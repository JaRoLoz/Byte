import { ByteGameObject } from "../../shared/classes";
import { Pixel, RGBA, Base64Image, ImageFilePath } from "../../shared/types";
import { TextureDictionary } from "./textureDictionary";

export class Texture extends ByteGameObject {
    handle: number;
    name: string;
    dictionary: TextureDictionary;

    constructor(handle: number, name: string, dict: TextureDictionary) {
        super();
        this.handle = handle;
        this.name = name;
        this.dictionary = dict;
    }

    public getHandle = () => this.handle;
    public getName = () => this.name;
    public getDictionary = () => this.dictionary;
    public getHeight = () => GetRuntimeTextureHeight(this.handle);
    public getWidth = () => GetRuntimeTextureWidth(this.handle);
    public commit = () => CommitRuntimeTexture(this.handle);
    /**
        Sets the color of a pixel on the texture.
        `Texture.commit()` must be called after this to apply the changes.
        @see https://docs.fivem.net/natives/?_0xAB65ACEE
    */
    public setPixel = (pixel: Pixel, color: RGBA) =>
        SetRuntimeTexturePixel(this.handle, pixel[0], pixel[1], color[0], color[1], color[2], color[3]);
    public setFromImage = (image: ImageFilePath | Base64Image) => SetRuntimeTextureImage(this.handle, image);

    public override hash() {
        return GetHashKey(`tex:${this.handle}+${this.name}`);
    }

    public override asString(): string {
        return `Texture { handle: ${this.getHandle()}, txn: ${this.getName()}, txd: ${this.getDictionary().getName()} }`;
    }
}
