<?php

include_once  __DIR__ . '/../../include/skin.class.php';
include_once __DIR__ . '/../../include/log.class.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    if (ctype_digit($id)) {
        $id = (int)$id;
        $log = new Log();


        $log = null;
    } else {
        header('HTTP/1.0 400 Bad Request');
        print '{ "status": "error", "error_message": "invalid values" }';
    }
} else {
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "parameters are missing" }';
}

?>