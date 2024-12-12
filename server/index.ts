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

    logger.info(translator.get("Server.Console.ServerStarted"));
};

const [initErr, errString] = init();

if (initErr) {
    console.error(`^1FATAL ERROR: ${errString}^0`);
} else {
    main();
}

export { ByteExport };
