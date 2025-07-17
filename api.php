<?php
    require_once 'config.php';
    
    // Ustawienie nagłówków
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type');
    
    $polaczenie = getConnection();

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $action = $_POST['action'] ?? 'add';
        
        switch($action) {
            case 'add':
                $item = mysqli_real_escape_string($polaczenie, $_POST['item']);
                $zapytanie = "INSERT INTO `rzeczy`(`Nazwa`, `Data_dodania`) VALUES ('$item', NOW())";
                if(mysqli_query($polaczenie, $zapytanie)) {
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'error' => mysqli_error($polaczenie)]);
                }
                break;
                
            case 'delete':
                $id = intval($_POST['id']);
                $zapytanie = "DELETE FROM rzeczy WHERE Id = $id";
                if(mysqli_query($polaczenie, $zapytanie)) {
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'error' => mysqli_error($polaczenie)]);
                }
                break;
                
            case 'delete_all':
                $zapytanie = "DELETE FROM rzeczy";
                if(mysqli_query($polaczenie, $zapytanie)) {
                    echo json_encode(['success' => true, 'all_deleted' => true]);
                } else {
                    echo json_encode(['success' => false, 'error' => mysqli_error($polaczenie)]);
                }
                break;
                
            case 'edit':
                $id = intval($_POST['id']);
                $item = mysqli_real_escape_string($polaczenie, $_POST['item']);
                $zapytanie = "UPDATE rzeczy SET Nazwa = '$item' WHERE Id = $id";
                if(mysqli_query($polaczenie, $zapytanie)) {
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'error' => mysqli_error($polaczenie)]);
                }
                break;
                
            case 'toggle_check':
                $id = intval($_POST['id']);
                $checked = intval($_POST['Wykreslone']);
                $zapytanie = "UPDATE rzeczy SET Wykreslone = $checked WHERE Id = $id";
                if(mysqli_query($polaczenie, $zapytanie)) {
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'error' => mysqli_error($polaczenie)]);
                }
                break;
                
            default:
                echo json_encode(['success' => false, 'error' => 'Unknown action']);
        }
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $zapytanie2 = "SELECT * FROM rzeczy ORDER BY id DESC";
        $wynik = mysqli_query($polaczenie, $zapytanie2);
        $items = [];
        while ($wiersz = mysqli_fetch_assoc($wynik)) {
            $items[] = $wiersz;
        }
        echo json_encode($items);
        exit;
    }

    mysqli_close($polaczenie);
?>