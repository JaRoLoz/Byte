type Null = null | undefined;
// type NotNull = number | string | boolean | symbol | object | Function | bigint;

/**
 * A result type that can be either an error or a value.
 * Tries to take the best of Go's and Rust's error handling.
 */
export type Result<T = Null, E = Null> =
    [error: true, value: E]
    | [error: false, value: T];

/**
 * Helper function to create an successful result
 * @param value The value to wrap
 * @returns A successful result
 */
export const Ok = <T, E>(value: T): Result<T, E> => [false, value];
/**
 * Helper function to create an empty successful result
 * @returns An empty successful result
 */
export const EmptyOk = <E>(): Result<Null, E> => [false, undefined];
/**
 * Helper function to create an error result
 * @param error The error to wrap
 * @returns An error result
 */
export const Err = <E>(error?: E): Result<never, E> => [true, error as E];