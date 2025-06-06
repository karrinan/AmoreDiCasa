<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    // Получаем данные из формы и удаляем лишние пробелы
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $text = trim($_POST['text'] ?? '');

    // Проверяем, все ли поля заполнены
    if (empty($name) || empty($email) || empty($text))
    {
        echo "Пожалуйста, заполните все поля.";
        exit;
    }

    // Проверяем корректный формат email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL))
    {
        echo "Пожалуйста, введите корректный email.";
        exit;
    }
    // Указываем папку для сохранения файла
    $dir = 'contacts/';
    if (!is_dir($dir))
    {
        mkdir($dir, 0755, true);
    }

    // Формируем текст файла
    $ContactDetails = "Отправитель: $name\nEmail: $email\nСообщение: $text\n";
    $ContactDetails .= "====================\n";

    // Создаем уникальное имя файла и сохраняем туда данные
    $filename = $dir . date('Y-m-d_H-i-s') . '_' . uniqid() . '.txt';
    if (file_put_contents($filename, $ContactDetails))
    {
        echo "Ваше сообщение успешно отправлено.";
    }
    else
    {
        echo "Ошибка при сохранении сообщения.";
    }
}
else
{
    echo "Неверный метод запроса.";
}
?>
