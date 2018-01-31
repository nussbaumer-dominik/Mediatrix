<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 30.01.2018
 * Time: 13:22
 */
namespace Mediatrix;

require __DIR__ . '/../vendor/autoload.php';

Preset::delete($_POST['id'],$_POST['jwt']);