const WHATSAPP_NUMBER = "573209429918";
const serviceData = [
  { id: "semi-manos", title: "Semipermanente en manos", short: "Color intenso y brillo para tus uñas naturales.", price: 40000, category: "semi", group: "01 / Manicure", palette: ["#f3bfd2", "#dd8baa", "#fff2f6"], what: "Esmaltado en gel que se cura con lámpara para lograr un acabado liso, brillante y más duradero que el esmalte tradicional.", why: "Ideal si quieres mantener tus manos arregladas por más tiempo, con color uniforme para tu día a día o una ocasión especial.", gallery: [1, 2, 3, 4, 5, 6, 7].map(number => `assets/nails/nail-${String(number).padStart(2, "0")}.jpeg`) },
  { id: "press-on", title: "Uñas Press On", short: "Diseños listos para lucir un look con personalidad.", price: 70000, category: "presson", group: "02 / Uñas postizas", palette: ["#edd2e0", "#cb8cab", "#fff5f9"], what: "Uñas postizas decoradas que se colocan sobre la uña natural para conseguir el largo y el diseño que quieres.", why: "Una opción para cambiar de estilo y lucir uñas arregladas en un evento o cuando quieras un look diferente.", gallery: [8, 9, 10, 11, 12].map(number => `assets/nails/nail-${String(number).padStart(2, "0")}.jpeg`) },
  { id: "acrilicas", title: "Uñas acrílicas", short: "Largo, forma y diseño creados a tu gusto.", price: 95000, category: "acrilicas", group: "03 / Extensiones", palette: ["#f4d8c9", "#d79e9b", "#fff4eb"], what: "Extensiones moldeadas con producto acrílico para crear longitud y una forma personalizada sobre tus uñas.", why: "Te permite transformar el largo y la silueta de tus uñas y complementar el resultado con el diseño que prefieras.", gallery: [13, 14, 15, 16].map(number => `assets/nails/nail-${String(number).padStart(2, "0")}.jpeg`) },
  { id: "bano-acrilico", title: "Baño en acrílico", short: "Refuerzo con acrílico sobre tu uña natural.", price: 60000, category: "acrilicas", group: "04 / Refuerzo", palette: ["#f5e5d8", "#d7b1bd", "#fff9f1"], what: "Una capa de acrílico aplicada sobre la uña natural, sin extensión, que ayuda a crear una superficie más firme para esmaltar y decorar.", why: "Recomendado si quieres conservar el largo natural con un recubrimiento y un acabado personalizado.", gallery: [17, 18, 19, 20, 21].map(number => `assets/nails/nail-${String(number).padStart(2, "0")}.jpeg`) },
  { id: "semi-pies", title: "Semipermanente en pies", short: "Un acabado pulido y duradero también para tus pies.", price: 40000, category: "semi", group: "05 / Pedicure", palette: ["#efd1dd", "#c6789a", "#fff8fb"], what: "Esmaltado semipermanente en las uñas de los pies, curado con lámpara para un acabado brillante y uniforme.", why: "Perfecto para lucir tus pies arreglados durante vacaciones, eventos o con tu calzado favorito.", gallery: ["assets/nails/pedicure-01.jpg"] }
];

const makeupTypes = [
  { id: "social", title: "Maquillaje social", price: 40000, copy: "Un look fresco y favorecedor para celebrar, compartir y disfrutar.", images: ["makeup-social-01.jpeg", "makeup-social-02.jpeg", "makeup-social-03.jpeg", "makeup-social-04.jpeg", "makeup-social-05.jpeg"] },
  { id: "noche", title: "Maquillaje de noche", price: 60000, copy: "Más intensidad, definición y brillo para tus planes especiales.", images: ["makeup-noche-01.jpeg", "makeup-noche-02.jpeg", "makeup-noche-03.jpeg", "makeup-social-05.jpeg"] },
  { id: "bodas", title: "Maquillaje para bodas", price: 80000, copy: "Un acabado elegante y pensado para acompañarte en un día inolvidable.", images: ["makeup-social-02.jpeg", "makeup-social-04.jpeg", "makeup-noche-02.jpeg"] },
  { id: "graduacion", title: "Maquillaje para graduación", price: 80000, copy: "Un look especial para tus fotos, tu ceremonia y toda la celebración.", images: ["makeup-noche-01.jpeg", "makeup-noche-03.jpeg", "makeup-social-03.jpeg"] },
  { id: "halloween", title: "Maquillaje de Halloween", price: 40000, copy: "Looks creativos y artísticos para darle vida a tu personaje favorito.", images: ["makeup-halloween-01.jpeg", "makeup-halloween-02.jpeg", "makeup-halloween-03.jpeg"] }
];

const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const serviceGrid = document.getElementById("service-grid");
const detailDialog = document.getElementById("detail-dialog");
const dialogContent = document.getElementById("dialog-content");
const cartDialog = document.getElementById("cart-dialog");
const makeupMenu = document.getElementById("makeup-menu");
const makeupFeature = document.getElementById("makeup-feature");
const makeupGallery = document.getElementById("makeup-gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
let selectedMakeup = "social";
let selectedServiceFilter = "all";
let cart = readCart();
let revealObserver;

function readCart() {
  try { return JSON.parse(localStorage.getItem("angelical-cart") || "[]"); }
  catch { return []; }
}

function revealElements(root = document) {
  if (!("IntersectionObserver" in window)) return;
  revealObserver ||= new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  root.querySelectorAll(".service-card, .service-benefits > div, .makeup-thumb, .closing-stamp").forEach(element => {
    if (!element.classList.contains("reveal")) { element.classList.add("reveal"); revealObserver.observe(element); }
  });
}

function saveCart() {
  try { localStorage.setItem("angelical-cart", JSON.stringify(cart)); } catch { /* storage may be unavailable */ }
}

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function serviceMessage(service) {
  return `Hola, me interesa el servicio de ${service.title} en Angelical Nails Studio. ¿Me cuentan la disponibilidad para reservar?`;
}

function renderServices() {
  const filters = [{ id: "all", label: "Todos" }, { id: "semi", label: "Semipermanente" }, { id: "presson", label: "Press On" }, { id: "acrilicas", label: "Acrílicas" }];
  document.getElementById("service-filters").innerHTML = filters.map(filter => `<button type="button" class="service-filter ${selectedServiceFilter === filter.id ? "active" : ""}" data-service-filter="${filter.id}" aria-pressed="${selectedServiceFilter === filter.id}">${filter.label}</button>`).join("");
  const visibleServices = serviceData.filter(service => selectedServiceFilter === "all" || service.category === selectedServiceFilter);
  document.getElementById("service-count").textContent = `${visibleServices.length} ${visibleServices.length === 1 ? "servicio" : "servicios"}`;
  serviceGrid.innerHTML = visibleServices.map((service, index) => `<article class="service-card" style="--card-bg:${service.palette[2]}">
    <button type="button" class="service-card-art service-art-trigger" data-detail="${service.id}" aria-label="Ver detalles de ${service.title}" style="--card-bg:${service.palette[2]}">
      <span class="art-number">${String(index + 1).padStart(2, "0")} / ANGELICAL</span><span class="card-arrow">↗</span><img class="service-cover-photo" src="${service.gallery[0]}" alt="Diseño real de ${service.title}" loading="lazy">
    </button>
    <div class="service-card-body"><h3 class="service-card-title">${service.title}</h3><p class="service-card-desc">${service.short}</p><div class="card-meta"><span class="price-label">${money.format(service.price)}</span><span class="price-note">${service.group}</span></div>
    <div class="service-card-actions"><button type="button" class="details-service" data-detail="${service.id}">Ver detalles</button><button type="button" class="add-service" data-add="${service.id}">Añadir +</button></div></div>
  </article>`).join("");
  serviceGrid.scrollLeft = 0;
  revealElements(serviceGrid);
}

function openService(serviceId) {
  const service = serviceData.find(item => item.id === serviceId);
  if (!service) return;
  const gallery = service.gallery.length
    ? `<div class="service-gallery-carousel"><button type="button" class="service-gallery-arrow" data-service-gallery-scroll="left" data-gallery-id="service-gallery-${service.id}" aria-label="Ver diseño anterior">‹</button><div class="service-gallery-track" id="service-gallery-${service.id}" aria-label="Diseños reales de ${service.title}">${service.gallery.map((src, index) => `<figure class="service-gallery-slide"><img src="${src}" alt="Diseño real ${index + 1} realizado en Angelical Nails Studio" loading="lazy"><figcaption>DISEÑO REAL · ${String(index + 1).padStart(2, "0")} / ${String(service.gallery.length).padStart(2, "0")}</figcaption></figure>`).join("")}</div><button type="button" class="service-gallery-arrow" data-service-gallery-scroll="right" data-gallery-id="service-gallery-${service.id}" aria-label="Ver diseño siguiente">›</button></div>`
    : `<div class="service-gallery-empty"><span>✧</span><span>Pronto agregaremos fotos reales de este servicio.</span></div>`;
  dialogContent.innerHTML = `<div class="dialog-visual dialog-photo-visual" style="--card-bg:${service.palette[2]}">${gallery}</div>
    <div class="dialog-copy"><span class="dialog-kicker">${service.group} · ANGELICALSNAILSSTUDIO</span><h2 id="dialog-title">${service.title}</h2><div class="dialog-price">${money.format(service.price)}</div>
    <h3>Diseños reales</h3><h3>¿En qué consiste?</h3><p class="dialog-paragraph">${service.what}</p><h3>¿Para qué elegirlo?</h3><p class="dialog-paragraph">${service.why}</p>
    <div class="service-card-actions dialog-actions"><button type="button" class="add-service" data-add="${service.id}">Añadir al carrito · ${money.format(service.price)}</button><a class="button button-dark dialog-book" href="${whatsappLink(serviceMessage(service))}" target="_blank" rel="noreferrer">Consultar por WhatsApp <span>↗</span></a></div></div>`;
  detailDialog.showModal();
}

function addToCart(id) {
  const service = [...serviceData, ...makeupTypes].find(item => item.id === id);
  if (!service) return;
  const line = cart.find(item => item.id === id);
  if (line) line.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart(); renderCart(); showToast(`${service.title} agregado al carrito`);
}

function makeupById(id) { return makeupTypes.find(type => type.id === id); }
function cartItem(id) { return serviceData.find(item => item.id === id) || makeupById(id); }

function changeQuantity(id, delta) {
  const line = cart.find(item => item.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) cart = cart.filter(item => item.id !== id);
  saveCart(); renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, line) => sum + line.qty, 0);
  document.getElementById("cart-count").textContent = count;
  const itemsElement = document.getElementById("cart-items");
  const summaryElement = document.getElementById("cart-summary");
  const checkout = document.getElementById("cart-checkout");
  if (!count) {
    itemsElement.innerHTML = `<div class="cart-empty"><strong>Tu carrito está esperando.</strong>Agrega tus servicios favoritos para armar tu pedido.</div>`;
    summaryElement.innerHTML = `<div class="cart-total-line total"><span>Total</span><strong>${money.format(0)}</strong></div>`;
    checkout.classList.add("disabled"); checkout.removeAttribute("href"); return;
  }
  let subtotal = 0, hasQuote = false;
  itemsElement.innerHTML = cart.map(line => {
    const item = cartItem(line.id);
    if (!item) return "";
    if (item.price == null) hasQuote = true; else subtotal += item.price * line.qty;
    const unitPrice = item.price == null ? "Precio por confirmar" : money.format(item.price);
    return `<div class="cart-row"><div><div class="cart-row-title">${item.title}</div><div class="cart-row-price">${unitPrice}${line.qty > 1 && item.price != null ? ` · ${money.format(item.price * line.qty)}` : ""}</div></div><div class="cart-row-controls"><button type="button" data-qty="${line.id}" data-delta="-1" aria-label="Quitar una unidad">−</button><span class="cart-qty">${line.qty}</span><button type="button" data-qty="${line.id}" data-delta="1" aria-label="Agregar una unidad">+</button><button type="button" class="remove-item" data-qty="${line.id}" data-delta="-${line.qty}" aria-label="Quitar servicio">×</button></div></div>`;
  }).join("");
  summaryElement.innerHTML = `<div class="cart-total-line total"><span>Total</span><strong>${money.format(subtotal)}${hasQuote ? " + maquillaje" : ""}</strong></div>`;
  const orderLines = cart.map(line => { const item = cartItem(line.id); return item ? `• ${line.qty} × ${item.title}: ${item.price == null ? "precio por confirmar" : money.format(item.price * line.qty)}` : ""; }).filter(Boolean);
  const message = `Hola, quiero hacer este pedido en Angelical Nails Studio:\n\n${orderLines.join("\n")}\n\n${hasQuote ? `Total parcial: ${money.format(subtotal)}\n¿Me ayudan a confirmar el valor final y la disponibilidad?` : `Total: ${money.format(subtotal)}\n\n¿Me confirman disponibilidad para reservar?`}`;
  checkout.href = whatsappLink(message); checkout.classList.remove("disabled");
}

function renderMakeup() {
  makeupMenu.innerHTML = makeupTypes.map((type, index) => `<button type="button" class="makeup-option ${type.id === selectedMakeup ? "active" : ""}" data-makeup="${type.id}"><span class="option-number">0${index + 1}</span><span><span class="option-title">${type.title}</span><span class="option-copy">${type.copy}</span><span class="option-price">${money.format(type.price)}</span></span><span class="option-arrow">↗</span></button>`).join("");
  renderMakeupGallery();
}

function renderMakeupGallery() {
  const type = makeupById(selectedMakeup);
  if (!type) return;
  const featureImage = type.images[0];
  makeupFeature.innerHTML = `<img src="assets/${featureImage}" alt="${type.title} realizado en Angelicalsnailsstudio" /><div class="feature-overlay"><small>Looks para cada ocasión · ${money.format(type.price)}</small><h3>${type.title}</h3><p>${type.copy}</p><button type="button" class="makeup-add" data-add="${type.id}">Añadir al carrito +</button></div>`;
  makeupGallery.innerHTML = type.images.map((src, index) => `<button type="button" class="makeup-thumb" data-lightbox="assets/${src}" aria-label="Ampliar foto ${index + 1} de ${type.title}"><img src="assets/${src}" alt="${type.title}: propuesta ${index + 1}" loading="lazy"/><span class="thumb-label">${type.title}</span></button>`).join("");
  revealElements(makeupGallery);
}

let toastTimer;
function showToast(message) {
  let toast = document.querySelector(".cart-toast");
  if (!toast) { toast = document.createElement("div"); toast.className = "cart-toast"; toast.setAttribute("role", "status"); document.body.append(toast); }
  toast.textContent = message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 1900);
}

document.addEventListener("click", event => {
  const pageLink = event.target.closest("[data-page-link]");
  if (pageLink) {
    event.preventDefault();
    const page = pageLink.dataset.pageLink;
    history.pushState(null, "", `#${page}`);
    setActivePage(page);
    return;
  }
  const detail = event.target.closest("[data-detail]");
  if (detail) { openService(detail.dataset.detail); return; }
  const add = event.target.closest("[data-add]");
  if (add) { addToCart(add.dataset.add); return; }
  const qty = event.target.closest("[data-qty]");
  if (qty) { changeQuantity(qty.dataset.qty, Number(qty.dataset.delta)); return; }
  const category = event.target.closest("[data-makeup]");
  if (category) { selectedMakeup = category.dataset.makeup; renderMakeup(); return; }
  const serviceFilter = event.target.closest("[data-service-filter]");
  if (serviceFilter) { selectedServiceFilter = serviceFilter.dataset.serviceFilter; renderServices(); return; }
  const serviceScroll = event.target.closest("[data-service-scroll]");
  if (serviceScroll) {
    const direction = serviceScroll.dataset.serviceScroll === "right" ? 1 : -1;
    serviceGrid.scrollBy({ left: direction * serviceGrid.clientWidth * 0.82, behavior: "smooth" });
    return;
  }
  const locationScroll = event.target.closest("[data-location-scroll]");
  if (locationScroll) {
    const gallery = document.getElementById("location-gallery");
    const direction = locationScroll.dataset.locationScroll === "right" ? 1 : -1;
    gallery.scrollBy({ left: direction * gallery.clientWidth * 0.78, behavior: "smooth" });
    return;
  }
  const serviceGalleryScroll = event.target.closest("[data-service-gallery-scroll]");
  if (serviceGalleryScroll) {
    const track = document.getElementById(serviceGalleryScroll.dataset.galleryId);
    const slide = track?.querySelector(".service-gallery-slide");
    if (track && slide) {
      const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
      const direction = serviceGalleryScroll.dataset.serviceGalleryScroll === "right" ? 1 : -1;
      track.scrollBy({ left: direction * (slide.getBoundingClientRect().width + gap), behavior: "smooth" });
    }
    return;
  }
  const imageButton = event.target.closest("[data-lightbox]");
  if (imageButton) { lightboxImage.src = imageButton.dataset.lightbox; lightboxImage.alt = imageButton.querySelector("img")?.alt || "Diseño de belleza"; lightbox.showModal(); return; }
});

document.getElementById("cart-open").addEventListener("click", () => { renderCart(); cartDialog.showModal(); });
document.querySelector(".cart-close").addEventListener("click", () => cartDialog.close());
document.querySelector(".dialog-close:not(.cart-close)").addEventListener("click", () => detailDialog.close());
document.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
for (const dialog of [detailDialog, cartDialog, lightbox]) dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
document.getElementById("year").textContent = new Date().getFullYear();
document.querySelector(".menu-toggle").addEventListener("click", event => {
  const toggle = event.currentTarget, nav = document.querySelector(".main-nav"), open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
function setActivePage(page, scroll = true) {
  const validPages = ["inicio", "unas", "maquillaje", "fundadora", "ubicacion", "preguntas", "reclamos"];
  const currentPage = validPages.includes(page) ? page : "inicio";
  document.querySelectorAll(".page-view").forEach(view => {
    const active = view.dataset.page === currentPage;
    view.hidden = !active;
    view.classList.toggle("page-view-active", active);
    view.setAttribute("aria-hidden", String(!active));
  });
  document.querySelectorAll(".main-nav [data-page-link]").forEach(link => {
    if (link.dataset.pageLink === currentPage) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.querySelector(".main-nav").classList.remove("open");
  document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("popstate", () => setActivePage(location.hash.slice(1), false));
document.getElementById("complaint-form").addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const name = String(formData.get("name") || "").trim();
  const reason = String(formData.get("reason") || "");
  const message = String(formData.get("message") || "").trim();
  const note = `Hola, ${name ? `soy ${name}. ` : ""}quiero comunicarme con Angelical Nails Studio.\n\nMotivo: ${reason}\n\n${message}`;
  window.open(whatsappLink(note), "_blank", "noopener,noreferrer");
});

renderServices(); renderMakeup(); renderCart(); revealElements();
setActivePage(location.hash.slice(1), false);
