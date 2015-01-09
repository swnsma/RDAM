<?php

include_once __DIR__ . '/connection.class.php';

abstract class Users {
    protected $result,
        $server_db;

    function __construct() {
        $this->server_db = Connection::conn_db();
    }

    public function get_data() {
        return $this->result->fetchAll(PDO::FETCH_ASSOC);
    }

    protected function check_field($fields) { //change
        $fields_db = array('city', 'descr', 'photo', 'type_db');
        foreach ($fields as $field) {
            if (!in_array($field, $fields_db))
                return false;
        }
        return true;
    }

    function __destruct() {
        $this->server_db = null;
    }
}

?>