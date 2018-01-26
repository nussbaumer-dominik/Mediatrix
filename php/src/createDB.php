<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 25.01.2018
 * Time: 18:42
 */

$sqlite = new \SQLite3("../sqlite/db.sqlite");

$sqlite->exec('create table if not exists preset(
	id INT AUTO_INCREMENT primary key,
    json string not null,
    user_id string
);');



