<?php
$json = file_get_contents('php://input');
$obj = json_decode($json, true);
$uun = $obj["user"];
$ready_path = '/home/'.$uun.'/server_data/il/ready_to_iterate';
$contents = array_diff(scandir($ready_path), array('.', '..'));
print(json_encode($contents));
?>
