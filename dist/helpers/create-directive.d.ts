import type { TemplateArgIndex } from '../h';
export type DirectiveIdentifier = symbol;
export type DirectiveCallbackResultKey = string;
export type TemplateDirective = ReturnType<typeof createDirective>;
export declare const directiveId = "9554857d-de86-490c-b840-97c0b09ec272";
export interface DirectiveInstance<DIRECTIVE_ARGS extends unknown[] = unknown[], DIRECTIVE_NODE extends Node = Element> {
    node: DIRECTIVE_NODE;
    pos: TemplateArgIndex;
    args: DIRECTIVE_ARGS;
}
export interface DirectiveDefinition<DIRECTIVE_KEY extends DirectiveCallbackResultKey, DIRECTIVE_ARGS extends unknown[], DIRECTIVE_RESULT, DIRECTIVE_NODE extends Node> {
    type: 'attr' | 'node';
    key?: DIRECTIVE_KEY;
    callback: (instances: DirectiveInstance<DIRECTIVE_ARGS, DIRECTIVE_NODE>[]) => DIRECTIVE_RESULT;
}
/**
 * Create a template directive.
 * @internal
 * @param definition Directive definition.
 */
export declare const createDirective: <DIRECTIVE_KEY extends string = "", DIRECTIVE_ARGS extends unknown[] = unknown[], DIRECTIVE_RESULT = void, DIRECTIVE_NODE extends Node = Element>(definition: DirectiveDefinition<DIRECTIVE_KEY, DIRECTIVE_ARGS, DIRECTIVE_RESULT, DIRECTIVE_NODE>) => (...args: DIRECTIVE_ARGS) => {
    directive: string;
    identifier: symbol;
    definition: {
        key: string | DIRECTIVE_KEY;
        type: 'attr' | 'node';
        callback: (instances: DirectiveInstance<DIRECTIVE_ARGS, DIRECTIVE_NODE>[]) => DIRECTIVE_RESULT;
    };
    args: DIRECTIVE_ARGS;
};
