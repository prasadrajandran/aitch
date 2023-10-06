import type { ParsedTemplate } from '../h';
/**
 * Merge directive options.
 * @internal
 */
type MergeOptions = {
    /**
     * Merge template callback expressions? The default is false.
     */
    callbacks?: boolean;
    /**
     * Merge template directive properties? The default is true.
     */
    directives?: boolean;
};
/**
 * Merge directive type generator.
 */
export type MergeDirective<M_TEMPLATE extends {
    [P in keyof M_TEMPLATE]: ParsedTemplate;
}> = M_TEMPLATE;
/**
 * Combines all properties of another parsed template into this parsed template.
 *
 * ! Note: If there is a property collision, the template parser will generate !
 * ! an exception.                                                             !
 *
 * Example:
 *
 * const Input = (name, label) => html`
 *   <div>
 *     <label>${label}</label>
 *     <input type="text" ${{ name }} ${_ref(name)}>
 *   </div>
 * `;
 *
 * const tpl = html`
 *   <form>
 *     ${Input('firstName', 'First name')}
 *     ${Input('lastName', 'Last name')}
 *     <button type="submit" ${_ref('submitBtn')}>Submit</button>
 *   </form>
 * `;
 *
 * tpl.firstName.node.value = 'John';
 * tpl.lastName.node.value = 'Smith';
 * tpl.submitBtn.node.click();
 */
export declare const _merge: (args_0: ParsedTemplate, args_1?: MergeOptions | undefined) => {
    id: string;
    def: import("../helpers/create-directive").DirectiveDefinition<[ParsedTemplate, MergeOptions?], HTMLElement>;
    args: [ParsedTemplate, MergeOptions?];
};
/**
 * Combines all properties of another parsed template into this parsed template.
 *
 * This directive will merge everything from the template (including its
 * template callback expressions).
 *
 * ! Note: If there is a property collision, the template parser will generate !
 * ! an exception.                                                             !
 *
 * Example:
 *
 * const Input = (name, label) => html`
 *   <div>
 *     <label>${label}</label>
 *     <input type="text" ${{ name }} ${_ref(name)}>
 *   </div>
 * `;
 *
 * const tpl = html`
 *   <form>
 *     ${Input('firstName', 'First name')}
 *     ${Input('lastName', 'Last name')}
 *     <button type="submit" ${_ref('submitBtn')}>Submit</button>
 *   </form>
 * `;
 *
 * tpl.firstName.node.value = 'John';
 * tpl.lastName.node.value = 'Smith';
 * tpl.submitBtn.node.click();
 */
export declare const _mergeAll: (template: ParsedTemplate) => {
    id: string;
    def: import("../helpers/create-directive").DirectiveDefinition<[ParsedTemplate, MergeOptions?], HTMLElement>;
    args: [ParsedTemplate, MergeOptions?];
};
export {};
