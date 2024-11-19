import { EnvManager } from "../../utils/env";
import { Logger } from "../../utils/logger";
import { getEventNames } from "./eventNameController";
import { getTranslator } from "./translator";

const debug = EnvManager.getDebug();
const production = EnvManager.getProduction();
const events = getEventNames();
const translator = getTranslator();
const logger = new Logger("Debugger");

/**
 * Debugger class.
 * Will stop the execution of the code until the continue event is triggered.
 * This is used to debug the code in a more controlled way.
 * This class is only active when the server `debug` mode is enabled.
 */
export class Debugger {
    private moduleName: string;
    private canContinue: boolean;

    constructor(moduleName: string) {
        this.moduleName = moduleName;
        this.canContinue = true

        if (production) {
            logger.warn(translator.get("Shared.Debugger.ProductionWarning"));
        }

        AddEventHandler(events.get("Shared.Debugger.BreakpointContinue"), (module) => {
            if (this.moduleName !== module) return;
            this.canContinue = true;
        });
    }

    /**
     * Stops the execution of the code until the continue event is triggered.
     * @param id Unique identifier for the breakpoint
     * @param args Arguments to be displayed when the breakpoint is hit
     */
    public breakpoint(id: string, args: any = null) {
        if (!debug) return;

        this.canContinue = false;
        TriggerEvent(events.get("Shared.Debugger.BreakpointHit"), this.moduleName, id, args);
        while (!this.canContinue) Wait(0);
    }

    /**
     * Similar to a breakpoint, but it doesn't stop the execution of the code, just logs the information.
     * @param id Unique identifier for the watchpoint
     * @param args Arguments to be displayed when the watchpoint is hit
     */
    public watchpoint(id: string, args: any) {
        if (!debug) return;

        TriggerEvent(events.get("Shared.Debugger.WatchpointHit"), this.moduleName, id, args);
    }
}

if (debug) {
    RegisterCommand("continue", (source: number, args: any) => {
        if (IsDuplicityVersion() && source !== 0) return; // Only allow the server console to continue
        const moduleName = args[1];
        if (!moduleName) return;
        TriggerEvent(events.get("Shared.Debugger.BreakpointContinue"), moduleName);
    }, false);

    AddEventHandler(events.get("Shared.Debugger.BreakpointHit"), (module: string, id: string, args: any) => {
        logger.debug(`Breakpoint '${id}' hit in module ${module}:`, args);
    });

    AddEventHandler(events.get("Shared.Debugger.WatchpointHit"), (module: string, id: string, args: any) => {
        logger.debug(`Watchpoint '${id}' hit in module ${module}:`, args);
    });
}
