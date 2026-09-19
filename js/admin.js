/* =========================================================
   admin.js — panel de administración NovaPlastiK
   Login de demo + gestión de productos y mensajes,
   todo sobre la misma "base de datos" en localStorage
   que usa la tienda (store.js).
   ========================================================= */

const ADMIN_USER = "admin";
const ADMIN_PASS = "novaplastik2026";

document.addEventListener("DOMContentLoaded", () => {
  wireLogin();
  if (sessionStorage.getItem(NOVA_KEYS.session) === "true") {
    showDashboard();
  }
});

/* ---------- Login ---------- */
function wireLogin() {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value;
    const error = document.getElementById("loginError");

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem(NOVA_KEYS.session, "true");
      error.hidden = true;
      showDashboard();
    } else {
      error.hidden = false;
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem(NOVA_KEYS.session);
    location.reload();
  });
}

function showDashboard() {
  document.getElementById("loginWrap").hidden = true;
  document.getElementById("adminMain").hidden = false;
  document.getElementById("logoutBtn").hidden = false;
  renderStats();
  renderProductTable();
  renderMessages();
  wireProductForm();
}

/* ---------- Estadísticas ---------- */
function renderStats() {
  const productos = novaGetProducts();
  const mensajes = novaGetMessages();
  const valorTotal = productos.reduce((sum, p) => sum + p.precio, 0);

  document.getElementById("statProductos").textContent = productos.length;
  document.getElementById("statMensajes").textContent = mensajes.length;
  document.getElementById("statValor").textContent = novaFormatPrice(valorTotal);
}

/* ---------- Productos ---------- */
function renderProductTable() {
  const tbody = document.getElementById("productosBody");
  const productos = novaGetProducts();

  if (!productos.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="admin-empty">No hay productos todavía.</td></tr>`;
    return;
  }

  tbody.innerHTML = productos.map(p => `
    <tr>
      <td>${p.codigo}</td>
      <td>${p.nombre}</td>
      <td>${p.tipo}</td>
      <td>${novaFormatPrice(p.precio)}</td>
      <td>
        <button class="mini-btn" data-act="edit" data-id="${p.id}">Editar</button>
        <button class="mini-btn danger" data-act="delete" data-id="${p.id}">Eliminar</button>
      </td>
    </tr>
  `).join("");

  tbody.querySelectorAll("[data-act]").forEach(btn => {
    btn.addEventListener("click", () => {
      const { act, id } = btn.dataset;
      if (act === "edit") editProduct(id);
      if (act === "delete") deleteProduct(id);
    });
  });
}

function wireProductForm() {
  const form = document.getElementById("productForm");
  const newBtn = document.getElementById("newProductBtn");
  const cancelBtn = document.getElementById("cancelProductBtn");

  newBtn.addEventListener("click", () => {
    form.reset();
    document.getElementById("prodId").value = "";
    form.hidden = false;
  });

  cancelBtn.addEventListener("click", () => { form.hidden = true; });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("prodId").value;
    const productos = novaGetProducts();

    const data = {
      nombre: document.getElementById("prodNombre").value.trim(),
      tipo: document.getElementById("prodTipo").value,
      codigo: document.getElementById("prodCodigo").value.trim(),
      precio: Number(document.getElementById("prodPrecio").value),
      material: document.getElementById("prodMaterial").value.trim(),
      descripcion: document.getElementById("prodDescripcion").value.trim(),
      icono: document.getElementById("prodTipo").value === "bolso" ? "👜" : "👛",
    };

    if (id) {
      const idx = productos.findIndex(p => p.id === id);
      if (idx > -1) productos[idx] = { ...productos[idx], ...data };
    } else {
      productos.push({ id: "np-" + Date.now(), ...data });
    }

    novaSaveProducts(productos);
    form.hidden = true;
    renderStats();
    renderProductTable();
  });
}

function editProduct(id) {
  const producto = novaGetProducts().find(p => p.id === id);
  if (!producto) return;
  document.getElementById("prodId").value = producto.id;
  document.getElementById("prodNombre").value = producto.nombre;
  document.getElementById("prodTipo").value = producto.tipo;
  document.getElementById("prodCodigo").value = producto.codigo;
  document.getElementById("prodPrecio").value = producto.precio;
  document.getElementById("prodMaterial").value = producto.material;
  document.getElementById("prodDescripcion").value = producto.descripcion;
  document.getElementById("productForm").hidden = false;
}

function deleteProduct(id) {
  if (!confirm("¿Eliminar este producto del catálogo?")) return;
  const productos = novaGetProducts().filter(p => p.id !== id);
  novaSaveProducts(productos);
  renderStats();
  renderProductTable();
}

/* ---------- Mensajes ---------- */
function renderMessages() {
  const wrap = document.getElementById("mensajesList");
  const mensajes = novaGetMessages();

  if (!mensajes.length) {
    wrap.innerHTML = `<p class="admin-empty">Todavía no han llegado mensajes.</p>`;
    return;
  }

  wrap.innerHTML = `
    <table class="admin-table">
      <thead><tr><th>Fecha</th><th>Nombre</th><th>Correo</th><th>Mensaje</th></tr></thead>
      <tbody>
        ${mensajes.map(m => `
          <tr>
            <td>${new Date(m.fecha).toLocaleString("es-CO")}</td>
            <td>${m.nombre}</td>
            <td>${m.email}</td>
            <td style="white-space:pre-wrap">${m.mensaje}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}