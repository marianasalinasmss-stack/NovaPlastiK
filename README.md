# NovaPlastiK 🛍️♻️

**De botella a bolso.** Bolsos y monederos hechos con plástico reciclado.

Proyecto final — Ruta básica "Mi emprendimiento digital" (Jóvenes creaTIvos).

## Qué incluye

| # | Requisito | Dónde está |
|---|-----------|------------|
| 01 | Landing / inicio | `index.html` (hero, misión) |
| 02 | Catálogo | `index.html` → sección `#catalogo` |
| 03 | Contacto real | `index.html` → sección `#contacto` (guarda solicitudes) |
| 04 | Panel admin | `admin.html` (login + gestión) |
| 05 | IA aplicada | Asistente virtual flotante (recomendador de productos) |
| 06 | Publicación | GitHub Pages (ver instrucciones abajo) |

## Cómo correrlo en local

Solo abre `index.html` en el navegador. No necesita servidor ni instalar nada.

## Cómo publicarlo en GitHub Pages

1. Crea un repositorio nuevo y vacío en GitHub (sin README).
2. En esta carpeta, conecta el remoto y sube el historial:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/novaplastik.git
   git branch -M main
   git push -u origin main
   ```
3. En GitHub → **Settings → Pages** → Source: `main` branch, carpeta `/ (root)`.
4. Espera 1-2 minutos y tu sitio quedará en `https://TU_USUARIO.github.io/novaplastik/`.

## Acceso al panel admin (demo)

- URL: `admin.html`
- Usuario: `admin`
- Contraseña: `novaplastik2026`

> Nota: por ser un sitio 100% estático (sin backend real), el "login" y los "datos"
> viven en `localStorage` del navegador — perfecto para la demo y la sustentación,
> pero no reemplaza una autenticación real en producción.

## Librerías usadas

- [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/) — únicamente para animaciones de entrada al hacer scroll.

## Estructura

```
novaplastik/
├── index.html
├── admin.html
├── css/
│   ├── styles.css
│   └── admin.css
├── js/
│   ├── store.js      (capa de datos: productos y mensajes)
│   ├── main.js        (carrito, catálogo, formulario)
│   ├── chatbot.js      (asistente / IA)
│   └── admin.js        (login y gestión)
└── assets/
```
