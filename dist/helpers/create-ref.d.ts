import type { TemplateAttrsExp } from '../h';
/**
 * A CSS class name.
 * @internal
 */
type ClassName = string;
/**
 * An HTML element attribute name.
 *
 * Attribute names are expected to be in "snake-case".
 *
 * @internal
 */
type AttrNameSnakeCased = string;
/**
 * An HTML element custom data attribute name.
 *
 * Custom data attribute names are expected to be in "cameCase".
 *
 * @internal
 */
type DataAttrNameCamelCased = string;
/**
 * Wraps a node with a utility functions to simplify making changes to the
 * node.
 * @param node Node to wrap
 */
export declare const createRef: <NODE extends HTMLElement>(node: NODE) => {
    /**
     * Provided node.
     */
    node: NODE;
    /**
     *
     * @param cssClassNames CSS class names to add or remove
     */
    classMap: (cssClassNames: Record<ClassName, boolean>) => void;
    attrMap: (attrs: Record<AttrNameSnakeCased, string | boolean>) => void;
    dataMap: (dataset: Record<DataAttrNameCamelCased, boolean | string>) => void;
    text: (textContent: string) => void;
    style: (style: Partial<CSSStyleDeclaration>) => void;
    attrs: (elementAttrs: TemplateAttrsExp) => void;
    show: () => void;
    hide: () => void;
    remove: () => void;
};
export {};
