import { Err, Ok, Optional, Result } from "../shared/classes";
import { DBPlayerInfo, PlayerGang, PlayerJob } from "../shared/types";
import { parseVector4, UUID } from "../shared/utils";
import { DB, TransactionError, TransactionResult } from "./db";

const je = (arg: any) => json.encode(arg);
const jd = (arg: string) => json.decode(arg);

export const getPlayersByDiscord = (discordId: string): Result<Array<UUID>, TransactionError> => {
    const [dbErr, result] = DB.querySync("select uuid from player where discord = $1", [discordId]);
    if (dbErr) return Err({ query: getPlayerQueries.byDiscord, params: [discordId], error: result });

    return Ok(result.rows.map(r => r.uuid));
};

export const getPlayerFromDB = (uuid: UUID): Result<Optional<DBPlayerInfo>, TransactionError> => {
    const [dbErr1, playerDBResult] = DB.querySync(loadPlayerQueries.loadPlayer, [uuid]);
    if (dbErr1) return Err({ query: loadPlayerQueries.loadPlayer, params: [uuid], error: playerDBResult });
    if (playerDBResult.count === 0) return Ok(Optional.None());

    const [dbErr2, jobsDBResult] = DB.querySync(loadPlayerQueries.loadPlayerJobs, [uuid]);
    if (dbErr2) return Err({ query: loadPlayerQueries.loadPlayer, params: [uuid], error: jobsDBResult });

    const [dbErr3, gangsDBResult] = DB.querySync(loadPlayerQueries.loadPlayerGangs, [uuid]);
    if (dbErr3) return Err({ query: loadPlayerQueries.loadPlayer, params: [uuid], error: gangsDBResult });

    const playerResult = playerDBResult.rows[0];
    const jobsResult: Array<PlayerJob> = jobsDBResult.rows.map(j => ({ name: j.name, grade: j.grade }));
    const gangsResult: Array<PlayerGang> = gangsDBResult.rows.map(j => ({ name: j.name, grade: j.grade }));

    return Ok(
        Optional.Some({
            uuid,
            data: {
                firstname: playerResult.firstname,
                lastname: playerResult.lastname,
                birthdate: playerResult.birthdate,
                nationality: playerResult.nationality,
                gender: playerResult.gender
            },
            jobs: jobsResult,
            gangs: gangsResult,
            inventory: jd(playerResult.inventory),
            position: parseVector4(jd(playerResult.position))
        })
    );
};

export const savePlayerToDB = (playerData: DBPlayerInfo): TransactionResult<null> => {
    const queries: Array<[string, Array<any>]> = [
        [savePlayerQueries.updatePlayer, [playerData.uuid, je(playerData.position), je(playerData.inventory)]],
        [
            savePlayerQueries.updatePlayerData,
            [
                playerData.uuid,
                playerData.data.firstname,
                playerData.data.lastname,
                playerData.data.nationality,
                playerData.data.birthdate,
                playerData.data.gender
            ]
        ],
        [
            savePlayerQueries.updatePlayerJobs,
            [playerData.uuid, playerData.jobs.map(j => j.name), playerData.jobs.map(j => j.grade)]
        ],
        [
            savePlayerQueries.updatePlayerGangs,
            [playerData.uuid, playerData.gangs.map(j => j.name), playerData.gangs.map(j => j.grade)]
        ]
    ];

    const errors: Array<TransactionError> = [];

    for (const [query, params] of queries) {
        const [error, errorString] = DB.querySync(query, params);
        if (error) errors.push({ query, params, error: errorString });
    }

    if (errors.length !== 0) return Err(errors);
    return Ok(null) as TransactionResult<null>; // ts was giving type errors lol
};

const getPlayerQueries = {
    byDiscord: `select uuid from player where discord = $1`
};

const loadPlayerQueries = {
    loadPlayer: `
    select * from 
        player natural join player_data
    where player.uuid = $1`,
    loadPlayerJobs: `select * from player_job where uuid = $1`,
    loadPlayerGangs: `select * from player_gang where uuid = $1`
};

const savePlayerQueries = {
    updatePlayer: `
        insert into player (uuid, position, inventory)
            values ($1, $2, $3)
            on conflict (uuid) do update
            set 
                position = excluded.position,
                inventory = excluded.inventory`,
    updatePlayerData: `
        insert into player_data (uuid, firstname, lastname, nationality, birthdate, gender)
            values ($1, $2, $3, $4, $5, $6)
            on conflict (uuid) do update
            set 
                firstname = $2,
                lastname = $3,
                nationality = $4,
                birthdate = $5,
                gender = $6`,
    updatePlayerJobs: `
        with input_data (name, grade) as (
            -- Transform job and grade arrays into rows
            select * from unnest($2::text[], $3::int[])
        ),
        upserted as (
            -- Insert and update existing rows
            insert into player_job (uuid, name, grade)
            select $1::varchar(50), name, grade
            from input_data
            on conflict (uuid, name) do update
            set grade = excluded.grade
            returning name
        )
        -- Delete rows that were not upserted
        delete from player_job
        where uuid = $1
            and name not in (select name from upserted);`,
    updatePlayerGangs: `
        with input_data (name, grade) as (
            -- Transform gang and grade arrays into rows
            select * from unnest($2::text[], $3::int[])
        ),
        upserted as (
            -- Insert and update existing rows
            insert into player_gang (uuid, name, grade)
            select $1::varchar(50), name, grade
            from input_data
            on conflict (uuid, name) do update
            set grade = excluded.grade
            returning name
        )
        -- Delete rows that were not upserted
        delete from player_gang
        where uuid = $1
            and name not in (select name from upserted);`
};
