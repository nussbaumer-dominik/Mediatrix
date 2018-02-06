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

$sqlite = new \SQLite3("../../sqlite/db.sqlite") or die('{"success":false,"err":"Can not open SQL-Connection}');

$stm = $sqlite->prepare("INSERT INTO preset(json,user_id) VALUES (:json,:userId);");

$stm->bindParam('userId',$userId);

if(isset($_POST['ex'])){



}else if (isset($_POST['base'])){

}