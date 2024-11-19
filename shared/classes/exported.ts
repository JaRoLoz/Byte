type Class = new (...args: any) => any;

/**
 * Wrapper class to export a class safely across resources.
 * If a class is exported without this wrapper, it won't be able to be constructed in other resources.
 */
export class ExportedClass<T extends Class> {
    private prototype: T;

    /**
     * @param prototype The **class prototype** to wrap 
     */
    constructor(prototype: T) {
        this.prototype = prototype;
    }

    /**
     * Returns a new instance of the wrapped class
     */
    public construct = (...args: ConstructorParameters<T>): InstanceType<T> => new this.prototype(...args);
    /**
     * Used for accessing static methods of the wrapped class
     * @returns The object prototype of the wrapped class
     */
    public getClass = () => this.prototype;
}
