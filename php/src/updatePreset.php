<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 31.01.2018
 * Time: 16:02
 */
namespace Mediatrix;

require __DIR__ . '/../vendor/autoload.php';

Preset::update($_POST['data'],$_POST['id'],$_POST['jwt']);