import type { TemplateDirectiveResults, createDirective } from './helpers/create-directive';
import { createRef } from './helpers/create-ref';
/**
 * A template that has been parsed by h.
 */
export type ParsedTemplate<NODE_TYPE = HTMLElement, DIRECTIVES extends TemplateDirectiveResults = TemplateDirectiveResults> = {
    $id: typeof parsedTemplateId;
    $cb: TemplateCallbackSet;
    $node: NODE_TYPE;
} & DIRECTIVES;
/**
 * An "attributes" template expression.
 */
export type TemplateAttrsExp<CUSTOM_ATTRS extends {
    [P in keyof CUSTOM_ATTRS]: CUSTOM_ATTRS[P];
} = object> = {
    /**
     * CSS classes that will be appended to the element.
     */
    className?: string;
    /**
     * CSS inline styles for the element. The properties are expected to be in
     * camelCase.
     */
    style?: Partial<CSSStyleDeclaration>;
    /**
     * A DOM string map of custom data attribute properties set on the element.
     * The properties are expected to be in camelCase.
     */
    dataset?: HTMLOrSVGElement['dataset'];
    /**
     * Other attributes or properties that will be assigned to the element.
     */
    [attr: string]: unknown;
} & Partial<GlobalEventHandlers> & Partial<ARIAMixin> & Partial<InnerHTML> & Partial<Node> & Partial<Element> & CUSTOM_ATTRS;
/**
 * A "directive" template expression.
 */
export type TemplateDirectiveExp = ReturnType<ReturnType<typeof createDirective>>;
export type TemplateCallbackRef<NODE_TYPE extends HTMLElement = HTMLElement, PARSED_TEMPLATE extends ParsedTemplate = ParsedTemplate> = ElementRef<NODE_TYPE> & {
    tpl: PARSED_TEMPLATE;
};
/**
 * A "callback" template expression.
 *
 * Notes:
 * - All callbacks expressions are collected into a set call "$cb" that is
 *   attached to a parsed template.
 * - This callback is not executed until $cb.run() is called. This allows you
 *   to control when callbacks which allows for the creation of more complex
 *   closures.
 * - If the callback returns false, it will be removed from "$cb" the first
 *   time it is executed (i.e. one-off callbacks expressions).
 */
export type TemplateCallbackExp<NODE_TYPE extends HTMLElement = HTMLElement, PARSED_TEMPLATE extends ParsedTemplate = ParsedTemplate> = (ref: TemplateCallbackRef<NODE_TYPE, PARSED_TEMPLATE>) => unknown;
/**
 * Valid template expressions.
 * @internal
 */
type TemplateExps = string | number | boolean | Node | TemplateAttrsExp | TemplateCallbackExp | TemplateDirectiveExp | ParsedTemplate | (string | number | boolean | Node | TemplateAttrsExp | TemplateCallbackExp | TemplateDirectiveExp | ParsedTemplate)[];
/**
 * The index position of a template expression.
 * @internal
 */
export type TemplateExpIndex = number;
/**
 * A map of template expression index position to template expression.
 * @internal
 */
type TaggedExpMap = Map<TemplateExpIndex, Node | TemplateCallbackExp | TemplateAttrsExp | TemplateDirectiveExp>;
/**
 * A wrapper around an HTML element that provides additional utility functions.
 */
export type ElementRef<NODE extends HTMLElement = HTMLElement> = ReturnType<typeof createRef<NODE>>;
/**
 * An internal property to identify parsed template objects.
 * @internal
 */
export declare const parsedTemplateId = "__PzroJBb1g__";
/**
 * Set of all callback expressions in a parsed template.
 * @internal
 */
declare class TemplateCallbackSet extends Set<() => unknown> {
    /**
     * Execute all callbacks.
     */
    run(): void;
    /**
     * Execute all callbacks inside "requestAnimationFrame"
     */
    runAsync(): void;
}
/**
 * Tags all expressions in a template.
 * @internal
 * @param htmlStrings Template literal HTML strings.
 * @param templateExps Template literal expressions.
 */
declare const tag: (htmlStrings: TemplateStringsArray, templateExps: TemplateExps[]) => {
    taggedTemplate: HTMLTemplateElement;
    taggedExps: TaggedExpMap;
    createErrorTemplate: () => string;
};
/**
 * Interpolate a tagged template with the provided template expressions.
 * @internal
 * @param template Tagged template
 */
declare const interpolate: <NODE_TYPE = HTMLElement, DIRECTIVES extends TemplateDirectiveResults = TemplateDirectiveResults>({ taggedTemplate, taggedExps, createErrorTemplate, }: ReturnType<typeof tag>) => ParsedTemplate<NODE_TYPE, DIRECTIVES>;
/**
 * Parse an HTML template
 * @param htmlStrings HTML strings.
 * @param templateExps Template expressions
 * @returns A parsed HTML template.
 */
export declare const h: <NODE_TYPE = HTMLElement, DIRECTIVES extends TemplateDirectiveResults = TemplateDirectiveResults>(htmlStrings: TemplateStringsArray, ...templateExps: TemplateExps[]) => ParsedTemplate<NODE_TYPE, DIRECTIVES>;
export {};
