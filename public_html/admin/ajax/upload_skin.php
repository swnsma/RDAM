<?php

include_once  __DIR__ . '/../../include/upload_skin.class.php';
include_once  __DIR__ . '/../../include/log.class.php';

if (!isset($_FILES['skin']['error']) || is_array($_FILES['skin']['error'])) {
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "parameters are missing" }';
} else {
    $upload = new UploadSkin($_FILES['skin']);
    $log = new Log();
    if ($upload->check_file_error() && $upload->upload()) {
        $log->write('');
        print '{ "status": "success", "data": ' . json_encode($upload->get_info()) . ' }';
    } else {
        $log->write($upload->get_error(), LOGTYPES::CRITICAL);
        header('HTTP/1.0 400 Bad Request');
        print '{ "status": "error", "error_message": "' . $upload->get_error() . '" }';
    }
}

?>