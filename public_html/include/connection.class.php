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

    public static function conn_values_db() {
        try {
            $db = new PDO('mysql:host=' . DB_SERVER_V . ';dbname=' . DB_NAME_V, DB_USER_V, DB_PASSWORD_V);
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

    function __destruct() {}
}

?>