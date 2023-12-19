import type { ParsedTemplate } from '../h';
import { isParsedTemplate } from './is-parsed-template';

/**
 * Node or template for each list item.
 * @internal
 */
export type ListNode = HTMLElement | ParsedTemplate;

/**
 * A key that uniquely identifies each list item.
 * @internal
 */
type ListItemKey = string;

/**
 * Index position of each list item.
 */
type ListItemIndex = number;

/**
 * Callback to generate a unique key for each list item.
 * @internal
 */
interface ListKeyCallback<ITEM> {
  (item: ITEM, data: { key: ListItemKey; index: ListItemIndex }): ListItemKey;
}

/**
 * Callback to generate each list item.
 * @internal
 */
interface ListNodeCallback<ITEM, NODE extends ListNode> {
  (item: ITEM, data: { key: ListItemKey; index: ListItemIndex }): NODE;
}

/**
 * Callback that is executed on each list item regardless of whether the item
 * has been updated or not.
 * @internal
 */
interface ListRefCallback<ITEM, NODE extends ListNode> {
  (
    el: NODE,
    item: ITEM,
    data: { key: ListItemKey; index: ListItemIndex },
  ): unknown;
}

/**
 * Parameters for createList
 * @internal
 */
interface ListParams<ITEM, NODE extends ListNode> {
  /**
   * Container that houses the entire list.
   */
  container: HTMLElement;
  /**
   * Items to generate.
   */
  items:
    | Map<unknown, ITEM>
    | Set<ITEM>
    | ITEM[]
    | Record<string | number | symbol, ITEM>;
  /**
   * List item node or template.
   */
  node: ListNodeCallback<ITEM, NODE>;
  /**
   * List item ref callback.
   */
  ref?: ListRefCallback<ITEM, NODE>;
  /**
   * List item key callback.
   */
  key?: ListKeyCallback<ITEM>;
  /**
   * Name of the list item key attribute.
   */
  keyName?: string;
  /**
   * Name of the list item index attribute.
   */
  indexKeyName?: string;
}

/**
 * Name of the property that is used to store a reference to a list item's
 * parsed template.
 * @internal
 */
const refParsedTemplateKey = '__un3Mvl07V__';

/**
 * Create a list of nodes.
 */
export const createList = <ITEM, NODE extends ListNode>({
  container,
  items,
  node: createNode,
  ref,
  key: createKey = (_, { key }) => String(key),
  keyName = 'data-h-list-key',
  indexKeyName = 'data-h-list-index',
}: ListParams<ITEM, NODE>): void => {
  const entries = Array.isArray(items)
    ? items.entries()
    : items instanceof Map
      ? items
      : items instanceof Set
        ? Array.from(items).entries()
        : Object.entries(items);

  // TODO: must create tests for checking that items are appended in the right order

  const existingElements = new Map<string, Element>();
  for (const element of container.querySelectorAll(`:scope > [${keyName}]`)) {
    existingElements.set(element.getAttribute(keyName) as string, element);
  }

  let index = 0;
  for (const [itemKey, item] of entries) {
    const key = String(itemKey);
    const elementKey = String(createKey(item, { key, index }));

    const element =
      existingElements.get(elementKey) || createNode(item, { key, index });

    existingElements.delete(elementKey);

    const node = isParsedTemplate(element) ? element.$node : element;

    if (!(node instanceof Element)) {
      throw new Error('Each list item must contain only a single root node');
    }

    const wrongOrder =
      Math.abs(Number(node.getAttribute(indexKeyName) || Infinity) - index) > 0;

    if (wrongOrder) {
      node.remove();
      node.setAttribute(keyName, elementKey);
      node.setAttribute(indexKeyName, String(index));
      container.append(node);
    }

    if (ref) {
      // If the element is a parsed template, we need to store it so that if
      // ref is called on an existing element, we can still retrieve the
      // original parsed template from the DOM node.
      if (isParsedTemplate(element)) {
        Object.defineProperty(node, refParsedTemplateKey, {
          enumerable: false,
          value: element,
        });
      }
      const refElement = (
        refParsedTemplateKey in node ? node[refParsedTemplateKey] : node
      ) as NODE;

      ref(refElement, item, { key, index });
    }

    index++;
  }

  // Remove any other elements that were not found in "items"
  existingElements.forEach((element) => element.remove());
};
