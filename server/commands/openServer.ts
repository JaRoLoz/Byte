import { Command } from "../controllers/commandController";
import { ServerAccessController } from "../controllers/serverAccessController";
import { Logger } from "../utils/logger";

const logger = new Logger("openServer");

const openServer: Command = {
    command: "openServer",
    privilege: "GOD",
    commandFn: (src, args, raw) => {
        const accessController = ServerAccessController.getInstance();
        accessController.setServerClosed(false);
        logger.info("Server openned.");
    }
};

export default openServer;
