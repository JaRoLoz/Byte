import "./commands/commands";
import "./events/baseEvents";
import "./events/exports";
import type { ByteExport } from "./events/exports";
import { init } from "./init";
import { Debugger } from "./shared/classes/debugger";
import { getTranslator } from "./shared/classes/translator";
import { Logger } from "./utils/logger";
import { getPlayerFromDB } from "./database/player";

const main = () => {
    const logger = new Logger("main");
    const translator = getTranslator();

    logger.info(translator.get("Server.Console.ServerStarted"));

    const dbg = new Debugger("main");
    //@ts-ignore
    const start: number = os.time();
    for (let i = 0; i < 100; i++) {
        const [err, result] = getPlayerFromDB("test3");
        if (err) {
            logger.error(json.encode(result));
            return;
        }
    }
    //@ts-ignore
    const end: number = os.time();
    dbg.watchpoint("time", end - start);
};

const [initErr, errString] = init();

if (initErr) {
    console.error(`^1FATAL ERROR: ${errString}^0`);
} else {
    main();
}

export { ByteExport };
