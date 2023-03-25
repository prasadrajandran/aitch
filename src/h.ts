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

type TemplateLiteralArgIndex = number;

type TaggedArgsMap = Map<TemplateLiteralArgIndex, Node | ElementAttrs>;

/**
 * Template literal attribute/node argument marker.
 */
const TAGGED_ATTR_NAME = 'data-FHF7Sj5kD1S';

/**
 * Make a template literal attribute argument marker.
 * @param i Template literal argument index.
 */
const makeTaggedAttr = (i: number): string => `${TAGGED_ATTR_NAME}="${i}"`;

/**
 * Make a template literal node argument marker.
 * @param i Template literal argument index.
 */
const makeTaggedNode = (i: number): string => `<i ${makeTaggedAttr(i)}></i>`;

/**
 * Parses an HTML template.
 * @internal
 * @param htmlStrings Template literal HTML strings.
 * @param templateArgs Template literal interpolated values.
 */
const parseTemplate = (
  htmlStrings: TemplateStringsArray,
  templateArgs: (string | number | boolean | ElementAttrs | Node)[]
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
      // This check is meant to guard against honest mistakes not scenarios
      // where the user is deliberately trying pass a value off as a plain
      // object.
      const isPlainObject =
        arg &&
        (arg.constructor === Object || Object.getPrototypeOf(arg) === null);
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
        return `${htmlChunk}${makeTaggedNode(argIndex)}`;
      } else if (isPlainObject) {
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
}: ReturnType<typeof parseTemplate>): Node | DocumentFragment => {
  const fragment = taggedTemplate.content.cloneNode(true) as DocumentFragment;

  const processedTaggedArgs = new Set();
  fragment.querySelectorAll(`[${TAGGED_ATTR_NAME}]`).forEach((node) => {
    const argIndex = Number(node.getAttribute(TAGGED_ATTR_NAME) as string);
    const arg = taggedArgs.get(argIndex) as Node | ElementAttrs;

    // Note: not deleting processed values from `taggedArgs` even though that
    // is easier because that introduces a side effect.
    processedTaggedArgs.add(argIndex);

    if (arg instanceof Node) {
      node.replaceWith(arg);
    } else {
      node.removeAttribute(TAGGED_ATTR_NAME);

      Object.entries(arg).forEach(([attrName, attrValue]) => {
        switch (attrName) {
          case '$ref':
            (attrValue as Required<ElementAttrs>['$ref'])(node);
            break;
          case 'style':
            Object.entries(
              attrValue as Required<ElementAttrs>['style']
            ).forEach(([stylePropName, stylePropValue]) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              node.style[stylePropName] = stylePropValue;
            });
            break;
          case 'dataset':
            Object.entries(
              attrValue as Required<ElementAttrs>['dataset']
            ).forEach(([dataPropName, dataPropValue]) => {
              (node as HTMLElement).dataset[dataPropName] = dataPropValue;
            });
            break;
          default:
            if (typeof attrValue === 'string' && !(attrName in node)) {
              node.setAttribute(attrName, attrValue);
            } else {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              node[attrName] = attrValue;
            }
        }
      });
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

  return fragment.childNodes.length === 1
    ? (fragment.childNodes[0] as Node)
    : fragment;
};

/**
 * Parses an HTML template.
 * @param htmlStrings HTML template literal
 * @param templateArgs Interpolated HTML template literal values.
 */
export const h = (
  htmlStrings: TemplateStringsArray,
  ...templateArgs: (string | number | boolean | ElementAttrs | Node)[]
): ReturnType<typeof interpolate> => {
  return interpolate(parseTemplate(htmlStrings, templateArgs));
};
