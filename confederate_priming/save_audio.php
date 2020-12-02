<?php
//strip special characters from filename to prevent any naughtiness
function cleanInput($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = str_replace('/','',$data);
  $data = str_replace('.','',$data);
  return $data;
}
// This is an example! Change this to somewhere your web server
// can save data
$datapath = '/home/ksmith7/server_data/audio';
$filename = cleanInput($_REQUEST["filename"]);
copy($_FILES['filedata']['tmp_name'], $datapath . '/' . $filename . ".webm");
?>
