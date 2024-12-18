/* eslint import/no-internal-modules: off */
import { RPCController } from "../controllers/rpcController";
import { Logger } from "../utils/logger";
import { EnvManager } from "../utils/env";
import { ExportedClass } from "../shared/classes/exported";
import {
    Inventory,
    InventorySlot,
    Player,
    PlayerInventory,
    CModel,
    CEntity,
    CNetEntity,
    CObject,
    CPed,
    CVehicle,
    Texture,
    TextureDictionary,
    ClothedPed,
    PlayerPed
} from "../classes";
import * as interfaces from "./exportedInterfaces";
import * as types from "./exportedTypes";
import { ByteSharedExport, sharedExport } from "../shared/byteSharedExport";

export type ByteExport = {
    interfaces: typeof interfaces;
    types: typeof types;
    classes: {
        InventorySlot: ExportedClass<typeof InventorySlot>;
        Inventory: typeof Inventory;
        PlayerInventory: ExportedClass<typeof PlayerInventory>;
        Player: ExportedClass<typeof Player>;
        PlayerPed: ExportedClass<typeof PlayerPed>;
        ClothedPed: ExportedClass<typeof ClothedPed>;
        game: {
            CModel: ExportedClass<typeof CModel>;
            CEntity: ExportedClass<typeof CEntity>;
            CNetEntity: ExportedClass<typeof CNetEntity>;
            CObject: ExportedClass<typeof CObject>;
            CPed: ExportedClass<typeof CPed>;
            CVehicle: ExportedClass<typeof CVehicle>;
            Texture: ExportedClass<typeof Texture>;
            TextureDictionary: ExportedClass<typeof TextureDictionary>;
        };
    };
    controllers: {
        RPCController: typeof RPCController;
    };
    utils: {
        Logger: ExportedClass<typeof Logger>;
        EnvManager: typeof EnvManager;
        XML: typeof XML;
    };
    shared: ByteSharedExport;
};

const exporterFunction = (): ByteExport => ({
    interfaces,
    types,
    classes: {
        InventorySlot: new ExportedClass(InventorySlot),
        Inventory, // abstract class, can't be instantiated
        PlayerInventory: new ExportedClass(PlayerInventory),
        Player: new ExportedClass(Player),
        PlayerPed: new ExportedClass(PlayerPed),
        ClothedPed: new ExportedClass(ClothedPed),
        game: {
            CModel: new ExportedClass(CModel),
            CEntity: new ExportedClass(CEntity),
            CNetEntity: new ExportedClass(CNetEntity),
            CObject: new ExportedClass(CObject),
            CPed: new ExportedClass(CPed),
            CVehicle: new ExportedClass(CVehicle),
            Texture: new ExportedClass(Texture),
            TextureDictionary: new ExportedClass(TextureDictionary)
        }
    },
    controllers: {
        RPCController
    },
    utils: {
        Logger: new ExportedClass(Logger),
        EnvManager,
        XML
    },
    shared: sharedExport
});

exports("Import", exporterFunction);
