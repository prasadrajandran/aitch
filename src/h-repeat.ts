interface HRepeatElementCallbackParams<ITEM> {
  key: string;
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
export const hRepeat = <ITEM, ELEMENT extends HTMLElement>({
  container,
  items,
  element: elementCallback,
  ref,
  opts: { key, reset, idAttrName } = {},
}: HRepeatParams<ITEM, ELEMENT>) => {
  const keyAttrName = idAttrName || `data-h-repeat-id`;

  const getItems = (items: unknown) => {
    if (items instanceof Map || items instanceof Set) {
      return items;
    }
    return Object.entries(items as Record<string, unknown>);
  };

  const getKeyValue = key || (({ key }: { key: string }) => key);

  const keyValues = new Set();

  let index = 0;
  for (const [key, item] of getItems(items)) {
    const keyValue = getKeyValue({ key, item, index });
    keyValues.add(keyValue);

    let element = container.querySelector<ELEMENT>(
      `[${keyAttrName}="${keyValue}"]`
    );
    if (!reset && !element) {
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
    if (!keyValues.has(element.getAttribute(keyAttrName))) {
      element.remove();
    }
  });
};
