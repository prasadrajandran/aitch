import type { TemplateAttrsExp } from '../h';
/**
 * Update attributes or properties on an element.
 * @param node Element whose attributes or properties need to be updated.
 * @param nodeAttrs Attributes and/or properties to update.
 *     The behaviour of the following properties have been altered to
 *     simplify the process of updating these values:
 *     - "className": A space separated list of CSS classnames that will be
 *                    appended to an element's class list.
 *     - "style"    : CSS inline styles that will be applied to the element.
 *                    Style names are expected to be camelCased.
 *     - "dataset"  : DOM string map of custom data attributes. The attributes
 *                    are expected to be camelCased.
 *
 */
export declare const attrs: (node: HTMLElement, nodeAttrs: TemplateAttrsExp) => void;
