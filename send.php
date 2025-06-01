<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Получаем данные из POST-запроса
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Данные клиента
    $name = htmlspecialchars($_POST['name']);
    $phone = htmlspecialchars($_POST['phone']);
    $email = htmlspecialchars($_POST['email']);
    $address = htmlspecialchars($_POST['address']);
    $payment = htmlspecialchars($_POST['payment']);
    $cartData = json_decode($_POST['cartData'], true);

   // Проверка корзины
   if (!$cartData || !isset($cartData['cart']) || empty($cartData['cart'])) {
    die('Корзина пуста или данные некорректны.');
}
    // Формируем содержимое для записи в файл
    $orderDetails = "Заказ от: $name\nТелефон: $phone\nEmail: $email\nАдрес: $address\nСпособ оплаты: $payment\n\n";
    $orderDetails .= "Ресторан: " . $cartData['restaurant'] . "\n";
    $orderDetails .= "====================\n";

    $total = 0;
    foreach ($cartData['cart'] as $item) {
        $itemTotal = $item['price'] * $item['quantity'];
        $total += $itemTotal;
        $orderDetails .= "Блюдо: " . $item['name'] . " | Кол-во: " . $item['quantity'] . " | Цена: " . $item['price'] . "₽ | Сумма: " . $itemTotal . "₽\n";
    }
    $orderDetails .= "====================\n";
    $orderDetails .= "Общая сумма: $total\n";
    $orderDetails .= "====================\n\n";

    // Записываем в файл
    $filename = 'orders/' . date('Y-m-d_H-i-s') . '.txt';
    file_put_contents($filename, $orderDetails);

    // Выводим подтверждение
    echo "Спасибо за заказ, $name! Ваш заказ был успешно оформлен. Мы свяжемся с вами в ближайшее время.";

    // Отправляем уведомление на email (если требуется)
    // mail($email, "Подтверждение заказа", $orderDetails);
} else {
    echo "Неверный метод запроса.";
}
?>
