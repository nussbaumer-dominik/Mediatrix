<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 30.01.2018
 * Time: 13:22
 */
namespace Mediatrix;

require __DIR__ . '/../vendor/autoload.php';

preg_match('/\d+/',$_POST['id']) or die('{"success":false,"err":"id not valid"}');

preg_match('/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/', $_POST['jwt']) or die('{"success":false,"err":"jwt not valid"}');

Preset::delete($_POST['id'],$_POST['jwt']);