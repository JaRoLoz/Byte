import * as consts from "../shared/consts";
import * as interfaces from "../shared/interfaces";
import { ConfigController, Item, Translator, XMLSearchNode } from "../shared/classes";
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
import { ExportedClass } from "../shared/classes/exported";
import { RPCController } from "../controllers/rpcController";

export type ByteExport = {
    classes: {
        InventorySlot: ExportedClass<typeof InventorySlot>;
        Inventory: typeof Inventory;
        PlayerInventory: ExportedClass<typeof PlayerInventory>;
        Player: ExportedClass<typeof Player>;
        User: ExportedClass<typeof User>;
    };
    controllers: {
        CommandController: typeof CommandController;
        PlayerController: typeof PlayerController;
        PrivilegeController: typeof PrivilegeController;
        ServerAccessController: typeof ServerAccessController;
        DeferralManager: typeof DeferralManager;
        RPCController: typeof RPCController;
    };
    utils: {
        EnvManager: typeof EnvManager;
        Logger: ExportedClass<typeof Logger>;
    };
    shared: {
        interfaces: typeof interfaces;
        classes: {
            ConfigController: typeof ConfigController;
            Item: ExportedClass<typeof Item>;
            Translator: ExportedClass<typeof Translator>;
            XMLSearchNode: ExportedClass<typeof XMLSearchNode>;
        };
        utils: typeof utils;
        consts: typeof consts;
    };
};

const exporterFunction = (): ByteExport => ({
    classes: {
        InventorySlot: new ExportedClass(InventorySlot),
        Inventory, // abstract class, cant be instantiated
        PlayerInventory: new ExportedClass(PlayerInventory),
        Player: new ExportedClass(Player),
        User: new ExportedClass(User)
    },
    controllers: {
        CommandController,
        PlayerController,
        PrivilegeController,
        ServerAccessController,
        DeferralManager,
        RPCController
    },
    utils: {
        EnvManager,
        Logger: new ExportedClass(Logger)
    },
    shared: {
        interfaces,
        utils,
        consts,
        classes: {
            ConfigController: ConfigController,
            Item: new ExportedClass(Item),
            Translator: new ExportedClass(Translator),
            XMLSearchNode: new ExportedClass(XMLSearchNode)
        }
    }
});

exports("Import", exporterFunction);
