import "./commands/commands";
import "./events/baseEvents";
import "./events/exports";
import type { ByteExport } from "./events/exports";
import { init } from "./init";
import { Debugger } from "./shared/classes/debugger";
import { getTranslator } from "./shared/classes/translator";
import { Logger } from "./utils/logger";
import { TypeChecker } from "./shared/classes/typeChecker";

const main = () => {
    const logger = new Logger("main");
    const translator = getTranslator();

    logger.info(translator.get("Server.Console.ServerStarted"));

    const dbg = new Debugger("main");
    const type = new TypeChecker({
        name: "string",
        age: {
            hola: "boolean[]"
        }
    });
    const passed = type.check({
        name: "hello",
        age: {
            hola: [true, "22"]
        }
    });
    dbg.watchpoint("typecheck", passed);
};

const [initErr, errString] = init();

if (initErr) {
    console.error(`^1FATAL ERROR: ${errString}^0`);
} else {
    main();
}

export { ByteExport };
