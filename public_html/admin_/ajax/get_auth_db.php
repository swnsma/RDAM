<?php

include_once  __DIR__ . '/../../include/auth_db.class.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    if (ctype_digit($id)) {
        $id = (int)$id;

        $auth = new AuthDB();

        if (null !== $data = $auth->get_auth($id)) {
            print '{ "status": "success", "data": ' . json_encode($data) . ' }';
        } else {
            header('HTTP/1.0 400 Bad Request');
            print '{ "status": "error", "error_message": "try again later or or change it" }';
        }

        $auth = null;
    } else {
        header('HTTP/1.0 400 Bad Request');
        print '{ "status": "error", "error_message": "invalid values" }';
    }
} else {
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "parameters are missing" }';
}

?>