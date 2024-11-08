const dataUrl = "../data/data.json"; // Ruta ajustada al servidor
let data;

async function obtenerRecetas() {
  try {
    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw new Error(
        `Error en la petición: ${response.status} ${response.statusText}`
      );
    }
    data = await response.json();
    return data;
  } catch (error) {
    Swal.fire({
      text: "Error en la petición realizada. :(",
      color: "black",
      toast: "true",
      background: "white",
      confirmButtonText: "Ok",
      confirmButtonColor: "black",
      timer: 5000,
    });
  }
}

// Cargar y mostrar recetas al inicio
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = parseInt(urlParams.get("id"), 10);

  data = await obtenerRecetas();

  if (recipeId) {
    cargarDetalleReceta(recipeId); // Pasamos `recetas` como parámetro
  } else {
    mostrarRecetas(data);
  }
  // Agregar el evento de búsqueda al campo de texto
  const searchInput = document.getElementById("campo-pesquisa");
  searchInput.addEventListener("click", search);
});

let currentPage = 1;
const recipePerPage = 8;

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

function mostrarRecetas(arregloRecetas, actualPage = 1) {
  const listaNames = document.getElementById("recetas"); // Contenedor principal donde se muestran las recetas
  limpiarContenedorRecetas(); // Limpiar el contenedor antes de agregar nuevas recetas

  const firstPage = (actualPage - 1) * recipePerPage;
  const lastPage = firstPage + recipePerPage;
  const recipesPage = arregloRecetas.slice(firstPage, lastPage); // Obtener las recetas de la página actual

  if (listaNames) {
    const container = document.createElement("div");
    container.className = "container text-center";

    let row; // Variable para crear nuevas filas
    recipesPage.forEach((item, i) => {
      // Crear una nueva fila cada 3 recetas
      if (i % 3 === 0) {
        row = document.createElement("div");
        row.className = "row justify-content-start align-items-center mb-4"; // Nueva fila con margen abajo
        container.appendChild(row);
      }

      // Crear la columna de Bootstrap para cada receta
      const col = document.createElement("div");
      col.className = "col-4 d-flex justify-content-center"; // Clase de columna de Bootstrap

      // Crear una card de Bootstrap para cada receta
      const card = document.createElement("div");
      card.className = "card"; // Clase de tarjeta de Bootstrap
      card.style.width = "20rem"; // Ancho opcional de la card

      // Crear el cuerpo de la card con la imagen y el título
      const img = document.createElement("img");
      img.src = item.image; // La URL de la imagen
      img.alt = item.title; // El título como texto alternativo
      img.className = "card-img-top"; // Clase de Bootstrap para la imagen en la card
      img.style.width = "100%"; // Asegura que la imagen ocupe todo el ancho de la card
      img.style.height = "200px"; // Define una altura fija para la imagen
      img.style.objectFit = "cover"; // Escala la imagen para llenar el espacio sin deformarse

      const cardBody = document.createElement("div");
      cardBody.className =
        "card-body d-flex align-items-center justify-content-center"; // Añadir clases de Bootstrap para centrar
      cardBody.style.height = "90px"; // Fijar la altura del cuerpo de la card

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
    showPagination(arregloRecetas.length, actualPage);
  }
}

function showPagination(totalRecipes, actualPage) {
  const totalPages = Math.ceil(totalRecipes / recipePerPage);
  const paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = "";

  const ul = document.createElement("ul");
  ul.className = "pagination justify-content-center ";

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item  ${i === actualPage ? "active" : ""}`;

    const link = document.createElement("a");
    link.className = "page-link";
    link.textContent = i;
    link.href = "#";
    link.addEventListener("click", function (e) {
      e.preventDefault();
      currentPage = i;
      mostrarRecetas(data, currentPage);
    });

    li.appendChild(link);
    ul.appendChild(li);
  }

  paginationDiv.appendChild(ul);
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
    currentPage = 1;
    // Llama a la función para recorrer el arreglo de recetas con las recetas filtradas
    mostrarRecetas(filteredRecetas, currentPage);
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

    // Mostrar curiosidad solo si existe
    const curiosidadContainer = document.getElementById("curiosidad-container");
    if (receta.curiosidad) {
      curiosidadContainer.style.display = "block"; // Mostrar el contenedor
      document.getElementById("curiosidad").textContent = receta.curiosidad;
    } else {
      curiosidadContainer.style.display = "none"; // Ocultar el contenedor si no hay curiosidad
    }
  }
}
