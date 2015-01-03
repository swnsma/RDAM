<?php

include_once __DIR__ . '/connection.class.php';
include_once __DIR__ . '/auth_db.class.php';

class SetAuthDB extends AuthDB {
    private $server_db;

    function __construct() {
        parent::__construct();
        $this->server_db = Connection::conn_db();
    }

    function update_auth($id, $server, $name, $user, $pass, $port) {
        $rt = <<<HERE
            UPDATE `auth` SET
                `db_server` = :server,
                `db_port` = :port,
                `db_name` = :name,
                `db_user` = :user,
                `db_password` = :pass
                WHERE `id`= :id
HERE;
        return $this->server_db->prepare($rt)->execute(array(
            ':id' => $id,
            ':server' => $server,
            ':port' => $port,
            ':name' => $name,
            ':user' => $user,
            ':pass' => $pass
        ));
    }

    function __destruct() {
        parent::__destruct();
        $this->server_db = null;
    }
}


?>