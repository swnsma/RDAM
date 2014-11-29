<?php

include_once 'include/user.class.php';

header('Content-type: application/json; charset=utf-8');

date_default_timezone_set('Europe/London');

if (isset($_GET['type']) && isset($_GET['id']) && isset($_GET['from'])) {
    $type = $_GET['type'];
    $id = $_GET['id'];
    $from = $_GET['from'];

    if (ctype_digit($type) && ctype_digit($id) && valid_date($from)) {
        $type = (int)$type;
        $id = (int)$id;

        /*
        * type:
        *  1 - day
        *  2 - month
        *  3 - years
        */

        $user = new User();
        if($user->select_data($type, $id, $from)) {
            $user->print_data();
        } else {
            header("HTTP/1.0 400 Bad Request");
            //http_response_code(400);
        }
        $user = null;
    } else {
        header("HTTP/1.0 400 Bad Request");
        //http_response_code(400);
    }
} else {
    header("HTTP/1.0 400 Bad Request");
    //http_response_code(400); //Bad Request
}

function valid_date($date) {
    // example 2012-11-27 03:59
    $d = DateTime::createFromFormat('Y-m-d H:i', $date);
    return $d && $d->format('Y-m-d H:i') == $date;
}

?>