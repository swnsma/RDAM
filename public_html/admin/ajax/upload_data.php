<?php

include_once 'include/upload_data.class.php';
include_once 'include/log.class.php';

if (!isset($_POST['id']) || !isset($_FILES['data']['error']) || is_array($_FILES['data']['error'])) {
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "parameters are missing" }';
} else {
    $id = $_POST['id'];
    if (ctype_digit($id)) {
        $id = (int)$id;

        $ignore_first_line = true;
        if (isset($_POST['ignore']) && $_POST['ignore'] == 'false') {
            $ignore_first_line = false;
        }

        $upload = new UploadData($_FILES['data']);
        $log = new Log();
        if ($upload->check_file_error() && $upload->upload($id, $ignore_first_line)) {
            $log->write( $upload->get_count_rows() . ' records have been added to the user with id ' . $id);
            print '{ "status": "success", "id": ' . $id . ', "insert_rows": ' . $upload->get_count_rows() . ' }';
        } else {
            $log->write($upload->get_error(), LOGTYPES::CRITICAL);
            header('HTTP/1.0 400 Bad Request');
            print '{ "status": "error", "error_message": "' . $upload->get_error() . '" }';
        }
    } else {
        header('HTTP/1.0 400 Bad Request');
        print '{ "status": "error", "error_message": "invalid values" }';
    }
}

?>