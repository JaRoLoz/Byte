import * as consts from "../shared/consts";
import * as interfaces from "../shared/interfaces";
import * as classes from "../shared/classes";
import * as utils from "../shared/utils";
import { Inventory } from "../classes/inventory";
import { InventorySlot } from "../classes/inventorySlot";
import { Player } from "../classes/player";
import { PlayerInventory } from "../classes/playerInventory";
import { RPCController } from "../controllers/rpcController";
import { Logger } from "../utils/logger";
import { EnvManager } from "../utils/env";
import { Ped } from "../classes/ped";

export type ByteExport = {
    classes: {
        InventorySlot: typeof InventorySlot;
        Inventory: typeof Inventory;
        PlayerInventory: typeof PlayerInventory;
        Player: typeof Player;
        Ped: typeof Ped;
    };
    controllers: {
        RPCController: typeof RPCController;
    };
    utils: {
        Logger: typeof Logger;
        EnvManager: typeof EnvManager;
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
        Ped
    },
    controllers: {
        RPCController
    },
    utils: {
        Logger,
        EnvManager
    },
    shared: {
        interfaces,
        classes,
        utils,
        consts
    }
});

exports("Import", exporterFunction);
