create table player_data
(
    discord     varchar(50) not null,
    uuid        varchar(50) not null,
    firstname   text        not null,
    lastname    text        not null,
    nationality text        not null,
    birthdate   bigint      not null,
    gender      smallint    not null,
    constraint player_data_pk primary key (discord, uuid),
    constraint player_fk foreign key (discord, uuid) references player (discord, uuid)
);