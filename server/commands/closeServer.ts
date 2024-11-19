import { Command } from "../controllers/commandController";
import { Privilege } from "../controllers/privilegeController";
import { ServerAccessController } from "../controllers/serverAccessController";
import { Logger } from "../utils/logger";

const logger = new Logger("closeServer");

const closeServer: Command = {
    command: "closeServer",
    privilege: Privilege.GOD,
    commandFn: (src, args, raw) => {
        const accessController = ServerAccessController.getInstance();
        accessController.setServerClosed(true);
        logger.info("Server closed.");
    }
};

export default closeServer;
