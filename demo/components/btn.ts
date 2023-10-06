import type {
  ParsedTemplate,
  ElementRef,
  TemplateAttrsExp,
} from '../../dist/h';
import { html } from '../../dist/index';
import { _mergeAll, _ref } from '../../dist/directives';
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
  child?: string | Node | ParsedTemplate | string[];
  update?: (ref: ElementRef) => void;
  updateIcon?: () => string;
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

  return _mergeAll(html<HTMLButtonElement>/* html */ `
    <button
      type="button"
      class="btn ${btnClassType} ${btnSize}"
      ${props || ''}
      ${ref ? _ref(ref) : ''}
      ${update || ''}
    >
      ${iconElement} ${child}
    </button>
  `);
};
