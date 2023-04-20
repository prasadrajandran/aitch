import { DirectiveInstance } from '../helpers/create-directive';
/**
 * A unique key that identifies the updatable node.
 */
type DirectiveArg = string;
/**
 * Marks a node as being updatable.
 */
export declare const $updatableNode: (args_0: string) => {
    directive: string;
    identifier: symbol;
    definition: {
        key: string;
        type: "attr" | "node";
        callback: (instances: DirectiveInstance<[string], Element | Text>[]) => (args: {
            [nodeKey: string]: string | Node;
        }) => void;
    };
    args: [string];
};
export {};
