import type { ElementAttrs } from '../h';

/**
 * Update attributes or properties on an element.
 * @internal
 * @param node Element whose attributes or properties need to be updated.
 * @param attrs Attributes or properties to update.
 */
export const updateElementAttrs = (
  node: Element,
  attrs: ElementAttrs
): void => {
  Object.entries(attrs).forEach(([attrName, attrValue]) => {
    switch (attrName) {
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
      default: {
        const isAttr =
          (attrName.startsWith('[') || attrName.startsWith('![')) &&
          attrName.endsWith(']');
        if (isAttr) {
          // "![attribute-name]" = attribute should be removed. This is useful
          // when we need to remove "boolean attributes"
          // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
          if (attrName.startsWith('![')) {
            node.removeAttribute(attrName.substring(2, attrName.length - 1));
          } else {
            node.setAttribute(
              attrName.substring(1, attrName.length - 1),
              String(attrValue)
            );
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const nodeProp = node[attrName] as unknown;

          if (typeof nodeProp === 'function' && Array.isArray(attrValue)) {
            nodeProp.apply(node, attrValue);
          } else {
            if (nodeProp !== attrValue) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              node[attrName] = attrValue;
            }
          }
        }
      }
    }
  });
};
