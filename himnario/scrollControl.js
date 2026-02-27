let scrollControl = document.getElementById('scrollControl');
let scrollSpeedInput = document.getElementById('scrollSpeed');
let scrollSpeed = 0; // Velocidad inicial, 0 = sin desplazamiento
let scrolling = false;
let lastTimestamp = 0;
const maxScrollSpeed = 10; // Velocidad máxima del scroll. En caso de ser muy rápido bajar el valor, subirlo exagera mucho la velocidad

// Mostrar el control cuando el mouse está encima
scrollControl.addEventListener('mouseover', function() {
  scrollControl.classList.add('show');
  clearTimeout(hideTimeout);
});

// Ocultar el control cuando el mouse no está encima
let hideTimeout;
scrollControl.addEventListener('mouseout', function() {
  hideTimeout = setTimeout(function() {
    scrollControl.classList.remove('show');
  }, 100); // Desaparecer scroll en 0.1 segundos
});

// Función para ajustar la velocidad del scroll
scrollSpeedInput.addEventListener('input', debounce(function() {
  // Convertir el valor del slider a un rango de velocidad más amplio y rápido
  scrollSpeed = Math.round((this.value / 150) * maxScrollSpeed); // Velocidad de 0 a maxScrollSpeed
  if (scrollSpeed > 0 && !scrolling) {
    scrolling = true;
    requestAnimationFrame(scrollStep);
  } else if (scrollSpeed === 0) {
    scrolling = false; // Detener el scroll si la velocidad es 0
  }
}, 100));

// Función para realizar el scroll suave
function scrollStep(timestamp) {
  if (!scrolling) return;

  // Controlar la velocidad con el tiempo entre frames
  const timeDiff = timestamp - lastTimestamp;
  const minFrameTime = 4.166; // Aproximadamente 240 FPS Esto es para que no se sienta que va por pasos
  
  if (timeDiff > minFrameTime) {
    // Cuantos más píxeles por paso, mayor la velocidad. Ajuste dinámico.
    window.scrollBy({
      top: scrollSpeed, // Usamos directamente la velocidad ajustada sin dividir
      left: 0,
      behavior: 'auto' // Usar smooth limita mucho
    });
    lastTimestamp = timestamp;
  }

  // Detener si llegamos al final de la página
  if ((window.innerHeight + window.scrollY) < document.body.offsetHeight) {
    requestAnimationFrame(scrollStep);
  } else {
    scrolling = false;
  }
}

// Función de "debounce" para evitar ejecutar código innecesariamente
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

