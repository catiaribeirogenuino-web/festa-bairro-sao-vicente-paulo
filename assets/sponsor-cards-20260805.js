const sponsorMedia = {
  "Casa dos Presuntos": "./assets/sponsor-casa-dos-presuntos.png",
  "Eletro Ideal": "./assets/sponsor-eletro-ideal.png",
  "Agência Funerária Rebelo": "./assets/sponsor-agencia-funeraria-rebelo.png",
  "Nova Real — Restaurante e Churrasqueira": "./assets/sponsor-nova-real.png",
  "Irreverent Studio": "./assets/sponsor-irreverent-contacts.webp",
  "Restaurante Convívio": "./assets/sponsor-restaurante-convivio.webp",
  "Estética Iluminada": "./assets/sponsor-estetica-iluminada.webp",
  "Sandro Oliveira": "./assets/sponsor-sandro-oliveira.webp",
  "Ana Marta Nails & Beauty": "./assets/sponsor-ana-marta.webp",
  "Os Padilhas": "./assets/sponsor-os-padilhas.webp",
  "Café Batista": "./assets/sponsor-cafe-batista.webp",
  "Mini Mercado Alcindo": "./assets/sponsor-mini-mercado-alcindo.webp",
  "Andrade Company": "./assets/sponsor-andrade-company.webp",
  "Café Snack-Bar S. Vicente": "./assets/sponsor-snack-bar-s-vicente.webp"
};

const sponsorAliases = {
  "Ana": "Ana Marta Nails & Beauty"
};

const sponsorsToAdd = [
  "Agência Funerária Rebelo",
  "Nova Real — Restaurante e Churrasqueira",
  "Os Padilhas",
  "Café Batista",
  "Mini Mercado Alcindo",
  "Andrade Company",
  "Café Snack-Bar S. Vicente"
];

const sponsorName = card => card.querySelector(":scope > p")?.textContent.trim() || "";
const sponsorSlug = name => name
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/&/g, "e")
  .replace(/[^a-zA-Z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .toLowerCase();

function canonicalSponsorName(card) {
  const currentName = sponsorName(card);
  const canonicalName = sponsorAliases[currentName] || currentName;
  if (canonicalName !== currentName) {
    const label = card.querySelector(":scope > p");
    if (label) label.textContent = canonicalName;
  }
  return canonicalName;
}

function createSponsorCard(name, hidden) {
  const card = document.createElement("article");
  card.className = "sponsor-slide sponsor-slide-card";
  card.setAttribute("aria-hidden", hidden ? "true" : "false");
  card.innerHTML = `<span>Patrocinador</span><img src="${sponsorMedia[name]}" alt="${hidden ? "" : name}"><p>${name}</p>`;
  return card;
}

function decorateSponsorCard(card) {
  const name = canonicalSponsorName(card);
  const image = sponsorMedia[name];
  if (!image) return;

  card.classList.add("sponsor-slide-card");
  card.dataset.sponsor = sponsorSlug(name);
  const oldVisual = card.querySelector(":scope > img, :scope > strong");
  if (oldVisual?.tagName === "IMG") {
    oldVisual.src = image;
  } else {
    const visual = document.createElement("img");
    visual.src = image;
    oldVisual?.replaceWith(visual);
  }

  const visual = card.querySelector(":scope > img");
  if (visual) {
    visual.alt = card.getAttribute("aria-hidden") === "true" ? "" : name;
    visual.loading = "lazy";
    visual.decoding = "async";
  }
}

function uniqueSponsorCards(cards) {
  const seen = new Set();
  return cards.filter(card => {
    const name = canonicalSponsorName(card);
    if (seen.has(name)) return false;
    seen.add(name);
    return true;
  });
}

function updateSponsorCarousel() {
  document.querySelectorAll(".sponsor-track").forEach(track => {
    const visible = uniqueSponsorCards(Array.from(track.children).filter(card => card.getAttribute("aria-hidden") !== "true"));
    const hidden = uniqueSponsorCards(Array.from(track.children).filter(card => card.getAttribute("aria-hidden") === "true"));

    sponsorsToAdd.forEach(name => {
      if (!visible.some(card => canonicalSponsorName(card) === name)) visible.push(createSponsorCard(name, false));
      if (!hidden.some(card => canonicalSponsorName(card) === name)) hidden.push(createSponsorCard(name, true));
    });

    track.replaceChildren(...visible, ...hidden);
    Array.from(track.children).forEach(decorateSponsorCard);
  });
}

function updateRaffleSponsorCards() {
  document.querySelectorAll(".raffle-supporters article").forEach(card => {
    const oldVisual = card.querySelector(":scope > img, :scope > strong");
    const originalName = oldVisual?.tagName === "IMG" ? oldVisual.alt : oldVisual?.textContent.trim();
    const name = sponsorAliases[originalName] || originalName;
    const image = sponsorMedia[name];
    if (!image) return;

    const visual = document.createElement("img");
    visual.src = image;
    visual.alt = name;
    visual.loading = "lazy";
    visual.decoding = "async";
    oldVisual?.replaceWith(visual);
  });
}

function applySponsorCards() {
  updateSponsorCarousel();
  updateRaffleSponsorCards();
}

function ensureSponsorCards() {
  applySponsorCards();
  window.setTimeout(applySponsorCards, 250);
  window.setTimeout(applySponsorCards, 1000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ensureSponsorCards);
} else {
  ensureSponsorCards();
}
window.addEventListener("load", ensureSponsorCards, { once: true });
