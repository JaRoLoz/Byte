import { Command } from "../controllers/commandController";
import { Logger } from "../utils/logger";
import { PlayerController } from "../controllers/playerController";
import { Privilege } from "../controllers/privilegeController";

const logger = new Logger("testLoadPlayer");

const testLoadPlayer: Command = {
    command: "testLoadPlayer",
    privilege: Privilege.NONE,
    commandFn: (src, args) => {
        if (!args[0]) {
            logger.error("You must provide a UUID to load a player.");
            return;
        }
        const player = PlayerController.getInstance().loadPlayerFromDb(1, args[0]);

        logger.debug(`Player object -> ${json.encode(player?.toObject())}`);
    }
};

export default testLoadPlayer;
