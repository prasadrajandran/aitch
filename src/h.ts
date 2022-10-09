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
  ref?: (element: T) => void;
}

/**
 * Create an HTML Element.
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
    ref = () => {
      /* Do nothing */
    },
  } = elementDetails instanceof Node || typeof elementDetails === 'string'
    ? {}
    : elementDetails || {};

  const parser = document.createElement('div');
  parser.innerHTML = `<${elementHeader}/>`;
  const element = parser.firstElementChild as T;

  if (!element || element instanceof HTMLUnknownElement) {
    throw new Error(`"${elementHeader}" is invalid`);
  }

  for (const [styleName, styleValue] of Object.entries(style)) {
    // Note: Do not use "style.setProperty" because "styleName" is in camelCase.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    element.style[styleName] = styleValue;
  }

  if (className) {
    element.classList.add(...className.split(' '));
  }

  if (id) {
    element.setAttribute('id', id);
  }

  for (const [attrName, attrValue] of Object.entries(attrs)) {
    element.setAttribute(attrName, String(attrValue));
  }

  for (const [dataAttrName, dataAttrValue] of Object.entries(dataAttrs)) {
    element.dataset[dataAttrName] = String(dataAttrValue);
  }

  for (const [ariaAttrName, ariaAttrValue] of Object.entries(ariaAttrs)) {
    element.setAttribute(`aria-${ariaAttrName}`, String(ariaAttrValue));
  }

  for (const [eventName, eventHandler] of Object.entries(events)) {
    if (eventName in element) {
      // eslint-disable-next-line
      // @ts-ignore
      element[eventName] = eventHandler;
    } else {
      throw new Error(`"${eventName}" does not exist on "${element.nodeName}"`);
    }
  }

  if (elementDetails instanceof Node || typeof elementDetails === 'string') {
    element.append(elementDetails);
  }
  element.append(...nodes);

  ref(element);

  return element;
};
