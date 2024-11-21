import { DB } from "./classes/db/db";
import "./commands/commands";
import "./events/baseEvents";
import "./events/exports";
import type { ByteExport } from "./events/exports";
import { init } from "./init";
import { Debugger } from "./shared/classes/debugger";
import { Optional } from "./shared/classes/optional";
import { Result, Ok, Err, EmptyOk } from "./shared/classes/result";
import { getTranslator } from "./shared/classes/translator";
import { EnvManager } from "./utils/env";
import { Logger } from "./utils/logger";

const main = () => {
    const logger = new Logger("main");
    const translator = getTranslator();

    logger.info(translator.get("Server.Console.ServerStarted"));

    const dbg = new Debugger("main");
    const [dbErr, result] = DB.querySync("select * from player where uuid = $1", ["tete"]);
    if (dbErr) {
        logger.error(dbErr);
        return;
    }
    dbg.breakpoint("db", `${json.encode(result.rows[0])} (${result.count})`);
};

const [initErr, errString] = init();

if (initErr) {
    console.error(`^1FATAL ERROR: ${errString}^0`);
} else {
    main();
}

export { ByteExport };
