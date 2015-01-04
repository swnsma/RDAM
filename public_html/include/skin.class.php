<?php

include_once  __DIR__ . '/connection.class.php';

class Skin {
    private $error = null;

    function __construct() {
        $this->server_db = Connection::conn_db();
    }

    public function get_list_skins() {
        $request = $this->server_db->query('SELECT `id`, `name`, `author`, `version`, `comment`, `active` FROM `templates`');
        if ($request) {
            return $request->fetchAll(PDO::FETCH_ASSOC);
        }
        return null;
    }

    private function get_filename($id) {
        $r = $this->server_db->prepare('SELECT `filename` FROM `templates` WHERE `id` = :id');
        $r->bindParam(':id', $id, PDO::PARAM_INT);
        if ($r->execute() && $r->rowCount() === 1) {
            return $r->fetchAll(PDO::FETCH_NUM)[0][0];
        }
        return null;
    }

    public function del_skin($id) {
        $this->server_db->beginTransaction();
        try {
            if ($id === 1) throw new RuntimeException('cannot delete the default template');

            if (null !== $curr_id = $this->current_skin()) {
                if ($curr_id === $id) throw new RuntimeException('active template cannot be removed');

                if (null !== $filename = $this->get_filename($id)) {
                    $r = $this->server_db->prepare('DELETE FROM `templates` WHERE `id` = :id');
                    $r->bindParam(':id', $id, PDO::PARAM_INT);
                    if (!$r->execute() || !unlink('../../' . SKINS_FOLDER . '/' . $filename)) {
                        throw new RuntimeException('failed to remove the template');
                    }
                } else {
                    throw new RuntimeException('it was not possible to obtain data on the requested template');
                }
            } else {
                throw new RuntimeException('failed to get the current template');
            }

            $this->server_db->commit();
            return true;
        } catch(RuntimeException $e) {
            $this->server_db->rollBack();
            $this->error = $e->getMessage();
            return false;
        }
    }

    private function current_skin() {
        $r = $this->server_db->query('SELECT `id` FROM `templates` WHERE `active` = 1');
        if ($r && $r->rowCount() === 1) {
            return $r->fetchAll(PDO::FETCH_NUM)[0][0];
        }
        return null;
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
        }
        return null;
    }

    public function select_skin($id) {
        $this->server_db->beginTransaction();
        try {
            if (null !== $curr_id = $this->current_skin()) {
                if ($curr_id === $id) throw new RuntimeException('this template already active');

            } else {
                throw new RuntimeException('failed to get the current template');
            }
            $this->server_db->commit();
            return true;
        } catch(RuntimeException $e) {
            $this->server_db->rollBack();
            $this->error = $e->getMessage();
            return false;
        }
    }

    public function get_error() {
        return $this->error;
    }

    function __destruct() {
        $this->server_db = null;
    }
}

?>