/**
 * Is `exp` a template directive?
 * @internal
 * @param exp Expression to check.
 */
export declare const isDirective: (exp: unknown) => exp is {
    id: string;
    def: import("./create-directive").DirectiveDefinition<unknown[], HTMLElement>;
    args: unknown[];
};
