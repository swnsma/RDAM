<?php

include_once 'connection.class.php';

abstract class Users extends Connection {
    protected  $result;

    function __construct() {
        parent::__construct();
    }

    public function get_data() {
        return $this->result->fetchAll(PDO::FETCH_ASSOC);
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

    protected function get_tables_exists($ids) {
        $id = '\'user_' . implode('\', \'user_', $ids) . '\'';
        $request = $this->db->prepare('SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_NAME IN (' . $id . ') AND TABLE_SCHEMA=\'' . DB_NAME . '\'');
        if ($request->execute()) {
            return $request->fetchAll(PDO::FETCH_COLUMN, 0);
        } else {
            return null;
        }
    }

    function __destruct() {
        parent::__destruct();
    }
}

?>