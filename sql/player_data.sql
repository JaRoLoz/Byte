create table player_data
(
    uuid        varchar(50) not null,
    discord     varchar(50) not null,
    firstname   text        not null,
    lastname    text        not null,
    nationality text        not null,
    birthdate   bigint      not null,
    gender      smallint    not null,
    constraint player_data_pk primary key (uuid, discord),
    constraint player_fk foreign key (uuid, discord) references player (uuid, discord)
);