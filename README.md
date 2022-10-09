# h.js

Create HTML and/or CSS in JavaScript.

## Installation

TODO

## Why Would I Use This Instead of JSX?

Maybe you're bored?

## How Do I Use It

### h()

```javascript
import { h } from '@prasadrajandran/h-js';

// Equivalent to document.createElement('p');
const p = h('p');

// Apply attributes "inline"
const btn = h('button class="btn btn-primary" style="color: blue;"');

const className = 'heading section';
const div = h(`div class="${className}"`);

// Apply attributes/event handlers using JS
const div = h('div', {
  class: 'btn btn-primary',
  id: '',
  events: {
    onclick: () => console.info('clicked!'),
  },
  // Notes:
  // - must be in kebab case
  // - technically could be used to apply "class", "id", or any attribute
  //   (except events!) but the others are provided as shortcuts.
  attrs: {
    role: 'button',
  },
  // Note: camel case
  dataAttrs: {
    registrationId: 'x-a1', // this gets applied as "data-registration-id"
  },
  // Note: kebab case
  ariaAttrs: {
    label: 'main section', // this would get applied as "aria-label"
  },
  ref: (el) => {
    // callback to reference the element after it has been created
  },
});

// Add child nodes
const p = h('p', 'something', h('br'), 'like', h('br'), 'this');

// Note that the second argument could be attributes/events or a node
const p = h(
  'p',
  { events: { onclick: () => console.info('clicked!') } },
  'something',
  h('br'),
  'like',
  h('br'),
  'this'
);
```

### hRepeat()

```javascript
import { h, hRepeat } from '@prasadrajandran/h-js';

const items = [
  {
    id: 'A-01',
    name: 'John',
  },
  {
    id: 'Q-22',
    name: 'Michael',
  },
];

const container = h('div');
hRepeat({
  // Required: Container that houses the items.
  container,
  // Required: Items to iterate over. Can be an array, map, set, or plain
  // object.
  items,
  // Required: Callback that generates the template for each iteration.
  element: ({ key, item: { id, name }, index }) => {
    return h('p', id, h('br'), name);
  },
  // Optional: Callback that gets called on each item.
  ref: ({ key, item, index, element }) => {},
  // Optional: Options
  opts: {
    // The value returned by this callback will be used to uniquely identify
    // each item. If not set, it will use the array index, map key, set's
    // index order (like an array), or plain object's key. This value MUST BE
    // UNIQUE. It is strongly recommended that this be set to something other
    // than the array/set's indices.
    key: ({ key, item, index }) => item.id,
    // Name of attribute that hStyle() will query to decide if the element
    // needs to be removed the next time hStyle() is called.
    keyAttrName: 'data-key', // Default is 'data-h-repeat-key'
  },
});
```

### hStyle()

```javascript
import { hStyle } from '@prasadrajandran/h-js';

// Create styles
const selector = 'div:hover';
const style = document.createElement('style');
style.innerHTML = hStyle({
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
});
document.head.appendChild(style);

// Create media queries
hStyle({
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
});

// Create animation keyframes
hStyle({
  '@keyframes slideIn': {
    from: {
      transform: 'translateX(0%)',
    },
    to: {
      transform: 'translateX(100%)',
    },
  },
});
```
