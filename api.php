<?php
    $polaczenie = mysqli_connect("localhost", "root", "", "lista");

    if (!$polaczenie) {
        die("Connection failed: " . mysqli_connect_error());
    }

    
?>