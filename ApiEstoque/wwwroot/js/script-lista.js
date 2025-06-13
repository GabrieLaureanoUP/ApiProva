const API_URL = '/api/produtos';
let produtos = [];
let produtoIdParaExcluir = null;

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupEventListeners();
    carregarProdutos();
}

function setupEventListeners() {
    document.getElementById('pesquisa').addEventListener('input', filtrarProdutos);
    
    document.getElementById('btn-confirmar-exclusao').addEventListener('click', confirmarExclusao);
    document.getElementById('btn-cancelar-exclusao').addEventListener('click', () => {
        document.getElementById('modal-confirmacao').style.display = 'none';
        produtoIdParaExcluir = null;
    });
}

async function carregarProdutos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Erro ao carregar produtos: ${response.status}`);
        
        produtos = await response.json();
        renderizarProdutos(produtos);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar produtos. Verifique o console para mais detalhes.');
    }
}

function renderizarProdutos(produtosParaExibir) {
    const tbody = document.getElementById('tabela-produtos').querySelector('tbody');
    tbody.innerHTML = '';

    if (produtosParaExibir.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum produto encontrado</td></tr>';
        return;
    }

    produtosParaExibir.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>${produto.quantidade}</td>
            <td>${formatarPreco(produto.preco)}</td>
            <td>${produto.descricao || '-'}</td>
            <td>
                <button class="btn-acao btn-editar" data-id="${produto.id}">Editar</button>
                <button class="btn-acao btn-excluir" data-id="${produto.id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => editarProduto(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', () => exibirModalExclusao(btn.getAttribute('data-id')));
    });
}

function filtrarProdutos() {
    const termo = document.getElementById('pesquisa').value.toLowerCase();
    
    if (!termo) {
        renderizarProdutos(produtos);
        return;
    }
    
    const produtosFiltrados = produtos.filter(produto => 
        produto.nome.toLowerCase().includes(termo) ||
        produto.descricao?.toLowerCase().includes(termo) ||
        produto.id.toString().includes(termo)
    );
    
    renderizarProdutos(produtosFiltrados);
}

function formatarPreco(preco) {
    return `R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}`;
}

function editarProduto(id) {
    window.location.href = `cadastro.html?id=${id}`;
}

function exibirModalExclusao(id) {
    produtoIdParaExcluir = id;
    document.getElementById('modal-confirmacao').style.display = 'flex';
}

async function confirmarExclusao() {
    if (!produtoIdParaExcluir) return;
    
    try {
        const response = await fetch(`${API_URL}/${produtoIdParaExcluir}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error(`Erro ao excluir produto: ${response.status}`);
        
        alert('Produto excluído com sucesso!');
        document.getElementById('modal-confirmacao').style.display = 'none';
        produtoIdParaExcluir = null;
        
        carregarProdutos();
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto. Verifique o console para mais detalhes.');
    }
}
