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
    <a href="recetas/recipe.html?id=${i}" "target=_blank"> Receta Completa </a>
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
  const recipeId = urlParams.get("id");
  const listaNames = document.getElementById("recetas");

  // Si hay un ID de receta, carga los detalles de la receta
  if (recipeId !== null && recipeId >= 0 && recipeId < data.length) {
    const receta = data[recipeId];
    const listaIngredientes = document.getElementById("ingredientes");
    const contenedorInstrucciones = document.getElementById("instrucciones");

    // Agregar ingredientes
    if (listaIngredientes) {
      receta.ingredients.forEach((ingredient) => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        listaIngredientes.appendChild(li);
      });
    }

    // Agregar instrucciones
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

    const row = document.createElement("div");
    row.className = "row align-items-center";

    // Itera sobre los datos y crea un elemento <li> para cada receta
    data.forEach((item, i) => {
      const col = document.createElement("div");
      col.className = "col"; // Clase de columna de Bootstrap

      // Crear un enlace que apunte a la página de detalles de la receta
      const link = document.createElement("a");
      link.textContent = item.title; // Texto del enlace es el título de la receta
      link.href = `recetas/recipe.html?id=${i}`; // Enlace con el ID de la receta
      link.target = "_self"; // Abrir en la misma pestaña

      col.appendChild(link); // Agregar el enlace a la columna
      row.appendChild(col); // Agregar la columna a la fila
    });

    container.appendChild(row); // Agregar la fila al contenedor principal
    listaNames.appendChild(container); // Agregar el contenedor a la lista de recetas
  }
});
