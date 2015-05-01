<?php
//this is requiring the file
require_once(__DIR__ . "/../model/config.php");

unset($_SESSION["authenticated"]);

session_destroy();
header("Location:" . $path . "index.php");