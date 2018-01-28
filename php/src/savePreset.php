<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 28.01.2018
 * Time: 18:51
 */
namespace Mediatrix;

use Firebase\JWT\JWT;

require __DIR__ . '/../vendor/autoload.php';




    var_dump($_POST);

    $userId = JWT::decode($_POST['jwt'], base64_decode(Key::getKey()), array("HS256"))->data->userName;

    $sqlite = new \SQLite3("../sqlite/db.sqlite");

    $stm = $sqlite->prepare("INSERT INTO preset(json,user_id) VALUES (:json,:userId);");

    $stm->bindParam(":json", $_POST['json']);
    $stm->bindParam(":userId", $userId);

    $result = $stm->execute();

    echo $result->numColumns();

