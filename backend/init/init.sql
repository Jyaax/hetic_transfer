create table todo
(
    id        int          not null auto_increment primary key,
    title     varchar(255) not null,
    completed boolean default false
);
