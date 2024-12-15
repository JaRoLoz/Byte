import { Err, Ok, Result } from "../../shared/classes";
import { IntRange } from "../../shared/types/generic";
import { CModel } from "./model";
import { CNetEntity, INetworkeable } from "./netEntity";

export enum CEntityType {
    Invalid = 0,
    Ped = 1,
    Vehicle = 2,
    Object = 3
}

/**
 * Base class for all entities in the framework.
 * Still wondering if this should be an abstract class.
 * May change in the future.
 */
export class CEntity extends CModel implements INetworkeable {
    protected entityId: number;

    constructor(entityId: number) {
        super(GetEntityModel(entityId));
        this.entityId = entityId;
    }

    public getEntity = (): number => this.entityId;
    protected setEntity = (entityId: number) => {
        this.entityId = entityId;
        const archetype = GetEntityArchetypeName(entityId);
        if (archetype !== "") this.setModel(archetype);
        else {
            const model = GetEntityModel(entityId);
            this.setModel(model);
        }
    };

    public override getHash = (): number => {
        this.modelHash = GetEntityModel(this.entityId);
        return this.modelHash;
    };

    public getPosition = (): Vector3 => GetEntityCoords(this.entityId, false);
    public setPosition = (position: Vector3) =>
        SetEntityCoords(this.entityId, position.x, position.y, position.z, false, false, false, false);

    public getHeading = (): IntRange<0, 361> => GetEntityHeading(this.entityId) as IntRange<0, 361>;
    public setHeading = (heading: IntRange<0, 361>) => SetEntityHeading(this.entityId, heading);

    public getRotation = (): Vector3 => GetEntityRotation(this.entityId, 2);
    public setRotation = (rotation: Vector3) =>
        SetEntityRotation(this.entityId, rotation.x, rotation.y, rotation.z, 2, false);

    public getVelocity = (): Vector3 => GetEntityVelocity(this.entityId);
    public setVelocity = (velocity: Vector3) => SetEntityVelocity(this.entityId, velocity.x, velocity.y, velocity.z);

    public getAlpha = (): IntRange<0, 256> => GetEntityAlpha(this.entityId) as IntRange<0, 256>;
    public setAlpha = (alpha: IntRange<0, 256>) => SetEntityAlpha(this.entityId, alpha, false);

    public getModel = (): CModel => new CModel(GetEntityModel(this.entityId));
    public getExists = (): boolean => DoesEntityExist(this.entityId) && true;
    public getEntityType = (): CEntityType => GetEntityType(this.entityId);

    public getIsMissionEntity = (): boolean => IsEntityAMissionEntity(this.entityId) && true;
    public setIsMissionEntity = (value: boolean) => SetEntityAsMissionEntity(this.entityId, value, true);

    public getVisible = (): boolean => IsEntityVisible(this.entityId) && true;
    public setVisible = (value: boolean) => SetEntityVisible(this.entityId, value, false);

    public freeze = (value: boolean) => FreezeEntityPosition(this.entityId, value && true);
    public isFrozen = (): boolean => IsEntityPositionFrozen(this.entityId);

    public getNetworkId = (): number => NetworkGetNetworkIdFromEntity(this.entityId);

    public delete = () => DeleteEntity(this.entityId);

    /**
     * Converts the entity to a network entity
     * @returns An instance to a CNetEntity
     */
    public toNet = (): CNetEntity => {
        const netId = this.getNetworkId();
        SetNetworkIdExistsOnAllMachines(netId, true);
        return new CNetEntity(netId);
    };

    public override equals(other: CEntity) {
        return this.entityId === other.getEntity();
    }

    public override asString(): string {
        return `CEntity { entityId: ${this.getEntity()} }`;
    }

    /** @noSelf **/
    public static fromNet = (netId: number): Result<CEntity> => {
        const id = NetworkGetEntityFromNetworkId(netId);
        if (id === 0) return Err();
        return Ok(new CEntity(id));
    };
}
