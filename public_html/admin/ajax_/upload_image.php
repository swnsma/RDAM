<?php

include_once 'include/upload_image.class.php';
include_once 'include/log.class.php';

if (!isset($_POST['id']) || !isset($_FILES['photo']['error']) || is_array($_FILES['photo']['error'])) {
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "parameters are missing" }';
} else {
    $id = $_POST['id'];
    if (ctype_digit($id)) {
        $id = (int)$id;

        $upload = new UploadImage($_FILES['photo']);
        $log = new Log();
        if ($upload->check_file_error() && $upload->upload($id)) {
            $log->write('photo was changed to the user with id 1');
            print '{ "status": "success", "id": ' . $id . ', "photo": "' . $upload->get_upload_file_name() . '" }';
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