import type {
  DirectiveDefinition,
  DirectiveInstance,
  TemplateDirectiveResults,
  createDirective,
} from './helpers/create-directive';
import { attrs } from './helpers/attrs';
import { createRef } from './helpers/create-ref';
import { isPlainObject } from './helpers/is-plain-object';
import { isDirective } from './helpers/is-directive';
import { isParsedTemplate } from './helpers/is-parsed-template';

/**
 * A template that has been parsed by h.
 */
export type ParsedTemplate<
  NODE_TYPE = HTMLElement,
  DIRECTIVES extends TemplateDirectiveResults = TemplateDirectiveResults,
> = {
  $id: typeof parsedTemplateId;
  $cb: TemplateCallbackSet;
  $node: NODE_TYPE;
} & DIRECTIVES;

/**
 * An "attributes" template expression.
 */
export type TemplateAttrsExp<
  CUSTOM_ATTRS extends { [P in keyof CUSTOM_ATTRS]: CUSTOM_ATTRS[P] } = object,
> = {
  /**
   * CSS classes that will be appended to the element.
   */
  className?: string;
  /**
   * CSS inline styles for the element. The properties are expected to be in
   * camelCase.
   */
  style?: Partial<CSSStyleDeclaration>;
  /**
   * A DOM string map of custom data attribute properties set on the element.
   * The properties are expected to be in camelCase.
   */
  dataset?: HTMLOrSVGElement['dataset'];
  /**
   * Other attributes or properties that will be assigned to the element.
   */
  [attr: string]: unknown;
} & Partial<GlobalEventHandlers> &
  Partial<ARIAMixin> &
  Partial<InnerHTML> &
  Partial<Node> &
  Partial<Element> &
  CUSTOM_ATTRS;

/**
 * A "directive" template expression.
 */
export type TemplateDirectiveExp = ReturnType<
  ReturnType<typeof createDirective>
>;

export type TemplateCallbackRef<
  NODE_TYPE extends HTMLElement = HTMLElement,
  PARSED_TEMPLATE extends ParsedTemplate = ParsedTemplate,
> = ElementRef<NODE_TYPE> & { tpl: PARSED_TEMPLATE };

/**
 * A "callback" template expression.
 *
 * Notes:
 * - All callbacks expressions are collected into a set call "$cb" that is
 *   attached to a parsed template.
 * - This callback is not executed until $cb.run() is called. This allows you
 *   to control when callbacks which allows for the creation of more complex
 *   closures.
 * - If the callback returns false, it will be removed from "$cb" the first
 *   time it is executed (i.e. one-off callbacks expressions).
 */
export type TemplateCallbackExp<
  NODE_TYPE extends HTMLElement = HTMLElement,
  PARSED_TEMPLATE extends ParsedTemplate = ParsedTemplate,
> = (ref: TemplateCallbackRef<NODE_TYPE, PARSED_TEMPLATE>) => unknown;

/**
 * Valid template expressions.
 * @internal
 */
type TemplateExps =
  | string
  | number
  | boolean
  | Node
  | TemplateAttrsExp
  | TemplateCallbackExp
  | TemplateDirectiveExp
  | ParsedTemplate
  | (
      | string
      | number
      | boolean
      | Node
      | TemplateAttrsExp
      | TemplateCallbackExp
      | TemplateDirectiveExp
      | ParsedTemplate
    )[];

/**
 * An "attribute" template expression that has been tagged and is ready for
 * interpolation.
 * @internal
 */
type TaggedTemplateAttrsExp = string;

/**
 * A "node" template expression that has been tagged and is ready for
 * interpolation.
 * @internal
 */
type TaggedNodeExp = string;

/**
 * The index position of a template expression.
 * @internal
 */
export type TemplateExpIndex = number;

/**
 * A map of template expression index position to template expression.
 * @internal
 */
type TaggedExpMap = Map<
  TemplateExpIndex,
  Node | TemplateCallbackExp | TemplateAttrsExp | TemplateDirectiveExp
>;

/**
 * A wrapper around an HTML element that provides additional utility functions.
 */
export type ElementRef<NODE extends HTMLElement = HTMLElement> = ReturnType<
  typeof createRef<NODE>
>;

/**
 * An internal property to identify parsed template objects.
 * @internal
 */
export const parsedTemplateId = '__PzroJBb1g__';

/**
 * Tags an "attributes" template expression for interpolation.
 *
 * @internal
 * @param i Template expression index position.
 */
const tagAttrsExp = (i: TemplateExpIndex): TaggedTemplateAttrsExp =>
  `data-FHF7Sj5kD1S-${i}`;

/**
 * Tags a "node" template expression for interpolation.
 * @internal
 * @param i Template expression index position.
 */
const tagNodeExp = (i: TemplateExpIndex): TaggedNodeExp =>
  `<template ${tagAttrsExp(i)}></template>`;

/**
 * Set of all callback expressions in a parsed template.
 * @internal
 */
class TemplateCallbackSet extends Set<() => unknown> {
  /**
   * Execute all callbacks.
   */
  run() {
    this.forEach((callback) => {
      if (callback() === false) {
        this.delete(callback);
      }
    });
  }

  /**
   * Execute all callbacks inside "requestAnimationFrame"
   */
  runAsync() {
    window.requestAnimationFrame(() => this.run());
  }
}

/**
 * Tags all expressions in a template.
 * @internal
 * @param htmlStrings Template literal HTML strings.
 * @param templateExps Template literal expressions.
 */
const tag = (
  htmlStrings: TemplateStringsArray,
  templateExps: TemplateExps[],
): {
  taggedTemplate: HTMLTemplateElement;
  taggedExps: TaggedExpMap;
  createErrorTemplate: () => string;
} => {
  const taggedExps: TaggedExpMap = new Map();

  // Intentionally using a `template` instead of something like a `div` as we
  // do not want any events from the elements to trigger while we're parsing the
  // template.
  const taggedTemplate = document.createElement('template');

  const createErrorTemplate = () => {
    let expIndex = 0;
    return htmlStrings.reduce((chunks, chunk, templateExpsIndex) => {
      if (templateExpsIndex === 0) {
        return chunk;
      }
      const currentExp = templateExps[templateExpsIndex - 1];
      let exp = '';
      if (Array.isArray(currentExp)) {
        exp = `\${[${currentExp.map((_, i) => i).join(',')}]}`;
        expIndex += currentExp.length;
      } else {
        exp = `\${${expIndex}}`;
        expIndex++;
      }
      return `${chunks}${exp}${chunk}`;
    }, '');
  };

  let expCount = -1;
  taggedTemplate.innerHTML = htmlStrings
    .reduce((combinedHtmlStrings, htmlString, expIndex) => {
      let htmlChunk = `${combinedHtmlStrings}${htmlString}`;

      if (!(expIndex in templateExps)) return htmlChunk;

      const currentExp = templateExps[expIndex] as TemplateExps;

      ([] as TemplateExps[]).concat(currentExp).forEach((exp) => {
        expCount++;

        // TODO: should we escape expression automatically?

        const expType = typeof exp;
        if (
          expType === 'string' ||
          expType === 'number' ||
          expType === 'boolean'
        ) {
          htmlChunk += exp;
        } else if (expType === 'function') {
          taggedExps.set(expCount, exp as TemplateCallbackExp);
          htmlChunk += tagAttrsExp(expCount);
        } else if (exp instanceof Node) {
          taggedExps.set(expCount, exp as Node);
          htmlChunk += tagNodeExp(expCount);
        } else if (isParsedTemplate(exp)) {
          taggedExps.set(expCount, exp.$node);
          htmlChunk += tagNodeExp(expCount);
        } else if (isDirective(exp)) {
          taggedExps.set(expCount, exp);
          htmlChunk +=
            exp.def.type === 'attr'
              ? tagAttrsExp(expCount)
              : tagNodeExp(expCount);
        } else if (isPlainObject(exp)) {
          taggedExps.set(expCount, exp as TemplateAttrsExp);
          htmlChunk += tagAttrsExp(expCount);
        } else {
          throw new Error(
            `Invalid template expression at index ${expCount}:\n` +
              createErrorTemplate(),
          );
        }
      });
      return htmlChunk;
    }, '')
    // The combined HTML strings must be trimmed to remove meaningless
    // whitespace characters. If not, given a string like this:
    // h`
    //   <p>Hello</p>
    // `
    // "container.childNodes.length" > 1 even though the only relevant node in
    // that string is the "p" element.
    .trim();

  return { taggedTemplate, taggedExps, createErrorTemplate };
};

/**
 * Interpolate a tagged template with the provided template expressions.
 * @internal
 * @param template Tagged template
 */
const interpolate = <
  NODE_TYPE = HTMLElement,
  DIRECTIVES extends TemplateDirectiveResults = TemplateDirectiveResults,
>({
  taggedTemplate,
  taggedExps,
  createErrorTemplate,
}: ReturnType<typeof tag>): ParsedTemplate<NODE_TYPE, DIRECTIVES> => {
  type Template = ParsedTemplate<NODE_TYPE, DIRECTIVES>;

  const fragment = taggedTemplate.content.cloneNode(true) as DocumentFragment;
  const directives = new Map<
    DirectiveDefinition<unknown[], HTMLElement>,
    DirectiveInstance[]
  >();

  const refs: TemplateCallbackRef[] = [];
  const callbackExps = new TemplateCallbackSet();
  taggedExps.forEach((exp, expIndex) => {
    const taggedAttr = tagAttrsExp(expIndex);

    const node = fragment.querySelector<HTMLElement>(`[${taggedAttr}]`);
    if (!node) {
      const template = document.createElement('template');
      template.append(fragment);
      console.error(template);
      throw new Error(
        `Unable to interpolate expression at index ${expIndex}. ` +
          `This could also have occurred because some prior expression was ` +
          `mismatched.\n${createErrorTemplate()}`,
      );
    }

    node.removeAttribute(taggedAttr);

    if (exp instanceof Node) {
      node.replaceWith(exp);
    } else if (isDirective(exp)) {
      const { def, args } = exp;
      const instances = directives.get(def) || [];
      instances.push({ node, index: expIndex, args });
      directives.set(def, instances);
    } else if (typeof exp === 'function') {
      const ref = createRef(node) as TemplateCallbackRef;
      refs.push(ref);
      callbackExps.add(() => exp(ref));
    } else {
      attrs(node, exp as TemplateAttrsExp);
    }
  });

  const template = new Proxy<Template>(
    Object.defineProperties({} as Template, {
      $id: {
        value: parsedTemplateId,
        enumerable: false,
      },
      $cb: {
        value: callbackExps,
        enumerable: false,
      },
      $node: {
        value:
          fragment.childNodes.length === 1 ? fragment.childNodes[0] : fragment,
        enumerable: false,
      },
    }),
    {
      defineProperty(target, key, descriptor) {
        if (typeof key === 'string' && key.startsWith('$')) {
          throw new Error(
            'The "$" prefix is reserved and cannot be used to declare ' +
              `additional properties on a parsed template: "${key}"`,
          );
        }
        if (key in target) {
          throw new Error(`Duplicate parsed template key: "${String(key)}"`);
        }
        Object.defineProperty(target, key, descriptor);
        return true;
      },
    },
  );

  // Attach parsed template to all callback refs.
  refs.forEach((ref) => Object.defineProperty(ref, 'tpl', { value: template }));

  directives.forEach((instances, { callback }) => {
    callback(template, instances);
  });

  return template;
};

/**
 * Parse an HTML template
 * @param htmlStrings HTML strings.
 * @param templateExps Template expressions
 * @returns A parsed HTML template.
 */
export const h = <
  NODE_TYPE = HTMLElement,
  DIRECTIVES extends TemplateDirectiveResults = TemplateDirectiveResults,
>(
  htmlStrings: TemplateStringsArray,
  ...templateExps: TemplateExps[]
): ReturnType<typeof interpolate<NODE_TYPE, DIRECTIVES>> => {
  return interpolate(tag(htmlStrings, templateExps));
};
