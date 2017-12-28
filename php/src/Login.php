<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 07.12.2017
 * Time: 21:53
 */

namespace Mediatrix;

//require __DIR__ . '/../vendor/autoload.php';

class Login
{
    private $ldap;
    private $config = [
        'default' => [
            'domain_controllers'    => ['10.0.0.209'],
            'base_dn'               => 'ou=Users,dc=htlw3r,dc=ac,dc=at',

            'use_tls'               => false
        ],
    ];

    public function __construct()
    {
        $this->ldap = new \Adldap\Adldap($this->config);
    }

    public function login($username, $password){

        try {

            // Connect to the provider you specified in your configuration.
            $provider = $this->ldap->connect('default');

            if ($provider->auth()->attempt($username, $password)) {
                echo ("Login success");
            } else {
                echo "Login false";
                //print_r($provider);
            }

        } catch (\Adldap\Auth\UsernameRequiredException $e) {
            echo ("error: ".$e->getMessage());
        } catch (\Adldap\Auth\PasswordRequiredException $e) {
            // The user didn't supply a password.
            echo ("error: ".$e->getMessage());
        }catch (\Adldap\Auth\BindException $e){
            echo ("error: ".$e->getMessage());
        }

    }

    /**
     * @return array
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * @param array $config
     */
    public function setConfig($config)
    {
        $this->config = $config;
    }


}

$l = new Login();

$l->login('3827','k?2Z=_3Q');
