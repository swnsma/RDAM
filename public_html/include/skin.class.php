<?php

include_once  __DIR__ . '/connection.class.php';

class Skin {
    function __construct() {
        $this->server_db = Connection::conn_db();
    }

    public function get_list_skins() {
        $request = $this->server_db->query('SELECT `id`, `name`, `author`, `version`, `comment` FROM `templates`');
        if ($request) {
            return $request->fetchAll(PDO::FETCH_ASSOC);
        }
        return null;
    }

    public function del_skin($name) {

    }

    public function current_skin() {

    }

    public function save_skin($info) {
        $request = $this->server_db->prepare('INSERT INTO `templates` (`id`, `name`, `author`, `version`, `comment`, `filename`) VALUES (NULL, :name, :author, :version, :comment, :filename);');
        if ($request->execute(array(
                ':name' => $info->name,
                ':author' => $info->author,
                ':version' => $info->version,
                ':comment' => $info->comment,
                ':filename' => $info->filename
            ))) {
            return (int)$this->server_db->lastInsertId();
        } else {
            return null;
        }
    }

    public function select_skin($name) {

    }

    function __destruct() {
        $this->server_db = null;
    }
}

?>