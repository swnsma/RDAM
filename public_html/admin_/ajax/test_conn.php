<?php

include_once  __DIR__ . '/../../include/connection.class.php';
include_once  __DIR__ . '/../../include/auth_db.class.php';

if (isset($_POST['server'])
    && isset($_POST['name'])
    && isset($_POST['user'])
    && isset($_POST['pass'])
    && isset($_POST['port'])) {

    $port = $_POST['port'];

    if (ctype_digit($port)) {
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
            if (Connection::test_conn_values_db($server, $name, $user, $pass, $port)) {
                print '{ "status": "success", "data": { "status": "success" } }';
            } else {
                print '{ "status": "success", "data": { "status": "error" } }';
            }
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