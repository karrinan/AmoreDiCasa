// Получить все корзины из localStorage
function getAllCarts() {
  return JSON.parse(localStorage.getItem("multiCart")) || {};
}

// Сохранить все корзины в localStorage
function saveAllCarts(carts) {
  localStorage.setItem("multiCart", JSON.stringify(carts));
}

// Получить выбранный ресторан из localStorage
function getSelectedRestaurant() {
  return localStorage.getItem("selectedRestaurant") || "Неизвестный ресторан";
}

// Установить выбранный ресторан в localStorage
function setSelectedRestaurant(name) {
  localStorage.setItem("selectedRestaurant", name);
}

// Получить корзину для текущего ресторана
function getCurrentCart() {
  const carts = getAllCarts();
  const restaurant = getSelectedRestaurant();
  return carts[restaurant] || [];
}

// Сохранить корзину для текущего ресторана
function saveCurrentCart(cart) {
  const carts = getAllCarts();
  const restaurant = getSelectedRestaurant();
  carts[restaurant] = cart;
  saveAllCarts(carts);
}

// Добавить товар в корзину указанного ресторана
function addToCart(name, price, restaurantName) {
  setSelectedRestaurant(restaurantName);
  const carts = getAllCarts();

  if (!carts[restaurantName]) {
    carts[restaurantName] = [];
  }

  const cart = carts[restaurantName];
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  saveAllCarts(carts);
  renderCartSwitcher();
  renderCart(restaurantName);
}

// Удалить товар из корзины текущего ресторана
function removeFromCart(name) {
  let cart = getCurrentCart();
  cart = cart.filter(item => item.name !== name);
  saveCurrentCart(cart);
  renderCartSwitcher();
  renderCart(getSelectedRestaurant());
}

// Изменить количество товара в корзине текущего ресторана
function changeQuantity(name, delta) {
  const cart = getCurrentCart();
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) item.quantity = 1;
  saveCurrentCart(cart);
  renderCartSwitcher();
  renderCart(getSelectedRestaurant());
}

// Очистить корзину текущего ресторана
function clearCart() {
  const carts = getAllCarts();
  const restaurant = getSelectedRestaurant();
  delete carts[restaurant];
  saveAllCarts(carts);
  renderCartSwitcher();
  renderCart(restaurant);
}

// Отрисовать переключатель между корзинами ресторанов
function renderCartSwitcher() {
  const carts = getAllCarts();
  const container = document.getElementById("cart-switcher");
  if (!container) return;

  container.innerHTML = "";
  for (const restaurant in carts) {
    const btn = document.createElement("button");
    btn.textContent = restaurant + ` (${carts[restaurant].reduce((acc, i) => acc + i.quantity, 0)})`;
    btn.className = restaurant === getSelectedRestaurant() ? "active btn btn-primary me-2" : "btn btn-outline-primary me-2";
    btn.onclick = () => {
      setSelectedRestaurant(restaurant);
      renderCartSwitcher();
      renderCart(restaurant);
    };
    container.appendChild(btn);
  }
  if (Object.keys(carts).length === 0) {
    container.textContent = "Корзина пуста";
  }
}

// Отрисовать корзину выбранного ресторана
function renderCart(restaurant) {
  const cart = getAllCarts()[restaurant] || [];
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

// Инициализация при загрузке страницы order.html
if (window.location.pathname.includes("order.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    renderCartSwitcher();
    const restaurant = getSelectedRestaurant();
    renderCart(restaurant);
  });
}

// Обработка отправки формы оформления заказа
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("orderForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const carts = getAllCarts();
    const restaurant = getSelectedRestaurant();
    const cart = carts[restaurant];

    if (!cart || cart.length === 0) {
      alert("Корзина пуста!");
      return;
    }

    const formData = new FormData(form);
    // Можно добавить данные корзины в форму, если нужно
    formData.append("cartData", JSON.stringify({ restaurant, cart }));

    fetch("send.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.text())
      .then(result => {
        alert(result);
        form.reset();
        // Очистка корзины текущего ресторана после заказа
        const allCarts = getAllCarts();
        delete allCarts[restaurant];
        saveAllCarts(allCarts);
        renderCartSwitcher();
        renderCart(getSelectedRestaurant());
      })
      .catch(error => {
        alert("Ошибка при отправке заказа.");
        console.error(error);
      });
  });
});

// Обработка отправки формы обратной связи
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    fetch("contact.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.text())
      .then(result => {
        alert(result);
        form.reset();
      })
      .catch(error => {
        alert("Ошибка при отправке сообщения.");
        console.error(error);
      });
  });
});
