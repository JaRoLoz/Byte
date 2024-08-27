import { Logger } from "../utils/logger";
import { Player } from "../classes/player";
import { Inventory } from "../classes/inventory";
import type { InventoryData, SlotData } from "../shared/types/inventory";
import { PlayerData, PlayerGang, PlayerJob } from "../shared/types/player";
import { ConfigController } from "../shared/classes";
import { PlayerInventory } from "../classes/playerInventory";

export type DBPlayerInfo = {
    uuid: string;
    data: PlayerData;
    job: PlayerJob;
    gang: PlayerGang;
    position: Vector3;
    inventory: InventoryData;
};

const logger = Logger.construct("PlayerController");

export class PlayerController {
    /** @noSelf **/
    private static instance: PlayerController;
    private players: Record<number, Player> = {};

    private constructor() {}

    public getPlayer = (src: number) => this.players[src];
    public getPlayers = () => this.players;
    public addPlayer = (src: number, player: Player) => (this.players[src] = player);
    public removePlayer = (src: number) => {
        this.players[src].save();
        delete this.players[src];
        logger.info(`Player ${GetPlayerName(src)} (${src}) exited, saving...`);
    };

    public onPlayerDropped = (reason: string) => {
        const src = source;
        if (this.players[src] === undefined) return;
        this.removePlayer(src);
        logger.debug(`Player ${GetPlayerName(src)} (${src}) dropped: ${reason}`);
    };

    public getPlayerInfoFromDb = (uuid: string): DBPlayerInfo | undefined => {
        const playerInfo: any = MySQL.prepare.await("SELECT * FROM players WHERE uuid = ?", [uuid]);
        if (playerInfo === undefined) return;

        const playerData: PlayerData = json.decode(playerInfo.data);

        const playerJob: PlayerJob = json.decode(playerInfo.job);

        const playerGang: PlayerGang = json.decode(playerInfo.gang);

        const inventory: InventoryData = json.decode(playerInfo.inventory) as Array<SlotData>;

        const { x, y, z }: Record<string, number> = json.decode(playerInfo.position);
        const playerPosition = vector3(x, y, z);

        return { uuid, data: playerData, job: playerJob, gang: playerGang, position: playerPosition, inventory };
    };

    public loadPlayerFromDb = (src: number, uuid: string): Player | undefined => {
        const playerInfo = this.getPlayerInfoFromDb(uuid);
        if (playerInfo === undefined) return;

        const configController = ConfigController.getInstance();

        const inventory = PlayerInventory.fromObject(
            src,
            playerInfo.inventory,
            configController.getInventorySlots(),
            configController.getMaxPlayerWeight()
        );

        return new Player(
            src,
            playerInfo.uuid,
            playerInfo.data,
            inventory,
            playerInfo.position,
            playerInfo.job,
            playerInfo.gang
        );
    };

    /** @noSelf **/
    public static getInstance = () => {
        if (!PlayerController.instance) {
            PlayerController.instance = new PlayerController();
        }

        return PlayerController.instance;
    };
}
