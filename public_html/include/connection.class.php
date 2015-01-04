<?php

include_once __DIR__ . '/../../conf/conf.php';
include_once __DIR__ . '/../../conf/conf_values.php';

class Connection {
    function __construct() {}

    public static function conn_db() {
        try {
            $db = new PDO('mysql:host=' . DB_SERVER . ';dbname=' . DB_NAME, DB_USER, DB_PASSWORD);
            $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            return $db;
        } catch(PDOException $e) {
            header('HTTP/1.0 500 Internal Server Error');
            exit();
        }
    }

    public static function conn_values_db($server = DB_SERVER_V,
                                          $name = DB_NAME_V,
                                          $user = DB_USER_V,
                                          $pass = DB_PASSWORD_V,
                                          $port = 3306) {
        try {
            $db = new PDO('mysql:host=' . $server . ';port=' . $port . ';dbname=' . $name, $user, $pass);
            $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            return $db;
        } catch(PDOException $e) {
            header('HTTP/1.0 500 Internal Server Error');
            exit();
        }
    }

    public static function conn_values_db_infile() {
        try {
            $db = new PDO('mysql:host=' . DB_SERVER_V . ';dbname=' . DB_NAME_V, DB_USER_V, DB_PASSWORD_V,
                array(PDO::MYSQL_ATTR_LOCAL_INFILE => true));
            $db->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
            return $db;
        } catch(PDOException $e) {
            header('HTTP/1.0 500 Internal Server Error');
            exit();
        }
    }

    public static function test_conn_values_db(
                            $server = DB_SERVER_V,
                            $name = DB_NAME_V,
                            $user = DB_USER_V,
                            $pass = DB_PASSWORD_V,
                            $port = 3306) {
        try {
            new PDO('mysql:host=' . $server . ';port=' . $port . ';dbname=' . $name, $user, $pass,
                array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
            return true;
        } catch(PDOException $e) {
            return false;
        }
    }

    function __destruct() {}
}

?>