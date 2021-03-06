<?php

include_once  __DIR__ . '/../../include/select_type_db.class.php';
include_once  __DIR__ . '/../../include/log.class.php';

if (isset($_POST['id']) && isset($_POST['type'])) {
    $id = $_POST['id'];
    $type = $_POST['type'];
    if (ctype_digit($id) && ctype_digit($type)) {
        $type = (int)$type;
        if ($type !== 0 && $type !== 1) {
            header('HTTP/1.0 400 Bad Request');
            print '{ "status": "error", "error_message": "invalid values" }';
            exit();
        }

        $id = (int)$id;

        $st = new SelectTypeDB();
        $log = new Log();

        if ($st->select_type($id, $type)) {
            $log->write('unable to select the type of database for user with id ' . $id);
            print '{ "status": "success", "data": { "id": ' . $id . ', "type_db": ' . $type . '} }';
        } else {
            $log->write('unable to select the type of database for user with id ' . $id , LOGTYPES::CRITICAL);
            header('HTTP/1.0 400 Bad Request');
            print '{ "status": "error", "error_message": "try again later or or change it" }';
        }

        $st = null;
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