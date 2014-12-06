<?php

/*
 * пошук користувачів
 */

include_once 'include/search.class.php';

header('Content-type: application/json; charset=utf-8');

if (isset($_GET['user_name'])) {
    $user_name = $_GET['user_name'];
    $len_user_name = strlen($user_name);
    if ($len_user_name <= 25 || $len_user_name > 3) {
        if (isset($_GET['fields'])) {
            $fields = explode(',', $_GET['fields']);
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