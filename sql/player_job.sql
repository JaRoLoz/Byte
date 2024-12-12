create table player_job
(
    discord varchar(50) not null,
    uuid    varchar(50) not null,
    name    text        not null,
    grade   integer     not null,
    constraint player_job_pk primary key (discord, uuid, name),
    constraint player_job_fk foreign key (discord, uuid) references player (discord, uuid)
);