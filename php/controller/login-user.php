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
         //this is protecting he pasword by encrypting it
         if($row["password"] === crypt ($password, $row["salt"])){
             $_SESSION["authenticated"] = true;
             $arrray["exp"] = $row["exp"];
             $arrray["exp1"] = $row["exp1"];
             $arrray["exp2"] = $row["exp2"];
             $arrray["exp3"] = $row["exp3"];
             $arrray["exp4"] = $row["exp4"];
             $_SESSION["name"] = $username; 
             
             echo json_encode($array);
         }
         else{
             //this tells you if you had an invalid username
             echo "Invalid username and password";
         }
     }
     else{
         //this tells you if you had an invalid password
             echo "Invalid username and password";
     }