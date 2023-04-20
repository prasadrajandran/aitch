import {
  DirectiveInstance,
  createDirective,
} from '../helpers/create-directive';

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
export const $ref = createDirective({
  type: 'attr',
  key: 'refs',
  callback: (instances: DirectiveInstance<[DirectiveArg]>[]) => {
    return instances.reduce((refs, { node, args: [keyOrCallback] }) => {
      if (typeof keyOrCallback === 'function') {
        keyOrCallback(node);
      } else {
        if (keyOrCallback in refs) {
          throw new Error(`Duplicate $ref key: "${keyOrCallback}"`);
        }
        refs[keyOrCallback] = node;
      }
      return refs;
    }, {} as Record<ReferencedElementName, Element>);
  },
});
