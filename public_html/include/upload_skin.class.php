<?php

include_once __DIR__ . '/upload.class.php';
include_once __DIR__ . '/skin.class.php';

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

    private function get_info_from_file($ext, $file) { //че-то я накрутил лишнего
        $descr = null;

        if ($ext == 'rar'
            && ($rar_file = rar_open($file))
            && (true == $entry = rar_entry_get($rar_file, 'description.json'))) {
            $fn =  '../../' . TMP_FOLDER . '/' . uniqid() . '.json';
            if ($entry->extract(false, $fn)) {
                $descr = $this->parse_descr(file_get_contents($fn));
                unlink($fn);
            }
            rar_close($rar_file);
        }

        if ($ext == 'zip') {
            $zip = new ZipArchive();
            if($zip->open($file) === true) {
                $descr = $this->parse_descr($zip->getFromName('description.json'));
            }
            $zip->close();
        }

        return $descr;
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

    private function parse_descr($descr) {
        $data = json_decode($descr);
        if (json_last_error() != JSON_ERROR_NONE) return null;

        if (isset($data->name)
            && isset($data->version)
            && isset($data->author)) {
            if (!isset($data->comment)) {
                $data->comment = null;
            }
            return $data;
        }
        return null;
    }

    public function upload() {
        try {
            if ($this->check_size()) {
                throw new RuntimeException('exceeded filesize limit');
            }

            $tmp_name = $this->file['tmp_name'];

            $info = new finfo(FILEINFO_MIME_TYPE);

            if ((!in_array($info->file($tmp_name), $this->mime_types)
                || (null === $ext = $this->get_type_file($tmp_name)))) {
                throw new RuntimeException('invalid file format');
            }

            $name = uniqid() . '.' . $ext;
            $path = '../../' . SKINS_FOLDER;

            $file = $path . '/' . $name;
            if (!move_uploaded_file($tmp_name, $file)) {
                throw new RuntimeException('failed to move uploaded file');
            }

            if (null === $descr = $this->get_info_from_file($ext, $file)) {
                unlink($file);
                throw new RuntimeException('failed to read the file description');
            }
            $descr->filename = $name;

            $skin = new Skin();
            if (null === $id = $skin->save_skin($descr)) {
                unlink($file);
                throw new RuntimeException('failed to save the file template');
            }
            $skin = null;

            $descr->id = $id;

            $this->info = $descr;

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