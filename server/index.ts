import { RPCController } from "./controllers/rpcController";
import "./events/exports";
import type { ByteExport } from "./events/exports";
import { init } from "./init";
import { getTranslator } from "./shared/classes/translator";
import { Logger } from "./utils/logger";
// import { TypeChecker } from "./shared/classes/typeChecker";

const main = () => {
    import("./events/baseEvents");
    import("./commands/commands");
    const logger = new Logger("main");
    const translator = getTranslator();
    const rpc = RPCController.getInstance();

    rpc.registerProcedure("test", (src, cb, arg1: number, arg2: number) => {
        cb(arg1 + arg2, "test");
    });

    logger.info(translator.get("Server.Console.ServerStarted"));
};

const [initErr, errString] = init();

if (initErr) {
    console.error(`^1FATAL ERROR: ${errString}^0`);
} else {
    main();
}

export { ByteExport };
