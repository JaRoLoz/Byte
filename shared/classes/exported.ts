export class ExportedClass<T extends new (...args: any) => any> {
    private prototype: T;

    constructor(prototype: T) {
        this.prototype = prototype;
    }

    public construct = (...args: ConstructorParameters<T>): InstanceType<T> => new this.prototype(...args);
    public getClass = () => this.prototype;
}
