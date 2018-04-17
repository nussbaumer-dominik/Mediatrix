<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 25.01.2018
 * Time: 18:42
 */

$sqlite = new \SQLite3("../sqlite/db.sqlite");

$sqlite->exec('create table if not exists user(
	id string primary key,
	password string not null,
    isextendet BOOLEAN DEFAULT 0,
    isadmin BOOLEAN DEFAULT 0
);');

$sqlite->exec('create table if not exists preset(
	id INTEGER primary key,
	name string not null,
    json string not null,
    user_id string not null,
    FOREIGN KEY(user_id) REFERENCES user(id)
);');

$sqlite->exec("INSERT INTO USER(id,password,isextendet,isadmin) VALUES ('pi','$2y$10\$XTrGXcIPTw1gQXZsXihqJ.YE1ci5oA1w/6N61ZhQvW04lCa48EoRi',1,1)");