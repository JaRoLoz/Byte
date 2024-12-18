import { ByteGameObject } from "../../shared/classes/byteObject";
import { Result } from "../../shared/classes/result";

export interface INetworkeable {
    toNet(): CNetEntity;
}

type Class = new (...args: any) => any;
type NetMethods<T extends Class> = {
    fromNet: (netId: number) => Result<InstanceType<T>>;
};

/**
 * This type represents a class that can be constructed from a network id.
 * For this to work the **class prototype** must have a static method called `fromNet` that receives a network id and returns an instance of the class.
 */
type NetworkeableClass<T extends Class> = Class & NetMethods<T>;

export class CNetEntity extends ByteGameObject {
    private networkId: number;

    constructor(networkId: number) {
        super();
        this.networkId = networkId;
    }

    public getNetId = (): number => this.networkId;

    public getOwner = (): number => NetworkGetEntityOwner(this.networkId);
    public getFirstOwner = (): number => NetworkGetNetworkIdFromEntity(this.networkId);

    public getAs = <T extends NetworkeableClass<T>>(transformer: T): Result<InstanceType<T>> => {
        return transformer.fromNet(this.networkId);
    };

    public equals(other: this): boolean {
        return this.networkId === other.getNetId();
    }

    public override asString(): string {
        return `CNetEntity { netId: ${this.getNetId()} }`;
    }
}
