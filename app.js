let lastScrollTop = 0; // Variable para guardar la posición anterior del scroll
const header = document.getElementById("main-header");

window.addEventListener("scroll", function () {
  let scrollTop = document.documentElement.scrollTop;

  // Si el usuario está haciendo scroll hacia abajo
  if (scrollTop > lastScrollTop) {
    header.classList.add("hidden"); // Oculta el header
  } else {
    header.classList.remove("hidden"); // Muestra el header
  }

  // Actualiza la posición anterior del scroll
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

function showAlert(message) {
  Swal.fire({
    text: message,
    background: "#f2f2f2",
    color: "#333",
    confirmButtonColor: "#808080",
    toast: true,
  });
}

// Función para realizar la búsqueda:
function search() {
  let campoPesquisa = document
    .getElementById("campo-pesquisa")
    .value.trim()
    .toLowerCase();
  // Selecciona la sección donde se exhibirán los resultados de la búsqueda
  let section = document.getElementById("resultados-pesquisa");

  if (!campoPesquisa) {
    showAlert(
      "Debe ingresar el nombre de la receta o una palabra clave para buscarla."
    );
    return;
  }

  // Inicializa uma string vazia para armazenar os resultados
  let results = "";

  //Función para realizar la lógica de la búsqueda
  function searchItem(item, campoPesquisa) {
    const title = item.title.toLowerCase();
    const description = item.description.toLowerCase();
    const tags = item.tags.toLowerCase();
    const ingredients = item.ingredients.join(", ").toLowerCase();

    return (
      title.includes(campoPesquisa) ||
      description.includes(campoPesquisa) ||
      tags.includes(campoPesquisa) ||
      ingredients.includes(campoPesquisa)
    );
  }
  // Itera sobre cada item del conjunto de datos
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    if (searchItem(item, campoPesquisa)) {
      // Crea uma div para cada item, formateando los datos como HTML
      results += `<div class="item-resultado">
    <h2>${item.title}</h2>
    <p>${item.description}</p>
    <a href="recipe.html?id=${i}" "target=_blank"> Receta Completa </a>
  </div>`;
    }
  }
  if (!results) {
    showAlert("No hay resultados para su búsqueda");
  } else {
    // Muestra los resultados en la sección
    section.innerHTML = results;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Lógica de inicialización
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = parseInt(urlParams.get("id"), 10);
  const listaNames = document.getElementById("recetas");

  // Si hay un ID de receta, carga los detalles de la receta
  if (recipeId !== null && recipeId >= 0 && recipeId < data.length) {
    const receta = data[recipeId];
    const tituloReceta = document.getElementById("title");
    const listaIngredientes = document.getElementById("ingredientes");
    const contenedorInstrucciones = document.getElementById("instrucciones");
    const photoRecipe = document.getElementById("photo-recipe");

    // Agregar título
    if (tituloReceta) {
      const h2 = document.createElement("h2");
      h2.textContent = receta.title;
      tituloReceta.appendChild(h2);
    }

    // Agregar porciones
    if (portions) {
      const p = document.createElement("p");
      p.textContent = receta.portions;
      portions.appendChild(p);
    }

    // Agregar imagenes (recorre con forEach porque es un array)
    if (photoRecipe && receta.image) {
      photoRecipe.src = receta.image;
    }

    // Agregar ingredientes (no hace falta el foreach pq no es un array y cada receta tiene su id distinto)
    if (listaIngredientes) {
      receta.ingredients.forEach((ingredient) => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        listaIngredientes.appendChild(li);
      });
    }

    // Agregar instrucciones (recorre con forEach porque es un array)
    if (contenedorInstrucciones && receta.instruction) {
      receta.instruction.forEach((instruction) => {
        const p = document.createElement("p");
        p.textContent = instruction;
        contenedorInstrucciones.appendChild(p);
      });
    }
  }

  // Si estamos en la página de la lista de recetas
  if (listaNames) {
    // Crear el contenedor principal con Bootstrap
    const container = document.createElement("div");
    container.className = "container text-center";

    let row; // Variable para crear nuevas filas
    data.forEach((item, i) => {
      // Crear una nueva fila cada 3 recetas
      if (i % 4 === 0) {
        row = document.createElement("div");
        row.className = "row align-items-center mb-3"; // Nueva fila con margen abajo
        container.appendChild(row);
      }

      // Crear la columna de Bootstrap para cada receta
      const col = document.createElement("div");
      col.className = "col"; // Clase de columna de Bootstrap
      // Crear un enlace que apunte a la página de detalles de la receta
      const link = document.createElement("a");
      link.textContent = item.title; // Texto del enlace es el título de la receta
      link.href = `recipe.html?id=${i}`; // Enlace con el ID de la receta
      link.target = "_self"; // Abrir en la misma pestaña

      col.appendChild(link); // Agregar el enlace a la columna
      row.appendChild(col); // Agregar la columna a la fila
    });

    container.appendChild(row); // Agregar la fila al contenedor principal
    listaNames.appendChild(container); // Agregar el contenedor a la lista de recetas
  }
});
