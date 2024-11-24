import type { PlayerData, PlayerGang, PlayerJob } from "../shared/types/player";
import type { IObjectifiable } from "../shared/interfaces/IObjectifiable";
import { Logger } from "../utils/logger";
import { getEventNames } from "../shared/classes/eventNameController";
import { User } from "./user";
import { PlayerInventory } from "./playerInventory";
import { EmptyOk, Err, Ok, Result } from "../shared/classes";
import { DBPlayerInfo } from "../shared/types";
import { savePlayerToDB } from "../database/player";
import { TransactionResult } from "../database/db";
import { UUID } from "../shared/utils";

const logger = new Logger("Player");
const eventNames = getEventNames();

export class Player extends User implements IObjectifiable<DBPlayerInfo> {
    private uuid: UUID;
    private data: PlayerData;
    private position: Vector4;
    private jobs: Array<PlayerJob>;
    private gangs: Array<PlayerGang>;
    private inventory: PlayerInventory;

    constructor(
        src: number,
        uuid: UUID,
        playerData: PlayerData,
        inventory: PlayerInventory,
        position: Vector4,
        jobs: Array<PlayerJob>,
        gangs: Array<PlayerGang>
    ) {
        super(src);
        this.uuid = uuid;
        this.data = playerData;
        this.inventory = inventory;
        this.position = position;
        this.jobs = jobs;
        this.gangs = gangs;
    }

    public getUuid = () => this.uuid;
    public getData = () => this.data;
    public getInventory = () => this.inventory;
    public getPosition = () => this.position;
    public getJobs = () => this.jobs;
    public getGangs = () => this.gangs;
    public hasJob = (job: PlayerJob) => this.jobs.find(j => j.name === job.name) !== undefined;
    public hasGang = (gang: PlayerGang) => this.gangs.find(g => g.name === gang.name) !== undefined;
    public getJob = (job: PlayerJob) => this.jobs.find(j => j.name === job.name);
    public getGang = (gang: PlayerGang) => this.gangs.find(g => g.name === gang.name);
    public getJobIndex = (job: PlayerJob) => this.jobs.findIndex(j => j.name === job.name);
    public getGangIndex = (gang: PlayerGang) => this.gangs.findIndex(g => g.name === gang.name);

    public setData = (data: PlayerData) => {
        this.data = data;
        this.emitChange("data");
    };

    public setDataKey = <K extends keyof PlayerData>(key: K, value: PlayerData[K]) => {
        this.data[key] = value;
        this.emitChange("data");
    };

    public setPosition = (position: Vector4) => {
        this.position = position;
        this.emitChange("position");
    };

    public setJobs = (jobs: Array<PlayerJob>) => {
        this.jobs = jobs;
        this.emitChange("jobs");
    };

    public addJob = (job: PlayerJob) => {
        const jobIndex = this.getJobIndex(job);
        if (jobIndex === -1) this.jobs.push(job);
        else this.jobs[jobIndex] = job;
        this.emitChange("jobs");
    };

    public removeJob = (job: PlayerJob): Result => {
        const jobIndex = this.getJobIndex(job);
        if (jobIndex === -1) return Err();
        this.jobs.splice(jobIndex, 1);
        this.emitChange("jobs");
        return EmptyOk();
    };

    public setJob = (job: PlayerJob): Result => {
        const jobIndex = this.getJobIndex(job);
        if (jobIndex === -1) return Err();
        this.jobs[jobIndex] = job;
        this.emitChange("jobs");
        return EmptyOk();
    };

    public setGangs = (gangs: Array<PlayerGang>) => {
        this.gangs = gangs;
        this.emitChange("gangs");
    };

    public addGang = (gang: PlayerGang) => {
        const gangIndex = this.getGangIndex(gang);
        if (gangIndex === -1) this.gangs.push(gang);
        else this.gangs[gangIndex] = gang;
        this.emitChange("gangs");
    };

    public removeGang = (gang: PlayerGang): Result => {
        const gangIndex = this.getGangIndex(gang);
        if (gangIndex === -1) return Err();
        this.gangs.splice(gangIndex, 1);
        this.emitChange("gangs");
        return EmptyOk();
    };

    public setGang = (gang: PlayerGang): Result => {
        const gangIndex = this.getGangIndex(gang);
        if (gangIndex === -1) return Err();
        this.gangs[gangIndex] = gang;
        this.emitChange("gangs");
        return EmptyOk();
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
        const ped = GetPlayerPed(this.getSrc());
        const position = GetEntityCoords(ped, true);
        const heading = GetEntityHeading(ped);
        this.position = vector4(position.x, position.y, position.z, heading);
    };

    public save = (): TransactionResult<null> => {
        this.updatePosition();
        const data = this.toObject();

        const [err, errors] = savePlayerToDB(data);

        if (err) {
            logger.error(`Failed to save player ${this.uuid} to database.`);
            return Err(errors);
        }

        logger.debug(`Player ${this.uuid} saved to database.`);
        return Ok(null) as TransactionResult<null>;
    };

    public toObject = (): DBPlayerInfo => ({
        uuid: this.uuid,
        data: {
            firstname: this.data.firstname,
            lastname: this.data.lastname,
            birthdate: this.data.birthdate.getTimestamp(),
            gender: this.data.gender,
            nationality: this.data.nationality
        },
        jobs: this.jobs,
        gangs: this.gangs,
        position: this.position,
        inventory: this.inventory.toObject()
    });
}
