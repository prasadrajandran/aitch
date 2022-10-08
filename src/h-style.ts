type StyleRules = {
  [selector: string]: Partial<CSSStyleDeclaration> | StyleRules;
};

/**
 * Add CSS style sheet rules.
 * @param rules Style rules.
 */
export const hStyle = (rules: StyleRules) => {
  const styleElement = document.createElement('style');

  const parser = (rules: StyleRules) => {
    return Object.entries(rules).map(([selector, styles]) => {
      const cssText = Object.entries(styles).reduce((items, [name, value]) => {
        if (typeof value === 'string') {
          const snakeCasedName = name.replace(
            /[A-Z]/g,
            (c) => `-${c.toLowerCase()}`
          );
          return (items += `${snakeCasedName}:${value};`);
        }
        return parser(styles as StyleRules).join('');
      }, '') as string;
      return `${selector}{${cssText}}`;
    });
  };

  styleElement.innerHTML = parser(rules).join('');

  document.head.append(styleElement);
};
