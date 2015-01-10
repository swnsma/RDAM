<?php

include_once  __DIR__ . '/../../include/skin.class.php';

$skin = new Skin();

$list = $skin->get_list_skins();
if ($skin == null) {
    header('HTTP/1.0 400 Bad Request');
    print '{ "status": "error", "error_message": "try again later or or change it" }';
} else {
    print '{ "status": "success", "data": ' . json_encode($list) . ' }';
}

$skin = null;

?>