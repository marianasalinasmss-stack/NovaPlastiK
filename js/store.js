/* =========================================================
   store.js — capa de datos de NovaPlastiK
   Simula un backend simple usando localStorage, para que
   index.html y admin.html lean y escriban la misma "base
   de datos" del navegador.
   ========================================================= */

const NOVA_KEYS = {
  products: "novaplastik_products",
  messages: "novaplastik_messages",
  session: "novaplastik_admin_session",
};

const NOVA_SEED_PRODUCTS = [
  {
    id: "np-001",
    codigo: "♲ 02",
    nombre: "Bolso Tótem",
    tipo: "bolso",
    material: "HDPE reciclado · equiv. 6 botellas",
    descripcion: "Bolso de mano grande, correa cruzada ajustable, forro interior impermeable.",
    precio: 128000,
    icono: "👜",
  },
  {
    id: "np-002",
    codigo: "♲ 01",
    nombre: "Monedero Ola",
    tipo: "monedero",
    material: "PET reciclado · equiv. 2 botellas",
    descripcion: "Monedero compacto con cierre magnético y compartimento para tarjetas.",
    precio: 42000,
    icono: "👛",
  },
  {
    id: "np-003",
    codigo: "♲ 05",
    nombre: "Bolso Costa",
    tipo: "bolso",
    material: "HDPE + algodón reciclado · equiv. 5 botellas",
    descripcion: "Tote de playa resistente al agua, base reforzada, ideal para el día a día.",
    precio: 96000,
    icono: "🛍️",
  },
  {
    id: "np-004",
    codigo: "♲ 01",
    nombre: "Monedero Arrecife",
    tipo: "monedero",
    material: "PET reciclado · equiv. 3 botellas",
    descripcion: "Monedero mediano con dos compartimentos y llavero desmontable.",
    precio: 54000,
    icono: "💰",
  },
  {
    id: "np-005",
    codigo: "♲ 04",
    nombre: "Bolso Manglar",
    tipo: "bolso",
    material: "HDPE reciclado · equiv. 8 botellas",
    descripcion: "Bolso tipo backpack, dos bolsillos frontales, tirantes acolchados.",
    precio: 142000,
    icono: "🎒",
  },
  {
    id: "np-006",
    codigo: "♲ 03",
    nombre: "Monedero Marea",
    tipo: "monedero",
    material: "PET + PP reciclado · equiv. 3 botellas",
    descripcion: "Monedero alargado tipo sobre, ideal para regalo, cordón removible.",
    precio: 48000,
    icono: "👝",
  },
];

function novaGetProducts() {
  const raw = localStorage.getItem(NOVA_KEYS.products);
  if (!raw) {
    localStorage.setItem(NOVA_KEYS.products, JSON.stringify(NOVA_SEED_PRODUCTS));
    return [...NOVA_SEED_PRODUCTS];
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [...NOVA_SEED_PRODUCTS];
  }
}

function novaSaveProducts(products) {
  localStorage.setItem(NOVA_KEYS.products, JSON.stringify(products));
}

function novaGetMessages() {
  const raw = localStorage.getItem(NOVA_KEYS.messages);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function novaSaveMessage(msg) {
  const messages = novaGetMessages();
  messages.unshift({ ...msg, id: "msg-" + Date.now(), fecha: new Date().toISOString() });
  localStorage.setItem(NOVA_KEYS.messages, JSON.stringify(messages));
}

function novaFormatPrice(value) {
  return "$" + Number(value).toLocaleString("es-CO");
}