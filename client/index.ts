/* eslint import/no-internal-modules: off */
import "./events";
import { ByteExport } from "./events/exports";
import { Logger } from "./utils/logger";

const logger = new Logger("main");

logger.info("Client started!");

export { ByteExport };
