type ElementAttrs = {
    /**
     * Obtain a reference to the DOM Element with this callback.
     * @param element
     */
    $ref?: (element: Element) => void;
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
} & Partial<GlobalEventHandlers>;
type TemplateLiteralArgIndex = number;
type TaggedArgsMap = Map<TemplateLiteralArgIndex, Node | ElementAttrs>;
/**
 * Parses an HTML template.
 * @internal
 * @param htmlStrings Template literal HTML strings.
 * @param templateArgs Template literal interpolated values.
 */
declare const parseTemplate: (htmlStrings: TemplateStringsArray, templateArgs: (string | number | boolean | ElementAttrs | Node)[]) => {
    taggedTemplate: HTMLTemplateElement;
    taggedArgs: TaggedArgsMap;
};
/**
 * Interpolate parsed HTML template literal with template literal arguments.
 * @internal
 * @param args Parsed and tagged HTML attributes or nodes.
 */
declare const interpolate: ({ taggedTemplate, taggedArgs, }: ReturnType<typeof parseTemplate>) => Node | DocumentFragment;
/**
 * Parses an HTML template.
 * @param htmlStrings HTML template literal
 * @param templateArgs Interpolated HTML template literal values.
 */
export declare const h: (htmlStrings: TemplateStringsArray, ...templateArgs: (string | number | boolean | ElementAttrs | Node)[]) => ReturnType<typeof interpolate>;
export {};
