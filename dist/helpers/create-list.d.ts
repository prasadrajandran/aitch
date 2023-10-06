import type { ParsedTemplate } from '../h';
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
    (item: ITEM, data: {
        key: ListItemKey;
        index: ListItemIndex;
    }): ListItemKey;
}
/**
 * Callback to generate each list item.
 * @internal
 */
interface ListNodeCallback<ITEM, NODE extends ListNode> {
    (item: ITEM, data: {
        key: ListItemKey;
        index: ListItemIndex;
    }): NODE;
}
/**
 * Callback that is executed on each list item regardless of whether the item
 * has been updated or not.
 * @internal
 */
interface ListRefCallback<ITEM, NODE extends ListNode> {
    (el: NODE, item: ITEM, data: {
        key: ListItemKey;
        index: ListItemIndex;
    }): unknown;
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
    items: Map<unknown, ITEM> | Set<ITEM> | ITEM[] | Record<string | number | symbol, ITEM>;
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
 * Create a list of nodes.
 */
export declare const createList: <ITEM, NODE extends ListNode>({ container, items, node: createNode, ref, key: createKey, keyName, indexKeyName, }: ListParams<ITEM, NODE>) => void;
export {};
