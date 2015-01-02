<?php

abstract class Upload {
    protected $file = null,
        $error = null,
        $max_size = 4194304; // 4 mb

    function __construct($files) {
        $this->file = $files;
    }

    public function check_file_error() {
        try {
            switch ($this->file['error']) {
                case UPLOAD_ERR_OK:
                    break;
                case UPLOAD_ERR_NO_FILE:
                    throw new RuntimeException('no file sent');
                case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    throw new RuntimeException('exceeded filesize limit');
                default:
                    throw new RuntimeException('unknown errors');
            }

            return true;
        } catch(RuntimeException $e) {
            $this->error = $e->getMessage();
            return false;
        }
    }

    public function check_size() {
        return $this->file['size'] > $this->max_size;
    }

    public function get_file() {
        return $this->file;
    }

    public function get_error() {
        return $this->error;
    }

    public function get_max_size() {
        return $this->max_size;
    }

    public function set_max_size($size) {
        $this->max_size = $size;
    }

    function __destruct() {}
}

?>