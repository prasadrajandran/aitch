import type { ElementAttrs } from '../h';
import {
  DirectiveInstance,
  createDirective,
} from '../helpers/create-directive';
import { updateElementAttrs } from '../helpers/update-element-attrs';

/**
 * A unique name of the element whose attributes or properties can be updated.
 */
type DirectiveArg = string;

/**
 * Marks an element has having updatable attributes and properties.
 */
export const $updatable = createDirective({
  type: 'attr',
  key: 'update',
  callback: (instances: DirectiveInstance<[DirectiveArg]>[]) => {
    const nodeMap = instances.reduce((map, { node, args: [nodeKey] }) => {
      if (map.has(nodeKey)) {
        throw new Error(`Duplicate $updatable key: "${nodeKey}"`);
      }
      return map.set(nodeKey, node);
    }, new Map<DirectiveArg, Element>());

    return (args: { [nodeKey: DirectiveArg]: ElementAttrs }) => {
      Object.entries(args).forEach(([nodeKey, nodeAttrs]) => {
        const node = nodeMap.get(nodeKey);
        if (node) {
          updateElementAttrs(node, nodeAttrs);
        }
      });
    };
  },
});
