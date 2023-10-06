/**
 * A name for the updatable text node.
 * @internal
 */
type UpdatableTextNodeName = string;
/**
 * Text directive type generator.
 */
export type TextDirective<NODE_NAME extends UpdatableTextNodeName> = Record<NODE_NAME, string>;
/**
 * Creates an updatable text node.
 *
 * Example:
 * const tpl = html`
 *   <div>
 *     <p>${_text('label', 'Optional default value')}</p>
 *   </div>
 * `;
 * tpl.label = 'Lorem ipsum...';
 */
export declare const _text: (...args: [string] | [string, string]) => {
    id: string;
    def: import("../helpers/create-directive").DirectiveDefinition<[string] | [string, string], HTMLElement>;
    args: [string] | [string, string];
};
export {};
