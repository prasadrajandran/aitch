/**
 * Add CSS style sheet rules.
 * @param rules Style rules.
 */
export const hStyle = (rules) => {
  const styleElement = document.createElement('style');
  const parser = (rules) => {
    return Object.entries(rules).map(([selector, styles]) => {
      const cssText = Object.entries(styles).reduce((items, [name, value]) => {
        if (typeof value === 'string') {
          const snakeCasedName = name.replace(
            /[A-Z]/g,
            (c) => `-${c.toLowerCase()}`
          );
          return (items += `${snakeCasedName}:${value};`);
        }
        return parser(styles).join('');
      }, '');
      return `${selector}{${cssText}}`;
    });
  };
  styleElement.innerHTML = parser(rules).join('');
  document.head.append(styleElement);
};
