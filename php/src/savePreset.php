<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 28.01.2018
 * Time: 18:51
 */
namespace Mediatrix;

require __DIR__ . '/../vendor/autoload.php';

preg_match('/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/', $_POST['jwt']) or die('{"success":false,"err":"jwt not valid"}');

preg_match('/^[0-9A-Za-z_-]+$/', $_POST['name']) or die('{"success":false,"err","name not valid"}');

json_decode($_POST['conf']);
json_last_error() == JSON_ERROR_NONE or die('{"success":false,"err":"json not valid"}');

echo Preset::create($_POST['name'],$_POST['conf'],$_POST['jwt']);