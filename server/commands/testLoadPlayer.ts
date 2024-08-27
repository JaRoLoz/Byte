import { Command } from "../controllers/commandController";
import { Logger } from "../utils/logger";
import { PlayerController } from "../controllers/playerController";

const logger = Logger.construct("testLoadPlayer");

const testLoadPlayer: Command = {
    command: "testLoadPlayer",
    privilege: "NONE",
    commandFn: (src, args) => {
        if (!args[0]) {
            logger.error("You must provide a UUID to load a player.");
            return;
        }
        const player = PlayerController.getInstance().loadPlayerFromDb(Number(1), args[0]);

        logger.debug(`Player object -> ${json.encode(player?.toObject())}`);
    }
};

export default testLoadPlayer;
