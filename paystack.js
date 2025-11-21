const PAYSTACK_KEY = "pk_test_d776ae9c523cd49d19d84779aef05c3a87fd80c8";

function openModal(message, status = "success") {
  const modal = document.getElementById("paymentModal");
  const statusBox = document.getElementById("paymentStatus");
  if (!modal || !statusBox) return;
  statusBox.innerHTML = `
    <h3>${status === "success" ? "Payment Successful" : "Payment Failed"}</h3>
    <p>${message}</p>
  `;
  statusBox.className = status === "success" ? "success" : "form-feedback error";
  modal.classList.add("open");
  modal.querySelector(".modal-close").onclick = () => modal.classList.remove("open");
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });
}

function initCheckoutSummary() {
  const summaryContainer = document.getElementById("checkoutSummary");
  if (!summaryContainer) return;
  const cart = getCart();
  if (!cart.length) {
    summaryContainer.innerHTML = `<p>Your cart is empty.</p>`;
    return;
  }

  summaryContainer.innerHTML = cart
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return "";
      return `
        <div class="order-card">
          <div>
            <strong>${product.name}</strong>
            <p class="muted">${item.size} · ${item.color}</p>
          </div>
          <div>
            ${item.quantity} × ${formatCurrency(product.price)}
          </div>
        </div>
      `;
    })
    .join("");

  const totals = calculateCartTotals();
  document.querySelector("[data-summary-subtotal]").textContent = formatCurrency(totals.subtotal);
  document.querySelector("[data-summary-shipping]").textContent = formatCurrency(totals.shipping);
  document.querySelector("[data-summary-total]").textContent = formatCurrency(totals.total);
}

function initCheckoutPage() {
  initCheckoutSummary();
  const form = document.getElementById("checkout-form");
  const feedback = document.querySelector("[data-checkout-feedback]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cart = getCart();
    if (!cart.length) {
      feedback.textContent = "Your cart is empty.";
      feedback.className = "form-feedback error";
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    if (!data.email || !data.fullName) {
      feedback.textContent = "Please complete required fields.";
      feedback.className = "form-feedback error";
      return;
    }

    const totals = calculateCartTotals();
    const amountInKobo = totals.total * 100 * 100; // USD to Kobo approximation (assuming $1 ~ ₦1000)
    const handler = PaystackPop.setup({
      key: PAYSTACK_KEY,
      email: data.email,
      amount: Math.round(amountInKobo),
      currency: "NGN",
      ref: "LXR-" + Date.now(),
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: data.fullName
          },
          {
            display_name: "Address",
            variable_name: "shipping_address",
            value: `${data.address1}, ${data.city}, ${data.country}`
          }
        ]
      },
      onClose: function () {
        openModal("Payment window closed.", "error");
      },
      callback: function () {
        openModal("Your order has been confirmed. A receipt has been emailed.");
        clearCart();
        initCheckoutSummary();
        updateCartCountUI();
        form.reset();
      }
    });
    handler.openIframe();
  });
}
