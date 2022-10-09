import { h } from '../dist';

const testData = {
  'Parses element name': () => {
    return h('div', h('p'));
  },
  'Parses element name and attributes as a single argument': () => {
    return h(
      'div',
      h(
        `div id="btn" class="btn btn-primary" tabindex="0" style="font-size: 10px; display: absolute" aria-label="cta"`
      )
    );
  },
  'Second argument can be used to apply attrs using JS': () => {
    return h(
      'div',
      h(
        `div style="font-size: 10px; display: absolute"`,
        {
          style: {
            flexDirection: 'column',
          },
          dataAttrs: {
            expectedPattern: '[a-z]',
          },
          attrs: {
            role: 'button',
          },
          class: 'btn btn-primary',
          id: 'mybtn',
        },
        'Label!'
      )
    );
  },
  'Attrs set via the second argument take precedence over attrs set via the first argument':
    () => {
      return h(
        'div',
        h(
          `div role="panel" style="font-size: 10px; display: absolute"`,
          {
            style: {
              fontSize: '20px',
            },
            attrs: {
              role: 'button',
            },
          },
          'Label!'
        )
      );
    },
  'Second argument can be a node instead of attributes': () => {
    return h(
      'div',
      h('p', 'something', h('br'), h('span style="font-weight: bold;"', 'else'))
    );
  },
};

describe('h()', () => {
  test('Only the element name is required', () => {
    expect(() => h('div')).not.toThrowError();
    expect(() => h()).toThrowError();
  });

  test('Grabbing reference to element via callback', () => {
    let element = null;

    h('button', { ref: (el) => (element = el) });

    expect(element instanceof HTMLButtonElement).toEqual(true);
    expect(element instanceof HTMLDivElement).toEqual(false);
  });

  test('Applying events', () => {
    const onclick = jest.fn(() => {});
    const onabort = () => {};
    let elementRef = null;

    h('button', {
      events: { onclick, onabort },
      ref: (btn) => (elementRef = btn),
    });

    expect(elementRef.onclick).toEqual(onclick);
    expect(elementRef.onclick).not.toEqual(onabort);
    expect(elementRef.onabort).toEqual(onabort);
    expect(elementRef.onabort).not.toEqual(onclick);

    expect(onclick).toBeCalledTimes(0);
    elementRef.click();
    expect(onclick).toBeCalledTimes(1);
  });

  for (const [testName, fn] of Object.entries(testData)) {
    test(testName, () => {
      expect(fn()).toMatchSnapshot();
    });
  }
});
