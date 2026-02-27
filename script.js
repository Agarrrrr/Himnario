const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const cantosElements = document.querySelectorAll('dl dd a');

// Función para normalizar texto (quita acentos, puntuación y pasa a minúsculas)
function normalize(text) {
    return text
        .normalize("NFD")                           // Separa los acentos de las letras
        .replace(/[\u0300-\u036f]/g, "")           // Elimina los acentos
        .replace(/[¡!.,;?¿()[\]{}'"]/g, "")         // ELIMINA SIGNOS DE PUNTUACIÓN
        .toLowerCase()                              // Todo a minúsculas
        .replace(/\s+/g, " ") // Convierte múltiples espacios en uno solo
        .trim();                                    // Quita espacios extras
}

searchInput.addEventListener('input', function() {
    const query = normalize(searchInput.value.trim());
    searchResults.innerHTML = '';

    if (query.length > 0) {
        searchResults.classList.add('active');
        
        const matches = [];

        cantosElements.forEach(function(canto) {
            const originalText = canto.textContent;
            const normalizedFull = normalize(originalText);
            
            // Separamos el número del título (ej: "290 Jesús..." -> "Jesús...")
            const titleOnly = normalize(originalText.replace(/^\d+\s+/, ""));
            const numberPart = originalText.match(/^\d+/)?.[0] || "";

            let priority = 100; // Sin coincidencia

            if (numberPart === query) {
                priority = 1; // Coincidencia exacta de número
            } else if (titleOnly.startsWith(query)) {
                priority = 2; // El título EMPIEZA con la búsqueda (Tu petición)
            } else if (numberPart.startsWith(query)) {
                priority = 3; // El número empieza con la búsqueda
            } else if (normalizedFull.includes(query)) {
                priority = 4; // La palabra está en cualquier otra parte
            }

            if (priority < 100) {
                matches.push({ element: canto, priority: priority });
            }
        });

        // Ordenamos por prioridad (1 es lo más importante)
        matches.sort((a, b) => a.priority - b.priority);

        matches.forEach(function(match) {
            const listItem = document.createElement('li');
            const href = match.element.getAttribute('href');
            listItem.innerHTML = `<a href="${href}">${match.element.textContent}</a>`;
            searchResults.appendChild(listItem);
        });
    } else {
        searchResults.classList.remove('active');
    }
});

// Cerrar y LIMPIAR buscador al hacer clic fuera
document.addEventListener('click', function(e) {
    const searchBar = document.getElementById('searchBar');
    if (searchBar && !searchBar.contains(e.target)) {
        searchResults.classList.remove('active');
        searchInput.value = ''; // Limpia el texto automáticamente
    }
});

// Lógica Sticky para los títulos (A, B, C...)
const headers = document.querySelectorAll('dt');
const observer = new IntersectionObserver(
  ([e]) => e.target.classList.toggle('is-stuck', e.intersectionRatio < 1),
  { threshold: [1.0] }
);
headers.forEach(h => observer.observe(h));