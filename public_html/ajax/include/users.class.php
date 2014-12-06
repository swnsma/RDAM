<?php

include_once 'connection.class.php';

abstract class Users extends Connection {
    protected  $result;

    function __construct() {
        parent::__construct();
    }

    public function print_list() {
        print '{ "status": "success", "data": ' . json_encode($this->result->fetchAll(PDO::FETCH_ASSOC)) . ' }';
    }

    protected function check_field($fields) { //change
        $fields_db = array('city', 'rating');
        foreach ($fields as $field) {
            if (!in_array($field, $fields_db))
                return false;
        }
        return true;
    }

    protected function check_user_exists($id) {
        $request = $this->db->prepare('SHOW TABLES LIKE \'user_' . $id . '\'');
        return $request->execute() && $request->rowCount() > 0;
    }


    function __destruct() {
        parent::__destruct();
    }
}

?>