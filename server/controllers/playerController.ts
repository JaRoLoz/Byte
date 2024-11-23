import { Logger } from "../utils/logger";
import { Player } from "../classes/player";

const logger = new Logger("PlayerController");

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

    /** @noSelf **/
    public static getInstance = () => {
        if (!PlayerController.instance) {
            PlayerController.instance = new PlayerController();
        }

        return PlayerController.instance;
    };
}
