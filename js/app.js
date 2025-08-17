let navigation, authSystem, menuSystem, adminSystem;

document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Starting app initialization...');
        navigation = new Navigation();
        console.log('Navigation initialized:', !!navigation);
        
        authSystem = new AuthSystem();
        console.log('AuthSystem initialized:', !!authSystem);
        
        menuSystem = new MenuSystem();
        console.log('MenuSystem initialized:', !!menuSystem);
        
        adminSystem = new AdminSystem();
        console.log('AdminSystem initialized:', !!adminSystem);
        
        window.navigation = navigation;
        window.authSystem = authSystem;
        window.menuSystem = menuSystem;
        window.adminSystem = adminSystem;
        
        console.log('Global objects assigned');
        
        initializeApp();
    } catch (error) {
        console.error('Erro na inicialização:', error);
        alert('Erro ao carregar a aplicação. Por favor, recarregue a página.');
    }
});
function initializeApp() {
    applyInputMasks();
    setupTooltips();
    setupSmoothAnimations();
    setTimeout(initializeSectionVisibility, 100);
    console.log('🎉 Irani & Toinho está pronto para uso!');
}

function initializeSectionVisibility() {
    try {
        const hiddenSections = ['cliente', 'admin'];
        
        if (!window.authSystem || !window.authSystem.isLoggedIn) {
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
            console.log('Section visibility initialized successfully');
        } else {
            console.log('User logged in, skipping section visibility initialization');
        }
    } catch (error) {
        console.error('Error initializing section visibility:', error);
    }
}
function applyInputMasks() {
    const telefoneInputs = document.querySelectorAll('input[type="tel"]');
    telefoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    });
    const precoInputs = document.querySelectorAll('input[type="number"][step="0.01"]');
    precoInputs.forEach(input => {
        input.addEventListener('blur', function(e) {
            if (e.target.value) {
                const value = parseFloat(e.target.value);
                e.target.value = value.toFixed(2);
            }
        });
    });
}
function setupTooltips() {
    const elementsWithTitle = document.querySelectorAll('[title]');
    elementsWithTitle.forEach(element => {
        element.addEventListener('mouseenter', function() {
        });
    });
}
function setupSmoothAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    const animateElements = document.querySelectorAll('.fade-in, .feature-card, .menu-card');
    animateElements.forEach(el => observer.observe(el));
}
function showMessage(message, type = 'info') {
    const icon = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    alert(`${icon[type]} ${message}`);
}
function debugInfo() {
    console.log('=== DEBUG INFO - IRANI & TOINHO ===');
    console.log('Navigation:', navigation);
    console.log('Auth System:', authSystem);
    console.log('Menu System:', menuSystem);
    console.log('Admin System:', adminSystem);
    console.log('Current User:', authSystem?.currentUser);
    console.log('Total Products:', menuSystem?.produtos?.length);
    console.log('===================================');
}
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugInfo = debugInfo;
    console.log('🔧 Modo de desenvolvimento ativo. Use debugInfo() para informações detalhadas.');
}
