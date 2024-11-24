import type { PlayerData, PlayerGang, PlayerJob } from "../shared/types/player";
import { PlayerInventory } from "./playerInventory";
import { getEventNames } from "../shared/classes/eventNameController";
import { UUID } from "../shared/utils";
import { Optional } from "../shared/classes";
import { Ped } from "./playerPed";

const eventNames = getEventNames();

export class Player {
    /** @noSelf **/
    private static instance: Player | undefined = undefined;

    private uuid: UUID;
    private data: PlayerData;
    private jobs: Array<PlayerJob>;
    private gangs: Array<PlayerGang>;
    private inventory: PlayerInventory;
    private ped: Ped;

    constructor(
        uuid: UUID,
        playerData: PlayerData,
        inventory: PlayerInventory,
        jobs: Array<PlayerJob>,
        gangs: Array<PlayerGang>
    ) {
        this.uuid = uuid;
        this.data = playerData;
        this.inventory = inventory;
        this.jobs = jobs;
        this.gangs = gangs;
        this.ped = new Ped(PlayerPedId());

        RegisterNetEvent(eventNames.get("Client.Player.SetPlayerField"), (key: keyof typeof this, value: any) => {
            this[key] = value;
        });
    }

    public getUuid = () => this.uuid;
    public getData = () => this.data;
    public getInventory = () => this.inventory;
    public getPed = () => this.ped;
    public getJobs = () => this.jobs;
    public getGangs = () => this.gangs;
    public hasJob = (job: PlayerJob) => this.jobs.find(j => j.name === job.name) !== undefined;
    public hasGang = (gang: PlayerGang) => this.gangs.find(g => g.name === gang.name) !== undefined;
    public getJob = (job: PlayerJob) => this.jobs.find(j => j.name === job.name);
    public getGang = (gang: PlayerGang) => this.gangs.find(g => g.name === gang.name);
    public getJobIndex = (job: PlayerJob) => this.jobs.findIndex(j => j.name === job.name);
    public getGangIndex = (gang: PlayerGang) => this.gangs.findIndex(g => g.name === gang.name);

    /** @noSelf **/
    public static getInstance = (): Optional<Player> =>
        Player.instance ? Optional.Some(Player.instance) : Optional.None();

    /** @noSelf **/
    public static setInstance = (instance: Player) => {
        Player.instance = instance;
        TriggerEvent(eventNames.get("Client.Player.OnPlayerReady"), instance);
    };

    /** @noSelf **/
    public static onPlayerReady = (cb: (player: Player) => void) => {
        if (Player.instance) cb(Player.instance);
        else RegisterNetEvent(eventNames.get("Client.Player.OnPlayerReady"), cb);
    };

    /** @noSelf **/
    public static onPlayerReadySync = (): Player => {
        const p = promise.new();
        Player.onPlayerReady(() => p.resolve(p));
        Citizen.Await(p);
        return Player.instance!;
    };
}
