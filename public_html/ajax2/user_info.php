<?php

include_once 'include/user_info.class.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    if (ctype_digit($id)) {
        if (isset($_GET['fields'])) {
            $fields = explode(',', $_GET['fields']);
        } else {
            $fields = null;
        }

        $user_info = new UserInfo();

        if ($user_info->select_list($id, $fields)) {
            print '{ "status": "success", "data": ' . json_encode($user_info->get_data()) . ' }';
        } else {
            header('HTTP/1.0 400 Bad Request');
            print '{ "status": "error", "error_message": "try again later or or change it" }';
        }

        $user_info = null;

    } else {
        header('HTTP/1.0 400 Bad Request');
        print '{ "status": "error", "error_message": "invalid values" }';
    }
} else {
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "parameters are missing" }';
}


?>