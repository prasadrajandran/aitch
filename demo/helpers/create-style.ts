import { style } from '../../dist/index';

type CssSelector = string;
type CssScope = string;

const ROOT_KEYWORD = '$root';

export const createStyle = (
  rules: Record<CssSelector, Partial<CSSStyleDeclaration>>
): CssScope => {
  const styleElement = document.createElement('style');

  // Always start with a letter as CSS class names cannot start with a number
  // and that might happen.
  const scope = 'a' + crypto.randomUUID().substring(24);

  const scopedRules: typeof rules = {};
  Object.entries(rules).forEach(([selector, rules]) => {
    scopedRules[
      `.${scope}${
        selector.startsWith(ROOT_KEYWORD)
          ? selector.substring(ROOT_KEYWORD.length)
          : ' ' + selector
      }`
    ] = rules;
  });

  styleElement.innerHTML = style(scopedRules);
  styleElement.dataset['scope'] = scope;
  document.head.append(styleElement);

  return scope;
};
