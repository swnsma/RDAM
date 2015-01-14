<?php

include_once __DIR__ . '/connection.class.php';

class AuthDB {
    private $server_db;

    function __construct() {
        $this->server_db = Connection::conn_db();
    }

    public static function valid_server($server) {
        return preg_match('/^[a-z\.\d_\-]{1,80}$/', $server);
    }

    public static function valid_name($name) {
        return preg_match('/^[a-z\d_]{1,30}$/', $name);
    }

    public static function valid_user($user) {
        return preg_match('/^[a-z\d_]{1,30}$/', $user);
    }

    public static function valid_pass($pass) {
        //return preg_match('/^[a-zA-Z\$\@\#\%\d_\-]{4,30}$/', $pass);
        $l = strlen($pass);
        return $l >= 4 && $l <= 30;
    }

    public static function valid_port($port) {
        return $port > 0 && $port < 65535;
    }

    public function update_auth($id, $server, $name, $user, $pass, $port) {
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

    public function get_auth($id) {
        $request = $this->server_db->prepare('SELECT * FROM `auth` WHERE `id` = :id');
        $request->bindParam(':id', $id, PDO::PARAM_INT);
        if ($request->execute() && $request->rowCount() > 0) {
            return $request->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return null;
        }
    }

    function __destruct() {
        $this->server_db = null;
    }
}

?>