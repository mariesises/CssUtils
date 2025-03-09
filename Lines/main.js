const track = document.getElementById("image-track");

// Guardamos las imágenes originales
let originals = Array.from(track.querySelectorAll(".image"));

// Función para clonar las imágenes a ambos lados (mismo orden)
function cloneImages() {
  // Clonar para la derecha
  originals.forEach(img => {
    const clone = img.cloneNode(true);
    track.appendChild(clone);
  });
  // Clonar para la izquierda
  originals.forEach(img => {
    const clone = img.cloneNode(true);
    track.insertBefore(clone, track.firstChild);
  });
}
cloneImages();

let mouseDownAt = null;
let currentTranslate = 0; // Desplazamiento acumulado en píxeles
let prevTranslate = 0;
let originalWidth = 0; // Ancho del conjunto original

// Función módulo que siempre devuelve un resultado positivo
const mod = (n, m) => ((n % m) + m) % m;

function updateTransform() {
  // Calcula el offset efectivo para que siempre esté entre -originalWidth y 0
  const effectiveTranslate = mod(currentTranslate + originalWidth, originalWidth) - originalWidth;
  
  // Actualiza el transform del track manteniendo el centrado con calc(-50% + Xpx)
  track.style.transform = `translate(calc(-50% + ${effectiveTranslate}px), -50%)`;
  
  // Efecto parallax: mapea effectiveTranslate (que varía entre -originalWidth y 0)
  // a un porcentaje para objectPosition. Si effectiveTranslate = 0 => objectPosition = "100% center"
  // y si effectiveTranslate = -originalWidth => objectPosition = "0% center".
  const percentage = (effectiveTranslate / originalWidth) * 100; 
  const allImages = track.querySelectorAll(".image");
  allImages.forEach(img => {
    img.style.objectPosition = `${100 + percentage}% center`;
  });
}

// Una vez cargada la ventana, calculamos originalWidth y centramos el carrusel
window.addEventListener("load", () => {
  // El track contiene 3 conjuntos: clon izquierdo, original y clon derecho
  originalWidth = track.getBoundingClientRect().width / 3;
  // Posición inicial: el conjunto original centrado
  currentTranslate = -originalWidth;
  prevTranslate = currentTranslate;
  updateTransform();
});

// Eventos para mouse y touch
window.addEventListener('mousedown', (e) => {
  mouseDownAt = e.clientX;
  track.style.transition = 'none'; // Sin transición durante el drag
});
window.addEventListener('touchstart', (e) => {
  mouseDownAt = e.touches[0].clientX;
  track.style.transition = 'none';
});
window.addEventListener('mousemove', (e) => {
  if (mouseDownAt === null) return;
  const delta = e.clientX - mouseDownAt;
  currentTranslate = prevTranslate + delta;
  updateTransform();
});
window.addEventListener('touchmove', (e) => {
  if (mouseDownAt === null) return;
  const delta = e.touches[0].clientX - mouseDownAt;
  currentTranslate = prevTranslate + delta;
  updateTransform();
});
window.addEventListener('mouseup', () => {
  mouseDownAt = null;
  prevTranslate = currentTranslate;
  // Opcional: activa una transición suave al soltar el mouse
  track.style.transition = 'transform 0.5s ease-out';
});
window.addEventListener('touchend', () => {
  mouseDownAt = null;
  prevTranslate = currentTranslate;
  track.style.transition = 'transform 0.5s ease-out';
});
