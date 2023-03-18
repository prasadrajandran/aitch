import { h } from '../dist';

describe('h()', () => {
  test('Returns root node instance directly if template contains a single root node', () => {
    expect(h/*html*/ `<div></div>`).toBeInstanceOf(HTMLDivElement);
    expect(h/*html*/ `<p></p>`).toBeInstanceOf(HTMLParagraphElement);
    expect(h/*html*/ `<div><p><br/></p></div>`).toBeInstanceOf(HTMLDivElement);
    expect(h/*html*/ `This is a test!`).toBeInstanceOf(Text);
    expect(h/*html*/ `
      This is a test! This is only a test!
      I repeat, this is a test, this is only
      a test!

      This is a test! This is only a test!
      I repeat, this is a test, this is only
      a test!
    `).toBeInstanceOf(Text);
  });

  test('Leading/trailing whitespace do not affect calculation of number of root nodes', () => {
    expect(h/*html*/ `
      <div></div>
    `).toBeInstanceOf(HTMLDivElement);
    expect(h/*html*/ `
      <p></p>
    `).toBeInstanceOf(HTMLParagraphElement);
    expect(h/*html*/ `
      <div>
        <p>
          Hello, this is a test!
          <br/>
        </p>
      </div>
    `).toBeInstanceOf(HTMLDivElement);
  });

  test('Returns a document fragment if template contains more than one root node', () => {
    expect(h/*html*/ `
      <div></div>
      <div></div>
    `).toBeInstanceOf(DocumentFragment);
    expect(h/*html*/ `
      This is a test!
      <p>This is a test!</p>
      <div>
        <p>This is a test!</p>
      </div>
    `).toBeInstanceOf(DocumentFragment);
  });

  test('Correctly interpolates strings, numbers, and booleans', () => {
    const ariaPressed = false;
    const min = 40;
    const href = 'https://example.com/';
    let divBtn = null;
    let input = null;
    let anchor = null;
    h/*html*/ `
      <form>
        <input
          type="number"
          min="${min}" ${{ $ref: (el) => (input = el) }}
        >
        <a
          href="${href}"
          ${{ $ref: (el) => (anchor = el) }}
        >
          Link 1
        </a>
        <div
          role="button"
          aria-pressed="${ariaPressed}"
          ${{ $ref: (el) => (divBtn = el) }}
        >
          Button 1
        </div>
      </form>
    `;

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

    h/*html*/ `
      <form>
        <input type="text">
        <button type="submit" ${{ onclick, $ref: (el) => (btn = el) }}>
          Submit
        </button>
      </form>
    `;

    expect(btn).toBeInstanceOf(HTMLButtonElement);
    expect(btn.onclick).toBe(onclick);
    expect(onclick).toBeCalledTimes(0);
    btn.click();
    expect(onclick).toBeCalledTimes(1);
  });

  test('Correctly interpolates object attributes', () => {
    const type = 'number';
    const min = 50;
    const input = h/*html*/ `
      <input ${{ type, min }}>
    `;

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
    const btn = h/*html*/ `
      <button ${{ type, style }}>Submit</button>
    `;

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
    const div = h/*html*/ `
      <div ${{ role, dataset }}>Submit</div>
    `;

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
    const textInput = h/*html*/ `<input type="text">`;
    const radioInput = h/*html*/ `<input type="radio">`;
    const submitBtn = h/*html*/ `<button type="submit">${btnText}</button>`;
    const form = h/*html*/ `
      <form>
        <div>
          ${textInput}
          ${radioInput}
        </div>
        <p>
          ${submitBtn}
        </p>
      </form>
    `;

    expect(form.querySelector('input[type="text"]')).toBe(textInput);
    expect(form.querySelector('input[type="radio"]')).toBe(radioInput);
    expect(form.querySelector('button')).toBe(submitBtn);
    expect(form.querySelector('button').innerHTML).toBe(btnText.wholeText);
  });

  test('Snapshot matches', () => {
    const input1 = h/*html*/ `First name: <input type="text">`;
    const input2 = h/*html*/ `Last name: <input type="text">`;
    const input3 = h/*html*/ `Age: <input type="number">`;
    const input4 = h/*html*/ `Address: <input type="text">`;
    const btnProps = {
      type: 'submit',
      style: {
        padding: '0 0 0 50px',
        fontFamily: 'Arial',
        margin: '0',
      },
      dataset: {
        isDefault: 'false',
      },
    };
    const btn = h/*html*/ `<button ${btnProps}>Submit</button>`;

    expect(h/*html*/ `
      <form>
        <div>
          ${input1}
          ${input2}
          ${input3}
          ${input4}
        </div>
        <div>${btn}</div>
      </form>
    `).toMatchSnapshot();
  });
});
