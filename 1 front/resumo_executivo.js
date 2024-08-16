// resumo_executivo.js
$(document).ready(function () {
    // Função para buscar produtos para o resumo
    function fetchSummaryProducts() {
      $.ajax({
        url: '/api/resumo/produtos',
        method: 'GET',
        success: function (data) {
          populateSummaryTable(data);
        },
        error: function (error) {
          console.error('Erro ao buscar produtos para o resumo:', error);
        }
      });
    }
  
    // Função para preencher a tabela de resumo
    function populateSummaryTable(products) {
      const tableBody = $('#summaryTableBody');
      tableBody.empty();
  
      products.forEach(product => {
        const row = `
          <tr>
            <td>${product.nome}</td>
            <td>${product.tipo}</td>
            <td>${product.valorVenda}</td>
            <td>${product.valorCusto}</td>
            <td>
              <button class="btn btn-sm btn-primary add-to-summary" data-id="${product.id}">Adicionar</button>
            </td>
          </tr>
        `;
        tableBody.append(row);
      });
    }
  
    // Evento para adicionar produto ao resumo
    $(document).on('click', '.add-to-summary', function () {
      const productId = $(this).data('id');
      $.ajax({
        url: `/api/resumo/produtos/${productId}`,
        method: 'POST',
        success: function () {
          fetchSummaryItems();
        },
        error: function (error) {
          console.error('Erro ao adicionar produto ao resumo:', error);
        }
      });
    });
  
    // Função para buscar itens do resumo
    function fetchSummaryItems() {
      $.ajax({
        url: '/api/resumo/itens',
        method: 'GET',
        success: function (data) {
          populateSummaryItemsTable(data);
        },
        error: function (error) {
          console.error('Erro ao buscar itens do resumo:', error);
        }
      });
    }
  
    // Função para preencher a tabela de itens do resumo
    function populateSummaryItemsTable(items) {
      const tableBody = $('#summaryItemsTableBody');
      tableBody.empty();
  
      items.forEach(item => {
        const row = `
          <tr>
            <td>${item.nome}</td>
            <td>${item.tipo}</td>
            <td>${item.valorVenda}</td>
            <td>${item.valorCusto}</td>
            <td>
              <button class="btn btn-sm btn-danger remove-from-summary" data-id="${item.id}">Remover</button>
            </td>
          </tr>
        `;
        tableBody.append(row);
      });
    }
  
    // Evento para remover item do resumo
    $(document).on('click', '.remove-from-summary', function () {
      const itemId = $(this).data('id');
      if (confirm('Tem certeza que deseja remover este item do resumo?')) {
        $.ajax({
          url: `/api/resumo/itens/${itemId}`,
          method: 'DELETE',
          success: function () {
            fetchSummaryItems();
          },
          error: function (error) {
            console.error('Erro ao remover item do resumo:', error);
          }
        });
      }
    });
  
    // Função de pesquisa na tabela de produtos do resumo
    $('#searchSummaryInput').on('keyup', function () {
      const searchTerm = $(this).val().toLowerCase();
      $('#summaryTableBody tr').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(searchTerm) > -1);
      });
    });
  
    // Inicialização
    fetchSummaryProducts();
    fetchSummaryItems();
  });
  