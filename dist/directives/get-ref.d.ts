import { DirectiveInstance } from '../helpers/create-directive';
type ReferencedElementName = string;
type ReferencedElementCallback = (el: Element) => void;
/**
 * If provided a
 * - string: will be used as a name to the referenced element.
 * - callback: the callback will received the referenced element as its first
 *             argument.
 */
type DirectiveArg = ReferencedElementName | ReferencedElementCallback;
/**
 * Obtain a reference to an element.
 */
export declare const $ref: (args_0: DirectiveArg) => {
    directive: string;
    identifier: symbol;
    definition: {
        key: string;
        type: "attr" | "node";
        callback: (instances: DirectiveInstance<[DirectiveArg], Element>[]) => Record<string, Element>;
    };
    args: [DirectiveArg];
};
export {};
