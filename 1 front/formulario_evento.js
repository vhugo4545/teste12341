document.addEventListener('DOMContentLoaded', function() {
    const listaDeopcionaisContratados = $('#listaDeopcionaisContratados');
    const listaDeopcionaisCortesia = $('#listaDeopcionaisCortesia');
    const searchProductInput = document.getElementById('searchProduct');
    const productSearchResults = document.getElementById('productSearchResults');

    // Inicializar Select2
    listaDeopcionaisContratados.select2();
    listaDeopcionaisCortesia.select2();

    // Função para buscar produtos da API
    async function fetchProducts() {
        try {
            const response = await fetch('https://novo-nome-do-app-ba5a0bbd9a20.herokuapp.com/api/products');
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return [];
        }
    }

    // Função para exibir os resultados da pesquisa
    function renderSearchResults(products) {
        productSearchResults.innerHTML = '';
        products.forEach(product => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = product.name;
            li.addEventListener('click', () => addProductToList(product));
            productSearchResults.appendChild(li);
        });
    }

    // Adicionar produto à lista de opcionais contratados ou cortesia
    function addProductToList(product) {
        const option = new Option(product.name, product._id);
        const selectType = confirm('Deseja adicionar este produto como Cortesia?') ? listaDeopcionaisCortesia : listaDeopcionaisContratados;
        selectType.append(option);
        productSearchResults.innerHTML = '';  // Limpa os resultados após adicionar
        searchProductInput.value = '';  // Limpa o campo de pesquisa
    }

    // Função de pesquisa de produtos
    searchProductInput.addEventListener('input', async function() {
        const searchText = searchProductInput.value.toLowerCase();
        if (searchText.length > 2) { // Pesquisa começa após 3 caracteres
            const products = await fetchProducts();
            const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchText));
            renderSearchResults(filteredProducts);
        } else {
            productSearchResults.innerHTML = ''; // Limpa os resultados se o texto for muito curto
        }
    });
});
