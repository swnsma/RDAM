<?php

/*
 * отримання детальної інформації про користувачів
 */

include_once 'include/users_info.class.php';

header('Content-type: application/json; charset=utf-8');

/*
 * example:
 * http://rdam.loc:83/ajax/users_info.php
 * http://rdam.loc:83/ajax/users_info.php?from_id=2
 * http://rdam.loc:83/ajax/users_info.php?from_id=3&fields=city,rating
 * http://rdam.loc:83/ajax/users_info.php?fields=city
 * and other
 */

if (isset($_GET['fields'])) {
    $fields = explode(',', $_GET['fields']);
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

$limit = 10;
if (isset($_GET['limit'])) {
    $fl = $_GET['limit'];
    if (ctype_digit($fl) && $fl > 0 && $fl <=10) {
        $limit = (int)$fl;
    }
}

$users_info = new UsersInfo();

if ($users_info->select_list($fields, $from_id, $limit)) {
    print '{ "status": "success", "data": ' . json_encode($users_info->get_data()) . ' }';
} else {
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "try again later or or change it" }';
}

$users_info = null;

?>