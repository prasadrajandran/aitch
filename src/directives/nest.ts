import type { ParsedTemplate } from '../h';
import { createDirective } from '../helpers/create-directive';

/**
 * Name of the nested template.
 * @internal
 */
type NestedTemplateName = string;

/**
 * Nest directive type generator.
 */
export type NestDirective<
  NESTED_TEMPLATE extends { [P in keyof NESTED_TEMPLATE]: ParsedTemplate },
> = NESTED_TEMPLATE;

/**
 * Creates a reference to another parsed template.
 *
 * Example:
 *
 * const Component = () => html`
 *   <div>
 *     <p>${_text('label')}</p>
 *   </div>
 * `;
 *
 * const tpl = html`
 *   <div>
 *     ${_nest('componentA', Component())}
 *     ${_nest('componentB', Component())}
 *   </div>
 * `;
 *
 * tpl.componentA.label = 'Something...';
 * tpl.componentB.label = 'Else...';
 */
export const _nest = createDirective<[NestedTemplateName, ParsedTemplate]>({
  type: 'node',
  callback: (template, instances) => {
    instances.forEach(({ node, args: [name, componentTemplate] }) => {
      node.appendChild(componentTemplate.$node);
      Object.defineProperty(template, name, {
        value: componentTemplate,
        enumerable: true,
      });
    });
  },
});
