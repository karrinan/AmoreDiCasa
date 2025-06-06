<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    // Получаем данные из формы и экранируем спецсимволы (защита от XSS)
    $name = htmlspecialchars($_POST['name']);
    $phone = htmlspecialchars($_POST['phone']);
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) ? : '';
    $address = htmlspecialchars($_POST['address']);
    $payment = htmlspecialchars($_POST['payment']);

    // Получаем данные корзины, декодируя JSON в массив
    $cartData = json_decode($_POST['cartData'], true);

    // Проверяем, что корзина не пустая и данные корректны
    if (!$cartData || !isset($cartData['cart']) || empty($cartData['cart']))
    {
        die('Корзина пуста или данные некорректны.');
    }
    
    // Определяем директорию для сохранения заказов
    $ordersDir = __DIR__ . '/orders';
    if (!is_dir($ordersDir))
    {
        mkdir($ordersDir, 0755, true);
    }
    
    // Создаем уникальное имя файла на основе текущей даты и времени
    $filename = $dir . date('Y-m-d_H-i-s') . '_' . uniqid() . '.txt';
    
    // Формируем текст заказа
    $orderDetails = "Заказ от: $name\nТелефон: $phone\nEmail: $email\nАдрес: $address\nСпособ оплаты: $payment\n\n";
    $orderDetails .= "Ресторан: " . $cartData['restaurant'] . "\n";
    $orderDetails .= "====================\n";

    $total = 0;

    // Перебираем каждый товар в корзине и рассчитываем общую сумму
    foreach ($cartData['cart'] as $item)
    {
        $itemTotal = $item['price'] * $item['quantity'];
        $total += $itemTotal;
        $orderDetails .= "Блюдо: {$item['name']} | Кол-во: {$item['quantity']} | Цена: {$item['price']}₽ | Сумма: {$itemTotal}₽\n";
    }

    // Добавляем общую сумму заказа
    $orderDetails .= "====================\n";
    $orderDetails .= "Общая сумма: $total\n";
    $orderDetails .= "====================\n\n";

    // Сохраняем заказ в файл
    if (file_put_contents($filename, $orderDetails) === false)
    {
        echo "Ошибка при сохранении заказа. Попробуйте позже.";
        exit;
    }
    echo "Спасибо за заказ, $name! Ваш заказ был успешно оформлен. Мы свяжемся с вами в ближайшее время.";
}
else
{
    echo "Неверный метод запроса.";
}
?>

