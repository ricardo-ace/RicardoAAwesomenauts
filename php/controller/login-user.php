<?php

    require_once(__DIR__ . "/../model/config.php");
    
    $array = array(
    'exp' => '',
    'exp1' => '',
    'exp2' => '',
    'exp3' => '',
    'exp4'=> '', 
    );

    //we are selecting user information from the database
    $username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
    $password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);
    $query = $_SESSION["connection"]->query("SELECT * FROM users WHERE username = '$username' ");
    
      //checking the pasword for logins 
     if($query-> num_rows == 1){
         $rows = $query->fetch_array();

         if($row["password"] === crypt ($password, $row["salt"])){
             $_SESSION["authenticated"] = true;
             $arrray["exp"] = $row["exp"];
             $arrray["exp1"] = $row["exp"];
             $arrray["exp2"] = $row["exp"];
             $arrray["exp3"] = $row["exp"];
             $arrray["exp4"] = $row["exp"];
       
             
             echo json_encode($array);
         }
         else{
             echo "<p>Invalid username and password</p>";
         }
     }
     else{
             echo "<p>Invalid username and password</p>";
     }