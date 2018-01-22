<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 30.12.2017
 * Time: 20:56
 */

namespace Mediatrix;


class Key
{
    private static $key = "y8MHaU+8NlT1Q4oJlmaPf4pt4U7nRM3aiN5EJwXiBTThfOSak6COvhmAuCuhSrTrT38hYNv4u5OpKYqN4RUJYQ==";

    /**
     * @return string
     */
    public static function getKey(): string
    {
        return self::$key;
    }


}