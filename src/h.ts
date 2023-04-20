import { isPlainObject } from './helpers/is-plain-object';
import { isDirective } from './helpers/is-directive';
import { updateElementAttrs } from './helpers/update-element-attrs';
import type {
  DirectiveIdentifier,
  DirectiveInstance,
  DirectiveCallbackResultKey,
  createDirective,
  TemplateDirective,
} from './helpers/create-directive';

export type ElementAttrs = {
  /**
   * CSS inline styles for the Element. The properties are expected to be in
   * camelCase.
   */
  style?: Partial<CSSStyleDeclaration>;
  /**
   * A DOM string map of custom data attribute properties set on the element.
   * The properties are expected to be in camelCase.
   */
  dataset?: HTMLOrSVGElement['dataset'];
  /**
   * Other miscellaneous attributes or properties that will be assigned to the
   * Element.
   */
  [attr: string]: unknown;
} & Partial<GlobalEventHandlers> &
  Partial<ARIAMixin> &
  Partial<InnerHTML> &
  Partial<Node> &
  Partial<Element>;

export type TemplateArgIndex = number;

type TaggedAttrArg = string;

type TaggedArgsMap = Map<
  TemplateArgIndex,
  Node | ElementAttrs | TemplateDirective
>;

// todo: make $repeat?

/**
 * Tags a template attributes argument in the template.
 * @internal
 * @param i Template literal argument index.
 */
const tagAttrsArg = (i: TemplateArgIndex): TaggedAttrArg =>
  `data-FHF7Sj5kD1S-${i}`;

/**
 * Tags a template node argument in the template.
 * @internal
 * @param i Template literal argument index.
 */
const tagNodeArg = (i: TemplateArgIndex): string =>
  `<template ${tagAttrsArg(i)}></template>`;

/**
 * Parses an HTML template.
 * @internal
 * @param htmlStrings Template literal HTML strings.
 * @param templateArgs Template literal interpolated directiveValues.
 */
const parse = (
  htmlStrings: TemplateStringsArray,
  templateArgs: (
    | string
    | number
    | boolean
    | Node
    | ElementAttrs
    | TemplateDirective
  )[]
): {
  taggedTemplate: HTMLTemplateElement;
  taggedArgs: TaggedArgsMap;
} => {
  const taggedArgs: TaggedArgsMap = new Map();

  // Intentionally using a `template` instead of something like a `div` as we
  // do not want any events from the elements to trigger while we're parsing the
  // template.
  const taggedTemplate = document.createElement('template');

  const lastHtmlStringIndex = htmlStrings.length - 1;

  taggedTemplate.innerHTML = htmlStrings
    .reduce((combinedHtmlStrings, htmlString, argIndex) => {
      const htmlChunk = `${combinedHtmlStrings}${htmlString}`;
      const arg = templateArgs[argIndex];
      const argType = typeof arg;
      if (argIndex === lastHtmlStringIndex) {
        return htmlChunk;
      } else if (
        argType === 'string' ||
        argType === 'number' ||
        argType === 'boolean'
      ) {
        return `${htmlChunk}${arg}`;
      } else if (arg instanceof Node) {
        taggedArgs.set(argIndex, arg as Node);
        return `${htmlChunk}${tagNodeArg(argIndex)}`;
      } else if (isDirective(arg)) {
        taggedArgs.set(argIndex, arg);
        return `${htmlChunk}${
          arg.definition.type === 'attr'
            ? tagAttrsArg(argIndex)
            : tagNodeArg(argIndex)
        }`;
      } else if (isPlainObject(arg)) {
        taggedArgs.set(argIndex, arg);
        return `${htmlChunk}${tagAttrsArg(argIndex)}`;
      } else {
        throw new Error(
          `Invalid template argument at position ${argIndex} ` +
            `(zero-based numbering)`
        );
      }
    }, '')
    // The combined HTML strings must be trimmed to remove meaningless
    // whitespace characters. If not, given a string like this:
    // h`
    //   <p>Hello</p>
    // `
    // "container.childNodes.length" > 1 even though the only relevant node in
    // that string is the "p" element.
    .trim();

  return {
    taggedTemplate,
    taggedArgs,
  };
};

/**
 * Interpolate parsed HTML template literal with template literal arguments.
 * @internal
 * @param args Parsed and tagged HTML attributes or nodes.
 */
const interpolate = ({
  taggedTemplate,
  taggedArgs,
}: ReturnType<typeof parse>): {
  content: Node | DocumentFragment;
  [directiveKey: DirectiveCallbackResultKey]: unknown;
} => {
  const fragment = taggedTemplate.content.cloneNode(true) as DocumentFragment;
  const directives = new Map<
    DirectiveIdentifier,
    {
      callback: Parameters<typeof createDirective>[0]['callback'];
      key: Parameters<typeof createDirective>[0]['key'];
      instances: DirectiveInstance[];
    }
  >();

  taggedArgs.forEach((arg, argIndex) => {
    const taggedAttr = tagAttrsArg(argIndex);

    const node = fragment.querySelector(`[${taggedAttr}]`);
    if (!node) {
      throw new Error(
        `Unexpected template argument at position ${argIndex} ` +
          `(zero-based numbering)`
      );
    }

    node.removeAttribute(taggedAttr);

    if (arg instanceof Node) {
      node.replaceWith(arg);
    } else if (isDirective(arg)) {
      const { identifier, args } = arg;
      const { callback, key } = arg.definition;
      const instances = directives.get(identifier)?.instances || [];
      instances.push({ node, pos: argIndex, args });
      directives.set(identifier, { callback, key, instances });
    } else {
      updateElementAttrs(node, arg as ElementAttrs);
    }
  });

  const results: { content: Node } & Record<string, unknown> = {
    content:
      fragment.childNodes.length === 1
        ? (fragment.childNodes[0] as Node)
        : fragment,
  };

  directives.forEach(({ key, callback, instances }) => {
    const callbackResults = callback(instances);
    if (key) {
      results[key] = callbackResults;
    }
  });

  return results;
};

export const h = (
  htmlStrings: TemplateStringsArray,
  ...templateArgs: (
    | string
    | number
    | boolean
    | Node
    | ElementAttrs
    | TemplateDirective
  )[]
): ReturnType<typeof interpolate> => {
  return interpolate(parse(htmlStrings, templateArgs));
};
