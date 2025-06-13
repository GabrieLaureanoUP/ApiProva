const API_URL = '/api/produtos';
let produtos = [];
let produtoIdParaExcluir = null;

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupEventListeners();
    
    mostrarSecao('lista');
}

function setupEventListeners() {
    document.getElementById('btn-listar').addEventListener('click', () => mostrarSecao('lista'));
    document.getElementById('btn-cadastrar').addEventListener('click', () => {
        limparFormulario();
        document.getElementById('form-title').textContent = 'Cadastrar Novo Produto';
        mostrarSecao('cadastro');
    });
    document.getElementById('btn-relatorio').addEventListener('click', () => {
        mostrarSecao('relatorio');
        gerarRelatorio();
    });
    document.getElementById('btn-cancelar').addEventListener('click', () => mostrarSecao('lista'));
    
    document.getElementById('form-produto').addEventListener('submit', salvarProduto);
    
    document.getElementById('btn-confirmar-exclusao').addEventListener('click', confirmarExclusao);
    document.getElementById('btn-cancelar-exclusao').addEventListener('click', () => {
        document.getElementById('modal-confirmacao').style.display = 'none';
        produtoIdParaExcluir = null;
    });
    
    document.getElementById('pesquisa').addEventListener('input', filtrarProdutos);
}

function mostrarSecao(secao) {
    const sections = {
        lista: document.getElementById('lista-produtos'),
        cadastro: document.getElementById('cadastro-produto'),
        relatorio: document.getElementById('relatorio-produtos')
    };
    
    const buttons = {
        lista: document.getElementById('btn-listar'),
        cadastro: document.getElementById('btn-cadastrar'),
        relatorio: document.getElementById('btn-relatorio')
    };
    
    Object.values(sections).forEach(el => el.classList.remove('active'));
    Object.values(buttons).forEach(el => el.classList.remove('active'));
    
    sections[secao].classList.add('active');
    buttons[secao].classList.add('active');
    
    if (secao === 'lista') {
        carregarProdutos();
    }
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
            <td>${formatarPreco(produto.preco)}</td>            <td>${produto.descricao || '-'}</td>
            <td>
                <button class="btn-acao btn-editar" data-id="${produto.id}">Editar</button>
                <button class="btn-acao btn-excluir" data-id="${produto.id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => editarProduto(btn.dataset.id));
    });
    
    document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', () => abrirModalExclusao(btn.dataset.id));
    });
}

function formatarPreco(preco) {
    return preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function filtrarProdutos() {
    const termoPesquisa = document.getElementById('pesquisa').value.toLowerCase();
    const produtosFiltrados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(termoPesquisa) ||
        (produto.descricao && produto.descricao.toLowerCase().includes(termoPesquisa))
    );
    renderizarProdutos(produtosFiltrados);
}

async function editarProduto(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error(`Erro ao buscar produto: ${response.status}`);
        
        const produto = await response.json();
        
        document.getElementById('produto-id').value = produto.id;
        document.getElementById('nome').value = produto.nome;
        document.getElementById('quantidade').value = produto.quantidade;
        document.getElementById('preco').value = produto.preco;
        document.getElementById('descricao').value = produto.descricao || '';
        
        document.getElementById('form-title').textContent = 'Editar Produto';
        mostrarSecao('cadastro');
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        alert('Erro ao editar produto. Verifique o console para mais detalhes.');    }
}

async function salvarProduto(event) {
    event.preventDefault();
    
    const produto = {
        nome: document.getElementById('nome').value,
        quantidade: parseInt(document.getElementById('quantidade').value),
        preco: parseFloat(document.getElementById('preco').value),
        descricao: document.getElementById('descricao').value || null
    };
    
    const id = document.getElementById('produto-id').value;
    const isEdicao = id !== '';
    
    try {
        const url = isEdicao ? `${API_URL}/${id}` : API_URL;
        const method = isEdicao ? 'PUT' : 'POST';
        
        if (isEdicao) {
            produto.id = parseInt(id);
        }
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto)
        });
        
        if (!response.ok) throw new Error(`Erro ao salvar produto: ${response.status}`);
        
        limparFormulario();
        mostrarSecao('lista');
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        alert('Erro ao salvar produto. Verifique o console para mais detalhes.');
    }
}

function abrirModalExclusao(id) {
    produtoIdParaExcluir = id;
    document.getElementById('modal-confirmacao').style.display = 'flex';
}

async function confirmarExclusao() {
    if (!produtoIdParaExcluir) return;
    
    try {
        const response = await fetch(`${API_URL}/${produtoIdParaExcluir}`, {            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error(`Erro ao excluir produto: ${response.status}`);
        
        document.getElementById('modal-confirmacao').style.display = 'none';
        produtoIdParaExcluir = null;
        carregarProdutos();
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto. Verifique o console para mais detalhes.');
    }
}

function limparFormulario() {
    document.getElementById('form-produto').reset();
    document.getElementById('produto-id').value = '';
}

async function gerarRelatorio() {
    if (produtos.length === 0) {
        await carregarProdutos();
    }

    atualizarCardsTotais();
    gerarGraficoValorEstoque();
    gerarGraficoQuantidade();
}

function atualizarCardsTotais() {
    document.querySelector('#total-produtos .card-value').textContent = produtos.length;
    
    const valorTotalEstoque = produtos.reduce((total, p) => total + (p.preco * p.quantidade), 0);
    document.querySelector('#valor-estoque .card-value').textContent = formatarPreco(valorTotalEstoque);
    
    const produtoMaiorValor = [...produtos].sort((a, b) => b.preco - a.preco)[0];
    if (produtoMaiorValor) {
        document.querySelector('#produto-maior-valor .card-value').textContent = 
            `${produtoMaiorValor.nome} (${formatarPreco(produtoMaiorValor.preco)})`;
    }
    
    const produtoMenorEstoque = [...produtos].sort((a, b) => a.quantidade - b.quantidade)[0];
    if (produtoMenorEstoque) {
        document.querySelector('#produto-menor-estoque .card-value').textContent = 
            `${produtoMenorEstoque.nome} (${produtoMenorEstoque.quantidade} un)`;
    }
}

function gerarGraficoValorEstoque() {
    const graficoContainer = document.getElementById('grafico-valor-estoque');
    graficoContainer.innerHTML = '';
    
    const dadosGrafico = produtos
        .map(p => ({ nome: p.nome, valor: p.preco * p.quantidade }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 10);
    
    const maiorValor = Math.max(...dadosGrafico.map(item => item.valor));
    
    dadosGrafico.forEach(item => {
        const barra = document.createElement('div');
        barra.className = 'bar';
        barra.style.height = `${Math.max((item.valor / maiorValor) * 100, 5)}%`;
        
        barra.innerHTML = `
            <div class="bar-value">${formatarPreco(item.valor)}</div>
            <div class="bar-label">${item.nome}</div>
        `;
        
        graficoContainer.appendChild(barra);
    });
}

function gerarGraficoQuantidade() {
    const graficoContainer = document.getElementById('grafico-quantidade');
    graficoContainer.innerHTML = '';
    
    const dadosGrafico = [...produtos]
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 10);
    
    const maiorQuantidade = Math.max(...dadosGrafico.map(p => p.quantidade));
    
    dadosGrafico.forEach(produto => {
        const barra = document.createElement('div');
        barra.className = 'bar';
        barra.style.height = `${Math.max((produto.quantidade / maiorQuantidade) * 100, 5)}%`;
        barra.style.backgroundColor = '#27ae60';
        
        barra.innerHTML = `
            <div class="bar-value">${produto.quantidade}</div>
            <div class="bar-label">${produto.nome}</div>
        `;
        
        graficoContainer.appendChild(barra);
    });
}
