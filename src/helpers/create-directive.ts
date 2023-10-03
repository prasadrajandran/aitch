import type { ParsedTemplate, TemplateExpIndex } from '../h';

/**
 * Return values of template directives.
 * @internal
 */
export type TemplateDirectiveResults<K = unknown, V = unknown> = Record<
  keyof K,
  V
>;

/**
 * An instance of a directive template expression.
 * @internal
 */
export interface DirectiveInstance<
  DIRECTIVE_ARGS extends unknown[] = unknown[],
  DIRECTIVE_NODE extends HTMLElement = HTMLElement
> {
  /**
   * Node that the directive is attached to.
   *
   * Note: If this is a "node" type directive, it will be attached to a
   * "template" element that serves as a placeholder.
   */
  node: DIRECTIVE_NODE;
  /**
   * Index position of the directive instance.
   */
  index: TemplateExpIndex;
  /**
   * Arguments provided to the directive.
   */
  args: DIRECTIVE_ARGS;
}

/**
 * Directive definition.
 * @internal
 */
export interface DirectiveDefinition<
  DIRECTIVE_ARGS extends unknown[],
  DIRECTIVE_NODE extends HTMLElement = HTMLElement
> {
  /**
   * Directive type:
   * "attr" - Directive must be attached to an element and it modifies the
   *          element it is attached to.
   * "node" - Directive produces a node or template.
   */
  type: 'attr' | 'node';
  /**
   * Directive's callback that processes the provided arguments.
   * @param template Template that the directive belongs to.
   * @param instances All instances of the same directive.
   */
  callback: (
    template: ParsedTemplate<unknown>,
    instances: DirectiveInstance<DIRECTIVE_ARGS, DIRECTIVE_NODE>[]
  ) => void;
}

/**
 * Property that identifies an object as an instance of a template directive
 * expression.
 * @internal
 */
export const directiveId = '__cI4Mp6yr0__';

/**
 * Create a template directive.
 * @internal
 * @param definition Template directive definition.
 */
export const createDirective = <
  DIRECTIVE_ARGS extends unknown[] = unknown[],
  DIRECTIVE_NODE extends HTMLElement = HTMLElement
>(
  def: DirectiveDefinition<DIRECTIVE_ARGS, DIRECTIVE_NODE>
) => {
  return (...args: DIRECTIVE_ARGS) => ({
    id: directiveId,
    def,
    args,
  });
};
