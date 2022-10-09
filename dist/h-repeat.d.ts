interface HRepeatElementCallbackParams<ITEM> {
    key: unknown;
    item: ITEM;
    index: number;
}
interface HRepeatRefCallbackParams<ITEM, ELEMENT> extends HRepeatElementCallbackParams<ITEM> {
    element: ELEMENT;
}
interface HRepeatKeyCallback<ITEM> {
    ({ key, item, index }: HRepeatElementCallbackParams<ITEM>): string;
}
interface HRepeatElementCallback<ITEM, ELEMENT> {
    ({ key, item, index }: HRepeatElementCallbackParams<ITEM>): ELEMENT;
}
interface HRepeatRefCallback<ITEM, ELEMENT> {
    ({ key, item, index }: HRepeatRefCallbackParams<ITEM, ELEMENT>): void;
}
interface HRepeatOptions<ITEM> {
    key?: HRepeatKeyCallback<ITEM>;
    keyAttrName?: string;
}
interface HRepeatParams<ITEM, ELEMENT extends Element> {
    container: HTMLElement;
    items: Map<unknown, ITEM> | Set<ITEM> | ITEM[] | Record<string | number | symbol, ITEM>;
    element: HRepeatElementCallback<ITEM, ELEMENT>;
    ref?: HRepeatRefCallback<ITEM, ELEMENT>;
    opts?: HRepeatOptions<ITEM>;
}
/**
 * Render a collection of nodes.
 */
export declare const hRepeat: <ITEM, ELEMENT extends Element>({ container, items, element: elementCallback, ref, opts, }: HRepeatParams<ITEM, ELEMENT>) => void;
export {};
