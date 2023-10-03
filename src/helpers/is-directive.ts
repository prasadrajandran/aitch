import type { TemplateDirectiveExp } from '../h';
import { isPlainObject } from './is-plain-object';
import { directiveId } from './create-directive';

/**
 * Is `exp` a template directive?
 * @internal
 * @param exp Expression to check.
 */
export const isDirective = (exp: unknown): exp is TemplateDirectiveExp => {
  return isPlainObject(exp) && 'id' in exp && exp['id'] === directiveId;
};
