type ElementHeader = string;

type AttrNameKebabCase = string;

type AttrValue = string | number | boolean;

type DataAttrNameCamelCase = string;

type EventHandlerName = string;

type HChildNode = Node | string;

interface ElementDetails<T extends HTMLElement> {
  style?: Partial<CSSStyleDeclaration>;
  class?: string;
  id?: string;
  events?: Record<EventHandlerName, (evt: Event) => unknown>;
  attrs?: Record<AttrNameKebabCase, AttrValue>;
  dataAttrs?: Record<DataAttrNameCamelCase, AttrValue>;
  ariaAttrs?: Record<AttrNameKebabCase, AttrValue>;
  namespaceUri?: string;
  elementOptions?: ElementCreationOptions;
  ref?: (el: T) => void;
}

/**
 * Create an HTML/SVG Element.
 *
 * @param elementHeader Element header definition E.g. 'div',
 *   'div class="class"', etc.
 * @param elementDetails Element details
 * @param nodes Child nodes.
 */
export const h = <T extends HTMLElement>(
  elementHeader: ElementHeader,
  elementDetails?: ElementDetails<T> | HChildNode,
  ...nodes: HChildNode[]
): T => {
  const {
    style = {},
    attrs = {},
    class: className = undefined,
    id = '',
    events = {},
    dataAttrs = {},
    ariaAttrs = {},
    namespaceUri = undefined,
    elementOptions = undefined,
    ref = () => {
      /* Do nothing */
    },
  } = elementDetails instanceof Node || typeof elementDetails === 'string'
    ? {}
    : elementDetails || {};

  const elementName = elementHeader.split(' ')[0] as string;

  const el: T = namespaceUri
    ? (document.createElementNS(namespaceUri, elementName, elementOptions) as T)
    : (document.createElement(elementName, elementOptions) as T);

  const attrParser = document.createElement('div');
  attrParser.innerHTML = `<${elementHeader}/>`;

  if (attrParser.firstElementChild) {
    const attrs = attrParser.firstElementChild.attributes;
    for (let i = 0; i < attrs.length; i++) {
      const { name, value } = attrs[i] as Attr;
      el.setAttribute(name, value);
    }
  }

  for (const [styleName, styleValue] of Object.entries(style)) {
    // Note: Do not use "style.setProperty" because "styleName" is in camelCase.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    el.style[styleName] = styleValue;
  }

  if (className) {
    el.classList.add(...className.split(' '));
  }

  if (id) {
    el.setAttribute('id', id);
  }

  for (const [attrName, attrValue] of Object.entries(attrs)) {
    el.setAttribute(attrName, String(attrValue));
  }

  for (const [dataAttrName, dataAttrValue] of Object.entries(dataAttrs)) {
    el.dataset[dataAttrName] = String(dataAttrValue);
  }

  for (const [ariaAttrName, ariaAttrValue] of Object.entries(ariaAttrs)) {
    el.setAttribute(`aria-${ariaAttrName}`, String(ariaAttrValue));
  }

  for (const [eventName, eventHandler] of Object.entries(events)) {
    // eslint-disable-next-line
    // @ts-ignore
    el[eventName] = eventHandler;
  }

  if (elementDetails instanceof Node || typeof elementDetails === 'string') {
    el.append(elementDetails);
  }
  el.append(...nodes);

  ref(el);

  return el;
};
