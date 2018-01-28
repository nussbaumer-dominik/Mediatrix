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

$sqlite = new \SQLite3("../sqlite/db.sqlite");

$stm = $sqlite->prepare("INSERT INTO preset(json,user_id) VALUES (:json,:userId);");

