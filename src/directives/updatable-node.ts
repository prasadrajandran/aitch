import {
  DirectiveInstance,
  createDirective,
} from '../helpers/create-directive';
import { updateNode } from '../helpers/update-node';

/**
 * A unique key that identifies the updatable node.
 */
type DirectiveArg = string;

/**
 * Marks a node as being updatable.
 */
export const $updatableNode = createDirective({
  type: 'node',
  key: 'updateNode',
  callback: (
    instances: DirectiveInstance<[DirectiveArg], Element | Text>[]
  ) => {
    const nodeMap = instances.reduce((map, { node, args: [nodeKey] }) => {
      if (map.has(nodeKey)) {
        throw new Error(`Duplicate $updatableNode key: "${nodeKey}"`);
      }
      return map.set(nodeKey, node);
    }, new Map<DirectiveArg, Element | Text>());

    return (args: { [nodeKey: DirectiveArg]: string | Node }) => {
      Object.entries(args).forEach(([nodeKey, newContent]) => {
        const node = nodeMap.get(nodeKey);
        if (node) {
          nodeMap.set(nodeKey, updateNode(node, newContent));
        }
      });
    };
  },
});
