type ElementHeader = string;

type AttrNameKebabCase = string;

type AttrValue = string | number | boolean;

type DataAttrNameCamelCase = string;

type HChildNode = Node | string;

type ElementDetails<T extends HTMLElement> = {
  $style?: Partial<CSSStyleDeclaration>;
  $data?: Record<DataAttrNameCamelCase, AttrValue>;
  $aria?: Record<AttrNameKebabCase, AttrValue>;
  $ref?: (element: T) => void;
  [attr: string]: unknown;
};

/**
 * Create an HTML Element.
 *
 * @param elementHeader Element header definition E.g. 'div',
 *   'div class="class"', etc.
 * @param elementDetails Element details
 * @param nodes Child nodes.
 */
export const h = <T extends HTMLElement>(
  elementHeader: ElementHeader,
  elementDetails?: ElementDetails<T> | HChildNode,
  ...nodes: HChildNode[]
): T => {
  const {
    class: className = '',
    id = '',
    $style = {},
    $data = {},
    $aria = {},
    $ref = () => {
      /* Do nothing */
    },
    ...attrs
  } = elementDetails instanceof Node || typeof elementDetails === 'string'
    ? {}
    : elementDetails || {};

  const parser = document.createElement('div');
  parser.innerHTML = `<${(elementHeader || '').trim()}/>`;
  const element = parser.firstElementChild as T;

  if (!element || element instanceof HTMLUnknownElement) {
    throw new Error(`First argument to h() is invalid: "${elementHeader}"`);
  }

  if (element.childNodes.length) {
    throw new Error(
      'First argument to h() should not contain more than one element: ' +
        parser.innerHTML
    );
  }

  for (const [styleName, styleValue] of Object.entries($style)) {
    if (typeof styleValue === 'string') {
      // Note: Do not use "style.setProperty" because "styleName" is in
      // camelCase.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      element.style[styleName] = styleValue;
    } else {
      throw new Error(
        `Value of "${styleName}" CSS style property has to be a string`
      );
    }
  }

  if (className) {
    if (typeof className === 'string') {
      element.classList.add(...className.split(' '));
    } else {
      throw new Error('Value of "class" attribute has to be a string');
    }
  }

  if (id) {
    if (typeof id === 'string') {
      element.setAttribute('id', id);
    } else {
      throw new Error('Value of "id" attribute has to be a string');
    }
  }

  for (const [attrName, attrValue] of Object.entries(attrs)) {
    if (attrName.startsWith('on')) {
      if (attrName in element) {
        if (typeof attrValue === 'function') {
          // eslint-disable-next-line
          // @ts-ignore
          element[attrName] = attrValue;
        } else {
          throw new Error(`Value of "${attrName}" has to be a function"`);
        }
      } else {
        throw new Error(
          `"${attrName}" does not exist on "${element.nodeName}"`
        );
      }
    } else {
      if (typeof attrValue === 'string') {
        element.setAttribute(attrName, attrValue);
      } else {
        throw new Error(`Value of "${attrName}" attribute has to be a string`);
      }
    }
  }

  for (const [dataAttrName, dataAttrValue] of Object.entries($data)) {
    if (typeof dataAttrValue === 'string') {
      element.dataset[dataAttrName] = dataAttrValue;
    } else {
      throw new Error(
        `Value of "${dataAttrName}" data attribute has to be a string`
      );
    }
  }

  for (const [ariaAttrName, ariaAttrValue] of Object.entries($aria)) {
    if (typeof ariaAttrValue === 'string') {
      element.setAttribute(`aria-${ariaAttrName}`, ariaAttrValue);
    } else {
      throw new Error(
        `Value of "${ariaAttrName}" ARIA attribute has to be a string`
      );
    }
  }

  if (elementDetails instanceof Node || typeof elementDetails === 'string') {
    element.append(elementDetails);
  }
  element.append(...nodes);

  $ref(element);

  return element;
};
