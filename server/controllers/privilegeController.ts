import { DB } from "../database/db";
import { getDBPrivileges } from "../database/privilegeController";
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
        const [dbErr, dbResult] = getDBPrivileges();

        if (dbErr) {
            logger.error(`Failed to load privileges: ${dbResult}`);
            return;
        }

        this.privilegedUsers = {};
        for (const user of dbResult) {
            if (this.privilegedUsers[user.discord]) {
                logger.warn(`Duplicate discord id found in privileges table: ${user.discord}`);
                continue;
            }

            const privilege = Privilege[user.privilege as keyof typeof Privilege];
            if (privilege === undefined) {
                logger.warn(`Invalid privilege level found in privileges table: ${user.privilege} (${user.discord})`);
                continue;
            }

            this.privilegedUsers[user.discord] = privilege;
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
        const [dbErr, dbResult] = DB.querySync("insert into privileges (discord, privilege) values ($1, $2)", [
            discord,
            privilege
        ]);
        if (dbErr) logger.error(`Failed to insert privilege into database: ${dbResult}`);
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
        const [dbErr, dbResult] = DB.querySync("delete from privileges where discord = $1", [discord]);
        if (dbErr) logger.error(`Faileed to delete privilege from database: ${dbResult}`);
    };

    public getPrivilege = (discordId: string): Privilege => {
        return this.privilegedUsers[discordId] || Privilege.NONE;
    };

    public hasPrivilege = (privilege: Privilege, target: Privilege) => {
        // prioritize safety
        return (privilege || Privilege.NONE) >= (target || Privilege.GOD);
    };

    /** @noSelf **/
    public static getInstance = () => {
        if (!PrivilegeController.instance) {
            PrivilegeController.instance = new PrivilegeController();
        }

        return PrivilegeController.instance;
    };
}
