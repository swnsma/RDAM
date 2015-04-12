<?php

include_once  __DIR__ . '/../../include/skin.class.php';
include_once __DIR__ . '/../../include/log.class.php';

if (isset($_POST['id'])) {
    $id = $_POST['id'];
    if (ctype_digit($id)) {
        $id = (int)$id;

        $log = new Log();
        $skin = new Skin();

        if ($skin->del_skin($id)) {
            $log->write('the template with id ' . $id . ' has been removed', LOGTYPES::WARNING);
            print '{ "status": "success", "data": { "id": '. $id . '} }';
        } else {
            $log->write('the template with id ' . $id . ' has not been removed', LOGTYPES::CRITICAL);
            header('HTTP/1.0 400 Bad Request');
            print '{ "status": "error", "error_message": "' . $skin->get_error() . '" }';
        }
        $skin = null;
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