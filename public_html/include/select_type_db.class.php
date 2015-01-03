<?php

include_once __DIR__ . '/connection.class.php';

class SelectTypeDB {
    private $server_db;

    function __construct() {
        $this->server_db = Connection::conn_db();
    }

    public function select_type($id, $type) {
        $request = $this->server_db->prepare('UPDATE `users` SET `type_db` = :type WHERE `id`= :id');
        $request->bindParam(':type', $type, PDO::PARAM_INT);
        $request->bindParam(':id', $id, PDO::PARAM_INT);
        return $request->execute() && $request->rowCount() > 0;
    }

    function __destruct() {
        $this->server_db = null;
    }
}

?>