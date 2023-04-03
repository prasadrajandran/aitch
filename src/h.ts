type ElementAttrs = {
  /**
   * Obtain a reference to the DOM Element with this callback.
   * @param element
   */
  $ref?: (element: Element) => void;
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
} & Partial<GlobalEventHandlers>;

type UpdatableArgKey = string;

type UpdatableAttrsMap = Map<UpdatableArgKey, Element>;

type UpdatableNodesMap = Map<UpdatableArgKey, Node>;

type UpdatableItems = Record<UpdatableArgKey, ElementAttrs | string | Node>;

/**
 * Template literal attribute/node argument marker.
 */
const TAGGED_ATTR_NAME = 'data-FHF7Sj5kD1S';

/**
 * Marks an element as having updatable attributes and properties.
 * @param key Unique key that identifies this element as having updatable
 *     attributes and properties.
 */
export const $attr = (key: string) => (): { type: 'attr'; key: string } => ({
  type: 'attr',
  key,
});

/**
 * Marks a node as being updatable.
 * @param key Unique key that identifies this node has being updatable.
 */
export const $node = (key: string) => (): { type: 'node'; key: string } => ({
  type: 'node',
  key,
});

type RefCallback = ReturnType<typeof $attr> | ReturnType<typeof $node>;

type TemplateLiteralArgIndex = number;

type TaggedArgsMap = Map<
  TemplateLiteralArgIndex,
  Node | ElementAttrs | RefCallback
>;

/**
 * This check is meant to guard against honest mistakes not scenarios where the
 * user is deliberately trying pass a value off as a plain object.
 * @internal
 */
const isPlainObject = (arg: unknown): boolean =>
  Boolean(
    arg && (arg.constructor === Object || Object.getPrototypeOf(arg) === null)
  );

/**
 * Make a template literal attribute argument marker.
 * @internal
 * @param i Template literal argument index.
 */
const makeTaggedAttr = (i: number): string => `${TAGGED_ATTR_NAME}="${i}"`;

/**
 * Make a template literal node argument marker.
 * @internal
 * @param i Template literal argument index.
 */
const makeTaggedNode = (i: number): string =>
  `<template ${makeTaggedAttr(i)}></template>`;

/**
 * Replaces a node if `newContent` is not identical to `currentNode`.
 * @internal
 * @param currentNode Current node to update.
 * @param newContent New text content or a new node to replace `currentNode`
 *     with.
 */
const replaceNode = (
  currentNode: Text | Element,
  newContent: string | Node
): Node => {
  let replacedNode: Node = currentNode;
  const newNode =
    typeof newContent === 'string' ? new Text(newContent) : newContent;
  if (
    !(
      currentNode instanceof Text &&
      newNode instanceof Text &&
      currentNode.textContent === newNode.textContent
    ) &&
    currentNode !== newNode
  ) {
    currentNode.replaceWith(newNode as Node);
    replacedNode = newNode;
  }
  return replacedNode;
};

const updateNode = (
  node: Element,
  attrs: ElementAttrs,
  alreadyAppliedProps: Set<string>
): Set<string> => {
  // Clone set so that we can modify without introducing side effects.
  const appliedProps = new Set(alreadyAppliedProps);

  Object.entries(attrs).forEach(([attrName, attrValue]) => {
    switch (attrName) {
      case '$ref':
        (attrValue as Required<ElementAttrs>['$ref'])(node);
        break;
      case 'style':
        Object.entries(attrValue as Required<ElementAttrs>['style']).forEach(
          ([stylePropName, stylePropValue]) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            node.style[stylePropName] = stylePropValue;
          }
        );
        break;
      case 'dataset':
        Object.entries(attrValue as Required<ElementAttrs>['dataset']).forEach(
          ([dataPropName, dataPropValue]) => {
            (node as HTMLElement).dataset[dataPropName] = dataPropValue;
          }
        );
        break;
      default:
        if (typeof attrValue === 'string' && !(attrName in node)) {
          node.setAttribute(attrName, attrValue);
        } else {
          // This prevents us from constantly updating properties like
          // "innerHTML" if they have not changed AND if they have been applied
          // at least once. We apply props at least once regardless of the
          // current value in the element because certain props are both a
          // property and an attribute (e.g. "type" in HTMLButtonElement) so we
          // want those values to show up in the HTML as an attribute
          // (e.g. '<button type="submit">Submit</button>').
          const attrHasBeenAppliedAtLeastOnce = appliedProps.has(attrName);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (node[attrName] !== attrValue || !attrHasBeenAppliedAtLeastOnce) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            node[attrName] = attrValue;
            appliedProps.add(attrName);
          }
        }
    }
  });

  return appliedProps;
};

/**
 * Determines if the supplied `arg` is a valid RefCallback value.
 * @internal
 * @param arg Arg to check.
 */
const isRefCallbackArgValid = (arg: RefCallback): boolean => {
  try {
    const { type, key } = arg();
    return (
      (type === 'attr' || type === 'node') &&
      typeof key === 'string' &&
      key.length > 1
    );
  } catch {
    return false;
  }
};

/**
 * Parses an HTML template.
 * @internal
 * @param htmlStrings Template literal HTML strings.
 * @param templateArgs Template literal interpolated values.
 */
const parse = (
  htmlStrings: TemplateStringsArray,
  templateArgs: (
    | string
    | number
    | boolean
    | Node
    | ElementAttrs
    | RefCallback
  )[]
): {
  taggedTemplate: HTMLTemplateElement;
  taggedArgs: TaggedArgsMap;
} => {
  const taggedArgs: TaggedArgsMap = new Map();
  const updatableArgsSet = new Set<UpdatableArgKey>();

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
      } else if (
        argType === 'function' &&
        isRefCallbackArgValid(arg as RefCallback)
      ) {
        const { type, key } = (arg as RefCallback)();

        if (updatableArgsSet.has(key)) {
          throw new Error(`Duplicate attribute or node key found: "${key}"`);
        }
        updatableArgsSet.add(key);

        taggedArgs.set(argIndex, arg as RefCallback);
        if (type === 'attr') {
          return `${htmlChunk}${makeTaggedAttr(argIndex)}`;
        } else {
          return `${htmlChunk}${makeTaggedNode(argIndex)}`;
        }
      } else if (arg instanceof Node) {
        taggedArgs.set(argIndex, arg as Node);
        return `${htmlChunk}${makeTaggedNode(argIndex)}`;
      } else if (isPlainObject(arg)) {
        taggedArgs.set(argIndex, arg as ElementAttrs);
        return `${htmlChunk}${makeTaggedAttr(argIndex)}`;
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
  updatableAttrs: UpdatableAttrsMap;
  updatableNodes: UpdatableNodesMap;
} => {
  const fragment = taggedTemplate.content.cloneNode(true) as DocumentFragment;
  const updatableAttrs: UpdatableAttrsMap = new Map();
  const updatableNodes: UpdatableNodesMap = new Map();
  const processedTaggedArgs = new Set();

  fragment.querySelectorAll(`[${TAGGED_ATTR_NAME}]`).forEach((node) => {
    const argIndex = Number(node.getAttribute(TAGGED_ATTR_NAME) as string);
    const arg = taggedArgs.get(argIndex) as Node | ElementAttrs | RefCallback;

    // Note: not deleting processed values from `taggedArgs` even though that
    // is easier because that introduces a side effect.
    processedTaggedArgs.add(argIndex);

    node.removeAttribute(TAGGED_ATTR_NAME);

    if (arg instanceof Node) {
      node.replaceWith(arg);
    } else if (typeof arg === 'function') {
      const { type, key } = arg();
      if (type === 'node') {
        updatableNodes.set(key, node);
      } else {
        updatableAttrs.set(key, node);
      }
    } else {
      updateNode(node, arg, new Set());
    }
  });

  if (processedTaggedArgs.size !== taggedArgs.size) {
    const indices: number[] = [];
    for (const argIndex of taggedArgs.keys()) {
      if (!processedTaggedArgs.has(argIndex)) {
        indices.push(argIndex);
      }
    }
    const plural = indices.length > 1 ? 's' : '';
    throw new Error(
      `Unexpected template argument${plural} at position${plural} ${
        '' + plural ? `[${indices.join(', ')}]` : indices[0]
      } (zero-based numbering)`
    );
  }

  return {
    content:
      fragment.childNodes.length === 1
        ? (fragment.childNodes[0] as Node)
        : fragment,
    updatableNodes,
    updatableAttrs,
  };
};

export const h = <UPDATABLE extends UpdatableItems = UpdatableItems>(
  htmlStrings: TemplateStringsArray,
  ...templateArgs: (
    | string
    | number
    | boolean
    | Node
    | ElementAttrs
    | RefCallback
  )[]
): {
  content: ReturnType<typeof interpolate>['content'];
  update: (data: UPDATABLE) => void;
} => {
  const { content, updatableNodes, updatableAttrs } = interpolate(
    parse(htmlStrings, templateArgs)
  );

  const appliedNodeProps = new Map<UpdatableArgKey, Set<string>>();
  for (const key of updatableAttrs.keys()) {
    appliedNodeProps.set(key, new Set());
  }

  const update = (data: UPDATABLE) => {
    Object.entries(data).forEach(([key, value]) => {
      if (updatableNodes.has(key)) {
        const currentNode = updatableNodes.get(key) as Text | Element;
        const newNode = replaceNode(
          currentNode,
          value as string | Node | Element
        );
        updatableNodes.set(key, newNode);
      } else if (updatableAttrs.has(key)) {
        const appliedProps = updateNode(
          updatableAttrs.get(key) as Element,
          value as unknown as ElementAttrs,
          appliedNodeProps.get(key) as Set<string>
        );
        appliedNodeProps.set(key, appliedProps);
      }
    });
  };

  return { content, update };
};
