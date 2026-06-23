let produtos = [];
let carrinho = [];

async function carregarProdutos() {
    try {
        const response = await fetch('produtos.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos: ' + response.statusText);
        }
        const data = await response.json();
        produtos = data;
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        console.warn('usando dados locais (fallback):', error);
        produtos = [
            {
                id: 1,
                nome: 'Notebook rosa',
                preco: 6742.90,
                categoria: 'computador',
                imagem: 'https://i.pinimg.com/736x/80/8c/7c/808c7cf59f7c985f9b8fa27871e729f2.jpg',
                estoque: 15,
                descricao: 'Computador rosa e bonitinho.'
            },
            {
                id: 2,
                nome: 'mouse sem fio',
                preco: 78.00,
                categoria: 'acessorios',
                imagem: 'https://i.pinimg.com/736x/e0/65/84/e065848899b3adffcb11e80194dd3335.jpg',
                estoque: 13,
                descricao: 'mouse rosa e bonitinho da my melody.'
            },
            {
                id: 3,
                nome: 'teclado rosa',
                preco: 980,
                categoria: 'acessorio',
                imagem: 'https://i.pinimg.com/736x/57/5b/84/575b8421982817af5f39dd26cd5ddd41.jpg',
                estoque: 19,
                descricao: 'teclado bonitinho de gatinho'
            },
            {
                id: 4,
                nome: 'kit solar power bank',
                preco: 140.00,
                categoria: 'acessorio',
                imagem: 'https://i.pinimg.com/736x/c3/60/e4/c360e44f0ece08cc2821abd788d7d056.jpg',
                estoque: 32,
                descricao: 'Power bank hello kitty'
            }
        ];
    }

    renderizarProdutos(produtos);
    atualizarcontadorCarrinho();
}

function renderizarProdutos(listaProdutos) {
    const produtosContainer = document.getElementById('produtosContainer');
    if (!produtosContainer) return;
    produtosContainer.innerHTML = '';

    listaProdutos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'produto-card';

        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" class="w-full h-48 object-cover mb-4 rounded-lg">

            <div class="p-5">
                <div class="flex justify-between items-center mb-2">
                    <h2 class="text-lg font-semibold text-pink-700">${produto.nome}</h2>
                    <span class="text-pink-500 font-bold">R$ ${produto.preco.toFixed(2)}</span>
                </div>

                <p class="text-gray-600 mb-3">${produto.descricao}</p>

                <button onclick="adicionarAoCarrinho(${produto.id})" class="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 w-full">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;

        produtosContainer.appendChild(card);
    });
}

function filtrarProdutos(categoria) {
    const termo = document.getElementById('busca').value.toLowerCase();
    const produtosFiltrados = produtos.filter(produto => {
        const nomeMatch = produto.nome.toLowerCase().includes(termo);
        const categoriaMatch = categoria === 'todos' || produto.categoria === categoria;
        return nomeMatch && categoriaMatch;
    });
    renderizarProdutos(produtosFiltrados);
}

function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    if (produto) {
        const itemNoCarrinho = carrinho.find(item => item.id === produtoId);
        if (itemNoCarrinho) {
            itemNoCarrinho.quantidade++;
        } else {
            carrinho.push({ ...produto, quantidade: 1 });
        }
        atualizarcontadorCarrinho();
        alert(`${produto.nome} adicionado ao carrinho!`);
    }
}

function atualizarcontadorCarrinho() {

    const contador =
        document.getElementById('contadorCarrinho');

    if (contador) {
        contador.textContent = carrinho.length;
    }
}
 function fecharCarrinho() {

    const modal =
        document.getElementById('carrinhoModal');

    modal.classList.add('hidden');
}

function mostrarCarrinho() {
    const carrinhoContainer = document.getElementById('carrinhoContainer');
    const totalContainer = document.getElementById('totalContainer');
    if (!carrinhoContainer || !totalContainer) return;

    carrinhoContainer.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
        carrinhoContainer.innerHTML = '<p class="text-pink-700">Carrinho vazio</p>';
        totalContainer.textContent = 'Total: R$ 0.00';
        return;
    }

    carrinho.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex justify-between items-center mb-3 border-b pb-2';
        itemDiv.innerHTML = `
            <span>${item.nome} (x${item.quantidade})</span>
            <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
            <button class="text-red-600 hover:text-red-800 ml-2" onclick="removerDoCarrinho(${index})">Remover</button>
        `;
        carrinhoContainer.appendChild(itemDiv);
        total += item.preco * item.quantidade;
    });

    totalContainer.textContent = `Total: R$ ${total.toFixed(2)}`;
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarcontadorCarrinho();
    mostrarCarrinho();
}

function fecharCarrinho() {
    const modal = document.getElementById('carrinhoModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('Carrinho vazio! Adicione produtos antes de finalizar a compra.');
        return;
    }

    const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const itens = carrinho.map(item => ({
        id: item.id,
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco
    }));

    pedidos.push({
        itens,
        total,
        data: new Date().toISOString()
    });

    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    carrinho = [];
    atualizarcontadorCarrinho();
    mostrarCarrinho();
    fecharCarrinho();
    alert(`Compra finalizada! Total: R$ ${total.toFixed(2)}`);
}
carregarProdutos();

const modal = document.getElementById('carrinhoModal');

if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const modal = document.getElementById('carrinhoModal');

modal.classList.remove('translate-x-full');
}



