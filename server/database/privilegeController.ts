import { Err, Ok, Result } from "../shared/classes/result";
import { DB } from "./db";

export type DBPrivilege = {
    discord: string;
    privilege: string;
};

export const getDBPrivileges = (): Result<Array<DBPrivilege>> => {
    const [dbErr, dbResult] = DB.querySync("select discord, privilege from privileges", []);

    if (dbErr) return Err(null);

    return Ok(dbResult.rows as Array<DBPrivilege>);
};
