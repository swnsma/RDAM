<?php
include_once __DIR__ . '/../../include/add_user.class.php';
include_once __DIR__ . '/../../include/log.class.php';
if(isset($_POST['id_user'])){
    $id = $_POST['id_user'];
}
$user = new AddUser();
if($user->delete_user($id)){
    $log->write("Deleted user #$id");
    print '{ "status": "success"} }';
}else{
    $log->write('failed to add a new user', LOGTYPES::CRITICAL);
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "' . $user->get_error() . '" }';
}