<?php
    $polaczenie = mysqli_connect("localhost", "root", "", "lista");

    if (!$polaczenie) {
        die("Connection failed: " . mysqli_connect_error());
    }

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $item = mysqli_real_escape_string($polaczenie, $_POST['item']);
        $zapytanie = "INSERT INTO `rzeczy`(`Nazwa`, `Data_dodania`) VALUES ('$item', NOW())";
        mysqli_query($polaczenie, $zapytanie);
        echo json_encode(['success' => true]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $zapytanie2 = "SELECT * FROM rzeczy ORDER BY id";
        $wynik = mysqli_query($polaczenie, $zapytanie2);
        $items = [];
        while ($wiersz = mysqli_fetch_assoc($wynik)) {
            $items[] = $wiersz;
        }
        echo json_encode($items);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str(file_get_contents("php://input"), $data);

        if(isset($data['all']) && $data['all'] == 1){
            $zapytanie3 = "DELETE FROM rzeczy";
            mysqli_query($polaczenie, $zapytanie3);
            echo json_encode(['success' => true, 'all_deleted' => true]);
            exit;
        }

        $id = intval($data['id']);
        $zapytanie4 = "DELETE FROM rzeczy WHERE Id = $id";
        mysqli_query($polaczenie, $zapytanie4);
        echo json_encode(['success' => true]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        parse_str(file_get_contents("php://input"), $data);
        $id = intval($data['id']);
        $item = mysqli_real_escape_string($polaczenie, $data['item']);
        $zapytanie5 = "UPDATE rzeczy SET Nazwa = '$item' WHERE Id = $id";
        mysqli_query($polaczenie, $zapytanie5);
        echo json_encode(['success' => true]);
        exit;
    }

    if($_SERVER['REQUEST_METHOD'] === 'PATCH') {
        parse_str(file_get_contents("php://input"), $data);
        $id = intval($data['id']);
        $checked = intval($data['Wykreslone']);
        $zapytanie6 = "UPDATE rzeczy SET Wykreslone = $checked WHERE Id = $id";
        mysqli_query($polaczenie, $zapytanie6);
        echo json_encode(['success' => true]);
        exit;
    }

    mysqli_close($polaczenie);
?>