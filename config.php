<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'lista');

function getConnection() {
    $connection = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    
    if (!$connection) {
        die("Connection failed: " . mysqli_connect_error());
    }
    
    mysqli_set_charset($connection, "utf8");
    
    return $connection;
}
?>
