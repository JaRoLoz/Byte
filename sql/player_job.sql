create table player_job
(
    uuid     varchar(50) not null,
    discord  varchar(50) not null,
    name     text        not null,
    grade    integer     not null,
    constraint player_job_pk
        primary key (uuid, name),
    constraint player_job_fk
        foreign key (uuid, discord) references player (uuid, discord)
);