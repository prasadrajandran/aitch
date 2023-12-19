import { createDirective } from '../helpers/create-directive';

/**
 * A unique name for the slottable element.
 * @internal
 */
type SlotName = string;

/**
 * Slot directive type generator.
 */
export type SlotDirective<SLOT_NAME extends SlotName> = Record<SLOT_NAME, Node>;

/**
 * Creates a slot that can be replaced with other content.
 *
 * Example:
 * const tpl = html`
 *   <div>${_slot('badge')}</div>
 * `;
 * tpl.badge = document.createElement('span');
 */
export const _slot = createDirective<[SlotName]>({
  type: 'node',
  callback: (template, instances) => {
    instances.forEach(({ node, args: [slotName] }) => {
      let currentNode: Text | Element = node;
      Object.defineProperty(template, slotName, {
        enumerable: true,
        set: (item: unknown) => {
          if (typeof item === 'string' && currentNode.textContent === item) {
            return;
          }
          const newNode =
            item instanceof Text || item instanceof Element
              ? item
              : new Text(String(item));
          currentNode.replaceWith(newNode);
          currentNode = newNode;
        },
        get: (): Text | Element => currentNode,
      });
    });
  },
});
