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

    if (ctype_digit($type) && ctype_digit($id)) {

        date_default_timezone_set('Europe/London');

        if ($to == 'last') {
            $to = date('Y-m-d H:i');
        } else {
            if (!valid_date($to)) {
                header('HTTP/1.0 400 Bad Request');
                exit();
            }
        }

        $type = (int)$type;
        $id = (int)$id;

        /*
        * type:
        *  1 - day
        *  2 - week
        *  3 - month
        */

        $user = new UserValues();
        if($user->select_data($type, $id, $to)) {
            $user->print_data();
        } else {
            header('HTTP/1.0 400 Bad Request');
        }
        $user = null;
    } else {
        header('HTTP/1.0 400 Bad Request');
    }
} else {
    header('HTTP/1.0 400 Bad Request');
}

function valid_date($date) {
    // example 2012-11-27 03:59
    $d = DateTime::createFromFormat('Y-m-d H:i', $date);
    return $d && $d->format('Y-m-d H:i') == $date;
}

?>