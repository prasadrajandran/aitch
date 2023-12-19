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
export declare const _slot: (args_0: string) => {
    id: string;
    def: import("../helpers/create-directive").DirectiveDefinition<[string], HTMLElement>;
    args: [string];
};
export {};
