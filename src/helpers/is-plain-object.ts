/**
 * Is `arg` a plain object?
 *
 * This check is meant to guard against honest mistakes not scenarios where the
 * user is deliberately trying pass a value off as a plain object.
 * @internal
 * @param arg Argument to check.
 */
export const isPlainObject = (arg: unknown): arg is object =>
  Boolean(
    arg && (arg.constructor === Object || Object.getPrototypeOf(arg) === null)
  );
