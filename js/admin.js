class AdminSystem {
    constructor() {
        this.produtos = [];
        this.init();
    }
    init() {
        this.loadProdutos();
        this.setupEventListeners();
    }
    setupEventListeners() {
        const adminForm = document.getElementById('admin-form');
        if (adminForm) {
            adminForm.addEventListener('submit', (e) => {
                this.handleAddProduto(e);
            });
        }
        const searchInput = document.querySelector('#admin-section input[type="search"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProducts(e.target.value);
            });
        }
    }
    handleAddProduto(e) {
        e.preventDefault();
        if (!window.authSystem?.currentUser?.isAdmin) {
            alert('Acesso negado! Apenas administradores podem adicionar produtos.');
            return;
        }
        const produto = {
            nome: e.target.querySelector('input[placeholder*="Caldinho"]').value,
            preco: parseFloat(e.target.querySelector('input[type="number"]').value),
            categoria: e.target.querySelector('select').value,
            descricao: e.target.querySelector('textarea').value || 'Delicioso produto do nosso cardápio.',
        };
        if (!produto.nome || !produto.preco || !produto.categoria) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }
        if (produto.preco <= 0) {
            alert('O preço deve ser maior que zero!');
            return;
        }
        window.menuSystem.addProduto(produto);
        this.loadProdutos();
        alert('✅ Produto adicionado com sucesso!');
        e.target.reset();
    }
    loadProdutos() {
        this.produtos = window.menuSystem ? window.menuSystem.produtos : [];
        this.renderProductList();
    }
    renderProductList() {
        const container = document.getElementById('admin-produtos');
        if (!container) return;
        if (this.produtos.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--gray-500);">
                    <i class="fas fa-utensils" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <p>Nenhum produto encontrado</p>
                    <p style="font-size: 0.875rem;">Use o formulário ao lado para adicionar produtos.</p>
                </div>
            `;
            return;
        }
        container.innerHTML = this.produtos.map(produto => `
            <div class="card produto-admin-card" style="margin-bottom: 1rem;" data-produto-id="${produto.id}">
                <div style="padding: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 0.5rem 0; color: var(--black-primary);">${produto.nome}</h4>
                            <div style="display: flex; gap: 1rem; margin-bottom: 0.5rem;">
                                <span style="background: var(--yellow-primary); color: var(--black-primary); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">
                                    ${produto.categoria}
                                </span>
                                <span style="color: var(--red-primary); font-weight: 700; font-size: 1.1rem;">
                                    R$ ${produto.preco.toFixed(2)}
                                </span>
                            </div>
                            <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem; line-height: 1.4;">
                                ${produto.descricao}
                            </p>
                            ${produto.rating ? `
                                <div style="margin-top: 0.5rem; color: var(--yellow-primary); font-size: 0.875rem;">
                                    ⭐ ${produto.rating} (${produto.avaliacoes} avaliações)
                                </div>
                            ` : ''}
                        </div>
                        ${produto.id > 1000 ? `
                            <button class="btn btn-ghost" onclick="adminSystem.removeProduto(${produto.id})" 
                                    style="padding: 0.5rem; color: var(--red-primary); margin-left: 1rem;" 
                                    title="Remover produto">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : `
                            <div style="padding: 0.5rem; margin-left: 1rem; color: var(--gray-400);" title="Produto padrão - não pode ser removido">
                                <i class="fas fa-lock"></i>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `).join('');
    }
    removeProduto(produtoId) {
        if (produtoId <= 1000) {
            alert('Produtos padrão não podem ser removidos!');
            return;
        }
        if (!window.authSystem?.currentUser?.isAdmin) {
            alert('Acesso negado!');
            return;
        }
        if (confirm('🗑️ Tem certeza que deseja remover este produto?')) {
            window.menuSystem.removeProduto(produtoId);
            this.loadProdutos();
            alert('✅ Produto removido com sucesso!');
        }
    }
    filterProducts(searchTerm) {
        const cards = document.querySelectorAll('.produto-admin-card');
        const term = searchTerm.toLowerCase();
        cards.forEach(card => {
            const nome = card.querySelector('h4').textContent.toLowerCase();
            const categoria = card.querySelector('span').textContent.toLowerCase();
            const descricao = card.querySelector('p').textContent.toLowerCase();
            if (nome.includes(term) || categoria.includes(term) || descricao.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    getStats() {
        const stats = {
            totalProdutos: this.produtos.length,
            porCategoria: {},
            precoMedio: 0
        };
        this.produtos.forEach(produto => {
            stats.porCategoria[produto.categoria] = (stats.porCategoria[produto.categoria] || 0) + 1;
        });
        if (this.produtos.length > 0) {
            const totalPrecos = this.produtos.reduce((sum, produto) => sum + produto.preco, 0);
            stats.precoMedio = totalPrecos / this.produtos.length;
        }
        return stats;
    }
}
