import { getEventNames } from "../shared/classes/eventNameController";

const eventNames = getEventNames();

export type CallbackFn = (src: number, cb: (...args: any[]) => void, ...args: any[]) => any;

export class RPCController {
    /** @noSelf **/
    private static instance: RPCController;
    private callbacks: Record<string, CallbackFn> = {};

    private constructor() {
        RegisterNetEvent(eventNames.get("Server.RPC.Call"), (procedure: string, ...args: any[]) => {
            const src = source;
            if (!this.callbacks[procedure]) return;

            const procedureCallback = this.callbacks[procedure];
            procedureCallback(
                src,
                (...retVals: any[]) => {
                    TriggerClientEvent(eventNames.get("Client.RPC.Callback"), src, procedure, ...retVals);
                },
                ...args
            );
        });
    }

    public registerProcedure = (procedure: string, callback: CallbackFn) => {
        this.callbacks[procedure] = callback;
    };

    public deleteProcedure = (procedure: string) => {
        delete this.callbacks[procedure];
    };

    /** @noSelf **/
    public static getInstance = () => {
        if (!RPCController.instance) {
            RPCController.instance = new RPCController();
        }

        return RPCController.instance;
    };
}
