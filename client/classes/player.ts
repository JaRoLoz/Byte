import type { PlayerData, PlayerGang, PlayerJob } from "../shared/types/player";
import { PlayerInventory } from "./playerInventory";
import { getEventNames } from "../shared/classes/eventNameController";
import { UUID } from "../shared/utils";

const eventNames = getEventNames();

export class Player {
    /** @noSelf **/
    private static instance: Player;

    private uuid: UUID;
    private data: PlayerData;
    // private position: Vector3;
    private job: PlayerJob;
    private gang: PlayerGang;
    private inventory: PlayerInventory;

    constructor(uuid: UUID, playerData: PlayerData, inventory: PlayerInventory, job: PlayerJob, gang: PlayerGang) {
        this.uuid = uuid;
        this.data = playerData;
        this.inventory = inventory;
        this.job = job;
        this.gang = gang;

        RegisterNetEvent(eventNames.get("Client.Player.SetPlayerField"), (key: keyof typeof this, value: any) => {
            this[key] = value;
        });
    }

    public getUuid = () => this.uuid;
    public getData = () => this.data;
    public getInventory = () => this.inventory;
    public getJob = () => this.job;
    public getGang = () => this.gang;

    /** @noSelf **/
    public static getInstance = () => Player.instance;
    /** @noSelf **/
    public static setInstance = (instance: Player) => {
        Player.instance = instance;
        TriggerEvent(eventNames.get("Client.Player.OnPlayerReady"));
    };

    /** @noSelf **/
    public static onPlayerReady = (cb: () => void) =>
        RegisterNetEvent(eventNames.get("Client.Player.OnPlayerReady"), cb);

    /** @noSelf **/
    public static onPlayerReadySync = () => {
        const p = promise.new();
        Player.onPlayerReady(() => p.resolve(p));
        return Citizen.Await(p);
    };
}
