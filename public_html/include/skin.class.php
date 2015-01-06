<?php

include_once  __DIR__ . '/connection.class.php';

error_reporting(0);

class Skin {
    private $error = null;

    function __construct() {
        $this->server_db = Connection::conn_db();
    }

    public function get_list_skins() {
        $request = $this->server_db->query('SELECT `id`, `name`, `author`, `version`, `comment`, `active`, `filename` FROM `templates`');
        if ($request) {
            return $request->fetchAll(PDO::FETCH_ASSOC);
        }
        return null;
    }

    private function get_filename($id) {
        $r = $this->server_db->prepare('SELECT `filename` FROM `templates` WHERE `id` = :id');
        $r->bindParam(':id', $id, PDO::PARAM_INT);
        if ($r->execute() && $r->rowCount() === 1) {
            $r = $r->fetchAll(PDO::FETCH_ASSOC);
            return $r;
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

    private function delete_dir($dir) {
        try {
            $it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
            $files = new RecursiveIteratorIterator($it,
                RecursiveIteratorIterator::CHILD_FIRST);
            foreach($files as $file) {
                if ($file->isDir()){
                    rmdir($file->getRealPath());
                } else {
                    unlink($file->getRealPath());
                }
            }
            rmdir($dir);
        } catch(Exception $e) {
            throw new RuntimeException('problem with delete file');
        }
    }


    private function current_skin() {
        $r = $this->server_db->query('SELECT `id` FROM `templates` WHERE `active` = 1');
        if ($r) {
            return $r->fetchAll();
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

    private function change_active_skin($from, $on) { //требует оптимизации, впрочем как и все
        $r1 = $this->server_db->prepare('UPDATE `templates` SET `active` = 1 WHERE `id`= :id');
        $r2 = $this->server_db->prepare('UPDATE `templates` SET `active` = 0 WHERE `id`= :id');
        $r1->bindParam(':id', $on, PDO::PARAM_INT);
        $r2->bindParam(':id', $from, PDO::PARAM_INT);
        return $r1->execute()
            && $r1->rowCount() > 0
            && $r2->execute()
            && $r2->rowCount() > 0;
    }

    private function get_extension($filename) {
        return substr(strrchr($filename, '.'), 1);
    }

    /*private function get_extension($filename) {
        return substr($filename, strrpos($filename, '.') + 1);
    }*/

    public function select_skin($id) {
        $this->server_db->beginTransaction();
        try {
            if (null !== $curr_id = $this->current_skin()) {
                $curr_id = $curr_id[0]['id'];
                if ($curr_id === $id) throw new RuntimeException('this template already active');

                //print_r($curr_id);

                if (null !== $filename = $this->get_filename($id)) {
                    $dir = '../../' . SITE_FOLDER;
                    $this->delete_dir($dir);
                    mkdir($dir);
                    //$filename = 'default.rar';
                    $this->change_active_skin($curr_id, $id);
                    $this->extract($filename[0]['filename'], $dir);
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

    public function get_error() {
        return $this->error;
    }

    private function extract($filename, $dir) {
        //$ext = $this->get_extension($filename);
        $ext = 'rar';
        //print $filename;
        $file = '../../' . SKINS_FOLDER . '/' . $filename;
        //print $ext . 93489439439;
        if ($ext == 'rar' && ($rar_file = rar_open($file))) {
            $list = rar_list($rar_file);
            foreach($list as $file) {
                //print $file;
                $file->extract($dir);
            }
            rar_close($rar_file);
            return true;
        }

        if ($ext == 'zip') {
            $zip_file = new ZipArchive;
            if ($zip_file->open($file) === true) {
                $zip_file->extractTo($dir);
                $zip_file->close();
                return true;
            }
        }

        return false;
    }

    function __destruct() {
        $this->server_db = null;
    }
}

?>