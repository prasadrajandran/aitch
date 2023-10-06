import { ListNode, createList } from '../helpers/create-list';
/**
 * Name of the updatable list.
 * @internal
 */
type ListName = string;
/**
 * List's data.
 * @internal
 */
type ListData<ITEM, ELEMENT extends ListNode> = {
    name: ListName;
} & Omit<Parameters<typeof createList<ITEM, ELEMENT>>[0], 'container'>;
/**
 * List directive type generator.
 */
export type ListDirective<LISTS extends Record<ListName, Parameters<typeof createList>[0]['items']>> = LISTS;
export declare const _list: <ITEM, ELEMENT extends ListNode>(args: ListData<ITEM, ELEMENT>) => {
    id: string;
    def: import("../helpers/create-directive").DirectiveDefinition<[ListData<ITEM, ELEMENT>], HTMLElement>;
    args: [ListData<ITEM, ELEMENT>];
};
export {};
