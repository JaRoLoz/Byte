import { Result, Ok, Err } from "../../shared/classes/result";
import { RGB } from "../../shared/types/texture";
import { IntRange } from "../../shared/types/generic";
import { CEntity } from "./entity";
import { CModel } from "./model";

export class CVehicle extends CEntity {
    constructor(vehicleId: number) {
        super(vehicleId);
    }

    public override delete = () => DeleteVehicle(this.entityId);
    public override getNetworkId = () => VehToNet(this.entityId);

    public override asString(): string {
        return `CVehicle { vehicleId: ${this.getEntity()} }`;
    }

    public setPrimaryColor = (color: RGB) => SetVehicleCustomPrimaryColour(this.entityId, color[0], color[1], color[2]);

    /** @noSelf **/
    public static create = (
        model: CModel,
        coords: Vector3,
        heading: IntRange<0, 361>,
        isNetwork: boolean,
        netMissionEntity: boolean
    ): Result<CVehicle> => {
        const { x, y, z } = coords;
        model.load();
        const vehicle = CreateVehicle(model.getHash(), x, y, z, heading, isNetwork, netMissionEntity);
        model.unload();
        if (vehicle === 0) return Err();
        return Ok(new CVehicle(vehicle));
    };

    /** @noSelf **/
    public static fromNet = (netId: number): Result<CVehicle> => {
        const id = NetToVeh(netId);
        if (id === 0) return Err();
        return Ok(new CVehicle(id));
    };
}
