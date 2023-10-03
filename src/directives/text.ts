import { createDirective } from '../helpers/create-directive';

/**
 * A name for the updatable text node.
 * @internal
 */
type UpdatableTextNodeName = string;

/**
 * Default text content for the text node.
 * @internal
 */
type DefaultTextContent = string;

/**
 * Text directive type generator.
 */
export type TextDirective<NODE_NAME extends UpdatableTextNodeName> = Record<
  NODE_NAME,
  string
>;

/**
 * Creates an updatable text node.
 *
 * Example:
 * const tpl = html`
 *   <div>
 *     <p>${_text('label', 'Optional default value')}</p>
 *   </div>
 * `;
 * tpl.label = 'Lorem ipsum...';
 */
export const _text = createDirective<
  [UpdatableTextNodeName] | [UpdatableTextNodeName, DefaultTextContent]
>({
  type: 'node',
  callback: (template, instances) => {
    instances.forEach(({ node, args: [nodeKey, content] }) => {
      const textNode = new Text(content || '');
      node.replaceWith(textNode);
      Object.defineProperty(template, nodeKey, {
        enumerable: true,
        get: () => textNode.textContent,
        set: (value: string) => {
          const stringifiedValue = String(value);
          if (textNode.textContent !== stringifiedValue) {
            textNode.textContent = stringifiedValue;
          }
        },
      });
    });
  },
});
