import * as consts from "../shared/consts";
import * as interfaces from "../shared/interfaces";
import { ConfigController, Item, Translator, XMLSearchNode } from "../shared/classes";
import * as utils from "../shared/utils";
import { Inventory } from "../classes/inventory";
import { InventorySlot } from "../classes/inventorySlot";
import { Player } from "../classes/player";
import { PlayerInventory } from "../classes/playerInventory";
import { RPCController } from "../controllers/rpcController";
import { Logger } from "../utils/logger";
import { EnvManager } from "../utils/env";
import { Ped } from "../classes/ped";
import { ExportedClass } from "../shared/classes/exported";

export type ByteExport = {
    classes: {
        InventorySlot: ExportedClass<typeof InventorySlot>;
        Inventory: typeof Inventory;
        PlayerInventory: ExportedClass<typeof PlayerInventory>;
        Player: ExportedClass<typeof Player>;
        Ped: ExportedClass<typeof Ped>;
    };
    controllers: {
        RPCController: typeof RPCController;
    };
    utils: {
        Logger: ExportedClass<typeof Logger>;
        EnvManager: typeof EnvManager;
    };
    shared: {
        interfaces: typeof interfaces;
        utils: typeof utils;
        consts: typeof consts;
        classes: {
            ConfigController: typeof ConfigController;
            Item: ExportedClass<typeof Item>;
            Translator: ExportedClass<typeof Translator>;
            XMLSearchNode: ExportedClass<typeof XMLSearchNode>;
        };
    };
};

const exporterFunction = (): ByteExport => ({
    classes: {
        InventorySlot: new ExportedClass(InventorySlot),
        Inventory, // abstract class, cant be instantiated
        PlayerInventory: new ExportedClass(PlayerInventory),
        Player: new ExportedClass(Player),
        Ped: new ExportedClass(Ped)
    },
    controllers: {
        RPCController
    },
    utils: {
        Logger: new ExportedClass(Logger),
        EnvManager
    },
    shared: {
        interfaces,
        utils,
        consts,
        classes: {
            ConfigController,
            Item: new ExportedClass(Item),
            Translator: new ExportedClass(Translator),
            XMLSearchNode: new ExportedClass(XMLSearchNode)
        }
    }
});

exports("Import", exporterFunction);
