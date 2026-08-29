/* =========================================================
   chatbot.js — Asistente virtual de NovaPlastiK
   IA aplicada: recomendador basado en reglas + respuestas
   a preguntas frecuentes. No requiere backend ni API externa.
   ========================================================= */

const NOVA_FAQ = [
  { test: /material|plástico|hecho|reciclad/i,
    reply: "Nuestras piezas se hacen con HDPE y PET reciclado post-consumo, recuperado por recicladores locales. Cada etiqueta te dice cuántas botellas equivale." },
  { test: /envio|envío|domicilio|entrega/i,
    reply: "El envío es gratis a nivel nacional y llega entre 3 y 6 días hábiles después de confirmar tu pedido por el formulario de contacto." },
  { test: /pago|precio|cuesta|cuanto vale|cuánto vale/i,
    reply: "Los precios están en el catálogo, en pesos colombianos. Al finalizar tu pedido te contactamos para coordinar el pago." },
  { test: /cambio|devoluc|garant/i,
    reply: "Tienes 8 días desde que recibes tu pedido para solicitar cambio si la pieza no te convenció, siempre que no esté usada." },
];

const NOVA_KEYWORDS = {
  bolso: ["bolso", "tote", "cartera grande", "backpack", "mochila", "playa"],
  monedero: ["monedero", "billetera", "tarjetero", "cartera pequeña", "regalo pequeño"],
  regalo: ["regalo", "obsequio", "cumpleaños", "detalle"],
  oficina: ["oficina", "trabajo", "laptop", "diario"],
};

document.addEventListener("DOMContentLoaded", () => {
  injectChatWidget();
  wireChat();
});

function injectChatWidget() {
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <button id="chatFab" class="chat-fab" aria-label="Abrir asistente NovaPlastiK">💬</button>
    <div id="chatPanel" class="chat-panel" hidden>
      <div class="chat-head">
        <div>
          <strong>Asistente NovaPlastiK</strong>
          <span>Te ayudo a elegir tu bolso o monedero ♲</span>
        </div>
        <button id="chatClose" aria-label="Cerrar asistente">✕</button>
      </div>
      <div id="chatLog" class="chat-log"></div>
      <form id="chatForm" class="chat-form">
        <input id="chatInput" type="text" placeholder="Ej: busco algo para regalo..." autocomplete="off">
        <button type="submit">Enviar</button>
      </form>
    </div>
  `;
  document.body.appendChild(wrap);
}

function wireChat() {
  const fab = document.getElementById("chatFab");
  const panel = document.getElementById("chatPanel");
  const closeBtn = document.getElementById("chatClose");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");

  fab.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    if (!panel.hidden && !panel.dataset.greeted) {
      addChatMessage("bot", "¡Hola! 👋 Cuéntame qué buscas (por ejemplo: 'bolso para la playa' o 'monedero de regalo') y te recomiendo una pieza del catálogo.");
      panel.dataset.greeted = "1";
    }
  });
  closeBtn.addEventListener("click", () => panel.hidden = true);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addChatMessage("user", text);
    input.value = "";
    setTimeout(() => respondTo(text), 350);
  });
}

function addChatMessage(who, text) {
  const log = document.getElementById("chatLog");
  const bubble = document.createElement("div");
  bubble.className = "chat-msg chat-" + who;
  bubble.innerHTML = text;
  log.appendChild(bubble);
  log.scrollTop = log.scrollHeight;
}

function respondTo(text) {
  const lower = text.toLowerCase();

  // 1) FAQ
  const faq = NOVA_FAQ.find(f => f.test.test(lower));
  if (faq) {
    addChatMessage("bot", faq.reply);
    return;
  }

  // 2) Recomendador por palabras clave
  let tipoDetectado = null;
  for (const [tipo, palabras] of Object.entries(NOVA_KEYWORDS)) {
    if (palabras.some(p => lower.includes(p))) { tipoDetectado = tipo; break; }
  }

  const productos = typeof novaGetProducts === "function" ? novaGetProducts() : [];
  let sugeridos = [];

  if (tipoDetectado === "bolso") sugeridos = productos.filter(p => p.tipo === "bolso");
  else if (tipoDetectado === "monedero" || tipoDetectado === "regalo") sugeridos = productos.filter(p => p.tipo === "monedero");
  else if (tipoDetectado === "oficina") sugeridos = productos.filter(p => p.tipo === "bolso");

  if (sugeridos.length) {
    const pick = sugeridos[Math.floor(Math.random() * sugeridos.length)];
    addChatMessage("bot", `Te recomiendo el <strong>${pick.nombre}</strong> (${novaFormatPrice(pick.precio)}) — ${pick.descripcion}
      <br><button class="chat-add" data-id="${pick.id}">Agregar al carrito</button>`);
    document.querySelector(`.chat-add[data-id="${pick.id}"]`)?.addEventListener("click", (e) => {
      addToCart(pick.id);
      e.target.textContent = "Agregado ✓";
    });
    return;
  }

  addChatMessage("bot", "Puedo recomendarte según el uso: prueba escribiendo 'bolso para la playa', 'monedero de regalo' o pregúntame por materiales, envíos o cambios.");
}
