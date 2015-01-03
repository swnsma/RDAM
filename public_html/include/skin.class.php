<?php

include_once  __DIR__ . '/connection.class.php';

class Skin {
    function __construct() {
        $this->server_db = Connection::conn_db();
    }

    function get_list_skins() {

    }

    function del_skin($name) {

    }

    function save_skin($info) {
        $request = $this->server_db->prepare('INSERT INTO `rdam`.`templates` (`id`, `name`, `author`, `version`, `comment`, `filename`) VALUES (NULL, :name, :author, :version, :comment, :filename);');
        if ($request->execute(array(
                ':name' => $info->name,
                ':author' => $info->author,
                ':version' => $info->version,
                ':comment' => $info->comment,
                ':filename' => $info->filename
            ))) {
            return $this->server_db->lastInsertId();
        } else {
            return null;
        }
    }

    function select_skin($name) {

    }

    function __destruct() {
        $this->server_db = null;
    }
}

?>