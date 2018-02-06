<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 06.02.2018
 * Time: 17:57
 */
namespace Mediatrix;

require __DIR__ . '/../vendor/autoload.php';

$jwt = $_POST['jwt'];

$userId = JWT::decode($jwt, base64_decode(Key::getKey()), array("HS256"))->data->userName;

$sqlite = new \SQLite3("../../sqlite/db.sqlite");

$stm = $sqlite->prepare("UPDATE usert SET isextendet = :ext where id = :id;");

$stm->bindParam(':id', $userId);

if(isset($_POST['ex'])){

    $stm->bindValue(':ext', true);


}else if (isset($_POST['base'])){
    $stm->bindValue(':ext', false);
}

$stm->execute();