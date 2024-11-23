import { Err, Ok, Result } from "../shared/classes/result";

export type DBResult = {
    rows: any[];
    count: number;
};

export type TransactionError = { query: string; params: any[]; error: string };
export type TransactionResult<T> = Result<T, Array<TransactionError>>;

/**
 * Small wrapper around [Byte-pg](https://github.com/JaRoloz/Byte-pg)
 * @noSelf
 */
export class DB {
    public static ready = (cb: (result: Result<null, string>) => void) => {
        PG.Ready(err => {
            if (err) cb(Err(err));
            else cb(Ok(null));
        });
    };

    public static readySync = (): Result<null, string> => {
        const err = PG.ReadySync();
        if (err) return Err(err);
        return Ok(null);
    };

    public static query = (query: string, args: any[], cb: (result: Result<DBResult, string>) => void) => {
        PG.Query(query, args, (rows, count, error) => {
            if (error) cb(Err(error));
            else cb(Ok({ rows, count }));
        });
    };

    public static querySync = (query: string, args: any[]): Result<DBResult, string> => {
        const [rows, count, error] = PG.QuerySync(query, args);
        if (error) return Err(error);
        return Ok({ rows, count });
    };
}
