import { Command } from "../controllers/commandController";
import { Privilege, PrivilegeController } from "../controllers/privilegeController";
import { Logger } from "../utils/logger";

const logger = Logger.construct("addPrivilege");

const addPrivilege: Command = {
    command: "addPrivilege",
    privilege: "GOD",
    commandFn: (src, args, raw) => {
        let discord = args[0] as string;
        const privilege = args[1] as string;

        if (!discord.startsWith("discord:")) {
            discord = `discord:${discord}`;
        }

        //@ts-ignore
        if (Privilege[privilege] === undefined) {
            logger.error(`Invalid privilege level: ${privilege}`);
            return;
        }

        const privilegeController = PrivilegeController.getInstance();
        privilegeController.addPrivilege(discord, privilege as keyof typeof Privilege);
        logger.info(`Added privilege for ${discord} with privilege level ${privilege}`);
    }
};

export default addPrivilege;
