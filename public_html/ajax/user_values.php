<?php

/*
 * отримання production та consumption для кожного користувача
 */

include_once 'include/user_values.class.php';

header('Content-type: application/json; charset=utf-8');

if (isset($_GET['type']) && isset($_GET['id']) && isset($_GET['todt'])) {
    $type = $_GET['type'];
    $id = $_GET['id'];
    $to = $_GET['todt'];

    if (ctype_digit($id)) {

        date_default_timezone_set('Europe/London');

        if ($to == 'last') {
            $to = date('Y-m-d H:i');
        } else {
            if (!valid_date($to)) {
                header('HTTP/1.0 400 Bad Request');
                print '{ "status": "error", "error_message": "invalid values" }';
                exit();
            }
        }

        $id = (int)$id;

        $user = new UserValues();
        if($user->select_data($type, $id, $to)) {
            print '{ "status": "success", "id": ' . $id . ', "type": "' . $type . '", "data": ' . json_encode($user->get_data()) . ' }';
        } else {
            header('HTTP/1.0 400 Bad Request');
            print '{ "status": "error", "error_message": "try again later or or change it" }';
        }
        $user = null;
    } else {
        print '{ "status": "error", "error_message": "invalid values" }';
    }
} else {
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "parameters are missing" }';
}

function valid_date($date) {
    // example 2012-11-27 03:59
    $d = DateTime::createFromFormat('Y-m-d H:i', $date);
    return $d && $d->format('Y-m-d H:i') == $date;
}

?>