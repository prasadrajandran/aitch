# h

Easily create HTML templates in pure JavaScript:

```javascript
import { h } from '@prasadrajandran/h';

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
  </form
`;
document.body.append(form);
```

It's just template literals and a tag function so that values other than strings can
be easily assigned to HTML elements.

## Motivation

JavaScript needs an HTML templating language that's:

- Low maintenance
  - No need to bug the author to update the package because it introduces 0
    custom syntax. `h` is not parsing a custom language, it's just a tag
    function to handle complex values like event handlers. That makes it
    highly unlikely to break unless JavaScript and/or HTML introduce a breaking
    change.
- Focused
  - It's designed to build HTML templates in JavaScript easily. That's it. It
    does not handle state management. That's for you to figure out.
- Lightweight
  - The tag function, `h`, is ~1.4kB.

Since this is a JavaScript package, it's mandatory for me to make claims about
how fast `h` is. `h`'s top speed is 25 salmon per second (sm/s). It also
updates the DOM with panache and rage in equal measure.

## Installation

```
npm install @prasadrajandran/h
```

## Guide

- [h()](#h)
  - Create HTML in pure JavaScript using template literals.
- [repeat()](#repeat)
  - Create repeating HTML elements given an array, map, set, or object.
- [style()](#style)
  - Create CSS styles using JavaScript.

### h()

HTML template parser.

```javascript
import { h } from '@prasadrajandran/h';

// Create a single node
const input = h`<input type="text" name="firstName">`;

// Create a fragment
const formBody = h`
  First name: <input type="text" name="firstName">
  Last name: <input type="text" name="lastName">
  <button>Submit</button>
`;

// Compose templates from other nodes or fragments
const firstNameInput = h`<input type="text" name="firstName">`;
const ageInput = h`<input type="number" name="age">`;
const submitBtn = h`<button type="submit">Submit</button>`;
const formBody = h`
  First name: ${firstNameInput}
  Age: ${ageInput}
  ${submitBtn}
`;
const form = h`<form>${formBody}</form>`;

// Interpolate strings, numbers, and booleans. Numbers and booleans are
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

// Interpolate more complex values like event handlers using an object.
const firstNameInput = h`<input type="text" name="firstName">`;
const ageInput = h`<input type="number" name="age">`;
const submitBtn = h`<button type="submit">Submit</button>`;
const onsubmit = (e) => {
  e.preventDefault();
  /* Do something... */
};
const form = h`
  <form ${{ onsubmit }}>
    First name: ${firstNameInput}
    Age: ${ageInput}
    ${submitBtn}    
  </form>
`;

// Inline styles, data attributes, obtaining a reference to a node within
// a template, and any other attribute can also be interpolated using an object.
// Please note that:
// (1) "style" properties must be in camelCase.
// (2) "dataset" properties must be in camelCase.
//     - E.g. dataset: { customData: '123' } = 'data-custom-data="123"'
// (3) "$ref" is a callback that allows you to obtain a reference to a node
//     within a template.
// (4) All other properties in an object are assigned
//     - (a) If the following is true "property in node", then the property is
//           assigned like this: "node[property] = value"
//           This is how event handlers are assigned.
//     - (b) If (a) is not true, then the property is assigned like this:
//           "node.setAttribute(property, value)"

let btn = null; // Gets assigned in the "$ref" callback below:
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

Render repeating HTML elements.

```javascript
import { h, repeat } from '@prasadrajandran/h';

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
    // Required: Callback that generates the element node on each item.
    element: ({ key, item: { id, name }, index }) => {
      return h`<p>${id}<br>${name}</p>`;
    },
    // Optional: Callback that is called on each item. This can be used to
    // update the element on each re-render.
    ref: ({ key, item, index, element }) => {},
    // Optional (but recommended to set!): The value returned by this callback
    // will be used to uniquely identify each element node.
    //
    // If this is not set, then the following defaults apply for:
    // (1) Arrays  : array indices
    // (2) Sets    : order of properties (effectively like array indices)
    // (3) Maps    : map keys
    // (4) Objects : object keys
    //
    // The value returned by this callback must be unique!
    // If (1) or (2) is used, then this should ideally be defined as array or
    // set indices do not make good keys!
    key: ({ key, item, index }) => item.id,
    // Optional: Name of the attribute for the keys that would be applied on
    // each element. If not set, the default is "data-h-repeat-key".
    keyName: 'data-key',
  });
};

// Render the DOM elements.
renderPeople();

// Some event happens and the "people" array is updated.
people.splice(0, 1);
people.push({ id: 'X-30', name: 'Josephine' });

// Call this again to update the DOM.
renderPeople();
```

### style()

Create CSS styles using JavaScript.

```javascript
import { style } from '@prasadrajandran/h';

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
