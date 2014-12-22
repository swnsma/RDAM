<?php

include_once 'include/users.class.php';

class UsersInfo extends Users {

    function __construct() {
        parent::__construct();
    }

    public function select_list($fields = null, $form_id = 0) {
        if ($fields == null) {
            $column = '';
        } else {
            if ($this->check_field($fields)) {
                $column = ', `' . implode('`, `', $fields) . '` ';
            } else {
                return false;
            }
        }
        $this->result = $this->db->prepare('SELECT `id`, `user`' . $column . 'FROM `users` WHERE `id` >= :id LIMIT 10');
        $this->result->bindParam(':id', $form_id);
        return $this->result->execute();
    }

    function __destruct() {
        parent::__destruct();
    }
}

?>