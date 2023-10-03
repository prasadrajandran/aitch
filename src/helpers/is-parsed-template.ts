import { type ParsedTemplate, parsedTemplateId } from '../h';
import { isPlainObject } from './is-plain-object';

/**
 * Is `arg` a parsed template?
 * @internal
 * @param arg Argument to check.
 */
export const isParsedTemplate = (arg: unknown): arg is ParsedTemplate => {
  return isPlainObject(arg) && '$id' in arg && arg['$id'] === parsedTemplateId;
};
