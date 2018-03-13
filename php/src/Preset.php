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

    static function create($name,$data, $jwt)
    {

        $userId = JWT::decode($jwt, base64_decode(Key::getKey()), array("HS256"))->data->userName;

        if(Preset::checkUsername($userId)) {

            $sqlite = new \SQLite3("../../sqlite/db.sqlite");

            $stm = $sqlite->prepare("INSERT INTO preset(name,json,user_id) VALUES (:name,:json,:userId);");

            $stm->bindParam(":name",$name);
            $stm->bindParam(":json", $data);
            $stm->bindParam(":userId", $userId);

            $stm->execute();
        }


    }

    static function update($data, $name, $id, $jwt)
    {
        $userId = JWT::decode($jwt, base64_decode(Key::getKey()), array("HS256"))->data->userName;

        $sqlite = new \SQLite3("../../sqlite/db.sqlite");

        $stm = $sqlite->prepare("UPDATE preset SET json = :json, name = :name where id = :id and user_id = :userId;");

        $stm->bindParam(':name', $name);
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

    static function checkUsername($user){

        $sqlite = new \SQLite3("../../sqlite/db.sqlite");

        $stm = $sqlite->prepare("SELECT count(*) as anz from USER WHERE id = :id");

        $stm->bindParam(":id", $user);

        $result = $stm->execute();

        $return = false;

        while ($res = $result->fetchArray(SQLITE3_ASSOC)) {
            $return = true;
            if($res['anz'] != 1){
                $return = false;
            }
        }

        return $return;

    }
}