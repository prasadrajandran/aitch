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
 * Creates a
 */
export declare const _slot: (args_0: string) => {
    id: string;
    def: import("../helpers/create-directive").DirectiveDefinition<[string], HTMLElement>;
    args: [string];
};
export {};
