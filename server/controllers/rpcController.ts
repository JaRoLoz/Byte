import { getEventNames } from "../shared/classes/eventNameController";
import { CfxPromise } from "../shared/native_defs";
import { uuid, UUID } from "../shared/utils/uuid";

const eventNames = getEventNames();

/**
 * Type of a RPC function that can be called from the client.
 * @param src The player source that called the procedure.
 * @param cb The callback function to call when the procedure is done.
 */
export type RPCCallback<T extends any[] = any> = (this: void, src: number, cb: (this: void, ...args: T) => void, ...args: any[]) => any;

export class RPCController {
    /** @noSelf **/
    private static instance: RPCController;
    private promises: Record<UUID, { source: number, promise: CfxPromise<unknown[]> }> = {};
    private procedures: Record<string, RPCCallback> = {};

    private constructor() {
        RegisterNetEvent(eventNames.get("Server.RPC.Call"), (procedure: string, procedureId: UUID, args: Array<any>) => {
            const src = source;
            const procedureCallback = this.procedures[procedure];
            if (!procedureCallback) return;

            procedureCallback(
                src,
                (...retVals: any[]) => {
                    TriggerClientEvent(eventNames.get("Client.RPC.Callback"), src, procedureId, retVals);
                },
                ...args
            );
        });

        RegisterNetEvent(eventNames.get("Server.RPC.Callback"), (procuedureId: UUID, args: Array<any>) => {
            const src = source;
            const procedurePromise = this.promises[procuedureId];
            if (!procedurePromise) return;
            if (procedurePromise.source !== src) return;

            procedurePromise.promise.resolve(procedurePromise.promise, args);
        });
    }

    /**
     * Registers a procedure that can be called from the client.
     * @template Args An array containing the types of the data returned by the procedure to the client.
     * @param procedure The name of the procedure to register.
     * @param callback The callback function to call when the procedure is called.
     */
    public registerProcedure = <T extends any[] = any>(procedure: string, callback: RPCCallback<T>) => {
        this.procedures[procedure] = callback;
    };

    /**
     * Deletes a procedure handler from the server.
     * @param procedure The name of the procedure to delete.
     */
    public deleteProcedure = (procedure: string) => {
        delete this.procedures[procedure];
    };

    /**
     * Calls a procedure on the client.
     * @param src The player source to call the procedure on.
     * @param procedure The name of the procedure to call.
     * @param args The arguments to pass to the client.
     * @returns A promise that resolves when the client responds.
     */
    public call = <T extends any[] = any>(src: number, procedure: string, ...args: any[]): LuaMultiReturn<T> => {
        const procedurePromise = promise.new();
        const procedureId = uuid();
        this.promises[procedureId] = {
            source: src,
            promise: procedurePromise
        };

        TriggerClientEvent(eventNames.get("Client.RPC.Call"), src, procedure, procedureId, args);

        const result = Citizen.Await<T>(procedurePromise);
        delete this.promises[procedureId];

        return $multi(...result);
    };

    /** @noSelf **/
    public static getInstance = () => {
        if (!RPCController.instance) {
            RPCController.instance = new RPCController();
        }

        return RPCController.instance;
    };
}
