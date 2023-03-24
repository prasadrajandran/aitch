type StyleRules = {
    [selector: string]: Partial<CSSStyleDeclaration> | StyleRules;
};
/**
 * Create CSS style sheet rules given a JavaScript object.
 * @param rules CSS rules.
 */
export declare const style: (rules: StyleRules) => string;
export {};
