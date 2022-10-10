declare type ElementHeader = string;
declare type AttrNameKebabCase = string;
declare type AttrValue = string | number | boolean;
declare type DataAttrNameCamelCase = string;
declare type HChildNode = Node | string;
declare type ElementDetails<T extends HTMLElement> = {
    $style?: Partial<CSSStyleDeclaration>;
    $data?: Record<DataAttrNameCamelCase, AttrValue>;
    $aria?: Record<AttrNameKebabCase, AttrValue>;
    $ref?: (element: T) => void;
    [attr: string]: unknown;
};
/**
 * Create an HTML Element.
 *
 * @param elementHeader Element header definition E.g. 'div',
 *   'div class="class"', etc.
 * @param elementDetails Element details
 * @param nodes Child nodes.
 */
export declare const h: <T extends HTMLElement>(elementHeader: ElementHeader, elementDetails?: HChildNode | ElementDetails<T> | undefined, ...nodes: HChildNode[]) => T;
export {};
