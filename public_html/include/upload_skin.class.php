<?php

include_once __DIR__ . '/upload.class.php';

class UploadSkin extends Upload {
    private $info = null,
        $mime_types = array(
            'application/x-rar-compressed',
            'application/zip',
            'application/x-rar',
            'application/octet-stream'
        );

    function __construct($files) {
        parent::__construct($files);
    }

    private function get_info_from_file($ext, $file) {
        if ($ext == 'rar') {
            if(($rar_file = rar_open($file))
                || ($entry = rar_entry_get($rar_file, 'descr.json'))) {
                return null;
            }
            print 124567890;
        } else {
            return null;
        }
    }

    private function get_type_file($file) {
        $bytes = file_get_contents($file, FALSE, NULL, 0, 7);
        if (bin2hex($bytes) == '526172211a0700') {
            return 'rar';
        } else if (substr($bytes, 0, 2) == 'PK') {
            return 'zip';
        } else {
            return null;
        }
    }

    public function upload() {
        try {
            if ($this->check_size()) {
                throw new RuntimeException('exceeded filesize limit');
            }

            $tmp_name = $this->file['tmp_name'];

            $info = new finfo(FILEINFO_MIME_TYPE);
            print $info->file($tmp_name);
            if ((!in_array($info->file($tmp_name), $this->mime_types)
                || (null === $ext = $this->get_type_file($tmp_name)))) {
                throw new RuntimeException('invalid file format');
            }

            $name = basename($tmp_name);
            $path = '../../storage/skins/' . $name;
            if (is_dir($path)) {
                throw new RuntimeException('this template already exists');
            }

            if (!mkdir($path)) {
                throw new RuntimeException('unable to process template');
            }

            $file = $path . '/' . $name . '.' . $ext;
            if (!move_uploaded_file($tmp_name, $file)) {
                throw new RuntimeException('failed to move uploaded file');
            }

            if (null === $info = $this->get_info_from_file($ext, $file)) {
                unlink($file);
                rmdir($path);
                throw new RuntimeException('failed to read the file description');
            }

            return true;
        } catch(RuntimeException $e) {
            $this->error = $e->getMessage();
            return false;
        }
    }

    public function get_info() {
        return $this->info;
    }

    function __destruct() {
        parent::__destruct();
    }
}

?>