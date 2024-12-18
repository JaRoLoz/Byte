import type { PlayerData, PlayerGang, PlayerJob } from "../shared/types/player";
import { PlayerInventory } from "./playerInventory";
import { getEventNames } from "../shared/classes/eventNameController";
import { UUID } from "../shared/utils/uuid";
import { Optional } from "../shared/classes/optional";
import { PlayerPed } from "./playerPed/ped";
import { PedData } from "../shared/types/ped";
import { IntRange } from "../shared/types/generic";

const eventNames = getEventNames();

export class Player extends PlayerPed {
    /** @noSelf **/
    private static instance: Player | undefined = undefined;

    private uuid: UUID;
    private data: PlayerData;
    private jobs: Array<PlayerJob>;
    private gangs: Array<PlayerGang>;
    private inventory: PlayerInventory;
    private ped: PlayerPed;

    constructor(
        uuid: UUID,
        playerData: PlayerData,
        inventory: PlayerInventory,
        jobs: Array<PlayerJob>,
        gangs: Array<PlayerGang>,
        pedData: PedData,
        position: Vector4
    ) {
        super();
        this.uuid = uuid;
        this.data = playerData;
        this.inventory = inventory;
        this.jobs = jobs;
        this.gangs = gangs;
        this.ped = new PlayerPed();

        this.ped.setPosition(position);
        this.ped.setHeading(position.w as IntRange<0, 361>);
        this.ped.setPedData(pedData);

        RegisterNetEvent(eventNames.get("Client.Player.SetPlayerField"), (key: keyof typeof this, value: any) => {
            this[key] = value;
        });

        RegisterNetEvent(eventNames.get("Client.Player.SetPlayerPedData"), (data: PedData) =>
            this.ped.setPedData(data)
        );
    }

    public getUuid = () => this.uuid;
    public getData = () => this.data;
    public getInventory = () => this.inventory;
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

    /**
     * Static method called by the server to set the instance of the player with the initial player data
     * **Never call this function manually**
     * @param instance Instance of the player
     * @noSelf
     */
    public static setInstance = (instance: Player) => {
        Player.instance = instance;
        TriggerEvent(eventNames.get("Client.Player.OnPlayerReady"), instance);
    };

    /** @noSelf **/
    public static onPlayerReady = (cb: (player: Player) => void) => {
        if (Player.instance) cb(Player.instance);
        else AddEventHandler(eventNames.get("Client.Player.OnPlayerReady"), cb);
    };

    /** @noSelf **/
    public static onPlayerReadySync = (): Player => {
        const p = promise.new();
        Player.onPlayerReady(() => p.resolve(p));
        Citizen.Await(p);
        return Player.instance!;
    };
}
