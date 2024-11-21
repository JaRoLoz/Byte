import { DBPlayerInfo } from "../controllers/playerController";
import type { PlayerData, PlayerGang, PlayerJob } from "../shared/types/player";
import type { IObjectifiable } from "../shared/interfaces/IObjectifiable";
import { Logger } from "../utils/logger";
import { getEventNames } from "../shared/classes/eventNameController";
import { User } from "./user";
import { PlayerInventory } from "./playerInventory";
import { Err, Ok, Result } from "../shared/classes";
import { DB } from "./db/db";

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

    /**
     * Emits a change to the client in order to update their local player's data.
     * @param key The key of the Player property that was changed.
     */
    private emitChange = (key: string) => {
        TriggerClientEvent(eventNames.get("Client.Player.SetPlayerField"), this.getSrc(), key, this[key as keyof this]);
    };

    /**
     * Updates the player's position to the current position of their ped.
     */
    public updatePosition = () => {
        const position = GetEntityCoords(GetPlayerPed(this.getSrc()), true);
        this.position = position;
    };

    public save = (): Result<null, string> => {
        // TODO
        // this.updatePosition();
        const data = this.toObject();
        const [dbErr, dbResult] = DB.querySync("select count(*) as count from player where uuid = $1", [this.uuid]);

        if (dbErr) return Err(dbResult);

        if (dbResult.rows[0].count === 1) {
            const queries = [["update  players", []]];
        }

        logger.debug(`Player ${this.uuid} saved to database.`);
        return Ok(null);
    };

    public toObject = (): DBPlayerInfo => ({
        uuid: this.uuid,
        data: this.data,
        job: this.job,
        gang: this.gang,
        position: this.position,
        inventory: this.inventory.toObject()
    });
}
