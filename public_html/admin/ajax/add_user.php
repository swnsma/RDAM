<?php

include_once __DIR__ . '/../../include/add_user.class.php';
include_once __DIR__ . '/../../include/log.class.php';

if (isset($_POST['user_name'])&& isset($_POST['descr'])) {
    $user_name = full_trim($_POST['user_name']);
    $descr = full_trim($_POST['descr']);

    $lu = strlen($user_name);
    $ld = strlen($descr);
    if (($lu >= 1 && $lu <= 100)
        && $ld <= 1000) {

        $user = new AddUser();
        $log = new Log();

        if ($user->add($user_name, "", $descr)) {
            $log->write('added a new user ' . $user_name);
            print '{ "status": "success", "data": { "id": ' . $user->get_id() . ' } }';
        } else {
            $log->write('failed to add a new user', LOGTYPES::CRITICAL);
            header('HTTP/1.0 400 Bad Request');
            print '{ "status": "error", "error_message": "' . $user->get_error() . '" }';
        }

        $log = null;
        $user = null;

    } else {
        header('HTTP/1.0 400 Bad Request');
        print '{ "status": "error", "error_message": "invalid values" }';
    }

} else {
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "parameters are missing" }';
}

function full_trim($str) {
    return trim(preg_replace('/\s{2,}/', ' ', $str));
}

?>