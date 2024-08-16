document.addEventListener('DOMContentLoaded', function() {
    const productTableBody = document.getElementById('productTableBody');
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    const productForm = document.getElementById('productForm');
    const newProductButton = document.getElementById('newProductButton');
    const productIdField = document.getElementById('productId');
    const nameField = document.getElementById('name');
    const descriptionField = document.getElementById('description');
    const cost2024Field = document.getElementById('cost2024');
    const price2024Field = document.getElementById('price2024');
    const isUnitaryField = document.getElementById('isUnitary');
    const qtdConvidadosField = document.getElementById('qtdConvidados');
    const searchInput = document.getElementById('searchInput');

    // Buscar e exibir produtos
    async function fetchProducts() {
        const response = await fetch('https://novo-nome-do-app-ba5a0bbd9a20.herokuapp.com/api/products');
        const products = await response.json();
        renderProducts(products);
    }

    function renderProducts(products) {
        const searchText = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText)
        );

        const sortedProducts = filteredProducts.sort((a, b) => a.name.localeCompare(b.name));

        const numberOfGuests = parseInt(document.getElementById('cv').value) || 1;

        productTableBody.innerHTML = sortedProducts.map(product => {
            const cost2024 = product.cost;
            const price2024 = product.price;

            const cost2025 = cost2024 * 1.1;
            const price2025 = price2024 * 1.1;

            const cost2026 = cost2025 * 1.1;
            const price2026 = price2025 * 1.1;

            const finalCost2024 = product.isUnitary ? cost2024 : cost2024 * numberOfGuests;
            const finalPrice2024 = product.isUnitary ? price2024 : price2024 * numberOfGuests;

            const finalCost2025 = product.isUnitary ? cost2025 : cost2025 * numberOfGuests;
            const finalPrice2025 = product.isUnitary ? price2025 : price2025 * numberOfGuests;

            const finalCost2026 = product.isUnitary ? cost2026 : cost2026 * numberOfGuests;
            const finalPrice2026 = product.isUnitary ? price2026 : price2026 * numberOfGuests;

            return `
                <tr>
                    <td class="name-bold description-tooltip">${product.name}
                        <span class="description-text">${product.description}</span>
                    </td>
                    <td>${product.description}</td>
                    <td class="cost-field">${finalCost2024.toFixed(2)}</td>
                    <td class="cost-field">${finalCost2025.toFixed(2)}</td>
                    <td class="cost-field">${finalCost2026.toFixed(2)}</td>
                    <td class="price-field">${finalPrice2024.toFixed(2)}</td>
                    <td class="price-field">${finalPrice2025.toFixed(2)}</td>
                    <td class="price-field">${finalPrice2026.toFixed(2)}</td>
                    <td>${product.isUnitary ? 'Unitário' : 'Por Convidado'}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editProduct('${product._id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="confirmDeleteProduct('${product._id}')">Excluir</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Abrir modal para novo produto
    newProductButton.addEventListener('click', () => {
        productIdField.value = '';
        productForm.reset();
        productModal.show();
    });

    // Manipular envio do formulário
    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const product = {
            name: nameField.value,
            description: descriptionField.value,
            cost: parseFloat(cost2024Field.value),
            price: parseFloat(price2024Field.value),
            isUnitary: isUnitaryField.value === 'true'
        };

        const method = productIdField.value ? 'PUT' : 'POST';
        const url = productIdField.value ? `https://novo-nome-do-app-ba5a0bbd9a20.herokuapp.com/api/products/${productIdField.value}` : 'https://novo-nome-do-app-ba5a0bbd9a20.herokuapp.com/api/products';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });

        productModal.hide();
        fetchProducts();
    });

    // Editar produto
    window.editProduct = async function(id) {
        const response = await fetch(`https://novo-nome-do-app-ba5a0bbd9a20.herokuapp.com/api/products/${id}`);
        if (response.ok) {
            const product = await response.json();
            productIdField.value = product._id;
            nameField.value = product.name;
            descriptionField.value = product.description;
            cost2024Field.value = product.cost;
            price2024Field.value = product.price;
            isUnitaryField.value = product.isUnitary ? 'true' : 'false';

            productModal.show();
        } else {
            console.error('Produto não encontrado');
        }
    };

    // Confirmar exclusão de produto
    window.confirmDeleteProduct = function(id) {
        if (confirm("Tem certeza que quer excluir este item?")) {
            deleteProduct(id);
        }
    };

    // Excluir produto
    window.deleteProduct = async function(id) {
        await fetch(`https://novo-nome-do-app-ba5a0bbd9a20.herokuapp.com/api/products/${id}`, { method: 'DELETE' });
        fetchProducts();
    };

    // Buscar produtos inicialmente
    fetchProducts();

    // Adicionar evento de pesquisa
    searchInput.addEventListener('input', fetchProducts);
});
