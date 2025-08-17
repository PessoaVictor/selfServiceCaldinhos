class MenuSystem {
    constructor() {
        this.produtos = [];
        this.filteredProdutos = [];
        this.init();
    }
    init() {
        this.loadProdutos();
        this.setupEventListeners();
    }
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('search-menu');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.searchMenu(e.target.value);
                });
                searchInput.addEventListener('keyup', (e) => {
                    this.searchMenu(e.target.value);
                });
            }
        });
    }
    loadProdutos() {
        const produtosPadrao = [
            {
                id: 1,
                nome: 'Caldinho de Feijão Preto',
                preco: 18.90,
                categoria: 'caldinho',
                descricao: 'Nosso carro-chefe! Feijão preto cremoso com linguiça calabresa, bacon defumado, cebola dourada e temperos especiais da casa.',
                rating: 4.9,
                avaliacoes: 156,
                gradient: 'linear-gradient(135deg, var(--red-primary), var(--red-dark))'
            },
            {
                id: 2,
                nome: 'Caldinho de Camarão',
                preco: 24.90,
                categoria: 'caldinho',
                descricao: 'Camarões frescos em caldo cremoso com leite de coco, temperos nordestinos, pimentão e coentro fresco.',
                rating: 4.8,
                avaliacoes: 89,
                gradient: 'linear-gradient(135deg, var(--yellow-primary), var(--yellow-dark))'
            },
            {
                id: 3,
                nome: 'Caldinho de Mandioca',
                preco: 16.90,
                categoria: 'caldinho',
                descricao: 'Mandioca cremosa com carne de sol desfiada, queijo coalho e cheiro-verde. Uma delícia nordestina!',
                rating: 4.7,
                avaliacoes: 72,
                gradient: 'linear-gradient(135deg, #8B4513, #A0522D)'
            },
            {
                id: 4,
                nome: 'Porção Mista',
                preco: 22.50,
                categoria: 'petisco',
                descricao: 'Combinação perfeita: pastéis, coxinhas, bolinhos de queijo e torresmo. Ideal para compartilhar!',
                rating: 4.6,
                avaliacoes: 134,
                gradient: 'linear-gradient(135deg, #FF6B35, #E55A2B)'
            },
            {
                id: 5,
                nome: 'Bebidas Geladas',
                preco: 5.90,
                categoria: 'bebida',
                descricao: 'Cerveja gelada, refrigerantes, sucos naturais, água de coco e nossa famosa caipirinha da casa.',
                rating: 4.8,
                avaliacoes: 201,
                gradient: 'linear-gradient(135deg, #4A90E2, #357ABD)',
                priceLabel: 'A partir de R$ 5,90'
            },
            {
                id: 6,
                nome: 'Sobremesas Caseiras',
                preco: 12.90,
                categoria: 'sobremesa',
                descricao: 'Pudim de leite, brigadeirão, mousse de maracujá e outras delícias.',
                rating: 4.9,
                avaliacoes: 67,
                gradient: 'linear-gradient(135deg, #D4AF37, #B8941F)'
            }
        ];
        const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
        this.produtos = [...produtosPadrao, ...produtosSalvos];
        this.filteredProdutos = [...this.produtos];
        this.renderMenu();
    }
    renderMenu() {
        const menuItems = document.querySelectorAll('.menu-item');
        const searchTerm = document.getElementById('search-menu')?.value.toLowerCase().trim() || '';
        
        menuItems.forEach(item => {
            const title = item.querySelector('.menu-title')?.textContent.toLowerCase() || '';
            const description = item.querySelector('.menu-description')?.textContent.toLowerCase() || '';
            const tags = Array.from(item.querySelectorAll('.menu-tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
            
            const matches = !searchTerm || 
                           title.includes(searchTerm) || 
                           description.includes(searchTerm) || 
                           tags.includes(searchTerm);
            
            if (matches) {
                item.style.display = 'block';
                item.style.opacity = '1';
            } else {
                item.style.display = 'none';
                item.style.opacity = '0';
            }
        });
    }
    searchMenu(searchTerm) {
        console.log('Searching for:', searchTerm);
        this.renderMenu();
    }
    orderItem(produtoId) {
        const produto = this.produtos.find(p => p.id === produtoId);
        if (produto) {
            alert(`🍽️ Pedido realizado: ${produto.nome}\nPreço: R$ ${produto.preco.toFixed(2)}\n\nEm breve implementaremos o sistema de pedidos completo!`);
        }
    }
    addProduto(novoProduto) {
        novoProduto.id = Date.now();
        novoProduto.rating = 0;
        novoProduto.avaliacoes = 0;
        novoProduto.gradient = this.getRandomGradient();
        this.produtos.push(novoProduto);
        this.filteredProdutos = [...this.produtos];
        const produtosPersonalizados = this.produtos.filter(p => p.id > 1000);
        localStorage.setItem('produtos', JSON.stringify(produtosPersonalizados));
        this.renderMenu();
    }
    removeProduto(produtoId) {
        this.produtos = this.produtos.filter(p => p.id !== produtoId);
        this.filteredProdutos = [...this.produtos];
        const produtosPersonalizados = this.produtos.filter(p => p.id > 1000);
        localStorage.setItem('produtos', JSON.stringify(produtosPersonalizados));
        this.renderMenu();
    }
    getRandomGradient() {
        const gradients = [
            'linear-gradient(135deg, var(--red-primary), var(--red-dark))',
            'linear-gradient(135deg, var(--yellow-primary), var(--yellow-dark))',
            'linear-gradient(135deg, #8B4513, #A0522D)',
            'linear-gradient(135deg, #FF6B35, #E55A2B)',
            'linear-gradient(135deg, #4A90E2, #357ABD)',
            'linear-gradient(135deg, #D4AF37, #B8941F)'
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
    }
}
function searchMenu() {
    const searchTerm = document.getElementById('search-menu').value;
    window.menuSystem.searchMenu(searchTerm);
}
