/**
 * Optional class to handle nullable values.
 * Tries to mimic Java's `Optional` class.
 * Doesn't really add much value, but it's a nice reminder for the developper to always check for null values.
 */
export class Optional<T = any | undefined> {
    private value: T;
    private _isSome: boolean;

    private constructor(value: T, isSome: boolean) {
        this.value = value;
        this._isSome = isSome;
    }

    /**
     * Returns the value as the not nullable type.
     * @returns The original value
     */
    public unwrap = (): T => this.value as T;
    /**
     * @returns Where the wrapped value is null
     */
    public isSome = (): boolean => this._isSome;

    /** @noSelf **/
    public static Some = <T>(value: T): Optional<T> => new Optional<T>(value, true);
    /** @noSelf **/
    public static None = <T>(): Optional<T> => new Optional<T>(undefined as T, false);
}

