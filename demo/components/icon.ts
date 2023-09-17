import type { TemplateAttrsExp, TemplateCallbackExp } from '../../dist/h';
import type { TemplateDirectiveExp } from '../../dist/helpers/create-directive';
import { html } from '../../dist/index';

export const Icon = (
  type: string,
  ...templateArgs: (
    | TemplateAttrsExp
    | TemplateDirectiveExp
    | TemplateCallbackExp
  )[]
) => {
  return html`<i class="bi bi-${type}" ${templateArgs}></i>`;
};
