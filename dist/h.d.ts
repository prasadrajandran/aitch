import type { DirectiveCallbackResultKey, TemplateDirective } from './helpers/create-directive';
export type ElementAttrs = {
    /**
     * CSS inline styles for the Element. The properties are expected to be in
     * camelCase.
     */
    style?: Partial<CSSStyleDeclaration>;
    /**
     * A DOM string map of custom data attribute properties set on the element.
     * The properties are expected to be in camelCase.
     */
    dataset?: HTMLOrSVGElement['dataset'];
    /**
     * Other miscellaneous attributes or properties that will be assigned to the
     * Element.
     */
    [attr: string]: unknown;
} & Partial<GlobalEventHandlers> & Partial<ARIAMixin> & Partial<InnerHTML> & Partial<Node> & Partial<Element>;
export type TemplateArgIndex = number;
type TaggedArgsMap = Map<TemplateArgIndex, Node | ElementAttrs | TemplateDirective>;
/**
 * Parses an HTML template.
 * @internal
 * @param htmlStrings Template literal HTML strings.
 * @param templateArgs Template literal interpolated directiveValues.
 */
declare const parse: (htmlStrings: TemplateStringsArray, templateArgs: (string | number | boolean | Node | ElementAttrs | TemplateDirective)[]) => {
    taggedTemplate: HTMLTemplateElement;
    taggedArgs: TaggedArgsMap;
};
/**
 * Interpolate parsed HTML template literal with template literal arguments.
 * @internal
 * @param args Parsed and tagged HTML attributes or nodes.
 */
declare const interpolate: ({ taggedTemplate, taggedArgs, }: ReturnType<typeof parse>) => {
    [directiveKey: string]: unknown;
    content: Node | DocumentFragment;
};
export declare const h: (htmlStrings: TemplateStringsArray, ...templateArgs: (string | number | boolean | Node | ElementAttrs | TemplateDirective)[]) => ReturnType<typeof interpolate>;
export {};
