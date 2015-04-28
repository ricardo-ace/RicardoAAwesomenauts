<?php
    //prottecting the controllers and views 
    require_once(__DIR__ . "/../model/config.php");
    require_once(__DIR__ . "/../controller/login-verify.php");
    //killing the program  if not logged in 
    if(!authenticateUser()){
        header("location: " . $path . "index.php");
        die();
    }

?>


//this is to connect the variables i have in my database file to this folder
require_once(__DIR__ . "/../model/config.php");

//this is to create the post
$query = $_SESSION["connection"]->query("CREATE TABLE posts ("
        . "id int(11) NOT NULL AUTO_INCREMENT,"
        . "title varchar(255) NOT NULL,"
        . "post text NOT NULL,"
        . "PRIMARY KEY (id))");

if ($query) {
    echo "<p>succesfully created table: posts</p>";
} else {
    echo"<p>" . $_SESSION["connection"]->error . "</p>";
}

 $query = $_SESSION["connection"]->query("CREATE TABLE users("
         . "id int(11) NOT NULL AUTO_INCREMENT,"
         . "username varchar(30)NOT NULL,"
         . "email varchar(50) NOT NULL,"
         . "password char(128)NOT NULL,"
         . "salt char(128) NOT NULL,"
         . "primary key(id))");
 
 if($query){
     echo "<p> succesfull created table:users </p>";
     
 }
else{
    echo"<p>" . $_SESSION["connection"]->error . "</p>";
}


        
