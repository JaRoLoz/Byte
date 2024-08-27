import { getTranslator } from "../shared/classes";
import { EnvManager } from "./env";

const translator = getTranslator();

type Trace = {
    color: number;
    level: string;
};

const maxTraceLength = 7;

export class Logger {
    private module?: string;

    constructor(module?: string) {
        this.module = module;
    }

    private log = (traceLevel: Trace, ...args: any[]) => {
        const invokingResource = GetInvokingResource() as string | undefined;

        const moduleParts = [];
        if (invokingResource) moduleParts.push(invokingResource);
        if (this.module) moduleParts.push(this.module);
        let moduleString = moduleParts.join("/");

        if (moduleParts.length > 0) moduleString = `^6(${moduleString}) ^0`;

        const traceString = `^${traceLevel.color}[${traceLevel.level.slice(0, maxTraceLength).padStart(maxTraceLength)}]^0 `;

        console.log(`${traceString}${moduleString}`, ...args);
    };

    public info = (...args: any[]) => this.log({ color: 2, level: translator.get("Logger.Trace.Info") }, ...args);
    public warn = (...args: any[]) => this.log({ color: 3, level: translator.get("Logger.Trace.Warn") }, ...args);
    public error = (...args: any[]) => this.log({ color: 1, level: translator.get("Logger.Trace.Error") }, ...args);

    public debug = (...args: any[]) => {
        if (!EnvManager.getDebug()) return;
        this.log({ color: 5, level: translator.get("Logger.Trace.Debug") }, ...args);
    };

    /** @noSelf **/
    public static construct = (module?: string) => new Logger(module);
}
