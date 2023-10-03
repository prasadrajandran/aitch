import type { ElementRef } from '../h';
import { createDirective } from '../helpers/create-directive';
import { createRef } from '../helpers/create-ref';

/**
 * Name of the referenced element.
 * @internal
 */
type ReferencedElementName = string;

/**
 * Ref directive type generator.
 */
export type RefDirective<
  NODE_REFS extends { [P in keyof NODE_REFS]: NODE_REFS[P] }
> = { [P in keyof NODE_REFS]: ElementRef<NODE_REFS[P]> };

/**
 * Create a reference to an element.
 *
 * Example:
 * const tpl = html`
 * 	 <form>
 *     <div>
 *       <label>Name:</label>
 *       <input type="text">
 *     </div>
 *     <div>
 *       <button type="submit" ${_ref('submitBtn')}>Submit</button>
 *     </div>
 *   </form>
 * `;
 * tpl.submitBtn.node.click();
 * tpl.submitBtn.attrMap({ disable: true });
 */
export const _ref = createDirective<[ReferencedElementName]>({
  type: 'attr',
  callback: (template, instances) => {
    instances.forEach(({ node, args: [key] }) => {
      Object.defineProperty(template, key, { value: createRef(node) });
    });
  },
});
