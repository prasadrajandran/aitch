import type { ElementAttrs } from '../h';
import { DirectiveInstance } from '../helpers/create-directive';
/**
 * A unique name of the element whose attributes or properties can be updated.
 */
type DirectiveArg = string;
/**
 * Marks an element has having updatable attributes and properties.
 */
export declare const $updatable: (args_0: string) => {
    directive: string;
    identifier: symbol;
    definition: {
        key: string;
        type: "attr" | "node";
        callback: (instances: DirectiveInstance<[string], Element>[]) => (args: {
            [nodeKey: string]: ElementAttrs;
        }) => void;
    };
    args: [string];
};
export {};
