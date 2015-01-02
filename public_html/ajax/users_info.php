<?php

include_once __DIR__ . '/../include/users_info.class.php';

if (isset($_GET['fields'])) {
    $fields = array_unique(explode(',', $_GET['fields']));
} else {
    $fields = null;
}

$from_id = 0;
if (isset($_GET['from_id'])) {
    $fid = $_GET['from_id'];
    if (ctype_digit($fid)) {
        $from_id = (int)$fid;
    }
}

$users_info = new UsersInfo();

if ($users_info->select_list($fields, $from_id)) {
    print '{ "status": "success", "data": ' . json_encode($users_info->get_data()) . ' }';
} else {
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "try again later or or change it" }';
}

$users_info = null;

?>