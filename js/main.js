/* =========================================================
   main.js — catálogo + carrito de compras de NovaPlastiK
   ========================================================= */

let novaCart = []; // [{ id, cantidad }]

document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) AOS.init({ duration: 600, once: true, offset: 40 });

  renderCatalogo();
  loadCartFromStorage();
  renderCart();
  wireCartUi();
  wireContactForm();
  wireMobileNav();
});

function wireMobileNav() {
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");
  if (!burger || !links) return;
  burger.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));
}

/* ---------- Catálogo ---------- */
function renderCatalogo() {
  const grid = document.getElementById("catalogoGrid");
  if (!grid) return;
  const productos = novaGetProducts();

  grid.innerHTML = productos.map((p, i) => `
    <article class="producto-card" data-aos="fade-up" data-aos-delay="${(i % 3) * 80}">
      <div class="producto-media" style="background:${mediaColor(i)}">
        <span class="producto-tag">${p.codigo}</span>
        <span>${p.icono}</span>
      </div>
      <div class="producto-body">
        <h3>${p.nombre}</h3>
        <span class="producto-material">${p.material}</span>
        <p class="producto-desc">${p.descripcion}</p>
        <div class="producto-footer">
          <span class="producto-precio">${novaFormatPrice(p.precio)}</span>
          <button class="add-btn" data-id="${p.id}">Agregar</button>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      addToCart(btn.dataset.id);
      btn.textContent = "Agregado ✓";
      btn.classList.add("added");
      setTimeout(() => { btn.textContent = "Agregar"; btn.classList.remove("added"); }, 900);
    });
  });
}

function mediaColor(i) {
  const palette = ["#DCEBD1", "#F3E4C8", "#E7DCF2", "#D9EEEA", "#F4D9CE", "#DEE7F5"];
  return palette[i % palette.length];
}

/* ---------- Carrito ---------- */
function loadCartFromStorage() {
  try {
    novaCart = JSON.parse(sessionStorage.getItem("novaplastik_cart")) || [];
  } catch (e) {
    novaCart = [];
  }
}

function persistCart() {
  sessionStorage.setItem("novaplastik_cart", JSON.stringify(novaCart));
}

function addToCart(id) {
  const item = novaCart.find(c => c.id === id);
  if (item) item.cantidad += 1;
  else novaCart.push({ id, cantidad: 1 });
  persistCart();
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  const item = novaCart.find(c => c.id === id);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) novaCart = novaCart.filter(c => c.id !== id);
  persistCart();
  renderCart();
}

function removeFromCart(id) {
  novaCart = novaCart.filter(c => c.id !== id);
  persistCart();
  renderCart();
}

function getCartTotal() {
  const productos = novaGetProducts();
  return novaCart.reduce((sum, c) => {
    const p = productos.find(p => p.id === c.id);
    return p ? sum + p.precio * c.cantidad : sum;
  }, 0);
}

function getCartCount() {
  return novaCart.reduce((sum, c) => sum + c.cantidad, 0);
}

function renderCart() {
  const productos = novaGetProducts();
  const itemsEl = document.getElementById("cartItems");
  const emptyEl = document.getElementById("cartEmpty");
  const countEl = document.getElementById("cartCount");
  const subtotalEl = document.getElementById("cartSubtotal");
  const totalEl = document.getElementById("cartTotal");
  if (!itemsEl) return;

  countEl.textContent = getCartCount();

  if (novaCart.length === 0) {
    itemsEl.innerHTML = `<p class="cart-empty" id="cartEmpty">Tu bolsa está vacía. Agrega un bolso o monedero del catálogo.</p>`;
  } else {
    itemsEl.innerHTML = novaCart.map(c => {
      const p = productos.find(p => p.id === c.id);
      if (!p) return "";
      return `
        <div class="cart-item">
          <div class="cart-item-icon">${p.icono}</div>
          <div>
            <p class="cart-item-name">${p.nombre}</p>
            <span class="cart-item-price">${novaFormatPrice(p.precio)}</span>
            <div class="cart-item-qty">
              <button data-act="minus" data-id="${p.id}" aria-label="Restar">–</button>
              <span>${c.cantidad}</span>
              <button data-act="plus" data-id="${p.id}" aria-label="Sumar">+</button>
            </div>
          </div>
          <div></div>
          <button class="cart-item-remove" data-act="remove" data-id="${p.id}">Quitar</button>
        </div>
      `;
    }).join("");

    itemsEl.querySelectorAll("[data-act]").forEach(btn => {
      btn.addEventListener("click", () => {
        const { act, id } = btn.dataset;
        if (act === "plus") changeQty(id, 1);
        if (act === "minus") changeQty(id, -1);
        if (act === "remove") removeFromCart(id);
      });
    });
  }

  const total = getCartTotal();
  subtotalEl.textContent = novaFormatPrice(total);
  totalEl.textContent = novaFormatPrice(total);
}

function openCart() {
  const drawer = document.getElementById("cartDrawer");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.getElementById("cartBackdrop").classList.add("active");
}
function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  document.getElementById("cartBackdrop").classList.remove("active");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});

function wireCartUi() {
  document.getElementById("cartToggle")?.addEventListener("click", openCart);
  document.getElementById("cartClose")?.addEventListener("click", closeCart);
  document.getElementById("cartBackdrop")?.addEventListener("click", closeCart);
  document.getElementById("cartCheckout")?.addEventListener("click", () => {
    closeCart();
    // Precarga el mensaje de contacto con el resumen del pedido
    const msg = document.getElementById("mensaje");
    if (msg && novaCart.length) {
      const productos = novaGetProducts();
      const resumen = novaCart.map(c => {
        const p = productos.find(p => p.id === c.id);
        return p ? `- ${p.nombre} x${c.cantidad} (${novaFormatPrice(p.precio * c.cantidad)})` : "";
      }).join("\n");
      msg.value = `Quiero hacer este pedido:\n${resumen}\nTotal: ${novaFormatPrice(getCartTotal())}`;
    }
  });
}

/* ---------- Formulario de contacto ---------- */
function wireContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();
    if (!nombre || !email || !mensaje) return;

    novaSaveMessage({ nombre, email, mensaje });

    const confirmEl = document.getElementById("contactConfirm");
    confirmEl.hidden = false;
    form.reset();
    setTimeout(() => { confirmEl.hidden = true; }, 5000);
  });
}