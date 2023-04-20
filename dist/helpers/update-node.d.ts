/**
 * Replaces a node if `newContent` is not identical to `currentNode`.
 * @internal
 * @param currentNode Current node to update.
 * @param newContent New text content or a new node to replace `currentNode`
 *     with.
 */
export declare const updateNode: (currentNode: Text | Element, newContent: string | Node) => Text | Element;
