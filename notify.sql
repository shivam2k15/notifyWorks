drop table users;
drop table followers;
drop table posts;
drop domain if exists email;
create domain email as text check (value ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' );
create table users (
id bigint generated always as identity primary key,
username varchar(50) not null,
email email unique not null,
name  varchar(50),
phonenumber numeric(10),
password varchar(100),
image_url varchar(2000)
);

CREATE TABLE followers (
id bigint generated always as identity primary key,
    user_id bigint NOT NULL,
    follower_id bigint NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_follower FOREIGN KEY (follower_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_follow UNIQUE (user_id, follower_id),
    CONSTRAINT prevent_self_follow CHECK (user_id != follower_id)
);

create table posts (
id bigint generated always as identity primary key,
user_id bigint NOT NULL,
title varchar(150),
description text,
tag varchar(20),
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

create table notification(
from_user  bigint NOT NULL,
to_user  bigint NOT NULL,
seen boolean,
title varchar(150),
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
CONSTRAINT fk_from_user FOREIGN KEY (from_user) REFERENCES users(id) ON DELETE CASCADE,
CONSTRAINT fk_to_user FOREIGN KEY (to_user) REFERENCES users(id) ON DELETE CASCADE
);

insert into users (username,email,phonenumber,name) values ('suarez2k16','suarez2k16@gmail.com',8318942503,'suarez');
insert into users (username,email,phonenumber,name) values ('shivam','shivamkumar2k16k@gmail.com',8318942503,'shivam');

insert into followers (user_id,follower_id) values (1,2);
insert into posts (user_id,title,description) values (1,'why to use postgres','we should use sql databse for complex relation based table data');
select * from posts;