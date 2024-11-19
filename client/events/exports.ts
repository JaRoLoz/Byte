import * as consts from "../shared/consts";
import * as sharedInterfaces from "../shared/interfaces";
import { ConfigController, Item, Translator, XMLSearchNode, ByteGameObject } from "../shared/classes";
import * as utils from "../shared/utils";
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
    Ped,
    Texture,
    TextureDictionary
} from "../classes";
import * as interfaces from "./exportedInterfaces";
import * as types from "./exportedTypes";
import { EventNameController } from "../shared/classes/eventNameController";
import { Debugger } from "../shared/classes/debugger";

export type ByteExport = {
    interfaces: typeof interfaces;
    types: typeof types;
    classes: {
        InventorySlot: ExportedClass<typeof InventorySlot>;
        Inventory: typeof Inventory;
        PlayerInventory: ExportedClass<typeof PlayerInventory>;
        Player: ExportedClass<typeof Player>;
        Ped: ExportedClass<typeof Ped>;
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
    };
    shared: {
        interfaces: typeof sharedInterfaces;
        utils: typeof utils;
        consts: typeof consts;
        classes: {
            ByteGameObject: typeof ByteGameObject;
            ConfigController: typeof ConfigController;
            Item: ExportedClass<typeof Item>;
            Translator: ExportedClass<typeof Translator>;
            XMLSearchNode: ExportedClass<typeof XMLSearchNode>;
            EventNameController: ExportedClass<typeof EventNameController>;
            Debugger: ExportedClass<typeof Debugger>;
        };
    };
};

const exporterFunction = (): ByteExport => ({
    interfaces,
    types,
    classes: {
        InventorySlot: new ExportedClass(InventorySlot),
        Inventory, // abstract class, can't be instantiated
        PlayerInventory: new ExportedClass(PlayerInventory),
        Player: new ExportedClass(Player),
        Ped: new ExportedClass(Ped),
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
        EnvManager
    },
    shared: {
        interfaces: sharedInterfaces,
        utils,
        consts,
        classes: {
            ByteGameObject,
            ConfigController,
            Item: new ExportedClass(Item),
            Translator: new ExportedClass(Translator),
            XMLSearchNode: new ExportedClass(XMLSearchNode),
            EventNameController: new ExportedClass(EventNameController),
            Debugger: new ExportedClass(Debugger)
        }
    }
});

exports("Import", exporterFunction);
