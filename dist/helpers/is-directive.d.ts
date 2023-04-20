/**
 * Determines if the supplied `arg` is a valid TemplateDirective value.
 * @internal
 * @param arg Arg to check.
 */
export declare const isDirective: (arg: unknown) => arg is {
    directive: string;
    identifier: symbol;
    definition: {
        key: string;
        type: "attr" | "node";
        callback: (instances: import("./create-directive").DirectiveInstance<unknown[], Node>[]) => unknown;
    };
    args: unknown[];
};
