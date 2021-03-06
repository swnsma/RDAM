<?php

include_once  __DIR__ . '/connection.class.php';

class AddUser {
    private $id = null,
        $server_db,
        $values_db,
        $error = null;

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
    public function delete_user($id){
        $this->server_db->beginTransaction();
        try{
        $result = $this->server_db->prepare('DELETE FROM `users` WHERE id = :id');
        $result ->execute(array(':id'=>$id));
        $result = $this->server_db->prepare('DELETE FROM `auth` WHERE id = :id');
        $result ->execute(array(':id'=>$id));
            $this->server_db->commit();
            $this->values_db->query("DROP TABLE IF EXISTS user_$id");
            return true;
        }
        catch(RuntimeException $e){
            $this->server_db->rollBack();
            $this->error = $e->getMessage();
            return false;
        }
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

    private function create_record_in_auth() {
        return $this->server_db->query('INSERT INTO `auth` (`id`) VALUES (NULL)');
    }

    public function add($user_name, $city, $descr) {
        $this->server_db->beginTransaction();
        try {
            if (!$this->create_record_in_user($user_name, $city, $descr)) {
                throw new RuntimeException('Username is already in use. Please try another one');
            }
            $this->id = $this->server_db->lastInsertId();
            if (!($this->create_record_in_auth() && $this->create_table_for_values())) {
                throw new RuntimeException('try again later or or change it');
            }

            $this->server_db->commit();
            return true;
        } catch(RuntimeException $e) {
            $this->server_db->rollBack();
            $this->error = $e->getMessage();
            return false;
        }
    }

    public function get_id() {
        return $this->id;
    }

    public function get_error() {
        return $this->error;
    }

    function __destruct() {
        $this->server_db = null;
        $this->values_db = null;
    }
}

?>