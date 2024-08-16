document.addEventListener('DOMContentLoaded', function() {
    const listaDeopcionaisContratados = $('#listaDeopcionaisContratados');
    const listaDeopcionaisCortesia = $('#listaDeopcionaisCortesia');
    const searchProductContratados = $('#searchProductContratados');
    const searchProductCortesia = $('#searchProductCortesia');
    const valorFinalInput = document.getElementById('valorfinal');
    const tipoDeEntradaInput = document.getElementById('tipoDeEntrada');
    const valorDeEntradaInput = document.getElementById('valorDeEntrada');
    const valorDo70Input = document.getElementById('valorDo70');
    const form = document.getElementById('eventForm');
    let products = [];

    // Inicializar Select2 para as listas
    listaDeopcionaisContratados.select2({
        placeholder: "Selecione ou adicione opcionais contratados",
        tags: true,
        tokenSeparators: [','],
        width: '100%'
    });

    listaDeopcionaisCortesia.select2({
        placeholder: "Selecione ou adicione opcionais cortesia",
        tags: true,
        tokenSeparators: [','],
        width: '100%'
    });

    // Função para buscar produtos da API
    async function fetchProducts() {
        try {
            const response = await fetch('https://novo-nome-do-app-ba5a0bbd9a20.herokuapp.com/api/products');
            products = await response.json();
            initializeSearchFields();
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    }

    // Inicializar os campos de pesquisa com Select2 e produtos da API
    function initializeSearchFields() {
        const options = products.map(product => ({
            id: product.name, // Usar o nome como id para garantir que o texto seja enviado
            text: product.name
        }));

        searchProductContratados.select2({
            placeholder: 'Digite o nome do produto...',
            data: options,
            tags: true,  // Permite a adição de novos itens (texto livre)
            tokenSeparators: [','],
            dropdownCssClass: "custom-select2-dropdown",  // Custom dropdown class
            width: '100%'
        });

        searchProductCortesia.select2({
            placeholder: 'Digite o nome do produto...',
            data: options,
            tags: true,  // Permite a adição de novos itens (texto livre)
            tokenSeparators: [','],
            dropdownCssClass: "custom-select2-dropdown",  // Custom dropdown class
            width: '100%'
        });

        searchProductContratados.on('select2:select', function(e) {
            const productText = e.params.data.text;
            const option = new Option(productText, productText, false, true);
            listaDeopcionaisContratados.append(option).trigger('change');
            searchProductContratados.val(null).trigger('change'); // Limpa o campo de pesquisa após adicionar
        });

        searchProductCortesia.on('select2:select', function(e) {
            const productText = e.params.data.text;
            const option = new Option(productText, productText, false, true);
            listaDeopcionaisCortesia.append(option).trigger('change');
            searchProductCortesia.val(null).trigger('change'); // Limpa o campo de pesquisa após adicionar
        });
    }

    // Função para calcular o valor da entrada e o valor restante
    function calculatePaymentFields() {
        const valorFinal = parseFloat(valorFinalInput.value) || 0;
        const tipoEntrada = parseInt(tipoDeEntradaInput.value) || 100;

        const valorEntrada = valorFinal * (tipoEntrada / 100);
        const valorRestante = valorFinal - valorEntrada;

        valorDeEntradaInput.value = valorEntrada.toFixed(2);
        valorDo70Input.value = valorRestante.toFixed(2);
    }

    // Atualizar os valores de entrada e parcela restante quando os campos mudarem
    tipoDeEntradaInput.addEventListener('change', calculatePaymentFields);
    valorFinalInput.addEventListener('input', calculatePaymentFields);

    // Função para validar o formulário
    function validateForm() {
        const inputs = form.querySelectorAll('input[required], select[required]');
        for (let input of inputs) {
            if (!input.value) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return false;
            }
        }
        return true;
    }

    // Submissão do formulário com validação, envio via fetch e mensagem de sucesso
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        if (validateForm()) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Converter campos de listas em strings separadas por vírgula (textos finais)
            data.listaDeopcionaisContratados = listaDeopcionaisContratados.val().join(', ');
            data.listaDeopcionaisCortesia = listaDeopcionaisCortesia.val().join(', ');

            try {
                const response = await fetch('https://novo-nome-do-app-ba5a0bbd9a20.herokuapp.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Formulário enviado com sucesso!');
                    form.reset();  // Reseta o formulário após o envio
                    listaDeopcionaisContratados.val(null).trigger('change');
                    listaDeopcionaisCortesia.val(null).trigger('change');
                } else {
                    alert('Falha ao enviar o formulário. Por favor, tente novamente.');
                }
            } catch (error) {
                console.error('Erro ao enviar o formulário:', error);
                alert('Erro ao enviar o formulário. Por favor, tente novamente.');
            }
        }
    });

    // Buscar produtos ao carregar a página
    fetchProducts();
});
