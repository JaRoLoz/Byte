import { Logger } from "../utils/logger";

export enum Privilege {
    NONE = 0,
    WHITELISTED = 1,
    SUPPORT = 2,
    MODERATOR = 3,
    ADMIN = 4,
    GOD = 5
}

const logger = new Logger("PrivilegeController");

/**
 * This class is a singleton that manages the privilege levels of users.
 */
export class PrivilegeController {
    /** @noSelf **/
    private static instance: PrivilegeController;
    private privilegedUsers: Record<string, Privilege> = {};

    private constructor() {
        this.reloadPrivileges();
    }

    private reloadPrivileges = () => {
        const privilegedUsers = MySQL.query.await("SELECT * FROM privileges");

        this.privilegedUsers = {};
        for (const user of privilegedUsers) {
            if (this.privilegedUsers[user.discord]) {
                logger.warn(`Duplicate discord id found in privileges table: ${user.discord}`);
                continue;
            }

            if (Privilege[user.privilege] === undefined) {
                logger.warn(`Invalid privilege level found in privileges table: ${user.privilege} (${user.discord})`);
                continue;
            }

            this.privilegedUsers[user.discord] = user.privilege;
        }
    };

    public addPrivilege = (discord: string, privilege: keyof typeof Privilege) => {
        if (!discord.startsWith("discord:")) {
            discord = `discord:${discord}`;
        }

        if (this.privilegedUsers[discord]) {
            logger.warn(`Duplicate discord id found in privileges table: ${discord}`);
            return;
        }

        if (Privilege[privilege] === undefined) {
            logger.warn(`Invalid privilege level found in privileges table: ${privilege} (${discord})`);
            return;
        }

        this.privilegedUsers[discord] = Privilege[privilege];
        MySQL.query.await("INSERT INTO privileges (discord, privilege) VALUES (?, ?)", [discord, privilege]);
    };

    public removePrivilege = (discord: string) => {
        if (!discord.startsWith("discord:")) {
            discord = `discord:${discord}`;
        }

        if (!this.privilegedUsers[discord]) {
            logger.warn(`Discord id not found in privileges table: ${discord}`);
            return;
        }

        delete this.privilegedUsers[discord];
        MySQL.query.await("DELETE FROM privileges WHERE discord = ?", [discord]);
    };

    public getPrivilege = (discordId: string): Privilege => {
        return this.privilegedUsers[discordId] || Privilege.NONE;
    };

    public hasPrivilege = (privilege: Privilege, target: Privilege) => {
        // prioritize safety
        return (Privilege[privilege] || Privilege.NONE) >= (Privilege[target] || Privilege.GOD);
    };

    /** @noSelf **/
    public static getInstance = () => {
        if (!PrivilegeController.instance) {
            PrivilegeController.instance = new PrivilegeController();
        }

        return PrivilegeController.instance;
    };
}
