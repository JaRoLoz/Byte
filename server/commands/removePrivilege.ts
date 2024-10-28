import { Command } from "../controllers/commandController";
import { Privilege, PrivilegeController } from "../controllers/privilegeController";
import { Logger } from "../utils/logger";

const logger = new Logger("removePrivilege");

const removePrivilege: Command = {
    command: "removePrivilege",
    privilege: "GOD",
    commandFn: (src, args, raw) => {
        let discord = args[0] as string;

        if (!discord.startsWith("discord:")) {
            discord = `discord:${discord}`;
        }

        const privilegeController = PrivilegeController.getInstance();
        privilegeController.removePrivilege(discord);
        logger.info(`Removed privilege for ${discord}`);
    }
};

export default removePrivilege;
