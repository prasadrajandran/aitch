type StyleRules = {
    [selector: string]: Partial<CSSStyleDeclaration> | StyleRules;
};
/**
 * Create CSS styles from plain JavaScript objects.
 * @param rules CSS rules.
 */
export declare const style: (rules: StyleRules) => string;
export {};
