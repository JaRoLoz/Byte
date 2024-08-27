import * as consts from "../shared/consts";
import * as interfaces from "../shared/interfaces";
import * as classes from "../shared/classes";
import * as utils from "../shared/utils";
import { Inventory } from "../classes/inventory";
import { InventorySlot } from "../classes/inventorySlot";
import { Player } from "../classes/player";
import { PlayerInventory } from "../classes/playerInventory";
import { User } from "../classes/user";
import { CommandController } from "../controllers/commandController";
import { PlayerController } from "../controllers/playerController";
import { PrivilegeController } from "../controllers/privilegeController";
import { ServerAccessController } from "../controllers/serverAccessController";
import { DeferralManager } from "../deferrals/deferralManager";
import { EnvManager } from "../utils/env";
import { Logger } from "../utils/logger";

export type ByteExport = {
    classes: {
        InventorySlot: typeof InventorySlot;
        Inventory: typeof Inventory;
        PlayerInventory: typeof PlayerInventory;
        Player: typeof Player;
        User: typeof User;
    };
    controllers: {
        CommandController: typeof CommandController;
        PlayerController: typeof PlayerController;
        PrivilegeController: typeof PrivilegeController;
        ServerAccessController: typeof ServerAccessController;
        DeferralManager: typeof DeferralManager;
    };
    utils: {
        EnvManager: typeof EnvManager;
        Logger: typeof Logger;
    };
    shared: {
        interfaces: typeof interfaces;
        classes: typeof classes;
        utils: typeof utils;
        consts: typeof consts;
    };
};

const exporterFunction = (): ByteExport => ({
    classes: {
        InventorySlot,
        Inventory,
        PlayerInventory,
        Player,
        User
    },
    controllers: {
        CommandController,
        PlayerController,
        PrivilegeController,
        ServerAccessController,
        DeferralManager
    },
    utils: {
        EnvManager,
        Logger
    },
    shared: {
        interfaces,
        classes,
        utils,
        consts
    }
});

exports("Import", exporterFunction);
