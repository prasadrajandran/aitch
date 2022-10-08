/**
 * Render a collection of nodes.
 */
export const hRepeat = ({
  container,
  items,
  element: elementCallback,
  ref,
  opts: { key, reset, idAttrName } = {},
}) => {
  const keyAttrName = idAttrName || `data-h-repeat-id`;
  const getItems = (items) => {
    if (items instanceof Map || items instanceof Set) {
      return items;
    }
    return Object.entries(items);
  };
  const getKeyValue = key || (({ key }) => key);
  const keyValues = new Set();
  let index = 0;
  for (const [key, item] of getItems(items)) {
    const keyValue = getKeyValue({ key, item, index });
    keyValues.add(keyValue);
    let element = container.querySelector(`[${keyAttrName}="${keyValue}"]`);
    if (!reset && !element) {
      element = elementCallback({ key, item, index });
      element.setAttribute(keyAttrName, keyValue);
      container.append(element);
    }
    if (ref && element) {
      ref({ key, item, index, element });
    }
    index++;
  }
  container.querySelectorAll(`[${keyAttrName}]`).forEach((element) => {
    if (!keyValues.has(element.getAttribute(keyAttrName))) {
      element.remove();
    }
  });
};
