<?php

include_once '../../conf/conf.php';

abstract class Connection {
    protected $db;

    function __construct() {
        $this->db = new PDO('mysql:host=' . DB_SERVER . ';dbname=' . DB_NAME, DB_USER, DB_PASSWORD);
        $this->db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    }

    function __destruct() {
        $this->db = null;
    }
}

?>