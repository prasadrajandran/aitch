/**
 * Replaces a node if `newContent` is not identical to `currentNode`.
 * @internal
 * @param currentNode Current node to update.
 * @param newContent New text content or a new node to replace `currentNode`
 *     with.
 */
export const updateNode = (
  currentNode: Text | Element,
  newContent: string | Node
): Text | Element => {
  let replacedNode: Node = currentNode;
  const newNode =
    typeof newContent === 'string' ? new Text(newContent) : newContent;
  if (
    !(
      currentNode instanceof Text &&
      newNode instanceof Text &&
      currentNode.textContent === newNode.textContent
    ) &&
    currentNode !== newNode
  ) {
    currentNode.replaceWith(newNode as Node);
    replacedNode = newNode;
  }
  return replacedNode as Text | Element;
};
