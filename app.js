let lastScrollTop = 0; // Variable para guardar la posición anterior del scroll
const header = document.getElementById("main-header");

function showAlert(message) {
  Swal.fire({
    text: message,
    background: "#f2f2f2",
    color: "#333",
    confirmButtonColor: "#808080",
    toast: true,
  });
}

// Función para limpiar el contenedor de recetas
function limpiarContenedorRecetas() {
  const listaNames = document.getElementById("recetas");
  listaNames.innerHTML = "";
}

function mostrarRecetas(arregloRecetas) {
  const listaNames = document.getElementById("recetas"); // Contenedor principal donde se muestran las recetas
  limpiarContenedorRecetas(); // Limpiar el contenedor antes de agregar nuevas recetas

  if (listaNames) {
    const container = document.createElement("div");
    container.className = "container text-center";

    let row; // Variable para crear nuevas filas
    arregloRecetas.forEach((item, i) => {
      // Crear una nueva fila cada 4 recetas
      if (i % 4 === 0) {
        row = document.createElement("div");
        row.className = "row align-items-center mb-3"; // Nueva fila con margen abajo
        container.appendChild(row);
      }

      // Crear la columna de Bootstrap para cada receta
      const col = document.createElement("div");
      col.className = "col"; // Clase de columna de Bootstrap

      // Crear una card de Bootstrap para cada receta
      const card = document.createElement("div");
      card.className = "card"; // Clase de tarjeta de Bootstrap
      card.style.width = "15rem"; // Ancho opcional de la card

      // Crear el cuerpo de la card con la imagen y el título
      const img = document.createElement("img");
      img.src = item.image; // La URL de la imagen
      img.alt = item.title; // El título como texto alternativo
      img.className = "card-img-top"; // Clase de Bootstrap para la imagen en la card

      const cardBody = document.createElement("div");
      cardBody.className = "card-body"; // Cuerpo de la card

      // Crear el enlace que apunte a la página de detalles de la receta
      const link = document.createElement("a");
      link.textContent = item.title; // Texto del enlace es el título de la receta
      link.href = `recipe.html?id=${item.id}`; // Enlace con el ID de la receta
      link.target = "_self"; // Abrir en la misma pestaña
      link.className = "card-title"; // Clase de título de la card

      // Agregar los elementos a la estructura de la card
      cardBody.appendChild(link); // Agregar el título al cuerpo de la card
      card.appendChild(img); // Agregar la imagen a la card
      card.appendChild(cardBody); // Agregar el cuerpo de la card

      // Agregar la card a la columna
      col.appendChild(card);

      // Agregar la columna a la fila
      row.appendChild(col);
    });

    // Finalmente, agregar el contenedor completo a la lista de recetas
    listaNames.appendChild(container);
  }
}

function search() {
  const searchTerm = document
    .getElementById("campo-pesquisa")
    .value.toLowerCase();

  // Filtrar las recetas que coinciden con el término de búsqueda
  const filteredRecetas = data.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchTerm)
      ) ||
      item.tags.toLowerCase().includes(searchTerm)
  );

  if (filteredRecetas.length === 0) {
    showAlert(
      "No se encontraron recetas. Intenta con otro término de búsqueda."
    );
  } else {
    // Llama a la función para recorrer el arreglo de recetas con las recetas filtradas
    mostrarRecetas(filteredRecetas);
  }
}

// Función para cargar los detalles de una receta específica
function cargarDetalleReceta(recipeId) {
  const receta = data.find((item) => item.id === recipeId);

  if (receta) {
    document.getElementById("title").textContent = receta.title || "";
    document.getElementById("portions").textContent = receta.portions || "";

    const photoRecipe = document.getElementById("photo-recipe");
    if (photoRecipe && receta.image) {
      photoRecipe.src = receta.image;
    }

    // Agregar ingredientes
    const listaIngredientes = document.getElementById("ingredientes");
    listaIngredientes.innerHTML = ""; // Limpiar antes de agregar
    receta.ingredients.forEach((ingredient) => {
      const li = document.createElement("li");
      li.textContent = ingredient;
      listaIngredientes.appendChild(li);
    });

    // Agregar instrucciones
    const contenedorInstrucciones = document.getElementById("instrucciones");
    contenedorInstrucciones.innerHTML = ""; // Limpiar antes de agregar
    receta.instruction.forEach((instruction) => {
      const p = document.createElement("p");
      p.textContent = instruction;
      contenedorInstrucciones.appendChild(p);
    });
  }
}

// Inicializar el comportamiento del scroll
window.addEventListener("scroll", function () {
  const scrollTop = document.documentElement.scrollTop;

  // Mostrar u ocultar el header dependiendo de la dirección del scroll
  if (scrollTop > lastScrollTop) {
    header.classList.add("hidden");
  } else {
    header.classList.remove("hidden");
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Evitar valores negativos
});

// Inicialización del DOM
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = parseInt(urlParams.get("id"), 10);

  // Cargar receta si se proporciona un ID en la URL
  if (recipeId) {
    cargarDetalleReceta(recipeId);
  } else {
    mostrarRecetas(data);
  }

  // Agregar el evento de búsqueda al campo de texto
  document.getElementById("campo-pesquisa");
});
