<?php

include_once 'include/users.class.php';

class UserInfo extends Users {

    function __construct() {
        parent::__construct();
    }

    public function select_list($id, $fields = null) {
        if ($fields == null) {
            $column = '';
        } else {
            if ($this->check_field($fields)) {
                $column = ', `' . implode('`, `', $fields) . '` ';
            } else {
                return false;
            }
        }
        $this->result = $this->db->prepare('SELECT `id`, `user`' . $column . 'FROM `users` WHERE `id` = :id');
        $this->result->bindParam(':id', $id, PDO::PARAM_INT);
        return $this->result->execute() &&  $this->result->rowCount() > 0;
    }

    function __destruct() {
        parent::__destruct();
    }
}

?>