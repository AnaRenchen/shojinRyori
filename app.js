// Função para realizar a pesquisa e exibir os resultados
function search() {
  let campoPesquisa = document
    .getElementById("campo-pesquisa")
    .value.trim()
    .toLowerCase();
  // Seleciona a seção onde os resultados da pesquisa serão exibidos
  let section = document.getElementById("resultados-pesquisa");

  if (!campoPesquisa) {
    Swal.fire({
      text: "Debe ingresar el nombre de la receta o una palabra clave para buscarla.",
      background: "#f2f2f2",
      color: "#333",
      confirmButtonColor: "#808080",
      toast: true,
    });
    return;
  }

  // Inicializa uma string vazia para armazenar os resultados
  let results = "";
  let title = "";
  let description = "";
  let tags = "";
  let ingredients = "";

  // Itera sobre cada item do conjunto de dados
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    title = item.title.toLowerCase();
    description = item.description.toLowerCase();
    tags = item.tags.toLowerCase();
    let ingredients = item.ingredients.join(", ").toLowerCase();
    if (
      title.includes(campoPesquisa) ||
      description.includes(campoPesquisa) ||
      tags.includes(campoPesquisa) ||
      ingredients.includes(campoPesquisa)
    ) {
      // Cria uma div para cada item, formatando os dados como HTML
      results += `<div class="item-resultado">
    <h2>${item.title}</h2>
    <p>${item.description}</p>
    <a href="recetas/recipe.html?id=${i}" "target=_blank"> Receta Completa </a>
  </div>`;
    }
  }
  if (!results) {
    Swal.fire({
      text: "No hay resultados para su búsqueda",
      background: "#f2f2f2",
      color: "#333",
      confirmButtonColor: "#808080",
      toast: true,
    });
  }
  // Atribui o HTML gerado à seção de resultados
  section.innerHTML = results;
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id"); // Obtiene el ID de la receta

  if (recipeId !== null && recipeId >= 0 && recipeId < data.length) {
    const receta = data[recipeId]; // Selecciona la receta por ID

    const listaIngredientes = document.getElementById("ingredientes");
    const contenedorInstrucciones = document.getElementById("instrucciones");

    // Agregar ingredientes
    receta.ingredients.forEach((ingredient) => {
      const li = document.createElement("li");
      li.textContent = ingredient;
      listaIngredientes.appendChild(li);
    });

    // Agregar instrucciones
    if (receta.instruction) {
      receta.instruction.forEach((instruction) => {
        const p = document.createElement("p");
        p.textContent = instruction;
        contenedorInstrucciones.appendChild(p);
      });
    }

    // Agregar título
    const titleElement = document.getElementById("title");
    titleElement.textContent = receta.title;
  } else {
    // Mostrar mensaje de error si no se encuentra la receta
    document.getElementById("title").textContent = "Receta no encontrada";
  }
});
