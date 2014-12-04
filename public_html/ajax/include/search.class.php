<?php

include_once 'include/users.class.php';

class Search extends Users {

    function __construct() {
        parent::__construct();
    }

    public function select_list($fields, $user_name) {
        if ($fields == null) {
            $column = '';
        } else {
            if ($this->check_field($fields)) {
                $column = ', `' . implode('`, `', $fields) . '` ';
            } else {
                return false;
            }
        }
        $this->result = $this->db->prepare('SELECT `id`, `user`' . $column . 'FROM `users` WHERE `user` LIKE :user LIMIT 10');
        $user_name = '%' . $user_name . '%';
        $this->result->bindParam(':user', $user_name);
        return $this->result->execute();
    }

    function __destruct() {
        parent::__destruct();
    }
}