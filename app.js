const collections = {
  "No Photos, Please": [
    "22.jpg",
    "IMG_4520.jpg",
    "IMG_5081 (2).jpg",
    "IMG_5207.jpg",
    "IMG_5261.jpg",
    "IMG_5281 (1).jpg",
    "IMG_5918.jpg",
    "IMG_6279.jpg",
    "IMG_6316 (1).jpg"
  ],
  Filandorra: [
    "IMG_2576 (1).jpg",
    "IMG_2640 (1).jpg",
    "IMG_2694 (1).jpg",
    "IMG_2698 (1).jpg",
    "IMG_2702 (1).jpg",
    "IMG_2717 (1).jpg",
    "IMG_2780 (1).jpg",
    "IMG_2868 (1).jpg"
  ],
  Vendimia: [
    "IMG_6408.jpg",
    "IMG_6414.jpg",
    "IMG_6417.jpg",
    "IMG_6430.jpg",
    "IMG_6450.jpg",
    "IMG_6451 (1).jpg",
    "IMG_6454 (1).jpg",
    "IMG_6455.jpg",
    "IMG_6456.jpg",
    "IMG_6464.jpg"
  ],
  Vivienda: [
    "IMG_6395.jpg",
    "IMG_6392.jpg",
    "IMG_6391.jpg",
    "IMG_6389.jpg",
    "IMG_6387.jpg",
    "IMG_6385.jpg",
    "IMG_6373.jpg",
    "IMG_6328.jpg",
    "IMG_6321.jpg",
    "IMG_6316 (1).jpg",
    "IMG_6281.jpg",
    "IMG_6279.jpg",
    "IMG_6263.jpg",
    "IMG_6259 (1).jpg",
    "IMG_6256.jpg",
    "IMG_6240.jpg",
    "IMG_6229 (1).jpg",
    "IMG_6226.jpg",
    "IMG_6212.jpg"
  ],
  Resto: [
    "IMG_0347.jpg",
    "IMG_0440 (2).jpg",
    "IMG_2263.jpg",
    "IMG_3503.jpg",
    "IMG_4285.jpg",
    "IMG_4538.jpg",
    "IMG_4584 (2).jpg",
    "IMG_5071.jpg",
    "IMG_5211.jpg",
    "IMG_5261.jpg",
    "IMG_5281 (1).jpg",
    "IMG_5308.jpg",
    "IMG_5329.jpg",
    "IMG_5569.jpg",
    "IMG_5821.jpg",
    "IMG_5872.jpg",
    "IMG_5920.jpg",
    "IMG_5928.jpg",
    "IMG_5998.jpg",
    "IMG_6134.jpg",
    "IMG_6159.jpg",
    "IMG_6170.jpg",
    "IMG_6201.jpg",
    "IMG_7602.jpg"
  ]
};

const seriesDescriptions = {
  "No Photos, Please": [
    "Esta es mi primera serie.",
    "No photos, please no trata de fotografiar momentos ni situaciones concretas, sino sujetos que quieren ser anónimos. No sabemos quiénes son ni qué hacen; solo sabemos lo que nos muestran, su contexto. No son personas concretas, pero sabemos existen y que podríamos ser nosotros."
  ],
  Filandorra: [
    "Esta serie es un conjunto de fotografías hechas en mi pueblo (Ferreras de Arriba), fotografiando las mascaradas típicas de invierno de la zona, La Filandorra. Estas se celebran en diciembre todos los años, siendo ya una tradición longeva en la localidad.",
    "En ella, las 4 mascaradas, repesentadas por 4 jovenes del pueblo, van recorriendo las casas y las calles, recogiendo dinero de los habitantes para poder posteriormente celebrar las fiestas de San Blas. Cuando pagas, te tiznan la cara. Van equipados con cencerros, y suelen atizar a las personas que no pagan."
  ],
  Vendimia: [
    "Fotos hechas durante las fiestas de la vendimia en Toro (Zamora). Toro es una localidad centrada en la elaboración de vino, y cuenta con distintas bodegas alrededor. En esta festividad, se celebra el fin de la época de vendimia. En ella, distintas bodegas dan vino y comida a los asistentes, utilizando carros tirados por burros."
  ],
  Vivienda: [
    "Fotos hechas durante las huelgas por las crisis de la vivienda en España."
  ]
};

const gallery = document.querySelector("#photo-grid");
const galleryTitle = document.querySelector("#gallery-title");
const galleryKicker = document.querySelector("#gallery-kicker");
const galleryCount = document.querySelector(".gallery-count");
const seriesDescription = document.querySelector("#series-description");
const filters = document.querySelector("#filters");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxIndex = document.querySelector(".lightbox-index");
const menuToggle = document.querySelector(".menu-toggle");

let activeView = "authorial";
let activeFilter = "all";
let visiblePhotos = [];
let activePhotoIndex = 0;
let previouslyFocused = null;

function imagePath(folder, filename) {
  const webpFilename = filename.replace(/\.jpe?g$/i, ".webp");
  return `./${encodeURIComponent(folder)}/${encodeURIComponent(webpFilename)}`;
}

function photosForView() {
  if (activeView === "authorial") {
    return collections["No Photos, Please"].map((filename) => ({
      folder: "No Photos, Please",
      filename,
      title: "No Photos, Please"
    }));
  }

  const folders = activeFilter === "all" ? ["Filandorra", "Vendimia", "Vivienda", "Resto"] : [activeFilter];
  return folders.flatMap((folder) => collections[folder].map((filename) => ({
    folder,
    filename,
    title: folder
  })));
}

function renderGallery() {
  visiblePhotos = photosForView();
  gallery.replaceChildren();
  galleryCount.textContent = `${String(visiblePhotos.length).padStart(2, "0")} fotografías`;

  const descriptionKey = activeView === "authorial" ? "No Photos, Please" : activeFilter;
  seriesDescription.replaceChildren(...(seriesDescriptions[descriptionKey] ?? []).map((text) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    return paragraph;
  }));

  if (activeView === "authorial") {
    galleryTitle.textContent = "No Photos, Please";
    galleryKicker.innerHTML = 'Serie seleccionada <span class="eyebrow-dot"></span> 01 / 02';
  } else {
    galleryTitle.textContent = activeFilter === "all" ? "Calle y proyectos" : activeFilter;
    galleryKicker.innerHTML = 'En la calle <span class="eyebrow-dot"></span> 02 / 02';
  }

  visiblePhotos.forEach((photo, index) => {
    const button = document.createElement("button");
    button.className = "photo-item";
    button.type = "button";
    button.setAttribute("aria-label", `Abrir fotografía ${index + 1}: ${photo.title}`);

    const image = document.createElement("img");
    image.src = imagePath(photo.folder, photo.filename);
    image.alt = `${photo.title}, fotografía documental`;
    image.loading = index < 4 ? "eager" : "lazy";
    image.decoding = "async";

    const label = document.createElement("span");
    label.className = "photo-label";
    label.textContent = photo.title;

    button.append(image, label);
    button.addEventListener("click", () => openLightbox(index, button));
    gallery.append(button);
  });
}

function showPhoto(index) {
  activePhotoIndex = (index + visiblePhotos.length) % visiblePhotos.length;
  const photo = visiblePhotos[activePhotoIndex];
  lightboxImage.src = imagePath(photo.folder, photo.filename);
  lightboxImage.alt = `${photo.title}, fotografía documental`;
  lightboxCaption.textContent = photo.title;
  lightboxIndex.textContent = `${String(activePhotoIndex + 1).padStart(2, "0")} / ${String(visiblePhotos.length).padStart(2, "0")}`;

  const nextPhoto = visiblePhotos[(activePhotoIndex + 1) % visiblePhotos.length];
  const preload = new Image();
  preload.src = imagePath(nextPhoto.folder, nextPhoto.filename);
}

function openLightbox(index, trigger) {
  previouslyFocused = trigger;
  showPhoto(index);
  lightbox.showModal();
  lightbox.querySelector(".lightbox-close").focus();
}

function closeLightbox() {
  lightbox.close();
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    activeView = button.dataset.view;
    activeFilter = "all";
    filters.hidden = activeView !== "street";
    document.querySelectorAll("[data-view]").forEach((navButton) => {
      navButton.classList.toggle("is-current", navButton === button);
    });
    document.querySelectorAll(".filter-button").forEach((filterButton) => {
      filterButton.classList.toggle("is-active", filterButton.dataset.filter === "all");
    });
    renderGallery();
    document.querySelector("#work").scrollIntoView({ behavior: "smooth" });
    menuToggle.setAttribute("aria-expanded", "false");
    document.querySelector("#site-nav").classList.remove("is-open");
  });
});

filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter-button").forEach((filterButton) => {
    filterButton.classList.toggle("is-active", filterButton === button);
  });
  renderGallery();
});

document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
document.querySelector(".lightbox-prev").addEventListener("click", () => showPhoto(activePhotoIndex - 1));
document.querySelector(".lightbox-next").addEventListener("click", () => showPhoto(activePhotoIndex + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener("close", () => previouslyFocused?.focus());
document.addEventListener("keydown", (event) => {
  if (!lightbox.open) return;
  if (event.key === "ArrowRight") showPhoto(activePhotoIndex + 1);
  if (event.key === "ArrowLeft") showPhoto(activePhotoIndex - 1);
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  document.querySelector("#site-nav").classList.toggle("is-open", !isOpen);
});

document.querySelectorAll('.site-nav a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    document.querySelector("#site-nav").classList.remove("is-open");
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();
renderGallery();