# h.js

Create HTML and/or CSS in JavaScript.

## Installation

TODO

## Why Would I Use This Instead of JSX?

Maybe you're bored?

## How Do I Use It

### h()

```javascript
import { h } from '@prasadrajandran/h.js';

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
