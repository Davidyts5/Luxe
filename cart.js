const CART_KEY = "luxora-cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCountUI();
}

function updateCartCountUI() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = totalItems;
  });
}

function addToCart(productId, size, color, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(
    (item) => item.productId === productId && item.size === size && item.color === color
  );
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: crypto.randomUUID(), productId, size, color, quantity });
  }
  saveCart(cart);
}

function removeCartItem(itemId) {
  const cart = getCart().filter((item) => item.id !== itemId);
  saveCart(cart);
  renderCartPage();
}

function updateCartItem(itemId, quantity) {
  const cart = getCart();
  const target = cart.find((item) => item.id === itemId);
  if (target) {
    target.quantity = Math.max(1, quantity);
  }
  saveCart(cart);
  renderCartPage();
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCountUI();
}

function buildCartMarkup() {
  const cart = getCart();
  if (!cart.length) {
    return `<p>Your cart is empty.</p>`;
  }
  const rows = cart
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return "";
      return `
        <div class="cart-item">
          <img src="${product.gallery[0]}" alt="${product.name}" />
          <div class="cart-item-details">
            <h3>${product.name}</h3>
            <p>${product.category} · Size ${item.size} · ${item.color}</p>
            <strong>${formatCurrency(product.price)}</strong>
          </div>
          <div class="cart-item-controls">
            <input type="number" min="1" value="${item.quantity}" data-cart-qty="${item.id}" />
            <button class="btn ghost" data-remove="${item.id}">Remove</button>
          </div>
        </div>
      `;
    })
    .join("");
  return rows;
}

function calculateCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
  const shipping = cart.length ? 25 : 0;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

function renderCartPage() {
  const container = document.getElementById("cartContainer");
  if (!container) return;
  const cart = getCart();
  if (!cart.length) {
    container.innerHTML = `<p>Your cart is empty.</p>`;
    updateCartCountUI();
    return;
  }
  container.innerHTML = `
    ${buildCartMarkup()}
    <div class="summary-line total">
      <span>Subtotal</span>
      <strong>${formatCurrency(calculateCartTotals().subtotal)}</strong>
    </div>
  `;

  container.querySelectorAll("[data-cart-qty]").forEach((input) => {
    input.addEventListener("change", (e) => {
      updateCartItem(input.dataset.cartQty, parseInt(e.target.value, 10));
    });
  });

  container.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => removeCartItem(btn.dataset.remove));
  });

  updateCartCountUI();
}

document.addEventListener("DOMContentLoaded", updateCartCountUI);
