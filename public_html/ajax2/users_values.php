<?php

include_once 'include/users_values.class.php';

if (isset($_GET['type']) && isset($_GET['id']) && isset($_GET['todt'])) {
    $type = $_GET['type'];
    $to = $_GET['todt'];

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

    if (isset($_GET['field'])) {
        $field = $_GET['field'];
    } else {
        $field = null;
    }

    $ids = array_unique(array_map('intval',  explode(',', $_GET['id'])));

    $users = new UsersValues();
    if($users->select_data($ids, $type, $to, $field)) {
        print '{ "status": "success", "type": "' . $type . '", "data": ' . json_encode($users->get_data()) . ' }';
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