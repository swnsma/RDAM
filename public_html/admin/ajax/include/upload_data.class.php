<?php

include_once 'include/upload.class.php';
include_once 'include/connection.class.php';

class SaveData extends Connection {
    private $count_row = 0;

    function __construct() {
        parent::__construct();
    }

    public function get_count_insert_rows() {
        return $this->count_row;
    }

    public function check_exists_user($id) {
        $result = $this->db->prepare('SELECT `id` from `users` where id = :id');
        $result->bindParam(':id', $id, PDO::PARAM_INT);
        return $result->execute() && $result->rowCount() > 0;
    }

    public function save($id, $file, $ignore_first_line = true) { // i don't know about the existence of procedures
        $temp_name = uniqid();
        $request =<<<HERE
            DROP TABLE IF EXISTS `$temp_name`;
HERE;
        if (!$this->db->query($request)) return false;

        $request =<<<HERE
            CREATE TABLE `$temp_name` (
                `readingid` VARCHAR(5) NOT NULL,
                `toDT` VARCHAR(20) NOT NULL,
                `production` VARCHAR(20) NOT NULL,
                `consumption` VARCHAR(20) NOT NULL
            ) ENGINE=MEMORY DEFAULT CHARSET=utf8;
HERE;

        if (!$this->db->query($request)) return false;

        $file = str_replace('\\', '\\\\', $file);

        $ignore = '';
        if ($ignore_first_line)
            $ignore = 'IGNORE 1 LINES';

        $request =<<<HERE
            LOAD DATA LOCAL INFILE '$file'
                INTO TABLE `$temp_name`
                FIELDS TERMINATED BY ';'
	            ENCLOSED BY '"'
                LINES TERMINATED BY '\n'
                $ignore
                (readingid, toDT, production, consumption);
HERE;

        if (!$this->db->query($request)) return false;

        $request =<<<HERE
            INSERT INTO `user_$id` (
	            readingid, toDT, production, consumption
            )  SELECT
                NULL,
	            STR_TO_DATE(toDT, '%e.%c.%Y %H:%i'),
	            CONVERT( REPLACE(production, ',', '.'), DECIMAL(10, 2) ),
                CONVERT( REPLACE(consumption, ',', '.'), DECIMAL(10, 2) )
            FROM `$temp_name`;
HERE;
        $result = $this->db->query($request);
        if (!$result) return false;
        $this->count_row = $result->rowCount();

        $request =<<<HERE
            DROP TABLE `$temp_name`;
HERE;
        $this->db->query($request);

        return true;
    }

    function __destruct() {
        parent::__destruct();
    }
}

class UploadData extends Upload {
    private $count_rows = 0;

    function __construct($files) {
        parent::__construct($files);
    }

    public function get_count_rows() {
        return $this->count_rows;
    }

    public function upload($id, $ignore_first_line = true) {
        try {
            if ($this->check_size()) {
                throw new RuntimeException('exceeded filesize limit');
            }

            $tmp_name = $this->file['tmp_name'];

            $info = new finfo(FILEINFO_MIME_TYPE);
            if ($info->file($tmp_name) != 'text/plain') {
                throw new RuntimeException('invalid file format');
            }

            $file = '../../' . TMP_FOLDER . uniqid() . '-' . $id . '.tmp';

            $save_data = new SaveData();

            if (!$save_data->check_exists_user($id)) {
                throw new RuntimeException('invalid user');
            }

            if (!move_uploaded_file($tmp_name, $file)) {
                throw new RuntimeException('failed to move uploaded file');
            }

            if (!$save_data->save($id, $file, $ignore_first_line)) {
                unlink($file);
                throw new RuntimeException('failed to load data');
            }

            $this->count_rows = $save_data->get_count_insert_rows();

            $save_data = null;

            if (!unlink($file)) {
                throw new RuntimeException('failed to remove the temporary file ' . $file . 'values');
            }

            return true;
        } catch(RuntimeException $e) {
            $this->error = $e->getMessage();
            return false;
        }
    }

    function __destruct() {
        parent::__destruct();
    }
}

?>