// Função para realizar a pesquisa e exibir os resultados
function search() {
  let campoPesquisa = document
    .getElementById("campo-pesquisa")
    .value.trim()
    .toLowerCase();
  // Seleciona a seção onde os resultados da pesquisa serão exibidos
  let section = document.getElementById("resultados-pesquisa");

  if (!campoPesquisa) {
    section.innerHTML = "<p> No results.</p>";
    return;
  }

  // Inicializa uma string vazia para armazenar os resultados
  let results = "";
  let title = "";
  let description = "";
  let tags = "";

  // Itera sobre cada item do conjunto de dados
  for (let item of data) {
    title = item.title.toLowerCase();
    description = item.description.toLowerCase();
    tags = item.tags.toLowerCase();
    if (
      title.includes(campoPesquisa) ||
      description.includes(campoPesquisa) ||
      tags.includes(campoPesquisa)
    ) {
      // Cria uma div para cada item, formatando os dados como HTML
      results += `<div class="item-resultado">
    <h2>${item.title}</h2>
    <p>${item.description}</p>
    <a href="" target="_blank"> More Information</a>
  </div>`;
    }
  }
  if (!results) {
    results = "<p> No results.</p>";
  }
  // Atribui o HTML gerado à seção de resultados
  section.innerHTML = results;
}
