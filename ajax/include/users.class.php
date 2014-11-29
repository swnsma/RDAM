<?php

include 'connection.class.php';

class Users extends Connection {
    private $result;

    function __construct() {
        parent::__construct();
    }

    public function print_list() {
		print json_encode($this->result->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE);
    }

    public function select_list() {
        $this->result = $this->db->query('SELECT * FROM `users`');
        return $this->result;
    }

    function __destruct() {
        parent::__destruct();
    }
}

?>