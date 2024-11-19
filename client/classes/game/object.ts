import { Result, Ok, Err } from "../../shared/classes";
import { CEntity } from "./entity";
import { CModel } from "./model";

export class CObject extends CEntity {
    constructor(objectId: number) {
        super(objectId);
    }

    public isADoor(): boolean {
        this.load();

        const coords = this.getPosition();
        const newEntity = CreateObject(this.modelHash, coords.x, coords.y, coords.z + 50, false, false, false);

        if (newEntity !== 0) DeleteObject(newEntity);

        this.unload();

        return newEntity === 0;
    }

    public override delete = () => DeleteObject(this.entityId);
    public override getNetworkId = () => ObjToNet(this.entityId);

    public override asString(): string {
        return `CObject { objectId: ${this.getEntity()} }`;
    }

    /** @noSelf **/
    public static create = (
        model: CModel,
        coords: Vector3,
        isNetwork: boolean,
        netMissionEntity: boolean,
        doorFlag: boolean
    ): Result<CObject> => {
        const { x, y, z } = coords;
        model.load();
        const object = CreateObject(model.getHash(), x, y, z, isNetwork, netMissionEntity, doorFlag);
        model.unload();
        if (object === 0) return Err();
        return Ok(new CObject(object));
    };

    /** @noSelf **/
    public static fromNet = (netId: number): Result<CObject> => {
        const id = NetToObj(netId);
        if (id === 0) return Err();
        return Ok(new CObject(id));
    };
}
