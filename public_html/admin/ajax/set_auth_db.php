<?php

include_once  __DIR__ . '/../../include/auth_db.class.php';
include_once  __DIR__ . '/../../include/log.class.php';

if (isset($_POST['id'])
    && isset($_POST['server'])
    && isset($_POST['name'])
    && isset($_POST['user'])
    && isset($_POST['pass'])
    && isset($_POST['port'])) {

    $id = $_POST['id'];
    $port = $_POST['port'];

    if (ctype_digit($id) && ctype_digit($port)) {
        $id = (int)$id;
        $port = (int)$port;

        $server = $_POST['server'];
        $name = $_POST['name'];
        $user = $_POST['user'];
        $pass = $_POST['pass'];

        if (AuthDB::valid_port($port)
            && AuthDB::valid_name($name)
            && AuthDB::valid_user($user)
            && AuthDB::valid_server($server)
            && AuthDB::valid_pass($pass)
        ) {
            $auth = new AuthDB();
            if ($auth->update_auth($id, $server, $name, $user, $pass, $port)) {
                print '{ "status": "success", "data": ' .
                    '{ "id": ' . $id . ', ' .
                    '"db_server": "' . $server . '", ' .
                    '"db_port": ' . $port . ', ' .
                    '"db_name": "' . $name . '", ' .
                    '"db_user": "' . $user . '", ' .
                    '"db_password": "' . $pass . '" } }';
            } else {
                header('HTTP/1.0 400 Bad Request');
                print '{ "status": "error", "error_message": "try again later or or change it" }';
            }
            $auth = null;
            exit();
        }
    }

    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "invalid values" }';
} else {
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "parameters are missing" }';
}

?>