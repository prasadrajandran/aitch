import { type ParsedTemplate } from '../h';
/**
 * Is `arg` a parsed template?
 * @internal
 * @param arg Argument to check.
 */
export declare const isParsedTemplate: (arg: unknown) => arg is ParsedTemplate;
