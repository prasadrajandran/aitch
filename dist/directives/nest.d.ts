import type { ParsedTemplate } from '../h';
/**
 * Nest directive type generator.
 */
export type NestDirective<NESTED_TEMPLATE extends {
    [P in keyof NESTED_TEMPLATE]: ParsedTemplate;
}> = NESTED_TEMPLATE;
/**
 * Creates a reference to another parsed template.
 *
 * Example:
 *
 * const Component = () => html`
 *   <div>
 *     <p>${_text('label')}</p>
 *   </div>
 * `;
 *
 * const tpl = html`
 *   <div>
 *     ${_nest('componentA', Component())}
 *     ${_nest('componentB', Component())}
 *   </div>
 * `;
 *
 * tpl.componentA.label = 'Something...';
 * tpl.componentB.label = 'Else...';
 */
export declare const _nest: (args_0: string, args_1: ParsedTemplate) => {
    id: string;
    def: import("../helpers/create-directive").DirectiveDefinition<[string, ParsedTemplate], HTMLElement>;
    args: [string, ParsedTemplate];
};
