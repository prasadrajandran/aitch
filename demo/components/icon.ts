import type {
  TemplateAttrsExp,
  TemplateCallbackExp,
  TemplateDirectiveExp,
} from '../../dist/h';
import { _mergeAll } from '../../dist/directives';
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
  return _mergeAll(
    html`<i
      class="bi bi-${type}"
      ${templateArgs}
      ${updateIcon
        ? ({ attrMap }) => attrMap({ class: `bi bi-${updateIcon()}` })
        : ''}
    ></i>`
  );
};
