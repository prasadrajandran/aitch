import type { TemplateArgIndex } from '../h';

export type DirectiveIdentifier = symbol;

export type DirectiveCallbackResultKey = string;

export type TemplateDirective = ReturnType<typeof createDirective>;

export const directiveId = '9554857d-de86-490c-b840-97c0b09ec272';

const reservedKeys = new Set(['fragment']);

const registeredDirectiveKeys = new Set<DirectiveCallbackResultKey>();

export interface DirectiveInstance<
  DIRECTIVE_ARGS extends unknown[] = unknown[],
  DIRECTIVE_NODE extends Node = Element
> {
  node: DIRECTIVE_NODE;
  pos: TemplateArgIndex;
  args: DIRECTIVE_ARGS;
}

export interface DirectiveDefinition<
  DIRECTIVE_KEY extends DirectiveCallbackResultKey,
  DIRECTIVE_ARGS extends unknown[],
  DIRECTIVE_RESULT,
  DIRECTIVE_NODE extends Node
> {
  type: 'attr' | 'node';
  key?: DIRECTIVE_KEY;
  callback: (
    instances: DirectiveInstance<DIRECTIVE_ARGS, DIRECTIVE_NODE>[]
  ) => DIRECTIVE_RESULT;
}

/**
 * Create a template directive.
 * @internal
 * @param definition Directive definition.
 */
export const createDirective = <
  DIRECTIVE_KEY extends DirectiveCallbackResultKey = '',
  DIRECTIVE_ARGS extends unknown[] = unknown[],
  DIRECTIVE_RESULT = void,
  DIRECTIVE_NODE extends Node = Element
>(
  definition: DirectiveDefinition<
    DIRECTIVE_KEY,
    DIRECTIVE_ARGS,
    DIRECTIVE_RESULT,
    DIRECTIVE_NODE
  >
) => {
  const { key } = definition;
  if (key) {
    if (reservedKeys.has(key)) {
      throw new Error(
        `This key is reserved and cannot be used in a directive: "${key}"`
      );
    }
    if (registeredDirectiveKeys.has(key)) {
      throw new Error(`Directive key already in use: "${key}"`);
    }
    registeredDirectiveKeys.add(key);
  }

  const identifier = Symbol(definition.key || 'directive-definition');

  return (...args: DIRECTIVE_ARGS) => ({
    directive: directiveId,
    identifier,
    definition: {
      ...definition,
      key: definition.key || '',
    },
    args,
  });
};
