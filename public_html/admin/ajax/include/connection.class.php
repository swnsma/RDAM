<?php

include_once '../../../conf/conf.php';

abstract class Connection {
    protected $db;

    function __construct() {
        try {
            $this->db = new PDO('mysql:host=' . DB_SERVER . ';dbname=' . DB_NAME, DB_USER, DB_PASSWORD,
                array(PDO::MYSQL_ATTR_LOCAL_INFILE => true));
            //$this->db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $this->db->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
        } catch(PDOException $e) {
            header('HTTP/1.0 500 Internal Server Error');
            exit();
        }
    }

    public function begin_transaction() {
        $this->db->beginTransaction();
    }

    public function commit() {
        $this->db->commit();
    }

    public function roll_back() {
        $this->db->rollBack();
    }

    function __destruct() {
        $this->db = null;
    }
}

?>