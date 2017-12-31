<?php
/**
 * Created by PhpStorm.
 * User: cleme
 * Date: 07.12.2017
 * Time: 21:53
 */

namespace Mediatrix;

require __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;

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
    private $key;

    public function __construct()
    {
        //$this->ldap = new \Adldap\Adldap($this->config);
        $this->key = base64_decode(Key::getKey());


    }

    public function login($username, $password){

        try {
            /*

            // Connect to the provider you specified in your configuration.
            $provider = $this->ldap->connect('default');

            if ($provider->auth()->attempt($username, $password)) {
                echo ("Login success");
            } else {
                echo "Login false";
                //print_r($provider);
            }

            */

            if(true){
                $data = [
                    'iat'  => time(),         // Issued at: time when the token was generated
                    'jti'  => base64_encode(random_bytes(32)),          // Json Token Id: an unique identifier for the token
                    'iss'  => "Mediatrix",       // Issuer
                    'nbf'  => time(),        // Not before
                    'exp'  => time()+120,           // Expire
                    'data' => [                  // Data related to the signer used
                        'userName' => $username, // User name
                    ]
                ];

                $jwt = JWT::encode($data, $this->key, 'HS512');

                $unencodedArray = ['jwt' => $jwt];
                echo json_encode($unencodedArray);

            }else{
                echo "Login false";
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
echo "test";
$l = new Login();

echo"test1";

$l->login('3827','k?2Z=_3Q');
