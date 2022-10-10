import { h } from '../dist';

const testData = {
  'Parses element name': () => {
    return h('div', h('p'));
  },
  'Parses element name/attrs inside backticks': () => {
    return h(
      `
      div
        class="btn btn-primary"
        style="font-size: 25px;"
    `,
      h('p')
    );
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
          $style: {
            flexDirection: 'column',
          },
          $data: {
            expectedPattern: '[a-z]',
          },
          role: 'button',
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
            $style: {
              fontSize: '20px',
            },
            role: 'button',
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
  describe('First argument', () => {
    test('Is required', () => {
      expect(() => h('div')).not.toThrowError();
      expect(() => h()).toThrowError('First argument to h() is invalid: ');
    });

    test('Will throw if it produces an invalid node', () => {
      expect(() => h('dsadsa')).toThrowError(
        'First argument to h() is invalid: '
      );
    });

    test('Will throw if it produces more than one node', () => {
      expect(() => h('div <p>')).toThrowError(
        'First argument to h() should not contain more than one element: '
      );
    });

    test('Attribute values have to be strings and event values have to be functions', () => {
      expect(() => h('div', { id: 1 })).toThrowError(
        'Value of "id" attribute has to be a string'
      );
      expect(() => h('div', { class: true })).toThrowError(
        'Value of "class" attribute has to be a string'
      );
      expect(() => h('div', { role: 5 })).toThrowError(
        'Value of "role" attribute has to be a string'
      );
      expect(() => h('div', { onclick: 5 })).toThrowError(
        'Value of "onclick" has to be a function'
      );
      expect(() => h('div', { $style: { fontSize: 10 } })).toThrowError(
        'Value of "fontSize" CSS style property has to be a string'
      );
      expect(() => h('div', { $data: { isReady: false } })).toThrowError(
        'Value of "isReady" data attribute has to be a string'
      );
      expect(() => h('div', { $aria: { label: true } })).toThrowError(
        'Value of "label" ARIA attribute has to be a string'
      );
    });
  });

  describe('Second argument', () => {
    test('Grabbing reference to element via callback', () => {
      let element = null;

      h('button', { $ref: (el) => (element = el) });

      expect(element instanceof HTMLButtonElement).toEqual(true);
      expect(element instanceof HTMLDivElement).toEqual(false);
    });

    test('Applying events', () => {
      const onclick = jest.fn(() => {});
      const onabort = () => {};
      let elementRef = null;

      h('button', {
        onclick,
        onabort,
        $ref: (btn) => (elementRef = btn),
      });

      expect(elementRef.onclick).toEqual(onclick);
      expect(elementRef.onclick).not.toEqual(onabort);
      expect(elementRef.onabort).toEqual(onabort);
      expect(elementRef.onabort).not.toEqual(onclick);

      expect(onclick).toBeCalledTimes(0);
      elementRef.click();
      expect(onclick).toBeCalledTimes(1);
    });
  });

  describe('Snapshots', () => {
    for (const [testName, fn] of Object.entries(testData)) {
      test(testName, () => {
        expect(fn()).toMatchSnapshot();
      });
    }
  });
});
