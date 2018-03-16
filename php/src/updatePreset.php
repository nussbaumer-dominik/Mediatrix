<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 31.01.2018
 * Time: 16:02
 */
namespace Mediatrix;

require __DIR__ . '/../vendor/autoload.php';

preg_match('/\d+/',$_POST['id']) or die('{"success":false,"err":"id not valid"}');

preg_match('/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/', $_POST['jwt']) or die('{"success":false,"err":"jwt not valid"}');

preg_match('/^[0-9A-Za-z_-]+$/', $_POST['name']) or die('{"success":false,"err","name not valid"}');

json_decode($_POST['data']);
json_last_error() == JSON_ERROR_NONE or die('{"success":false,"err":"json not valid"}');

Preset::update($_POST['data'],$_POST['name'],$_POST['id'],$_POST['jwt']);