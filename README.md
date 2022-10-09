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

### hStyle()

```javascript
import { hStyle } from '@prasadrajandran/h.js';

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
