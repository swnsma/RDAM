<?php

/*
 * пошук користувачів
 */

include_once 'include/search.class.php';

header('Content-type: application/json; charset=utf-8');

if (isset($_GET['user_name'])) {
    $user_name = $_GET['user_name'];
    if (strlen($user_name) <= 25) {
        if (isset($_GET['fields'])) {
            $fields = explode(',', $_GET['fields']);
        } else {
            $fields = null;
        }

        $search = new Search();
        if ($search->select_list($fields, $user_name)) {
            $search->print_list();
        } else {
            header('HTTP/1.0 400 Bad Request');
        }

        $search = null;
    } else {
        header('HTTP/1.0 400 Bad Request');
    }
} else {
    header('HTTP/1.0 400 Bad Request');
}

?>