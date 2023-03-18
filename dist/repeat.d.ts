interface HRepeatElementCallbackParams<ITEM> {
    key: unknown;
    item: ITEM;
    index: number;
}
interface HRepeatRefCallbackParams<ITEM, ELEMENT extends Element> extends HRepeatElementCallbackParams<ITEM> {
    element: ELEMENT;
}
interface HRepeatKeyCallback<ITEM> {
    ({ key, item, index }: HRepeatElementCallbackParams<ITEM>): string;
}
interface HRepeatElementCallback<ITEM, ELEMENT extends Element> {
    ({ key, item, index }: HRepeatElementCallbackParams<ITEM>): ELEMENT;
}
interface HRepeatRefCallback<ITEM, ELEMENT extends Element> {
    ({ key, item, index }: HRepeatRefCallbackParams<ITEM, ELEMENT>): void;
}
interface HRepeatParams<ITEM, ELEMENT extends Element> {
    container: HTMLElement;
    items: Map<unknown, ITEM> | Set<ITEM> | ITEM[] | Record<string | number | symbol, ITEM>;
    element: HRepeatElementCallback<ITEM, ELEMENT>;
    ref?: HRepeatRefCallback<ITEM, ELEMENT>;
    key?: HRepeatKeyCallback<ITEM>;
    keyName?: string;
}
/**
 * Render a collection of Elements.
 */
export declare const repeat: <ITEM, ELEMENT extends Element>({ container, items, element: elementCallback, ref, key: keyValueCallback, keyName, }: HRepeatParams<ITEM, ELEMENT>) => void;
export {};
