<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 28.01.2018
 * Time: 19:52
 */

echo "Test: \n";

$sqlite = new \SQLite3("../sqlite/db.sqlite");

echo "User-Tabel:\n";

$stm = $sqlite->prepare('SELECT * FROM user');

$result = $stm->execute();

while($res = $result->fetchArray(SQLITE3_ASSOC)){
    print_r($res);
}


echo "\nPreset-Tabel:\n";

$stm = $sqlite->prepare('SELECT * FROM preset');

$result = $stm->execute();

 while($res = $result->fetchArray(SQLITE3_ASSOC)){
        print_r($res);
    }
