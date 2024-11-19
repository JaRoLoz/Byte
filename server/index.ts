import "./commands/commands";
import "./events/baseEvents";
import "./events/exports";
import type { ByteExport } from "./events/exports";
import { Debugger } from "./shared/classes/debugger";
import { Optional } from "./shared/classes/optional";
import { Result, Ok, Err, EmptyOk } from "./shared/classes/result";
import { getTranslator } from "./shared/classes/translator";
import { EnvManager } from "./utils/env";
import { Logger } from "./utils/logger";

const logger = new Logger("main");
const translator = getTranslator();

logger.info(translator.get("Server.Console.ServerStarted"));

const dbg = new Debugger("main");
logger.info(`Debug: ${EnvManager.getDebug()}`);
logger.info("Test1");
dbg.breakpoint("test", json.encode({ test: "test" }));
logger.info("Test2");
dbg.breakpoint("test2", json.encode({ test2: "test2" }));
logger.info("Test3");
dbg.watchpoint("test3", json.encode({ test3: "test3" }));
logger.info("Test4");

const result1 = (): Result<string> => Ok("fdsf");
const result2 = (): Result<number> => Err();
const result3 = (): Result => EmptyOk();
const option1 = (): Optional<number> => Optional.Some(69);
const option2 = (): Optional<number> => Optional.None();

const [err1, r1] = result1();
const [err2, r2] = result2();
const [err3, r3] = result3();
const o1 = option1();
const o2 = option2();

if (!err1 && !err2) {
    const ar1 = r1;
    const ar2 = r2;
    const ar3 = r3;
}

// !err1 ? logger.info(`Result1: ${r1}`) : logger.info("Result1: Error");
// !err2 ? logger.info(`Result2: ${r2}`) : logger.info("Result2: Error");
// o1.isSome() ? logger.info(`Option1: ${o1.unwrap()}`) : logger.info("Option1: None");
// o2.isSome() ? logger.info(`Option2: ${o2.unwrap()}`) : logger.info("Option2: None");

export { ByteExport };
