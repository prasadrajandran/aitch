import type { TemplateDirectiveExp } from '../../dist/helpers/create-directive';
import type { TemplateAttrsExp, TemplateCallbackExp } from '../../dist/h';
import { _merge } from '../../dist/directives';
import { html } from '../../dist/index';

export const Icon = (
  type: string,
  updateIcon?: (() => string) | false,
  ...templateArgs: (
    | TemplateAttrsExp
    | TemplateDirectiveExp
    | TemplateCallbackExp
  )[]
) => {
  return _merge(
    html`<i
      class="bi bi-${type}"
      ${templateArgs}
      ${updateIcon
        ? ({ attrMap }) => attrMap({ class: `bi bi-${updateIcon()}` })
        : ''}
    ></i>`,
    { callbacks: true }
  );
};
