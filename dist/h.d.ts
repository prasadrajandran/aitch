type ElementAttrs = {
    /**
     * Obtain a reference to the instantiated Element with this callback.
     * @param element
     */
    $ref?: (element: Element) => void;
    /**
     * CSS inline styles for the Element. The properties are expected to be in
     * camelCase.
     */
    style?: Partial<CSSStyleDeclaration>;
    /**
     * A DOM string map of data attribute properties that will be attached to the
     * element. The properties are expected to be in camelCase.
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
 * Parses HTML template literal and tags interpolated attributes and nodes.
 * @param htmlStrings Template literal HTML strings.
 * @param templateArgs Template literal interpolated values.
 */
declare const parseAndTagArgs: (htmlStrings: TemplateStringsArray, templateArgs: (string | number | boolean | ElementAttrs | Node)[]) => {
    template: HTMLTemplateElement;
    taggedArgs: TaggedArgsMap;
};
/**
 * Interpolate parsed HTML template literal with template literal arguments.
 * @param args Parsed and tagged HTML.
 */
declare const interpolate: ({ template, taggedArgs, }: ReturnType<typeof parseAndTagArgs>) => Node | DocumentFragment;
/**
 * Parse HTML template literal.
 * @param htmlStrings HTML template literal
 * @param templateArgs Interpolated HTML template literal values.
 */
export declare const h: (htmlStrings: TemplateStringsArray, ...templateArgs: (string | number | boolean | ElementAttrs | Node)[]) => ReturnType<typeof interpolate>;
export {};
