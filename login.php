<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logowanie</title>
</head>
<body>
    <h1>Dołącz do listy</h1>
    <form method="post">
        <label for="username">Adres email:</label>
        <input type="text" id="mail" name="mail" required><br><br>
        <label for="password">Hasło:</label>
        <input type="password" id="password" name="password" required><br><br>
        <button type="submit">Zaloguj się</button>
    <p>Chcesz stworzyć listę?</p>
    <a href="create_list.html">Kliknij tu!</a>
    <p>Nie masz konta?</p>
    <a href="register.html">Zarejestruj się!</a>
</body>
</html>

<?php
    $polaczenie = mysqli_connect("localhost", "root", "", "lista");
    if (!$polaczenie) {
        die("Nie można połączyć z bazą danych: " . mysqli_connect_error());
    }

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $username = $_POST['mail'];
        $password = sha1($_POST['password']);

        $sql = "SELECT * FROM konta WHERE Adres_email='$username' AND Haslo='$password'";
        $result = mysqli_query($polaczenie, $sql);

        if (mysqli_num_rows($result) > 0) {
            header("Location: index.html");
        } else {
            echo "Nieprawidłowy adres email lub hasło.";
        }
    }
?>