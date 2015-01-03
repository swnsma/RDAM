<?php

include_once __DIR__ . '/connection.class.php';
include_once __DIR__ . '/upload.class.php';

class InfoPhoto {
    private $server_db;

    function __construct() {
        $this->server_db = Connection::conn_db();
    }

    public function get_previous_file_name($id) {
        $result = $this->server_db->prepare('SELECT `photo` FROM `users` WHERE `id` = :id');
        $result->bindParam(':id', $id, PDO::PARAM_INT);
        if ($result->execute() && $result->rowCount() > 0) {
            return $result->fetchAll(PDO::FETCH_ASSOC)[0]['photo'];
        }
        return false;
    }

    public function set_current_file_name($id, $filename) {
        $result = $this->server_db->prepare('UPDATE `users` SET `photo` = :photo WHERE `id` = :id');
        $result->bindParam(':id', $id, PDO::PARAM_INT);
        $result->bindParam(':photo', $filename);
        return $result->execute();
    }

    function __destruct() {
        $this->server_db = null;
    }
}

class UploadImage extends Upload {
    private $upload_file_name = null;
    private $quality = 80;

    private $mime_types = array(
        'jpg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif'
    );

    function __construct($files) {
        parent::__construct($files);
    }

    private function compress($source, $result, $type) {
        $image = null;
        if ($type == 'jpg')
            $image = imagecreatefromjpeg($source);
        elseif ($type == 'gif')
            $image = imagecreatefromgif($source);
        elseif ($type == 'png')
            $image = imagecreatefrompng($source);
        imagejpeg($image, $result, $this->quality);
    }

    public function get_quality() {
        return $this->quality;
    }

    public function set_quality($size) {
        $this->quality = $size;
    }

    public function get_mime_types() {
        return $this->mime_types;
    }

    public function upload($id) {
        try {
            if ($this->check_size()) {
                throw new RuntimeException('exceeded filesize limit');
            }

            $tmp_name = $this->file['tmp_name'];

            $info = new finfo(FILEINFO_MIME_TYPE);
            if (false === $ext = array_search($info->file($tmp_name), $this->mime_types, true)) {
                throw new RuntimeException('invalid file format');
            }

            $db = new InfoPhoto();

            $previous_file_name = $db->get_previous_file_name($id);
            if ($previous_file_name === false) {
                throw new RuntimeException('it was not possible to obtain information about the current picture');
            }

            $file = uniqid() . '.' . $ext;
            $folder = '../../' . IMAGES_FOLDER;

            $this->compress($tmp_name, $tmp_name, $ext);

            if (!move_uploaded_file($tmp_name, $folder . $file)) {
                throw new RuntimeException('failed to move uploaded file');
            }

            if (!$db->set_current_file_name($id, $file)) {
                unlink($folder . $file);
                throw new RuntimeException('failed to update the information about the current photo.');
            }

            $db = null;

            if ($previous_file_name !== null) {
                unlink($folder . $previous_file_name);
            }

            $this->upload_file_name = $file;
            return true;
        } catch(RuntimeException $e) {
            $this->error = $e->getMessage();
            return false;
        }
    }

    public function get_upload_file_name() {
        return $this->upload_file_name;
    }

    function __destruct() {
        parent::__destruct();
    }
}

?>