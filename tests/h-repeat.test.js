import { h, hRepeat } from '../dist';

const createItem = (id, name) => {
  return {
    id,
    name,
  };
};

const shallowCopyItems = (items) => {
  return items instanceof Map
    ? new Map(items)
    : items instanceof Set
    ? new Set(items)
    : Array.isArray(items)
    ? [...items]
    : { ...items };
};

const removeItem = (items, ...itemsToDelete) => {
  const entries = shallowCopyItems(items);

  itemsToDelete.forEach((item) => {
    if (entries instanceof Set) {
      entries.delete(item);
    } else if (entries instanceof Map) {
      for (const [k, { id }] of entries) {
        if (item.id === id) {
          entries.delete(k);
          break;
        }
      }
    } else if (Array.isArray(entries)) {
      entries.splice(
        entries.findIndex(({ id }) => item.id === id),
        1
      );
    } else {
      for (const [k, { id }] of Object.entries(entries)) {
        if (item.id === id) {
          delete entries[k];
        }
      }
    }
  });

  return entries;
};

const addItem = (items, index, newItem) => {
  const entries = shallowCopyItems(items);

  if (entries instanceof Set) {
    entries.add(newItem);
  } else if (entries instanceof Map) {
    entries.set(index, newItem);
  } else if (Array.isArray(entries)) {
    entries.push(newItem);
  } else {
    entries[index] = newItem;
  }

  return entries;
};

const createElementCallback = () => {
  return jest.fn(({ key, item: { id, name }, index }) => {
    expect(typeof index).toEqual('number');
    expect(Number(key)).toEqual(index);
    expect(typeof id).toEqual('string');
    expect(typeof name).toEqual('string');
    return h('div', id, h('br'), name);
  });
};

const createRefCallback = () => {
  return jest.fn(({ key, item, index, element }) => {
    expect(typeof index).toEqual('number');
    expect(Number(key)).toEqual(index);
    expect(typeof item.id).toEqual('string');
    expect(typeof item.name).toEqual('string');
    expect(element instanceof HTMLDivElement).toEqual(true);
  });
};

const createKeyCallback = () => {
  return jest.fn(({ key, item, index, element }) => {
    expect(typeof index).toEqual('number');
    expect(Number(key)).toEqual(index);
    expect(typeof item.id).toEqual('string');
    expect(typeof item.name).toEqual('string');
    return item.id;
  });
};

describe('hRepeat()', () => {
  const item0 = createItem('A-01', 'John');
  const item1 = createItem('B-02', 'Brian');
  const item2 = createItem('C-55', 'Adam');
  const item3 = createItem('G-12', 'Michael');
  const item4 = createItem('Q-73', 'Andrew');

  const itemsArr = [item0, item1, item2, item3, item4];
  const itemsSet = new Set(itemsArr);
  const itemsObj = {
    0: item0,
    1: item1,
    2: item2,
    3: item3,
    4: item4,
  };
  const itemsMap = new Map([
    [0, item0],
    [1, item1],
    [2, item2],
    [3, item3],
    [4, item4],
  ]);

  test('Accepts maps, sets, arrays, and objects and only container, items, and element are required', () => {
    [itemsArr, itemsObj, itemsMap, itemsSet].forEach((items) => {
      const container = h('div');
      const element = createElementCallback();

      hRepeat({
        container,
        items,
        element,
      });

      // ! Note: using inline snapshot because we want to make sure maps, !
      // ! sets, arrays, and objects produce identical HTML. !
      expect(container).toMatchInlineSnapshot(`
        <div>
          <div
            data-h-repeat-key="0"
          >
            A-01
            <br />
            John
          </div>
          <div
            data-h-repeat-key="1"
          >
            B-02
            <br />
            Brian
          </div>
          <div
            data-h-repeat-key="2"
          >
            C-55
            <br />
            Adam
          </div>
          <div
            data-h-repeat-key="3"
          >
            G-12
            <br />
            Michael
          </div>
          <div
            data-h-repeat-key="4"
          >
            Q-73
            <br />
            Andrew
          </div>
        </div>
      `);

      expect(element).toBeCalledTimes(itemsArr.length);
    });
  });

  test('Can change key value', () => {
    [itemsArr, itemsObj, itemsMap, itemsSet].forEach((items) => {
      const container = h('div');
      const element = createElementCallback();

      hRepeat({
        container,
        items,
        element,
        opts: {
          key: createKeyCallback(),
        },
      });

      // ! Note: using inline snapshot because we want to make sure maps, !
      // ! sets, arrays, and objects produce identical HTML. !
      expect(container).toMatchInlineSnapshot(`
        <div>
          <div
            data-h-repeat-key="${itemsArr[0].id}"
          >
            A-01
            <br />
            John
          </div>
          <div
            data-h-repeat-key="${itemsArr[1].id}"
          >
            B-02
            <br />
            Brian
          </div>
          <div
            data-h-repeat-key="${itemsArr[2].id}"
          >
            C-55
            <br />
            Adam
          </div>
          <div
            data-h-repeat-key="${itemsArr[3].id}"
          >
            G-12
            <br />
            Michael
          </div>
          <div
            data-h-repeat-key="${itemsArr[4].id}"
          >
            Q-73
            <br />
            Andrew
          </div>
        </div>
      `);

      expect(element).toBeCalledTimes(itemsArr.length);
    });
  });

  test('Can change key value and key name', () => {
    [itemsArr, itemsObj, itemsMap, itemsSet].forEach((items) => {
      const container = h('div');
      const element = createElementCallback();

      hRepeat({
        container,
        items,
        element,
        opts: {
          key: createKeyCallback(),
          keyAttrName: 'key',
        },
      });

      // ! Note: using inline snapshot because we want to make sure maps, !
      // ! sets, arrays, and objects produce identical HTML. !
      expect(container).toMatchInlineSnapshot(`
        <div>
          <div
            key="${itemsArr[0].id}"
          >
            A-01
            <br />
            John
          </div>
          <div
            key="${itemsArr[1].id}"
          >
            B-02
            <br />
            Brian
          </div>
          <div
            key="${itemsArr[2].id}"
          >
            C-55
            <br />
            Adam
          </div>
          <div
            key="${itemsArr[3].id}"
          >
            G-12
            <br />
            Michael
          </div>
          <div
            key="${itemsArr[4].id}"
          >
            Q-73
            <br />
            Andrew
          </div>
        </div>
      `);

      expect(element).toBeCalledTimes(itemsArr.length);
    });
  });

  test('Calls ref() on every item', () => {
    [itemsArr, itemsObj, itemsMap, itemsSet].forEach((items) => {
      const container = h('div');
      const element = createElementCallback();
      const ref = createRefCallback();

      hRepeat({
        container,
        items,
        element,
        ref,
      });

      // ! Note: using inline snapshot because we want to make sure maps, !
      // ! sets, arrays, and objects produce identical HTML. !
      expect(container).toMatchInlineSnapshot(`
        <div>
          <div
            data-h-repeat-key="0"
          >
            A-01
            <br />
            John
          </div>
          <div
            data-h-repeat-key="1"
          >
            B-02
            <br />
            Brian
          </div>
          <div
            data-h-repeat-key="2"
          >
            C-55
            <br />
            Adam
          </div>
          <div
            data-h-repeat-key="3"
          >
            G-12
            <br />
            Michael
          </div>
          <div
            data-h-repeat-key="4"
          >
            Q-73
            <br />
            Andrew
          </div>
        </div>
      `);

      expect(element).toBeCalledTimes(itemsArr.length);
      expect(ref).toBeCalledTimes(itemsArr.length);
    });
  });

  test('Does not render nodes if their keys have not changed', () => {
    [itemsArr, itemsObj, itemsMap, itemsSet].forEach((items) => {
      const container = h('div');
      const element = createElementCallback();
      const firstCallNodes = [];
      const secondCallNodes = [];

      hRepeat({
        container,
        items,
        element,
        ref: ({ element }) => firstCallNodes.push(element),
      });

      hRepeat({
        container,
        items,
        element,
        ref: ({ element }) => secondCallNodes.push(element),
      });

      expect(firstCallNodes.length).toEqual(itemsArr.length);
      expect(secondCallNodes.length).toEqual(itemsArr.length);
      firstCallNodes.forEach((node, i) => {
        expect(node).toStrictEqual(secondCallNodes[i]);
      });
    });
  });

  test('Removes entries that have been deleted and adds new entries that have been added', () => {
    [itemsArr, itemsObj, itemsMap, itemsSet].forEach((items) => {
      const container = h('div');
      const item6 = createItem('X-29', 'Sheldon');
      const entries = addItem(removeItem(items, item1, item3), 6, item6);

      hRepeat({
        container,
        items: entries,
        element: ({ item: { id, name } }) => h('div', id, h('br'), name),
        opts: {
          key: ({ item: { id } }) => id,
          keyAttrName: 'k',
        },
      });

      // ! Note: using inline snapshot because we want to make sure maps, !
      // ! sets, arrays, and objects produce identical HTML. !
      expect(container).toMatchInlineSnapshot(`
        <div>
          <div
            k="${itemsArr[0].id}"
          >
            A-01
            <br />
            John
          </div>
          <div
            k="${itemsArr[2].id}"
          >
            C-55
            <br />
            Adam
          </div>
          <div
            k="${itemsArr[4].id}"
          >
            Q-73
            <br />
            Andrew
          </div>
          <div
            k="${item6.id}"
          >
            ${item6.id}
            <br />
            ${item6.name}
          </div>
        </div>
      `);
    });
  });
});
