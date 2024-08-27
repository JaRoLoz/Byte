import "./commands/commands";
import "./events/baseEvents";
import "./events/exports";
import type { ByteExport } from "./events/exports";
import { getTranslator } from "./shared/classes/translator";
import { Logger } from "./utils/logger";

const logger = Logger.construct("main");
const translator = getTranslator();

logger.info(translator.get("Server.Console.ServerStarted"));

export { ByteExport };
