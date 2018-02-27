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
    isextendet BOOLEAN DEFAULT 0
);');

$sqlite->exec('create table if not exists preset(
	id INTEGER primary key,
    json string not null,
    user_id string not null,
    FOREIGN KEY(user_id) REFERENCES user(id)
);');
