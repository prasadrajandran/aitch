declare type ElementHeader = string;
declare type AttrNameKebabCase = string;
declare type AttrValue = string | number | boolean;
declare type DataAttrNameCamelCase = string;
declare type EventHandlerName = string;
declare type HChildNode = Node | string;
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
export declare const h: <T extends HTMLElement>(
  elementHeader: ElementHeader,
  elementDetails?: HChildNode | ElementDetails<T> | undefined,
  ...nodes: HChildNode[]
) => T;
export {};
