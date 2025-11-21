const PRODUCT_KEY = "luxora-products";

function createPlaceholder(label, color) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 800'><rect width='600' height='800' fill='${color}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family="Helvetica Neue" font-size='42' fill='#111111' opacity='0.7'>${label}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const PRODUCTS = [
  {
    id: "lx-01",
    name: "Aurelia Structured Coat",
    price: 890,
    category: "Women",
    tags: ["New Arrivals"],
    stock: 12,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Bone", "Charcoal"],
    description: "Double-faced wool coat with sculpted shoulders and concealed placket.",
    gallery: [
      createPlaceholder("Aurelia Coat", "#e7e7e3"),
      createPlaceholder("Aurelia Coat Detail", "#d0d0cb"),
      createPlaceholder("Aurelia Coat Back", "#c4c4bf")
    ]
  },
  {
    id: "lx-02",
    name: "Tactile Knit Dress",
    price: 520,
    category: "Women",
    tags: ["New Arrivals"],
    stock: 20,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ink", "Sand"],
    description: "Seamless rib dress crafted with recycled viscose for fluid drape.",
    gallery: [
      createPlaceholder("Knit Dress", "#1a1a1a"),
      createPlaceholder("Knit Dress Side", "#2c2c2c")
    ]
  },
  {
    id: "lx-03",
    name: "Helix Modular Blazer",
    price: 760,
    category: "Men",
    tags: ["New Arrivals"],
    stock: 15,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Obsidian"],
    description: "Technical blazer with detachable hood and bonded seams.",
    gallery: [
      createPlaceholder("Helix Blazer", "#111111"),
      createPlaceholder("Helix Detail", "#191919")
    ]
  },
  {
    id: "lx-04",
    name: "Vector Cargo Trouser",
    price: 420,
    category: "Men",
    tags: [],
    stock: 30,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Olive", "Black"],
    description: "High-rise cargo trouser with laser-cut panels and magnetic pockets.",
    gallery: [
      createPlaceholder("Vector Cargo", "#5b5f52"),
      createPlaceholder("Vector Cargo Detail", "#4b4f43")
    ]
  },
  {
    id: "lx-05",
    name: "Orbit Sling Pouch",
    price: 260,
    category: "Accessories",
    tags: ["Sale"],
    stock: 40,
    sizes: ["OS"],
    colors: ["Chrome", "Black"],
    description: "Aerospace nylon sling with titanium buckle hardware.",
    gallery: [
      createPlaceholder("Orbit Sling", "#d9d9d9"),
      createPlaceholder("Orbit Sling Detail", "#bfbfbf")
    ]
  },
  {
    id: "lx-06",
    name: "Linea Knit Set",
    price: 640,
    category: "Women",
    tags: [],
    stock: 10,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Stone"],
    description: "Two-piece knit set featuring architectural rib mapping.",
    gallery: [
      createPlaceholder("Linea Knit", "#cfc9c3"),
      createPlaceholder("Linea Knit Detail", "#b8b2ad")
    ]
  },
  {
    id: "lx-07",
    name: "Axis Chelsea Boot",
    price: 480,
    category: "Accessories",
    tags: ["New Arrivals"],
    stock: 25,
    sizes: ["38", "39", "40", "41", "42", "43"],
    colors: ["Black"],
    description: "Italian leather boot with carbon fiber shank and exaggerated welt.",
    gallery: [
      createPlaceholder("Axis Boot", "#1c1c1c"),
      createPlaceholder("Axis Boot Detail", "#101010")
    ]
  },
  {
    id: "lx-08",
    name: "Gradient Silk Scarf",
    price: 190,
    category: "Accessories",
    tags: ["Sale"],
    stock: 60,
    sizes: ["OS"],
    colors: ["Silver Fade"],
    description: "Hand-rolled silk scarf featuring grayscale ombré artwork.",
    gallery: [
      createPlaceholder("Silk Scarf", "#ebebeb"),
      createPlaceholder("Silk Detail", "#d3d3d3")
    ]
  }
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function getProductsByCategory(category) {
  return PRODUCTS.filter((product) => {
    return (
      product.category === category ||
      product.tags.includes(category)
    );
  });
}

function renderProductCards(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = products
    .map(
      (product) => `
      <article class="product-card">
        <a href="product.html?id=${product.id}">
          <img src="${product.gallery[0]}" alt="${product.name}" loading="lazy" />
          <div class="card-body">
            <h3>${product.name}</h3>
            <p>${product.category}</p>
            <strong>${formatCurrency(product.price)}</strong>
          </div>
        </a>
      </article>
    `
    )
    .join("");
}

function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function initProductListing() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const priceFilter = document.getElementById("priceFilter");
  const grid = document.getElementById("productsGrid");
  const countEl = document.getElementById("productCount");

  function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const maxPrice = parseFloat(priceFilter.value) || Infinity;

    const filtered = PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm);
      const matchesCategory =
        category === "all" ||
        product.category === category ||
        product.tags.includes(category);
      const matchesPrice = product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });

    renderProductCards(filtered, "productsGrid");
    if (countEl) {
      countEl.textContent = `${filtered.length} styles`;
    }
  }

  const urlSearch = getQueryParam("search") || "";
  const urlCategory = getQueryParam("category") || "all";
  searchInput.value = urlSearch;
  categoryFilter.value = urlCategory;

  searchInput.addEventListener("input", () => filterProducts());
  categoryFilter.addEventListener("change", () => filterProducts());
  priceFilter.addEventListener("input", () => filterProducts());

  filterProducts();
}

function renderProductDetail() {
  const container = document.getElementById("productDetail");
  if (!container) return;
  const productId = getQueryParam("id");
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) {
    container.innerHTML = `<p>Product not found.</p>`;
    return;
  }

  const sizeOptions = product.sizes
    .map((size) => `<button type="button" class="option-pill" data-size="${size}">${size}</button>`)
    .join("");
  const colorOptions = product.colors
    .map((color) => `<button type="button" class="option-pill" data-color="${color}">${color}</button>`)
    .join("");
  const thumbs = product.gallery
    .map(
      (img, index) => `
      <button type="button" data-gallery-thumb data-index="${index}">
        <img src="${img}" alt="${product.name} thumbnail ${index + 1}" />
      </button>
    `
    )
    .join("");

  container.innerHTML = `
    <div>
      <div class="gallery-main">
        <img id="mainImage" src="${product.gallery[0]}" alt="${product.name}" />
      </div>
      <div class="gallery-thumbs">${thumbs}</div>
    </div>
    <div class="product-info">
      <p class="badge">${product.category}</p>
      <h1>${product.name}</h1>
      <p class="muted">${product.description}</p>
      <h2>${formatCurrency(product.price)}</h2>
      <p class="muted">Stock: ${product.stock}</p>
      <form id="addToCartForm">
        <div class="option-group">
          <label>Size</label>
          <div class="option-list" data-size-options>${sizeOptions}</div>
        </div>
        <div class="option-group">
          <label>Color</label>
          <div class="option-list" data-color-options>${colorOptions}</div>
        </div>
        <label>Quantity
          <input type="number" name="quantity" value="1" min="1" max="${product.stock}" />
        </label>
        <button type="submit" class="btn">Add to Cart</button>
        <p class="form-feedback" data-product-feedback></p>
      </form>
    </div>
  `;

  let selectedSize = null;
  let selectedColor = null;

  document.querySelectorAll("[data-size-options] .option-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll("[data-size-options] .option-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      selectedSize = pill.getAttribute("data-size");
    });
  });

  document.querySelectorAll("[data-color-options] .option-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll("[data-color-options] .option-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      selectedColor = pill.getAttribute("data-color");
    });
  });

  document.querySelectorAll("[data-gallery-thumb]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index, 10);
      document.getElementById("mainImage").src = product.gallery[idx];
    });
  });

  const form = document.getElementById("addToCartForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const feedback = document.querySelector("[data-product-feedback]");
    const quantity = parseInt(form.quantity.value, 10);

    if (!selectedSize || !selectedColor) {
      feedback.textContent = "Select size and color.";
      feedback.className = "form-feedback error";
      return;
    }
    addToCart(product.id, selectedSize, selectedColor, quantity);
    feedback.textContent = "Added to cart.";
    feedback.className = "form-feedback success";
  });
}
