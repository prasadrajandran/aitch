import { createDirective } from '../helpers/create-directive';
import { ListNode, createList } from '../helpers/create-list';

/**
 * Name of the updatable list.
 * @internal
 */
type ListName = string;

/**
 * List data.
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

/**
 * Create a list of nodes.
 *
 * Example:
 * const tasks = new Map([
 *   ['gudjIy', "Task 1"],
 *   ['gCoKL9', "Task 2"],
 *   ['e16Amr', "Task 3"],
 * ]);
 *
 * const tpl = html`
 *   <div
 *     ${_list({
 *       name: 'tasks',
 *       items: new Map([
 *         ['gudjIy', "Task 1"],
 *         ['gCoKL9', "Task 2"],
 *         ['e16Amr', "Task 3"],
 *       ]),
 *       key: (task, { key, index }) => key,
 *     })
 *   }>
 *   </div>
 * `;
 *
 * tasks.delete('gCoKL9');
 * tpl.tasks = tasks; // Updates DOM
 *
 * @param args List data.
 */
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
