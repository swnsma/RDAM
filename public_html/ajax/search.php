<?php

include_once 'include/search.class.php';

if (isset($_GET['user_name'])) {
    $user_name = $_GET['user_name'];
    $len_user_name = strlen($user_name);
    if ($len_user_name <= 25 && $len_user_name >= 5) {
        if (isset($_GET['fields'])) {
            $fields = array_unique(explode(',', $_GET['fields']));
        } else {
            $fields = null;
        }

        $search = new Search();
        if ($search->select_list($fields, $user_name)) {
            print '{ "status": "success", "data": ' . json_encode($search->get_data()) . ' }';
        } else {
            header('HTTP/1.0 400 Bad Request');
            print '{ "status": "error", "error_message": "try again later or or change it" }';
        }

        $search = null;
    } else {
        header('HTTP/1.0 400 Bad Request');
        print '{ "status": "error", "error_message": "invalid length" }';
    }
} else {
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "parameters are missing" }';
}

?>