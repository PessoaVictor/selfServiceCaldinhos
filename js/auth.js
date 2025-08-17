class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.userType = null;
        this.modal = null;
        this.adminModal = null;
        this.init();
    }

    init() {
        this.modal = document.getElementById('auth-modal');
        this.adminModal = document.getElementById('admin-panel-modal');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        this.adminModal?.addEventListener('click', (e) => {
            if (e.target === this.adminModal) {
                this.closeAdminPanel();
            }
        });

        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.modal?.classList.contains('active')) {
                const emailInput = document.getElementById('login-email');
                const senhaInput = document.getElementById('login-senha');
                if (emailInput && senhaInput && (document.activeElement === emailInput || document.activeElement === senhaInput)) {
                    performLogin();
                }
            }
        });
    }

    openModal() {
        if (this.modal) {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        this.modal?.classList.remove('active');
        document.body.style.overflow = '';
        this.clearForm();
    }

    openAdminPanel() {
        this.adminModal?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeAdminPanel() {
        this.adminModal?.classList.remove('active');
        document.body.style.overflow = '';
    }

    clearForm() {
        const emailInput = document.getElementById('login-email');
        const senhaInput = document.getElementById('login-senha');
        if (emailInput) emailInput.value = '';
        if (senhaInput) senhaInput.value = '';
    }

    handleLogin(e) {
        e.preventDefault();
        const email = e.target.querySelector('#login-email').value;
        const senha = e.target.querySelector('#login-senha').value;

        const users = {
            'admin@teste.com.br': { senha: 'admin123', type: 'admin', name: 'Administrador' },
            'cliente@teste.com.br': { senha: 'cliente123', type: 'cliente', name: 'Cliente' }
        };

        if (users[email] && users[email].senha === senha) {
            this.currentUser = {
                email: email,
                name: users[email].name,
                type: users[email].type
            };
            this.isLoggedIn = true;
            this.userType = users[email].type;

            this.closeModal();
            this.updateAuthButton();

            if (users[email].type === 'admin') {
                this.showAdminDashboard();
                this.updateAdminInfo();
            } else {
                this.showClientDashboard();
            }
        } else {
            this.showMessage('Email ou senha inválidos!', 'error');
        }
    }

    showClientDashboard() {
        const clientNameElement = document.getElementById('client-name');
        if (clientNameElement) {
            clientNameElement.textContent = `Bem-vindo, ${this.currentUser.name}!`;
        }
        
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });
        
        const clientSection = document.getElementById('cliente-section');
        if (clientSection) {
            clientSection.style.display = 'block';
            clientSection.classList.add('active');
            window.scrollTo(0, 0);
        }
        
        this.showMessage('Login realizado com sucesso!', 'success');
    }

    showAdminDashboard() {
        const adminNameElement = document.getElementById('admin-name');
        const adminEmailElement = document.getElementById('admin-email-display');
        if (adminNameElement) {
            adminNameElement.textContent = `Bem-vindo, ${this.currentUser.name}!`;
        }
        if (adminEmailElement) {
            adminEmailElement.textContent = this.currentUser.email;
        }
        
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });
        
        const adminSection = document.getElementById('admin-section');
        if (adminSection) {
            adminSection.style.display = 'block';
            adminSection.classList.add('active');
            window.scrollTo(0, 0);
        }
        
        this.showMessage('Acesso administrativo autorizado!', 'success');
    }

    openModalAdminPanel() {
        this.adminModal?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    updateAuthButton() {
        const elements = this.getAuthElements();
        
        if (this.isLoggedIn) {
            this.updateLoggedInButtons(elements);
        } else {
            this.updateLoggedOutButtons(elements);
        }
    }

    getAuthElements() {
        return {
            authButton: document.querySelector('.nav-auth .btn-ghost:last-child'),
            mobileAuthButton: document.querySelector('.mobile-nav .btn-ghost:last-child'),
            userAreaButton: document.getElementById('user-area-btn'),
            mobileUserAreaButton: document.getElementById('mobile-user-area-btn')
        };
    }

    updateLoggedInButtons(elements) {
        const buttonContent = `<i class="fas fa-sign-out-alt"></i> Sair`;
        
        if (elements.authButton) {
            elements.authButton.innerHTML = buttonContent;
            elements.authButton.onclick = () => this.logout();
            elements.authButton.title = `Logado como: ${this.currentUser.name}`;
        }
        if (elements.mobileAuthButton) {
            elements.mobileAuthButton.innerHTML = buttonContent;
            elements.mobileAuthButton.onclick = () => this.logout();
        }
        if (elements.userAreaButton) {
            elements.userAreaButton.style.display = 'inline-block';
        }
        if (elements.mobileUserAreaButton) {
            elements.mobileUserAreaButton.style.display = 'block';
        }
    }

    updateLoggedOutButtons(elements) {
        const buttonContent = `<i class="fas fa-user"></i> Entrar`;
        
        if (elements.authButton) {
            elements.authButton.innerHTML = buttonContent;
            elements.authButton.onclick = () => this.openModal();
            elements.authButton.title = 'Fazer login';
        }
        if (elements.mobileAuthButton) {
            elements.mobileAuthButton.innerHTML = buttonContent;
            elements.mobileAuthButton.onclick = () => this.openModal();
        }
        if (elements.userAreaButton) {
            elements.userAreaButton.style.display = 'none';
        }
        if (elements.mobileUserAreaButton) {
            elements.mobileUserAreaButton.style.display = 'none';
        }
    }

    updateAdminInfo() {
        const nameElement = document.getElementById('admin-user-name');
        const emailElement = document.getElementById('admin-user-email');
        
        if (nameElement) nameElement.textContent = this.currentUser.name;
        if (emailElement) emailElement.textContent = this.currentUser.email;
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.userType = null;
        
        this.closeAdminPanel();
        
        this.updateAuthButton();
        
        const hiddenSections = ['cliente', 'admin'];
        document.querySelectorAll('.section').forEach(section => {
            const sectionName = section.id.replace('-section', '');
            if (hiddenSections.includes(sectionName)) {
                section.style.display = 'none';
                section.classList.remove('active');
            } else {
                section.style.display = 'block';
                section.classList.add('active');
            }
        });
        
        window.scrollTo(0, 0);
        
        this.showMessage('Logout realizado com sucesso!', 'success');
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: var(--radius-lg);
            color: white;
            font-weight: 600;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            ${type === 'success' ? 'background: var(--gradient-primary);' : 'background: #ef4444;'}
        `;
        messageDiv.textContent = message;

        if (!document.getElementById('toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

function openAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        alert('Modal não encontrado');
    }
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function logout() {
    window.authSystem.logout();
}

function openModalAdminPanel() {
    window.authSystem.openModalAdminPanel();
}

function goToUserArea() {
    if (window.authSystem.isLoggedIn) {
        if (window.authSystem.userType === 'admin') {
            window.authSystem.showAdminDashboard();
        } else {
            window.authSystem.showClientDashboard();
        }
    }
}

function handleFormSubmit() {
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    
    if (window.authSystem) {
        const mockEvent = {
            preventDefault: () => {},
            target: {
                querySelector: (selector) => {
                    if (selector === '#login-email') return { value: email };
                    if (selector === '#login-senha') return { value: senha };
                    return null;
                }
            }
        };
        window.authSystem.handleLogin(mockEvent);
    }
}

function performLogin() {
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    
    if (!email || !senha) {
        alert('Por favor, preencha email e senha!');
        return;
    }
    
    const users = {
        'admin@teste.com.br': { senha: 'admin123', type: 'admin', name: 'Administrador' },
        'cliente@teste.com.br': { senha: 'cliente123', type: 'cliente', name: 'Cliente' }
    };

    if (users[email] && users[email].senha === senha) {
        if (window.authSystem) {
            window.authSystem.currentUser = {
                email: email,
                name: users[email].name,
                type: users[email].type
            };
            window.authSystem.isLoggedIn = true;
            window.authSystem.userType = users[email].type;

            window.authSystem.closeModal();
            window.authSystem.updateAuthButton();

            if (users[email].type === 'admin') {
                window.authSystem.showAdminDashboard();
                window.authSystem.updateAdminInfo();
            } else {
                window.authSystem.showClientDashboard();
            }
        }
    } else {
        alert('Email ou senha inválidos!');
    }
}
