import { Command } from "../controllers/commandController";
import { ServerAccessController } from "../controllers/serverAccessController";
import { Logger } from "../utils/logger";

const logger = Logger.construct("closeServer");

const closeServer: Command = {
    command: "closeServer",
    privilege: "GOD",
    commandFn: (src, args, raw) => {
        const accessController = ServerAccessController.getInstance();
        accessController.setServerClosed(true);
        logger.info("Server closed.");
    }
};

export default closeServer;
