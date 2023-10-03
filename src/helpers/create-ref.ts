import type { TemplateAttrsExp } from '../h';
import { attrs } from './attrs';

/**
 * A CSS class name.
 * @internal
 */
type ClassName = string;

/**
 * An HTML element attribute name.
 *
 * Attribute names are expected to be in "snake-case".
 *
 * @internal
 */
type AttrNameSnakeCased = string;

/**
 * An HTML element custom data attribute name.
 *
 * Custom data attribute names are expected to be in "cameCase".
 *
 * @internal
 */
type DataAttrNameCamelCased = string;

/**
 * Wraps a node with a utility functions to simplify making changes to the
 * node.
 * @param node Node to wrap
 */
export const createRef = <NODE extends HTMLElement>(node: NODE) => {
  const nodePlaceholder = new Text('');
  let removed = false;

  const replaceNode = () => {
    if (removed) {
      nodePlaceholder.replaceWith(node);
      removed = false;
    }
  };

  return {
    /**
     * Provided node.
     */
    node,
    /**
     *
     * @param cssClassNames CSS class names to add or remove
     */
    classMap: (cssClassNames: Record<ClassName, boolean>) => {
      Object.entries(cssClassNames).forEach(([className, active]) => {
        if (active) {
          node.classList.add(className);
        } else {
          node.classList.remove(className);
        }
      });
    },
    attrMap: (attrs: Record<AttrNameSnakeCased, string | boolean>) => {
      Object.entries(attrs).forEach(([attrName, value]) => {
        if (value === false) {
          node.removeAttribute(attrName);
        } else {
          node.setAttribute(attrName, value === true ? '' : value);
        }
      });
    },
    dataMap: (dataset: Record<DataAttrNameCamelCased, boolean | string>) => {
      Object.entries(dataset).forEach(([dataAttrName, value]) => {
        if (value === false) {
          delete node.dataset[dataAttrName];
        } else {
          node.dataset[dataAttrName] = value === true ? '' : value;
        }
      });
    },
    text: (textContent: string) => {
      if (node.textContent !== textContent) {
        node.textContent = textContent;
      }
    },
    style: (style: Partial<CSSStyleDeclaration>) => attrs(node, { style }),
    attrs: (elementAttrs: TemplateAttrsExp) => attrs(node, elementAttrs),
    show: () => {
      node.style.removeProperty('display');
      replaceNode();
    },
    hide: () => {
      node.style.setProperty('display', 'none');
      replaceNode();
    },
    remove: () => {
      if (!removed) {
        node.replaceWith(nodePlaceholder);
        removed = true;
      }
    },
  };
};
