import { _merge } from '../../dist/directives';
import type { TemplateAttrsExp, TemplateCallbackExp } from '../../dist/h';
import type { TemplateDirectiveExp } from '../../dist/helpers/create-directive';
import { html } from '../../dist/index';

export const Icon = (
  type: string,
  updateIcon: (() => string) | false,
  ...templateArgs: (
    | TemplateAttrsExp
    | TemplateDirectiveExp
    | TemplateCallbackExp
  )[]
) => {
  const tpl = html`<i
    class="bi bi-${type}"
    ${templateArgs}
    ${updateIcon
      ? () => {
          tpl.$node.setAttribute('class', `bi bi-${updateIcon()}`);
        }
      : ''}
  ></i>`;
  return _merge(tpl, { callbacks: true });
};
