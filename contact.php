<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $text = trim($_POST['text'] ?? '');

    if (empty($name) || empty($email) || empty($text)) {
        echo "Пожалуйста, заполните все поля.";
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Пожалуйста, введите корректный email.";
        exit;
    }

    $dir = 'contacts/';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $ContactDetails = "Отправитель: $name\nEmail: $email\nСообщение: $text\n";
    $ContactDetails .= "====================\n";

    $filename = $dir . date('Y-m-d_H-i-s') . '.txt';
    if (file_put_contents($filename, $ContactDetails)) {
        echo "Ваше сообщение успешно отправлено.";
    } else {
        echo "Ошибка при сохранении сообщения.";
    }
} else {
    echo "Неверный метод запроса.";
}
?>
