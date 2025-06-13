const API_URL = '/api/produtos';
let editandoProduto = false;
let produtoId = null;

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupEventListeners();
    verificarParametrosURL();
}

function setupEventListeners() {
    document.getElementById('form-produto').addEventListener('submit', salvarProduto);
    document.getElementById('btn-cancelar').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

function verificarParametrosURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
        editandoProduto = true;
        produtoId = id;
        carregarProduto(id);
        document.getElementById('form-title').textContent = 'Editar Produto';
    } else {
        limparFormulario();
        document.getElementById('form-title').textContent = 'Cadastrar Novo Produto';
    }
}

async function carregarProduto(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error(`Erro ao carregar produto: ${response.status}`);
        
        const produto = await response.json();
        preencherFormulario(produto);
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        alert('Erro ao carregar produto. Verifique o console para mais detalhes.');
        window.location.href = 'index.html';
    }
}

function preencherFormulario(produto) {
    document.getElementById('produto-id').value = produto.id;
    document.getElementById('nome').value = produto.nome;
    document.getElementById('quantidade').value = produto.quantidade;
    document.getElementById('preco').value = produto.preco;
    document.getElementById('descricao').value = produto.descricao || '';
}

function limparFormulario() {
    document.getElementById('form-produto').reset();
    document.getElementById('produto-id').value = '';
}

async function salvarProduto(event) {
    event.preventDefault();
    
    const produto = {
        nome: document.getElementById('nome').value,
        quantidade: parseInt(document.getElementById('quantidade').value),
        preco: parseFloat(document.getElementById('preco').value),
        descricao: document.getElementById('descricao').value
    };
    
    try {
        let response;
        let mensagem;
        
        if (editandoProduto) {
            produto.id = produtoId;
            response = await fetch(`${API_URL}/${produtoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });
            mensagem = 'Produto atualizado com sucesso!';
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });
            mensagem = 'Produto cadastrado com sucesso!';
        }
        
        if (!response.ok) throw new Error(`Erro ao salvar produto: ${response.status}`);
        
        alert(mensagem);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        alert('Erro ao salvar produto. Verifique o console para mais detalhes.');
    }
}
