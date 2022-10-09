interface HRepeatElementCallbackParams<ITEM> {
  key: unknown;
  item: ITEM;
  index: number;
}

interface HRepeatRefCallbackParams<ITEM, ELEMENT>
  extends HRepeatElementCallbackParams<ITEM> {
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
  items:
    | Map<unknown, ITEM>
    | Set<ITEM>
    | ITEM[]
    | Record<string | number | symbol, ITEM>;
  element: HRepeatElementCallback<ITEM, ELEMENT>;
  ref?: HRepeatRefCallback<ITEM, ELEMENT>;
  opts?: HRepeatOptions<ITEM>;
}

/**
 * Render a collection of nodes.
 */
export const hRepeat = <ITEM, ELEMENT extends Element>({
  container,
  items,
  element: elementCallback,
  ref,
  opts = {},
}: HRepeatParams<ITEM, ELEMENT>) => {
  const keyAttrName = opts.keyAttrName || `data-h-repeat-key`;

  const getKeyValue = opts.key || (({ key }) => key);

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
    const keyValue = String(getKeyValue({ key, item, index }));
    savedKeys.add(keyValue);

    let element = container.querySelector<ELEMENT>(
      `[${keyAttrName}="${keyValue}"]`
    );
    if (!element) {
      element = elementCallback({ key, item, index });
      element.setAttribute(keyAttrName, keyValue);
      container.append(element);
    }

    if (ref && element) {
      ref({ key, item, index, element });
    }

    index++;
  }

  container.querySelectorAll(`[${keyAttrName}]`).forEach((element) => {
    if (!savedKeys.has(element.getAttribute(keyAttrName) as string)) {
      element.remove();
    }
  });
};
