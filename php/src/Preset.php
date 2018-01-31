<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 30.01.2018
 * Time: 13:22
 */

namespace Mediatrix;

use Firebase\JWT\JWT;


class Preset
{

    static function create($data, $jwt)
    {

        $userId = JWT::decode($jwt, base64_decode(Key::getKey()), array("HS256"))->data->userName;

        $sqlite = new \SQLite3("../../sqlite/db.sqlite");

        $stm = $sqlite->prepare("INSERT INTO preset(json,user_id) VALUES (:json,:userId);");

        $stm->bindParam(":json", $data);
        $stm->bindParam(":userId", $userId);

        $stm->execute();


    }

    static function update($data, $id, $jwt)
    {
        $userId = JWT::decode($jwt, base64_decode(Key::getKey()), array("HS256"))->data->userName;

        $sqlite = new \SQLite3("../../sqlite/db.sqlite");

        $stm = $sqlite->prepare("UPDATE preset SET json = :json where id = :id and user_id = :userId;");

        $stm->bindParam(':json', $data);
        $stm->bindParam(':id', $id);
        $stm->bindParam(':userId', $userId);

        $stm->execute();

    }

    static function delete($id, $jwt)
    {

        $userId = JWT::decode($jwt, base64_decode(Key::getKey()), array("HS256"))->data->userName;

        $sqlite = new \SQLite3("../../sqlite/db.sqlite");

        $stm = $sqlite->prepare("DELETE FROM preset where id = :id and user_id = :userId;");

        $stm->bindParam(':id', $id);
        $stm->bindParam(':userId', $userId);

        $stm->execute();

    }
}