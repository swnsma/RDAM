<?php

include_once 'include/connection.class.php';

class UpdateUser extends Connection {
    private $result = null;

    function __construct() {
        parent::__construct();
    }

    public function update($id, $user_name, $city, $descr) {
        if ($user_name == null && $city == null && $descr == null) return false;

        $fields = array();
        if ($user_name != null) {
            array_push($fields, '`user` = :user_name');
        }
        if ($city != null) {
            array_push($fields, '`city` = :city');
        }
        if ($descr != null) {
            array_push($fields, '`descr` = :descr');
        }

        $result = $this->db->prepare('UPDATE `users` SET ' . implode(', ', $fields) . ' WHERE `id`= :id');
        $result->bindParam(':id', $id, PDO::PARAM_INT);

        if ($user_name != null) {
            $result->bindParam(':user_name', $user_name);
        }
        if ($city != null) {
            $result->bindParam(':city', $city);
        }
        if ($descr != null) {
            $result->bindParam(':descr', $descr);
        }

        return $result->execute();
    }

    public function select_info($id) {
        $this->result = $this->db->prepare('SELECT * FROM `users` WHERE `id` = :id');
        $this->result->bindParam(':id', $id, PDO::PARAM_INT);
        return $this->result->execute() && $this->result->rowCount() > 0;
    }

    public function get_data() {
        return $this->result->fetchAll(PDO::FETCH_ASSOC)[0];
    }

    function __destruct() {
        parent::__destruct();
    }
}

?>