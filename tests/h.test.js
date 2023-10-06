import { html } from '../dist';
import { _ref } from '../dist/directives';

describe('h()', () => {
  test('Returns root node instance directly if template contains a single root node', () => {
    expect(html`<div></div>`.$node).toBeInstanceOf(HTMLDivElement);
    expect(html`<p></p>`.$node).toBeInstanceOf(HTMLParagraphElement);
    expect(
      html`<div>
        <p><br /></p>
      </div>`.$node
    ).toBeInstanceOf(HTMLDivElement);
    expect(html`This is a test!`.$node).toBeInstanceOf(Text);
    expect(
      html`
        This is a test! This is only a test! I repeat, this is a test, this is
        only a test! This is a test! This is only a test! I repeat, this is a
        test, this is only a test!
      `.$node
    ).toBeInstanceOf(Text);
  });

  test('Leading/trailing whitespace do not affect calculation of number of root nodes', () => {
    expect(html`<div></div> `.$node).toBeInstanceOf(HTMLDivElement);
    expect(html`<p></p> `.$node).toBeInstanceOf(HTMLParagraphElement);
    expect(
      html`
        <div>
          <p>
            Hello, this is a test!
            <br />
          </p>
        </div>
      `.$node
    ).toBeInstanceOf(HTMLDivElement);
  });

  test('Returns a document fragment if template contains more than one root node', () => {
    expect(
      html`
        <div></div>
        <div></div>
      `.$node
    ).toBeInstanceOf(DocumentFragment);
    expect(
      html`
        This is a test!
        <p>This is a test!</p>
        <div>
          <p>This is a test!</p>
        </div>
      `.$node
    ).toBeInstanceOf(DocumentFragment);
  });

  test('Correctly interpolates strings, numbers, and booleans', () => {
    const ariaPressed = false;
    const min = 40;
    const href = 'https://example.com/';
    let divBtn = null;
    let input = null;
    let anchor = null;
    const tpl = html`
      <form>
        <input type="number" min="${min}" ${({ node }) => (input = node)} />
        <a href="${href}" ${({ node }) => (anchor = node)}> Link 1 </a>
        <div
          role="button"
          aria-pressed="${ariaPressed}"
          ${({ node }) => (divBtn = node)}
        >
          Button 1
        </div>
      </form>
    `;

    tpl.$cb.run();

    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input.min).toBe(String(min));
    expect(anchor).toBeInstanceOf(HTMLAnchorElement);
    expect(anchor.href).toBe(href);
    expect(divBtn).toBeInstanceOf(HTMLDivElement);
    // Note: divBtn.ariaPressed is probably not supported by JSDOM so using
    // getAttribute to get the value instead.
    expect(divBtn.getAttribute('aria-pressed')).toBe(String(ariaPressed));
  });

  test('Correctly interpolates event handlers', () => {
    let btn = null;
    const onclick = jest.fn();

    const tpl = html`
      <form>
        <input type="text" />
        <button type="submit" ${{ onclick }} ${({ node }) => (btn = node)}>
          Submit
        </button>
      </form>
    `;

    tpl.$cb.run();

    expect(btn).toBeInstanceOf(HTMLButtonElement);
    expect(btn.onclick).toBe(onclick);
    expect(onclick).toBeCalledTimes(0);
    btn.click();
    expect(onclick).toBeCalledTimes(1);
  });

  test('Correctly interpolates object attributes', () => {
    const type = 'number';
    const min = 50;
    const input = html`<input ${{ type, min, disabled: '' }} /> `.$node;

    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input.type).toBe(type);
    expect(input.min).toBe(String(min));
  });

  test('Correctly interpolates "style" attribute', () => {
    const type = 'submit';
    const style = {
      fontFamily: 'Arial',
      padding: '0px 0px 50px 100px',
      display: 'inline-block',
    };
    const btn = html`<button ${{ type, style }}>Submit</button> `.$node;

    expect(btn).toBeInstanceOf(HTMLButtonElement);
    expect(btn.type).toBe(type);
    expect(btn.style.padding).toBe(style.padding);
    expect(btn.style.fontFamily).toBe(style.fontFamily);
    expect(btn.style.display).toBe(style.display);
  });

  test('Correctly interpolates "dataset" attribute', () => {
    const role = 'button';
    const dataset = {
      label: 'green-button',
      customId: 'some-id',
      isImportant: false,
      longPropertyName: 0,
    };
    const div = html`<div ${{ '[role]': role, dataset }}>Submit</div> `.$node;

    expect(div).toBeInstanceOf(HTMLDivElement);
    expect(div.getAttribute('role')).toBe(role);
    expect(div.dataset.label).toBe(dataset.label);
    expect(div.getAttribute('data-label')).toBe(dataset.label);
    expect(div.dataset.customId).toBe(dataset.customId);
    expect(div.getAttribute('data-custom-id')).toBe(dataset.customId);
    expect(div.dataset.isImportant).toBe(String(dataset.isImportant));
    expect(div.getAttribute('data-is-important')).toBe(
      String(dataset.isImportant)
    );
    expect(div.dataset.longPropertyName).toBe(String(dataset.longPropertyName));
    expect(div.getAttribute('data-long-property-name')).toBe(
      String(dataset.longPropertyName)
    );
  });

  test('Correctly interpolates nodes', () => {
    const btnText = new Text('Submit');
    const textInput = html`<input type="text" />`.$node;
    const radioInput = html`<input type="radio" />`.$node;
    const submitBtn = html`<button type="submit">${btnText}</button>`.$node;
    const form = html`
      <form>
        <div>${textInput} ${radioInput}</div>
        <p>${submitBtn}</p>
      </form>
    `.$node;

    expect(form.querySelector('input[type="text"]')).toBe(textInput);
    expect(form.querySelector('input[type="radio"]')).toBe(radioInput);
    expect(form.querySelector('button')).toBe(submitBtn);
    expect(form.querySelector('button').innerHTML).toBe(btnText.wholeText);
  });

  test('Object whose prototype is null is considered a valid template argument', () => {
    const props = Object.create(null);
    props.dataset = { label: 'something' };
    expect(() => html`<div ${props}><div></div></div>`).not.toThrowError();
  });

  test.skip('Error thrown if template argument is invalid', () => {
    [null, undefined, new Map(), new Set()].forEach((arg) => {
      expect(() => html` <div data-label="${arg}"></div> `).toThrowError(
        `Invalid template expression at index 0:\n` +
          `<div data-label="\${0}"></div>`
      );

      expect(
        () =>
          html`<div data-label="${'something'}"></div>
            <div data-label="${arg}"></div>`
      ).toThrowError(
        `Invalid template expression at index 1:\n<div data-label="\${0}"></div><div data-label="\${1}"></div>`
      );

      expect(() => html`<div>${arg}</div> `).toThrowError(
        'Invalid template expression at index 0'
      );

      expect(
        () =>
          html`<div data-label="${'something'}"></div>
            <div>${arg}</div>`
      ).toThrowError(
        `Invalid template expression at index 1:\n<div data-label="\${0}"></div><div>\${1}</div>`
      );
    });
  });

  test.skip('Throws error if template argument(s) are in unexpected position(s)', () => {
    const prefix =
      'Unable to interpolate expression at index 0. This could ' +
      'have occurred because the previous expression was mismatched\n';

    expect(() => html`<div id="${new Text('something')}"></div>`).toThrowError(
      `${prefix}\n<div id="\${0}"></div>`
    );

    expect(
      () => html`<div id="${{ dataset: { label: 'something' } }}"></div> `
    ).toThrowError(
      'Unexpected template argument at position 0 (zero-based numbering)'
    );

    expect(
      () => html`<div>${{ dataset: { label: 'something' } }}</div> `
    ).toThrowError(
      'Unexpected template argument at position 0 (zero-based numbering)'
    );

    expect(
      () => html`
        <div data-index="${1}">${{ dataset: { label: 'something' } }}</div>
        <button data-index="${2}">${{ type: 'button' }}</button>
      `
    ).toThrowError(
      'Unexpected template argument at position 1 (zero-based numbering)'
    );
  });

  test('Snapshot matches', () => {
    const input1 = html`First name: <input type="text" />`.$node;
    const input2 = html`Last name: <input type="text" />`.$node;
    const input3 = html`Age: <input type="number" />`.$node;
    const input4 = html`Address: <input type="text" />`.$node;
    const btnProps = {
      '[type]': 'submit',
      style: {
        padding: '0 0 0 50px',
        fontFamily: 'Arial',
        margin: '0',
      },
      dataset: {
        isDefault: 'false',
      },
    };
    const btn = html`<button ${btnProps}>Submit</button>`.$node;

    expect(
      html`
        <form>
          <div>${input1} ${input2} ${input3} ${input4}</div>
          <div>${btn}</div>
        </form>
      `.$node
    ).toMatchSnapshot();
  });
});
