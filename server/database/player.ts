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

    const [dbErr4, playerSkinDBResult] = DB.querySync(loadPlayerQueries.loadPlayerSkin, [uuid]);
    if (dbErr4) return Err({ query: loadPlayerQueries.loadPlayerSkin, params: [uuid], error: playerSkinDBResult });

    const playerResult = playerDBResult.rows[0];
    const jobsResult: Array<PlayerJob> = jobsDBResult.rows.map(j => ({ name: j.name, grade: j.grade }));
    const gangsResult: Array<PlayerGang> = gangsDBResult.rows.map(j => ({ name: j.name, grade: j.grade }));
    const playerSkinResult = playerSkinDBResult.rows[0];

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
            position: parseVector4(jd(playerResult.position)),
            pedData: {
                pedModel: playerSkinResult.ped_model,
                hairColor: playerSkinResult.hair_color,
                highlightColor: playerSkinResult.highlight_color,
                components: jd(playerSkinResult.components),
                props: jd(playerSkinResult.props),
                headBlend: jd(playerSkinResult.head_blend),
                faceFeatures: jd(playerSkinResult.face_features),
                headOverlays: jd(playerSkinResult.head_overlays)
            }
        })
    );
};

export const savePlayerToDB = (discord: string, playerData: DBPlayerInfo): TransactionResult<null> => {
    const queries: Array<[string, Array<any>]> = [
        [savePlayerQueries.updatePlayer, [discord, playerData.uuid, je(playerData.position), je(playerData.inventory)]],
        [
            savePlayerQueries.updatePlayerData,
            [
                discord,
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
            [discord, playerData.uuid, playerData.jobs.map(j => j.name), playerData.jobs.map(j => j.grade)]
        ],
        [
            savePlayerQueries.updatePlayerGangs,
            [discord, playerData.uuid, playerData.gangs.map(j => j.name), playerData.gangs.map(j => j.grade)]
        ],
        [
            savePlayerQueries.updatePlayerSkin,
            [
                discord,
                playerData.uuid,
                playerData.pedData.pedModel /* ped_model */,
                je(playerData.pedData.components) /* components */,
                je(playerData.pedData.props) /* props */,
                je(playerData.pedData.headBlend) /* head_blend */,
                je(playerData.pedData.headOverlays) /* head_overlays */,
                je(playerData.pedData.faceFeatures) /* face_features */,
                playerData.pedData.hairColor /* hair_color */,
                playerData.pedData.highlightColor /* highlight_color */
            ]
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
    loadPlayerGangs: `select * from player_gang where uuid = $1`,
    loadPlayerSkin: `select * from player_skin where uuid = $1`
};

const savePlayerQueries = {
    updatePlayer: `
        insert into player (discord, uuid, position, inventory)
            values ($1, $2, $3, $4)
            on conflict (discord, uuid) do update
            set 
                position = excluded.position,
                inventory = excluded.inventory`,
    updatePlayerData: `
        insert into player_data (discord, uuid, firstname, lastname, nationality, birthdate, gender)
            values ($1, $2, $3, $4, $5, $6, $7)
            on conflict (discord, uuid) do update
            set 
                firstname = excluded.firstname,
                lastname = excluded.lastname,
                nationality = excluded.nationality,
                birthdate = excluded.birthdate,
                gender = excluded.gender`,
    updatePlayerJobs: `
        with input_data (name, grade) as (
            -- Transform job and grade arrays into rows
            select * from unnest($3::text[], $4::int[])
        ),
        upserted as (
            -- Insert and update existing rows
            insert into player_job (discord, uuid, name, grade)
            select $1::varchar(50), $2::varchar(50), name, grade
            from input_data
            on conflict (discord, uuid, name) do update
            set grade = excluded.grade
            returning name
        )
        -- Delete rows that were not upserted
        delete from player_job
        where discord = $1 and uuid = $2
            and name not in (select name from upserted);`,
    updatePlayerGangs: `
        with input_data (name, grade) as (
            -- Transform gang and grade arrays into rows
            select * from unnest($3::text[], $4::int[])
        ),
        upserted as (
            -- Insert and update existing rows
            insert into player_gang (discord, uuid, name, grade)
            select $1::varchar(50), $2::varchar(50), name, grade
            from input_data
            on conflict (discord, uuid, name) do update
            set grade = excluded.grade
            returning name
        )
        -- Delete rows that were not upserted
        delete from player_gang
        where discord = $1 and uuid = $2
            and name not in (select name from upserted);`,
    updatePlayerSkin: `
        insert into player_skin (discord, uuid, ped_model, components, props, head_blend, head_overlays, face_features, hair_color, highlight_color)
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            on conflict (discord, uuid) do update
            set 
                ped_model = excluded.ped_model,
                components = excluded.components,
                props = excluded.props,
                head_blend = excluded.head_blend,
                head_overlays = excluded.head_overlays,
                face_features = excluded.face_features,
                hair_color = excluded.hair_color,
                highlight_color = excluded.highlight_color`
};
