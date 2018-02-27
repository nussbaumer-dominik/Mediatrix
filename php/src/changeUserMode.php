<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 06.02.2018
 * Time: 17:57
 */
namespace Mediatrix;

use Firebase\JWT\JWT;

require __DIR__ . '/../vendor/autoload.php';

try {

    $jwt = $_POST['jwt'];

    if (!preg_match('/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/', $jwt)) {
        return json_encode(array("success" => false, "err" => "JWT not valid"));
    }

    $userId = JWT::decode($jwt, base64_decode(Key::getKey()), array("HS256"))->data->userName;

    $sqlite = new \SQLite3("../../sqlite/db.sqlite");

    $stm = $sqlite->prepare("UPDATE user SET isextendet = :ext where id = :id;");

    $stm->bindParam(':id', $userId);

    if (isset($_POST['ex'])) {

        $stm->bindValue(':ext', true);


    } else if (isset($_POST['base'])) {
        $stm->bindValue(':ext', false);
    }

    $stm->execute();

    echo json_encode(array("success" => true, "err" => ""));

}catch (\Exception $ex) {

    echo json_encode(array("success" => false, "err" => "An Error occurred"));

}

