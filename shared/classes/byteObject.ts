/**
 * A class that represents a byte object.
 * Tries to replicate the behavior of Java's `Object` base class.
 */
export abstract class ByteGameObject {
    constructor() {}
    
    /**
     * Clones the object.
    */
    public clone(): this {
        return this;
    }
    /**
     * Checks if the object is equal to another object.
     * @param other The object to compare to.
     * @returns `true` if the objects are equal, `false` otherwise.
     */
    public equals(other: this): boolean {
        return false;
    }
    /**
     * @returns A hash code for the object instance.
    */
    public hash(): number {
        return -1;
    }
    /**
     * @returns `-1` if `this` is less than `other`, `0` if they are equal, `1` if `this` is greater than `other`.
     */
    public compare(other: this): -1 | 0 | 1 {
        return 0;
    }
    /**
     * @returns A string representation of the object.
     */
    public asString(): string {
        return `ByteObject {}`;
    }
    /**
     * @returns A JSON string representation of the object.
    */
    public asJSON(): string {
        return '{}';
    }
}