<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 07.12.2017
 * Time: 21:53
 */

namespace Mediatrix\src;


class Login
{
    private $ldap;
    private $config = [

    ];

    public function __construct()
    {
        $this->ldap = new \Adldap\Adldap($this->config);
    }

    public function login($username, $passwd){

    }

}