
// Корзина
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let restaurant = localStorage.getItem("selectedRestaurant") || "Неизвестный ресторан";

// Сохраняем корзину
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Добавить в корзину
function addToCart(name, price, restaurantName) {
  restaurant = restaurantName;
  localStorage.setItem("selectedRestaurant", restaurantName);
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  saveCart();
}

// Удалить позицию
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
  renderCart();
}

// Изменить количество
function changeQuantity(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) item.quantity = 1;
  saveCart();
  renderCart();
}

// Очистить корзину
function clearCart() {
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
}

// Отображение корзины
function renderCart() {
  const cartTable = document.getElementById("cart-items");
  const totalSpan = document.getElementById("total-price");
  const restName = document.getElementById("restaurant-name");
  const hiddenInput = document.getElementById("cartDataInput");

  if (!cartTable || !totalSpan) return;

  cartTable.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price}₽</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary me-1" onclick="changeQuantity('${item.name}', -1)">-</button>
        ${item.quantity}
        <button class="btn btn-sm btn-outline-secondary ms-1" onclick="changeQuantity('${item.name}', 1)">+</button>
      </td>
      <td>${itemTotal}₽</td>
      <td><button class="btn btn-sm btn-danger" onclick="removeFromCart('${item.name}')">Удалить</button></td>
    `;
    cartTable.appendChild(row);
  });

  totalSpan.textContent = `${total}₽`;
  if (restName) restName.textContent = restaurant;

  if (hiddenInput) {
    hiddenInput.value = JSON.stringify({
      restaurant,
      cart
    });
  }
}

// Отображение корзины при загрузке order.html
if (window.location.pathname.includes("order.html")) {
  document.addEventListener("DOMContentLoaded", renderCart);
}

// Форма для оформления
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("orderForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Собираем данные формы
    const formData = new FormData(form);

    // Добавим корзину из localStorage, если нужно
    const cartData = localStorage.getItem("cart");
    const restaurant = localStorage.getItem("selectedRestaurant");

    if (!cartData || !restaurant) {
      alert("Корзина пуста!");
      return;
    }

    // Отправляем запрос
    fetch("send.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.text())
      .then(result => {
        alert(result);
        form.reset(); // очищаем форму
        localStorage.removeItem("cart"); // очищаем корзину
        localStorage.removeItem("restaurant");
      })
      .catch(error => {
        alert("Ошибка при отправке заказа.");
        console.error(error);
      });
  });
});

//Форма для связи
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Собираем данные формы
    const formData = new FormData(form);

    // Отправляем запрос
    fetch("contact.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.text())
      .then(result => {
        alert(result); // Показываем результат в окне
        form.reset(); // очищаем форму
      })
      .catch(error => {
        alert("Ошибка при отправке сообщения.");
        console.error(error);
      });
  });
});

