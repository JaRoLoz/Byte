import { ByteGameObject, Optional, Result, Err, EmptyOk } from "../../shared/classes";

export class CModel extends ByteGameObject {
    protected modelHash: number;
    protected modelName: Optional<string>;

    /**
     * Model class to handle basic model operations. If the model name is provided, the hash will be calculated.
     * If the hash is provided, the name will be nil.
     * Always prefer using the model name as it leads to less errors.
     * @param init The model name or hash
     */
    constructor(init: number | string) {
        super();
        if (typeof init === "number") {
            this.modelHash = init;
            this.modelName = Optional.None();
        } else {
            this.modelName = Optional.Some(init);
            this.modelHash = GetHashKey(init);
        }
    }

    protected setModel = (model: number | string) => {
        if (typeof model === "number") {
            this.modelHash = model;
            this.modelName = Optional.None();
        } else {
            this.modelName = Optional.Some(model);
            this.modelHash = GetHashKey(model);
        }
    };

    /**
     * Loads the model into the game
     * @param wait Time to wait for the model to load
     */
    public load = (wait: number = 0): Result => {
        if (!this.getIsInCdImage()) return Err();
        const hash = this.getHash();
        RequestModel(hash);
        while (!HasModelLoaded(hash)) Wait(wait);
        return EmptyOk();
    };

    /**
     * Unloads the model from the game
     */
    public unload = () => SetModelAsNoLongerNeeded(this.getHash());

    /**
     * Getter for the model hash
     * @returns The model hash
     */
    public getHash = (): number => this.modelHash;

    /**
     * Getter for the model name
     * @returns The model name (can be nil as the model name can't be retrieved from the hash)
     */
    public getName = (): Optional<string> => this.modelName;

    /**
     * Gets the dimensions of the model
     * @returns The minimum and maximum dimensions of the model
     * @see https://docs.fivem.net/natives/?_0x03E8D3D5F549087A
     */
    public getDimensions = (): [min: Vector3, max: Vector3] => {
        const [_min, max] = GetModelDimensions(this.getHash());
        const min = _min as any as Vector3;
        return [min, max];
    };

    /**
     * Gets the size of the model
     * @returns A vector3 representing the size of the model in the x, y, and z dimensions
     */
    public getSize = () => {
        const [min, max] = this.getDimensions();
        return vector3(max.x - min.x, max.y - min.y, max.z - min.z);
    };

    /**
     * @returns Whether the model is loaded
     */
    public getIsLoaded = (): boolean => HasModelLoaded(this.getHash());

    /**
     * @returns Whether the model is valid
     */
    public getIsValid = (): boolean => IsModelValid(this.getHash());

    /**
     * @returns Whether the model is in the game's CD image
     */
    public getIsInCdImage = (): boolean => IsModelInCdimage(this.getHash());

    public hash = () => this.modelHash;

    public override equals(other: CModel) {
        return this.modelHash === other.modelHash;
    }

    public asString(): string {
        return `CModel { hash: ${this.getHash()}, name: ${this.getName().isSome() ? this.getName().unwrap : "nil"} }`;
    }
}
