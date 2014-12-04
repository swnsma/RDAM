<?php

include_once 'connection.class.php';

abstract class Users extends Connection {
    protected  $result;

    function __construct() {
        parent::__construct();
    }

    public function print_list() {
		print json_encode($this->result->fetchAll(PDO::FETCH_ASSOC));
    }

    protected function check_field($fields) { //change
        $fields_db = array('city', 'rating');
        foreach ($fields as $field) {
            if (!in_array($field, $fields_db))
                return false;
        }
        return true;
    }

    protected function check_user_exists($id) { //change
        $request = $this->db->prepare('SELECT `id` FROM `users` WHERE `id` = :id');
        $request->bindParam(':id', $id);
        $result = $request->execute();
        if ($result && $request->rowCount() > 0)
            return true;
        return false;
    }


    function __destruct() {
        parent::__destruct();
    }
}

?>