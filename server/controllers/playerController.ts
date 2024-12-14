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
    public addPlayer = (src: number, player: Player) => {
        this.players[src] = player;
        logger.debug(`Player ${src} (${player.getUuid()}) added to the controller.`);
    };
    public removePlayer = (src: number) => {
        logger.debug(`Player ${src} (${this.players[src].getUuid()}) removed from the controller.`);
        this.players[src].save();
        delete this.players[src];
    };

    public savePlayersAsync = () => Object.values(this.players).forEach(player => CreateThread(() => player.save()));

    public onPlayerDropped = (_reason: string) => {
        const src = source;
        if (this.players[src] === undefined) return;
        this.removePlayer(src);
    };

    /** @noSelf **/
    public static getInstance = () => {
        if (!PlayerController.instance) {
            PlayerController.instance = new PlayerController();
        }

        return PlayerController.instance;
    };
}
