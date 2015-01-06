<?php

include_once  __DIR__ . '/../../include/update_user.class.php';
include_once  __DIR__ . '/../../include/log.class.php';

if (isset($_POST['id'])) {
    $id = $_POST['id'];
    if (ctype_digit($id)) {
        $id = (int)$id;

        $user_name = null;
        $city = null;
        $descr = null;

        if (isset($_POST['user_name'])) {
            $user_name = full_trim($_POST['user_name']);
            if (!preg_match('/^[\p{L}\d \.\'\-\:\,\.\?\!]{1,25}$/', $user_name)) exit_ttwp();
        }

        if (isset($_POST['city'])) {
            $city = full_trim($_POST['city']);
            if (!preg_match('/^[\p{L} \-]{5,25}$/', $city)) exit_ttwp();
        }

        if (isset($_POST['descr'])) {
            $descr = full_trim($_POST['descr']);
            if (!preg_match('/^[\p{L} \(\)\'\"\d\-]{0,300}$/m', $descr)) exit_ttwp();
        }

        $user = new UpdateUser();
        $log = new LOG();

        if ($user->update($id, $user_name, $city, $descr)) {
            $log->write('data about the user with id = ' . $id .' has been updated');
            if ($user->select_info($id)) {
                print '{ "status": "success", "data": ' . json_encode($user->get_data()) . ' }';
            } else {
                $log->write('it was not possible to obtain data after a successful update', LOGTYPES::ERROR);
                header('HTTP/1.0 400 Bad Request');
                print '{ "status": "error", "error_message": "try again later or or change it" }';
            }
        } else {
            $log->write('failed to update the data about user with id ' . $id, LOGTYPES::CRITICAL);
            header('HTTP/1.0 400 Bad Request');
            print '{ "status": "error", "error_message": "try again later or or change it" }';
        }

        $user = null;
        $log = null;

    } else {
        exit_ttwp();
    }

} else {
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "parameters are missing" }';
}

function full_trim($str) {
    return trim(preg_replace('/\s{2,}/', ' ', $str));
}

function exit_ttwp() { //exit through the wrong parameters
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "invalid values" }';
    exit();
}

?>