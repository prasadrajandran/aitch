import { createDirective } from '../helpers/create-directive';
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
export type ListDirective<
  LISTS extends Record<ListName, Parameters<typeof createList>[0]['items']>,
> = LISTS;

export const _list = <ITEM, ELEMENT extends ListNode>(
  args: ListData<ITEM, ELEMENT>,
) => {
  return createDirective<[ListData<ITEM, ELEMENT>]>({
    type: 'attr',
    callback: (template, instances) => {
      instances.forEach(({ node, args: [opts] }) => {
        const { name } = opts;
        const list = { ...opts, container: node };
        Object.defineProperty(template, name, {
          enumerable: true,
          get: () => list.items,
          set: (
            items: Parameters<typeof createList<ITEM, ELEMENT>>[0]['items'],
          ) => {
            list.items = items;
            createList(list);
          },
        });
        createList(list);
      });
    },
  })(args);
};
