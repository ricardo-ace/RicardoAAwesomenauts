<?php
//it is requiring a file 
 require_once(__DIR__."/database.php");
 
  //this is to start a session 
  session_start();
  session_regenerate_id(true);
  
$path = "/ricardo-blog/";

  $host = "localhost";
  $username = "root";
  $password = "root";
  $database = "blog_db";
  
  //we want to see if this session variable exits
  if(!isset($_SESSION["connection"])){
        //it is creating a new database
        $connection = new Database($host, $username, $password, $database);
        //these are like regular variables but there different because of how we access them
        $_SESSION["connection"] = $connection;
  }
  
  //its allowing us to regfister on the website
  