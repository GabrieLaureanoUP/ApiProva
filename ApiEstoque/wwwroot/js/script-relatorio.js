const API_URL = '/api/produtos';
let produtos = [];

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    carregarProdutos();
}

async function carregarProdutos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Erro ao carregar produtos: ${response.status}`);
        
        produtos = await response.json();
        gerarRelatorio();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar produtos. Verifique o console para mais detalhes.');
    }
}

function gerarRelatorio() {
    if (produtos.length === 0) {
        alert('Não há produtos cadastrados para gerar o relatório.');
        return;
    }
    
    atualizarCardsTotais();
    criarGraficos();
}

function atualizarCardsTotais() {
    document.querySelector('#total-produtos .card-value').textContent = produtos.length;
    
    const valorTotal = produtos.reduce((total, produto) => {
        return total + (produto.preco * produto.quantidade);
    }, 0);
    document.querySelector('#valor-estoque .card-value').textContent = formatarPreco(valorTotal);
    
    const produtoMaiorValor = [...produtos].sort((a, b) => b.preco - a.preco)[0];
    document.querySelector('#produto-maior-valor .card-value').textContent = 
        `${produtoMaiorValor.nome} (${formatarPreco(produtoMaiorValor.preco)})`;
    
    const produtoMenorEstoque = [...produtos].filter(p => p.quantidade > 0).sort((a, b) => a.quantidade - b.quantidade)[0];
    
    if (produtoMenorEstoque) {
        document.querySelector('#produto-menor-estoque .card-value').textContent = 
            `${produtoMenorEstoque.nome} (${produtoMenorEstoque.quantidade} unid.)`;
    } else {
        document.querySelector('#produto-menor-estoque .card-value').textContent = 'Nenhum produto em estoque';
    }
}

function criarGraficos() {
    criarGraficoValorEstoque();
    criarGraficoQuantidade();
}

function criarGraficoValorEstoque() {
    const container = document.getElementById('grafico-valor-estoque');
    container.innerHTML = '';
    
    const produtosOrdenados = [...produtos]
        .filter(p => p.quantidade > 0)
        .map(p => ({
            ...p,
            valorTotal: p.preco * p.quantidade
        }))
        .sort((a, b) => b.valorTotal - a.valorTotal)
        .slice(0, 5); 
    
    if (produtosOrdenados.length === 0) {
        container.innerHTML = '<p class="sem-dados">Sem dados para exibir</p>';
        return;
    }
    
    const maiorValor = Math.max(...produtosOrdenados.map(p => p.valorTotal));
    
    produtosOrdenados.forEach(produto => {
        const percentual = (produto.valorTotal / maiorValor) * 100;
        
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = produto.nome;
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = `${percentual}%`;
        
        const value = document.createElement('div');
        value.className = 'bar-value';
        value.textContent = formatarPreco(produto.valorTotal);
        
        barContainer.appendChild(label);
        barContainer.appendChild(bar);
        barContainer.appendChild(value);
        
        container.appendChild(barContainer);
    });
}

function criarGraficoQuantidade() {
    const container = document.getElementById('grafico-quantidade');
    container.innerHTML = '';
    
    const produtosOrdenados = [...produtos]
        .filter(p => p.quantidade > 0)
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 5); 
    
    if (produtosOrdenados.length === 0) {
        container.innerHTML = '<p class="sem-dados">Sem dados para exibir</p>';
        return;
    }
    
    const maiorQuantidade = Math.max(...produtosOrdenados.map(p => p.quantidade));
    
    produtosOrdenados.forEach(produto => {
        const percentual = (produto.quantidade / maiorQuantidade) * 100;
        
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = produto.nome;
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = `${percentual}%`;
        
        const value = document.createElement('div');
        value.className = 'bar-value';
        value.textContent = `${produto.quantidade} unid.`;
        
        barContainer.appendChild(label);
        barContainer.appendChild(bar);
        barContainer.appendChild(value);
        
        container.appendChild(barContainer);
    });
}

function formatarPreco(preco) {
    return `R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}`;
}
