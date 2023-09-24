import type { ParsedTemplate, TemplateAttrsExp } from '../../dist/h';
import type { ElementRef } from '../../dist/helpers/create-ref';
import { html } from '../../dist/index';
import { _merge, _ref } from '../../dist/directives';
import { Icon } from './icon';

type Props = TemplateAttrsExp<{
  size?: 'sm' | 'lg';
  variant?:
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
  updateIcon?: () => string;
  child?: string | Node | ParsedTemplate;
}>;

export const Btn = ({
  size,
  variant,
  icon,
  ref,
  update,
  updateIcon,
  child = '',
  ...props
}: Props = {}) => {
  const btnSize = size ? `btn-${size}` : '';
  const btnClassType = `btn-outline-${variant || 'primary'}`;
  const iconElement = icon ? Icon(icon, updateIcon || false) : '';

  return _merge(
    html<HTMLButtonElement>/* html */ `
      <button
        type="button"
        class="btn ${btnClassType} ${btnSize}"
        ${props || ''}
        ${ref ? _ref(ref) : ''}
        ${update || ''}
      >
        ${iconElement} ${child}
      </button>
    `,
    { callbacks: true }
  );
};
