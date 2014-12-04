<?php

include_once 'include/users.class.php';

header('Content-type: application/json; charset=utf-8');

$users = new Users();
if ($users->select_list()) {
    $users->print_list();
} else {
    header('HTTP/1.0 400 Bad Request');
    //http_response_code(400); //Bad Request
}
$users = null;

?>