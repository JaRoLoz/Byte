import { Result, Ok, Err } from "../../shared/classes";
import { CEntity } from "./entity";
import { CModel } from "./model";

export class CPed extends CEntity {
    constructor(pedId: number) {
        super(pedId);
    }

    public override delete = () => DeletePed(this.entityId);
    public override getNetworkId = () => PedToNet(this.entityId);

    public override asString(): string {
        return `CPed { pedId: ${this.getEntity()} }`;
    }

    /** @noSelf **/
    public static create = (
        model: CModel,
        coords: Vector3,
        isNetwork: boolean,
        netMissionEntity: boolean
    ): Result<CPed> => {
        const { x, y, z } = coords;
        model.load();
        const ped = CreatePed(4, model.getHash(), x, y, z, 0, isNetwork, netMissionEntity);
        model.unload();
        if (ped === 0) return Err();
        return Ok(new CPed(ped));
    };

    /** @noSelf **/
    public static playerPed = (): CPed => new CPed(PlayerPedId());

    /** @noSelf **/
    public static fromNet = (netId: number): Result<CPed> => {
        const id = NetToPed(netId);
        if (id === 0) return Err();
        return Ok(new CPed(id));
    };
}
