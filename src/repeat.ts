interface HRepeatElementCallbackParams<ITEM> {
  key: unknown;
  item: ITEM;
  index: number;
}

interface HRepeatRefCallbackParams<ITEM, ELEMENT extends Element>
  extends HRepeatElementCallbackParams<ITEM> {
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
  items:
    | Map<unknown, ITEM>
    | Set<ITEM>
    | ITEM[]
    | Record<string | number | symbol, ITEM>;
  element: HRepeatElementCallback<ITEM, ELEMENT>;
  ref?: HRepeatRefCallback<ITEM, ELEMENT>;
  key?: HRepeatKeyCallback<ITEM>;
  keyName?: string;
}

/**
 * Render a collection of Elements.
 */
export const repeat = <ITEM, ELEMENT extends Element>({
  container,
  items,
  element: elementCallback,
  ref,
  key: keyValueCallback = (args) => String(args.key),
  keyName = 'data-h-repeat-key',
}: HRepeatParams<ITEM, ELEMENT>): void => {
  const entries = Array.isArray(items)
    ? items.entries()
    : items instanceof Map
    ? items
    : items instanceof Set
    ? Array.from(items).entries()
    : Object.entries(items);

  const savedKeys = new Set<string>();

  let index = 0;
  for (const [key, item] of entries) {
    const keyValue = String(keyValueCallback({ key, item, index }));
    savedKeys.add(keyValue);

    let element = container.querySelector<ELEMENT>(
      `:scope > [${keyName}="${keyValue}"]`
    );

    if (!element) {
      element = elementCallback({ key, item, index });
      element.setAttribute(keyName, keyValue);
      container.append(element);
    }

    if (ref && element) {
      ref({ key, item, index, element });
    }

    index++;
  }

  container.querySelectorAll(`:scope > [${keyName}]`).forEach((element) => {
    if (!savedKeys.has(element.getAttribute(keyName) as string)) {
      element.remove();
    }
  });
};
