<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 28.01.2018
 * Time: 19:52
 */

echo "Test: \n";

$sqlite = new \SQLite3("../sqlite/db.sqlite");

$stm = $sqlite->prepare('SELECT * FROM preset');

$result = $stm->execute();

var_dump($result->numColumns());

 while($res = $result->fetchArray(SQLITE3_ASSOC)){

        print_r($res);
    }
