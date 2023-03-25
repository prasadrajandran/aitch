# aitch

Easily create HTML templates in pure JavaScript:

```javascript
import { h } from '@prsd/aitch';

const nameInput = h`<input type="text" name="name">`;
const onclick = (e) => {
  e.preventDefault();
  const name = nameInput.value;
  // process form data...
};
const form = h`
  <form>
    Name ${nameInput}
    <button type="submit" ${{ onclick }}>
      Submit
    </button>
  </form>
`;
document.body.append(form);
```

It's just template literals and a tag function so that we can assign values
other than strings (i.e. event handlers) from within the template itself.

## Motivation

JavaScript needs an HTML templating language that's:

- Low maintenance
  - This package does not introduce a new language for creating HTML. As such,
    there's very little to maintain outside of bugs, breaking changes introduced
    by JavaScript or HTML (which is very rare).
- Focused
  - It's designed to build HTML templates in JavaScript. State management,
    routing, etc. is not within the scope of this package.
- Lightweight
  - The tag function, `h`, is ~1.4kB.

All JavaScript packages are required by law to make claims about how fast they
are. `aitch`'s top speed is 25 salmon per second (sm/s). `aitch` updates the DOM
with the grace of a drowning seagull.

## Installation

```
npm install @prsd/aitch
```

## Guide

- [h()](#h)
  - Create HTML in JavaScript.
- [repeat()](#repeat)
  - Create repeating HTML elements.
- [style()](#style)
  - Create CSS styles in JavaScript.

### h()

Create HTML in JavaScript.

If you use <a href="https://code.visualstudio.com/" target="_blank">VS Code</a>,
you could add HTML syntax highlighting with a plugin like
<a href="https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html" target="_blank">es6-string-html</a>.

```javascript
import { h } from '@prsd/aitch';

// This will create a single input node.
const input = h`<input type="text" name="firstName">`;

// A fragment is created automatically if there's more than one root node.
const formBody = h`
  First name: <input type="text" name="firstName">
  Last name: <input type="text" name="lastName">
  <button>Submit</button>
`;

// You can compose templates from other nodes.
const firstNameInput = h`<input type="text" name="firstName">`;
const ageInput = h`<input type="number" name="age">`;
const submitBtn = h`<button type="submit">Submit</button>`;
const formBody = h`
  First name: ${firstNameInput}
  Age: ${ageInput}
  ${submitBtn}
`;
const form = h`<form>${formBody}</form>`;

// You can interpolate strings, numbers, and booleans. Numbers and booleans are
// converted into strings.
const isHidden = () => true;
const ariaLevel = 5;
const ariaDescription = 'A container that displays...';
const div = h`
  <div
    aria-level="${ariaLevel}"
    aria-hidden="${isHidden()}"
    aria-description="${ariaDescription}"
  >
    Lorem ipsum...
  </div>
`;

// You can interpolate more complex values like event handlers with the use of
// a plain object.
const firstNameInput = h`<input type="text" name="firstName">`;
const ageInput = h`<input type="number" name="age">`;
const submitBtn = h`<button type="submit">Submit</button>`;
const onsubmit = (e) => {
  e.preventDefault();
  /* Does something... */
};
const form = h`
  <form ${{ onsubmit }}>
    First name: ${firstNameInput}
    Age: ${ageInput}
    ${submitBtn}    
  </form>
`;

// You can also interpolate inline styles, data attributes, and obtain a
// reference to the node from within the template using a plain object too.
// Please note that:
// (1) All inline styles declared within the "style" must be in camelCase.
// (2) All data attributes declared within the "dataset" property must be in
//     camelCase.
//     - E.g. dataset: { customData: '123' } = 'data-custom-data="123"'
// (3) "$ref" accepts a callback that receives a reference to the node. You can
//     use this, for example, to obtain a reference of the node, perform more
//     complex tasks with the node, etc.
// (4) All other properties in an object are assigned based on:
//     - (a) If the following is true "property in node", then the property is
//           assigned like this: "node[property] = value"
//           This is how event handlers are assigned.
//     - (b) If (a) is not true, then the property is assigned like this:
//           "node.setAttribute(property, value)"

let btn = null; // Gets assigned in using "$ref" below.
const form = h`
  <form>
    Email: <input type="text">
    <button ${{
      onclick: (e) => e.preventDefault(),
      style: {
        padding: '10px',
        fontFamily: '"Goudy Bookletter 1911", sans-serif',
      },
      dataset: {
        test: 'submitBtn',
        customData: '123',
      },
      $ref: (el) => (btn = el),
    }}>
      Submit
    </button>
  </form>
`;
```

### repeat()

Create repeating HTML elements.

```javascript
import { h, repeat } from '@prsd/aitch';

const peopleContainer = document.querySelector('#peopleContainer');
const people = [
  {
    id: 'A-01',
    name: 'John',
  },
  {
    id: 'Q-22',
    name: 'Michael',
  },
];
const renderPeople = () => {
  repeat({
    // Required: Container that houses the items.
    container: peopleContainer,
    // Required: Items to render. Supported types:
    // (1) Array
    // (2) Set
    // (3) Map
    // (4) Plain object.
    items: people,
    // Required: Callback that generates the element node for each item.
    element: ({ key, item: { id, name }, index }) => {
      return h`<p>${id}<br>${name}</p>`;
    },
    // Optional: Callback that is activated on each rendered element. This can
    // be used to perform more complex tasks with each rendered element.
    ref: ({ key, item, index, element }) => {},
    // Optional (but recommended to set!): The value returned by this callback
    // will be used to uniquely identify each element node.
    //
    // If this is not set, then the following will be used as keys:
    // (1) Arrays  : array indices
    // (2) Sets    : order of properties (effectively like array indices)
    // (3) Maps    : map keys
    // (4) Objects : object keys
    //
    // The value returned by this callback must be unique!
    // If (1) or (2) is used, then we highly recommended setting this callback
    // as array and/or set indices do not make good keys.
    key: ({ key, item, index }) => item.id,
    // Optional: Name of the attribute for the key that would be applied on
    // each element. If not set, the default is "data-h-repeat-key".
    keyName: 'data-key',
  });
};

// Render the list of people.
renderPeople();

// Some event happens and the "people" array is updated.
people.splice(0, 1);
people.push({ id: 'X-30', name: 'Josephine' });

// Call this again to update the DOM.
renderPeople();
```

### style()

Create CSS styles in JavaScript.

```javascript
import { style } from '@prsd/aitch';

const selector = 'div:hover';
const style = document.createElement('style');
style.innerHTML = style({
  p: {
    fontSize: '10px',
    fontWeight: 'bold',
  },
  'p > button': {
    color: 'blue',
  },
  [selector]: {
    color: 'yellow',
  },
  [`
    p > button,
    div > span
  `]: {
    display: 'absolute',
  },
  '@media (height: 360px)': {
    div: {
      fontSize: '10px',
    },
    p: {
      display: 'flex',
      flexDirection: 'column',
      fontSize: '10px',
    },
  },
  '@keyframes slideIn': {
    from: {
      transform: 'translateX(0%)',
    },
    to: {
      transform: 'translateX(100%)',
    },
  },
});

document.head.appendChild(style);
```
