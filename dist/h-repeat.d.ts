interface HRepeatElementCallbackParams<ITEM> {
    key: string;
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
    reset?: boolean;
    idAttrName?: string;
}
interface HRepeatParams<ITEM, ELEMENT extends HTMLElement> {
    container: HTMLElement;
    items: unknown;
    element: HRepeatElementCallback<ITEM, ELEMENT>;
    ref?: HRepeatRefCallback<ITEM, ELEMENT>;
    opts?: HRepeatOptions<ITEM>;
}
/**
 * Render a collection of nodes.
 */
export declare const hRepeat: <ITEM, ELEMENT extends HTMLElement>({ container, items, element: elementCallback, ref, opts: { key, reset, idAttrName }, }: HRepeatParams<ITEM, ELEMENT>) => void;
export {};
