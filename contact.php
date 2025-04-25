<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Данные клиента
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $text = htmlspecialchars($_POST['text']); 

    // Проверка, если данные пусты
    if (empty($name) || empty($email) || empty($text)) {
        echo "Пожалуйста, заполните все поля.";
        exit;
    }

    $ContactDetails = "Отправитель: $name\nEmail: $email\nСообщение: $text\n";
    $ContactDetails .= "====================\n";

    // Записываем в файл
    $filename = 'contacts/' . date('Y-m-d_H-i-s') . '.txt';
    if (file_put_contents($filename, $ContactDetails)) {
        echo "Ваше сообщение успешно отправлено.";
    } else {
        echo "Ошибка при сохранении сообщения.";
    }

} else {
    echo "Неверный метод запроса.";
}
?>
