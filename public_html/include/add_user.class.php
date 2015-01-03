<?php

include_once  __DIR__ . '/connection.class.php';

class AddUser {
    private $id = null,
        $server_db,
        $values_db;

    function __construct() {
        $this->server_db = Connection::conn_db();
        $this->values_db = Connection::conn_values_db();
    }

    private function create_record_in_user($user_name, $city, $descr) {
        $result = $this->server_db->prepare('INSERT INTO `users` (`id`, `user`, `city`, `descr`, `photo`) VALUES (NULL, :user_name, :city, :descr, NULL)');
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
        return $this->values_db->query($request);
    }

    public function add($user_name, $city, $descr) {
        $this->server_db->beginTransaction();
        if ($this->create_record_in_user($user_name, $city, $descr)) {
            $this->id = $this->server_db->lastInsertId();
            if ($this->create_table_for_values()) {
                $this->server_db->commit();
                return true;
            } else {
                $this->server_db->rollBack();
                return false;
            }
        }
    }

    public function get_id() {
        return $this->id;
    }

    function __destruct() {
        $this->server_db = null;
        $this->values_db = null;
    }
}

?>