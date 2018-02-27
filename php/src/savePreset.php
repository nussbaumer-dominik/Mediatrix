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

json_decode($_POST['data']);
json_last_error() == JSON_ERROR_NONE or die('{"success":false,"err":"json not valid"}');

Preset::create($_POST['data'],$_POST['jwt']);