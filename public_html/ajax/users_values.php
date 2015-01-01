<?php

include_once 'include/users_values.class.php';

if (isset($_GET['id']) && isset($_GET['todt'])) {
    $to = $_GET['todt'];

    date_default_timezone_set(TIME_ZONE);

    if ($to == 'last') {
        $to = date('Y-m-d H:i');
    } else {
        if (!valid_date($to)) {
            header('HTTP/1.0 400 Bad Request');
            print '{ "status": "error", "error_message": "invalid values" }';
            exit();
        }
    }

    $limit = null;
    if (isset($_GET['type'])) {
        $type = $_GET['type'];
        if (isset($_GET['limit']) && ctype_digit($_GET['limit'])) {
            $limit = (int)$_GET['limit'];
        }
    } else {
        $type = null;
    }

    if (isset($_GET['field'])) {
        $field = $_GET['field'];
    } else {
        $field = null;
    }

    $ids = array_unique(array_map('intval',  explode(',', $_GET['id'])));

    $users = new UserValues();
    if($users->select_data($ids, $to, $type, $field, $limit)) {
        print '{ "status": "success", "data": ' . json_encode($users->get_data()) . ' }';
    } else {
        header('HTTP/1.0 400 Bad Request');
        print '{ "status": "error", "error_message": "try again later or or change it" }';
    }
    $users = null;

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