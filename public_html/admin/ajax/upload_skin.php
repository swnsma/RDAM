<?php

include_once 'include/upload_skin.class.php';
include_once 'include/log.class.php';

if (!isset($_FILES['skin']['error']) || is_array($_FILES['skin']['error'])) {
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "parameters are missing" }';
} else {
    $upload = new UploadData($_FILES['data']);
    $log = new Log();
    if ($upload->check_file_error() && $upload->upload($id, $ignore_first_line)) {
        $log->write( $upload->get_count_rows() . ' records have been added to the user with id ' . $id);
        print '{ "status": "success", "data": { "id": ' . $id . ', "insert_rows": ' . $upload->get_count_rows() . ' } }';
    } else {
        $log->write($upload->get_error(), LOGTYPES::CRITICAL);
        header('HTTP/1.0 400 Bad Request');
        print '{ "status": "error", "error_message": "' . $upload->get_error() . '" }';
    }
}

?>