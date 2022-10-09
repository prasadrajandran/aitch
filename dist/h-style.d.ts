declare type StyleRules = {
    [selector: string]: Partial<CSSStyleDeclaration> | StyleRules;
};
/**
 * Add CSS style sheet rules.
 * @param rules Style rules.
 */
export declare const hStyle: (rules: StyleRules) => string;
export {};
