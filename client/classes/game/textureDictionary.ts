import { Texture } from "./texture";
import { TextureIndex, DuiHandle } from "../../shared/types";
import { ByteGameObject } from "../../shared/classes";

export type TextureDictionaryTuple = [TextureIndex, Texture];

export class TextureDictionary extends ByteGameObject {
    private name: string;
    private handle: number;
    private textures: Texture[];

    constructor(name: string) {
        super();
        this.name = name;
        this.handle = CreateRuntimeTxd(name);
        this.textures = [];
    }

    public getHandle = () => this.handle;
    public getName = () => this.name;

    public addRuntimeTexture = (txn: string, width: number, height: number): TextureDictionaryTuple => {
        const texHandle = CreateRuntimeTexture(this.handle, txn, width, height);
        const tex = new Texture(texHandle, txn, this);
        return [this.textures.push(tex) - 1, tex];
    };

    public addRuntimeTextureFromDui = (txn: string, dui: DuiHandle): TextureDictionaryTuple => {
        const texHandle = CreateRuntimeTextureFromDuiHandle(this.handle, txn, dui);
        const tex = new Texture(texHandle, txn, this);
        return [this.textures.push(tex) - 1, tex];
    };

    public override hash() {
        return GetHashKey(`txd:${this.handle}+${this.name}`);
    }

    public override asString(): string {
        return `TextureDictionary { handle: ${this.getHandle()}, txd: ${this.getName()} }`;
    }
}
