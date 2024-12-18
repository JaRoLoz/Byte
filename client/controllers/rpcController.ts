import { getEventNames } from "../shared/classes/eventNameController";
import { CfxPromise } from "../shared/native_defs";
import { uuid, UUID } from "../shared/utils/uuid";

const eventNames = getEventNames();
export type RPCCallback<T extends any[] = any> = (this: void, cb: (this: void, ...args: T) => void, ...args: any[]) => any;

export class RPCController {
    /** @noSelf **/
    private static instance: RPCController;
    private promises: Record<UUID, CfxPromise<unknown[]>> = {};
    private procedures: Record<string, RPCCallback> = {};

    private constructor() {
        RegisterNetEvent(eventNames.get("Client.RPC.Callback"), (procuedureId: UUID, args: Array<any>) => {
            const procedurePromise = this.promises[procuedureId] as CfxPromise<any> | undefined;
            if (!procedurePromise) return;

            procedurePromise.resolve(procedurePromise, args);
        });

        RegisterNetEvent(eventNames.get("Client.RPC.Call"), (procedure: string, procedureId: UUID, args: Array<any>) => {
            const procedureCallback = this.procedures[procedure];
            if (!procedureCallback) return;

            procedureCallback(
                (...retVals: any[]) => {
                    TriggerServerEvent(eventNames.get("Server.RPC.Callback"), procedureId, retVals);
                },
                ...args
            );
        });
    }

    /**
     * Calls a procedure on the server.
     * @template Args An array containing the types of the arguments to pass to the server.
     * @param procedure The name of the procedure to call.
     * @param args The arguments to pass to the server.
     * @returns A promise that resolves when the server responds.
     */
    public call = <T extends any[] = any>(procedure: string, ...args: any[]): LuaMultiReturn<T> => {
        const procedurePromise = promise.new();
        const procedureId = uuid();
        this.promises[procedureId] = procedurePromise;

        TriggerServerEvent(eventNames.get("Server.RPC.Call"), procedure, procedureId, args);

        const result = Citizen.Await<T>(procedurePromise);
        delete this.promises[procedureId];

        return $multi(...result);
    };

    /**
     * Registers a procedure that can be called from the server.
     * @template Args An array containing the types of the data returned by the procedure to the server.
     * @param procedure The name of the procedure to register.
     * @param callback The callback function to call when the procedure is called.
     */
    public registerProcedure = <T extends any[] = any>(procedure: string, callback: RPCCallback<T>) => {
        this.procedures[procedure] = callback;
    };

    /**
     * Deletes a procedure handler from the client.
     * @param procedure The name of the procedure to delete.
     */
    public deleteProcedure = (procedure: string) => {
        delete this.procedures[procedure];
    };

    /** @noSelf **/
    public static getInstance = () => {
        if (!RPCController.instance) {
            RPCController.instance = new RPCController();
        }

        return RPCController.instance;
    };
}
