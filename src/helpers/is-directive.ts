import { isPlainObject } from './is-plain-object';
import { directiveId, createDirective } from './create-directive';

/**
 * Determines if the supplied `arg` is a valid TemplateDirective value.
 * @internal
 * @param arg Arg to check.
 */
export const isDirective = (
  arg: unknown
): arg is ReturnType<ReturnType<typeof createDirective>> => {
  return (
    isPlainObject(arg) && 'directive' in arg && arg['directive'] === directiveId
  );
};
