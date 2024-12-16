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
import * as database from "../database";
import { ByteSharedExport, sharedExport } from "../shared/byteSharedExport";

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
    database: typeof database;
    shared: ByteSharedExport;
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
        Logger: new ExportedClass(Logger),
    },
    database: database,
    shared: sharedExport
});

exports("Import", exporterFunction);
