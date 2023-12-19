import type { TemplateCallbackRef } from '../h';
import { createDirective } from '../helpers/create-directive';
import { createRef } from '../helpers/create-ref';

/**
 * Name of the function.
 * @internal
 */
type FunctionName = string;

/**
 * Body of the function.
 * @internal
 */
type FunctionBody<FUNC_ARGS extends never[] = never[]> = (
  ...args: FUNC_ARGS
) => unknown;

/**
 * Fn directive type generator.
 */
export type FnDirective<
  FUNCTION_NAMES extends Record<FunctionName, FunctionBody>,
> = FUNCTION_NAMES;

/**
 * Create a named function callback.
 *
 * Example:
 *
 * const tpl = html`
 *   <div
 *     ${_fn('updateBgColor', ({ style }, backgroundColor) => {
 *       style({ backgroundColor });
 *     })}
 *   >
 *     <p>Lorem ipsum...</p>
 *   </div>
 * `;
 *
 * tpl.updateBgColor('red');
 *
 * Note: the second argument is a TemplateCallbackRef and that is supplied and
 * bounded automatically by the template parser - all additional arguments
 * are defined in the template. So in the example above, the only argument that
 * would have to be supplied when the function is called is `backgroundColor`
 */
export const _fn = createDirective<
  [FunctionName, (ref: TemplateCallbackRef, ...args: never[]) => unknown]
>({
  type: 'attr',
  callback: (template, instances) => {
    instances.forEach(({ node, args: [name, callback] }) => {
      const ref = Object.defineProperty(createRef(node), 'tpl', {
        value: template,
      }) as TemplateCallbackRef;
      Object.defineProperty(template, name, {
        enumerable: false,
        value: callback.bind(callback, ref),
      });
    });
  },
});
