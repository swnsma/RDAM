<?php

include_once 'include/connection.class.php';

class AddUser extends Connection {
    private $id = null;

    function __construct() {
        parent::__construct();
    }

    private function create_record_in_user($user_name, $city, $descr) {
        $result = $this->db->prepare('INSERT INTO `users` (`id`, `user`, `city`, `descr`, `photo`) VALUES (NULL, :user_name, :city, :descr, NULL)');
        return $result->execute(array(
            ':user_name' => $user_name,
            ':city' => $city,
            ':descr' => $descr
        ));
    }

    private function create_table_for_values() {
        $id = $this->id;
        $request =<<<HERE
            CREATE TABLE IF NOT EXISTS `user_$id` (
                `readingid` INT(5) NOT NULL AUTO_INCREMENT,
                `toDT` DATETIME NOT NULL,
                `production` DOUBLE NOT NULL DEFAULT 0,
                `consumption` DOUBLE NOT NULL DEFAULT 0,
                PRIMARY KEY (`readingid`)
            ) ENGINE=MyISAM
HERE;
        return $this->db->query($request);
    }

    private function drop_user_record() {
        return $this->db->query('DELETE FROM `users` WHERE `id` = ' . $this->id);
    }

    public function add($user_name, $city, $descr) {
        if ($this->create_record_in_user($user_name, $city, $descr)) {
            $this->id = $this->db->lastInsertId();
            if ($this->create_table_for_values()) {
                return true;
            } else {
                $this->drop_user_record();
                return false;
            }
        }
    }

    public function get_id() {
        return $this->id;
    }

    function __destruct() {
        parent::__destruct();
    }
}

?>