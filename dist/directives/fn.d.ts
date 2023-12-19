import type { TemplateCallbackRef } from '../h';
/**
 * Name of the function.
 * @internal
 */
type FunctionName = string;
/**
 * Body of the function.
 * @internal
 */
type FunctionBody<FUNC_ARGS extends never[] = never[]> = (...args: FUNC_ARGS) => unknown;
/**
 * Fn directive type generator.
 */
export type FnDirective<FUNCTION_NAMES extends Record<FunctionName, FunctionBody>> = FUNCTION_NAMES;
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
export declare const _fn: (args_0: string, args_1: (ref: TemplateCallbackRef, ...args: never[]) => unknown) => {
    id: string;
    def: import("../helpers/create-directive").DirectiveDefinition<[string, (ref: TemplateCallbackRef, ...args: never[]) => unknown], HTMLElement>;
    args: [string, (ref: TemplateCallbackRef, ...args: never[]) => unknown];
};
export {};
