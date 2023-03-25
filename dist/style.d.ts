type StyleRules = {
    [selector: string]: Partial<CSSStyleDeclaration> | StyleRules;
};
/**
 * Create CSS styles given a plain JavaScript object.
 * @param rules CSS rules.
 */
export declare const style: (rules: StyleRules) => string;
export {};
