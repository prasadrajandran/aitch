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
export const attrs = (node: HTMLElement, nodeAttrs: TemplateAttrsExp): void => {
  Object.entries(nodeAttrs).forEach(([name, value]) => {
    switch (name) {
      case 'className': {
        (value as string).split(/\s{1,}/).forEach((name) => {
          const trimmedName = name.trim();
          if (trimmedName) {
            node.classList.add(trimmedName);
          }
        });
        break;
      }
      case 'style':
        Object.assign(node.style, value);
        break;
      case 'dataset':
        Object.assign(node.dataset, value);
        break;
      default: {
        const isAttr = name.startsWith('[') && name.endsWith(']');
        if (isAttr) {
          const attrName = name.substring(1, name.length - 1);
          if (value === false) {
            node.removeAttribute(attrName);
          } else {
            node.setAttribute(
              attrName,
              value === true ? '' : (value as string),
            );
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const currentPropValue = node[name] as unknown;

          if (currentPropValue !== value) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            node[name] = value;
          }
        }
      }
    }
  });
};
