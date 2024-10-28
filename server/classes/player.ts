import { DBPlayerInfo } from "../controllers/playerController";
import type { PlayerData, PlayerGang, PlayerJob } from "../shared/types/player";
import type { IObjectifiable } from "../shared/interfaces/IObjectifiable";
import { Logger } from "../utils/logger";
import { Inventory } from "./inventory";
import { getEventNames } from "../shared/classes/eventNameController";
import { User } from "./user";
import { PlayerInventory } from "./playerInventory";

const logger = new Logger("Player");
const eventNames = getEventNames();

export class Player extends User implements IObjectifiable<DBPlayerInfo> {
    private uuid: string;
    private data: PlayerData;
    private position: Vector3;
    private job: PlayerJob;
    private gang: PlayerGang;
    private inventory: PlayerInventory;

    constructor(
        src: number,
        uuid: string,
        playerData: PlayerData,
        inventory: PlayerInventory,
        position: Vector3,
        job: PlayerJob,
        gang: PlayerGang
    ) {
        super(src);
        this.uuid = uuid;
        this.data = playerData;
        this.inventory = inventory;
        this.position = position;
        this.job = job;
        this.gang = gang;
    }

    public getUuid = () => this.uuid;
    public getData = () => this.data;
    public getInventory = () => this.inventory;
    public getPosition = () => this.position;
    public getJob = () => this.job;
    public getGang = () => this.gang;

    public setData = (data: PlayerData) => {
        this.data = data;
        this.emitChange("data");
    };

    public setPosition = (position: Vector3) => {
        this.position = position;
        this.emitChange("position");
    };

    public setJob = (job: PlayerJob) => {
        this.job = job;
        this.emitChange("job");
    };

    public setGang = (gang: PlayerGang) => {
        this.gang = gang;
        this.emitChange("gang");
    };

    private emitChange = (key: string) => {
        TriggerClientEvent(eventNames.get("Client.Player.SetPlayerField"), this.getSrc(), key, this[key as keyof this]);
    };

    public updatePosition = () => {
        const position = GetEntityCoords(GetPlayerPed(this.getSrc()), true);
        this.position = position;
    };

    public save = () => {
        // this.updatePosition();
        const data = this.toObject();

        MySQL.prepare.await(
            `
            INSERT INTO players
            (uuid, data, job, gang, position, inventory)
            VALUES
            (?, ?, ?, ?, ?, ?)

            ON DUPLICATE KEY UPDATE

            data = VALUES(data),
            job = VALUES(job),
            gang = VALUES(gang),
            position = VALUES(position),
            inventory = VALUES(inventory)
        `,
            [
                data.uuid,
                json.encode(data.data),
                json.encode(data.job),
                json.encode(data.gang),
                json.encode(data.position),
                json.encode(data.inventory)
            ]
        );
        logger.debug(`Player ${this.uuid} saved to database.`);
    };

    public toObject = () => ({
        uuid: this.uuid,
        data: this.data,
        job: this.job,
        gang: this.gang,
        position: this.position,
        inventory: this.inventory.toObject()
    });
}
