import { ByteGameObject, ConfigController, Item, Translator, XMLSearchNode, Debugger, ExportedClass, TypeChecker, EventNameController, Optional, Ok, EmptyOk, Err } from "./classes";
import * as consts from "./consts";
import * as utils from "./utils";
import * as interfaces from "./interfaces";

export type ByteSharedExport = {
    interfaces: typeof interfaces;
    utils: typeof utils;
    consts: typeof consts;
    XML: typeof XML;
    classes: {
        ByteGameObject: typeof ByteGameObject;
        ConfigController: typeof ConfigController;
        Item: ExportedClass<typeof Item>;
        Translator: ExportedClass<typeof Translator>;
        XMLSearchNode: ExportedClass<typeof XMLSearchNode>;
        EventNameController: ExportedClass<typeof EventNameController>;
        Debugger: ExportedClass<typeof Debugger>;
        TypeChecker: ExportedClass<typeof TypeChecker>;
        Optional: typeof Optional;
        ExportedClass: typeof ExportedClass;
        Result: {
            Ok: typeof Ok;
            EmptyOk: typeof EmptyOk;
            Err: typeof Err;
        }
    };
};

export const sharedExport: ByteSharedExport = {
    consts,
    utils,
    interfaces,
    XML,
    classes: {
        ByteGameObject,
        ConfigController,
        Item: new ExportedClass(Item),
        Translator: new ExportedClass(Translator),
        XMLSearchNode: new ExportedClass(XMLSearchNode),
        EventNameController: new ExportedClass(EventNameController),
        Debugger: new ExportedClass(Debugger),
        TypeChecker: new ExportedClass(TypeChecker),
        ExportedClass,
        Optional,
        Result: {
            Ok,
            EmptyOk,
            Err
        },
    }
};
