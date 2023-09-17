import type { ParsedTemplate, TemplateAttrsExp } from '../../dist/h';
import type { ElementRef } from '../../dist/helpers/create-ref';
import { html } from '../../dist/index';
import { _merge, _ref } from '../../dist/directives';
import { Icon } from './icon';

type Props = TemplateAttrsExp<{
  size?: 'sm' | 'lg';
  classType?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'info'
    | 'light'
    | 'dark';
  icon?: string;
  ref?: string;
  update?: (ref: ElementRef) => void;
  child?: string | Node | ParsedTemplate;
}>;

export const Btn = ({
  size,
  classType,
  icon,
  ref,
  update,
  child,
  ...props
}: Props = {}) => {
  const btnSize = size ? `btn-${size}` : '';
  const btnClassType = `btn-outline-${classType || 'primary'}`;
  return _merge(
    html<HTMLButtonElement>/* html */ `
      <button
        type="button"
        class="btn ${btnClassType} ${btnSize}"
        ${props || ''}
        ${ref ? _ref(ref) : ''}
        ${update || ''}
      >
        ${icon ? Icon(icon) : ''} ${child || ''}
      </button>
    `,
    { update: true }
  );
};