type StyleRules = {
  [selector: string]: Partial<CSSStyleDeclaration> | StyleRules;
};

/**
 * Create CSS styles from plain JavaScript objects.
 * @param rules CSS rules.
 */
export const style = (rules: StyleRules): string => {
  return Object.entries(rules)
    .map(([selector, styles]) => {
      const cssText = Object.entries(styles).reduce((items, [name, value]) => {
        if (typeof value === 'string') {
          const snakeCasedName = name.replace(
            /[A-Z]/g,
            (c) => `-${c.toLowerCase()}`
          );
          return (items += `${snakeCasedName}:${value};`);
        }
        return style(styles as StyleRules);
      }, '') as string;
      return `${selector}{${cssText}}`;
    })
    .join('');
};
