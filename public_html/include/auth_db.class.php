<?php

class AuthDB {
    function __construct() {}

    public static function valid_server($server) {
        return preg_match('/^[a-z\d_\-]{7,30}$/', $server);
    }

    public static function valid_name($name) {
        return preg_match('/^[a-z\d_]{4,30}$/', $name);
    }

    public static function valid_user($user) {
        return preg_match('/^[a-z\d_]{4,30}$/', $user);
    }

    public static function valid_pass($pass) {
        return preg_match('/^[a-z\d_\-]{4,30}$/', $pass);
    }

    public static function valid_port($port) {
        return $port > 0 && $port < 65000;
    }

    function __destruct() {}
}

?>