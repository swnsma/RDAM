<?php

include_once 'include/add_user.class.php';
include_once 'include/log.class.php';

/*print $_POST['city'] . 'eee';
print $_POST['user_name'] . 'eee';
print $_POST['descr'] . 'eee';*/

if (isset($_POST['user_name']) && isset($_POST['city']) && isset($_POST['descr'])) {
    $user_name = full_trim($_POST['user_name']);
    $city = full_trim($_POST['city']);
    $descr = full_trim($_POST['descr']);

    if (preg_match('/^[\p{L} \.\'\-]{5,25}$/', $user_name)
        && preg_match('/^[\p{L} \-]{5,25}$/', $city)
        && preg_match('/^[\p{L} \(\)\'\"\d\-]{30,300}$/m', $descr)) {

        $user = new AddUser();
        $log = new Log();

        if ($user->add($user_name, $city, $descr)) {
            $log->write('added a new user ' . $user_name);
            print '{ "status": "success", "data": { "id": ' . $user->get_id() . ' } }';
        } else {
            $log->write('failed to add a new user', LOGTYPES::CRITICAL);
            header('HTTP/1.0 400 Bad Request');
            print '{ "status": "error", "error_message": "try again later or or change it" }';
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