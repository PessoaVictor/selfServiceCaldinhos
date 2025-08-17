class Navigation {
    constructor() {
        this.currentSection = 'home';
        this.sections = [];
        this.init();
    }
    init() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        this.updateSectionPositions();
        
        window.addEventListener('scroll', this.detectActiveSection.bind(this));
        
        window.addEventListener('resize', this.updateSectionPositions.bind(this));
        
        this.updateActiveNavigation('home');
    }
    
    updateSectionPositions() {
        this.sections = Array.from(document.querySelectorAll('.section')).map(section => ({
            element: section,
            name: section.id.replace('-section', ''),
            get offsetTop() { return section.offsetTop; }
        }));
    }
    
    handleScroll() {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    showSection(sectionName) {
        const section = document.getElementById(sectionName + '-section');
        if (section) {
            const hiddenSections = ['cliente', 'admin'];
            
            document.querySelectorAll('.section').forEach(sec => {
                const secName = sec.id.replace('-section', '');
                if (!hiddenSections.includes(secName)) {
                    sec.style.display = 'block';
                    sec.classList.add('active');
                } else {
                    sec.style.display = 'none';
                    sec.classList.remove('active');
                }
            });
            
            const headerHeight = document.getElementById('header').offsetHeight;
            const sectionTop = section.offsetTop - headerHeight;
            
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
            
            this.currentSection = sectionName;
            this.updateActiveNavigation(sectionName);
        }
    }
    
    detectActiveSection() {
        const scrollPosition = window.scrollY + 100;
        
        for (let i = this.sections.length - 1; i >= 0; i--) {
            const section = this.sections[i];
            if (scrollPosition >= section.offsetTop) {
                if (this.currentSection !== section.name) {
                    this.currentSection = section.name;
                    this.updateActiveNavigation(section.name);
                }
                break;
            }
        }
    }
    
    updateActiveNavigation(sectionName) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

function showSection(sectionName) {
    const section = document.getElementById(sectionName + '-section');
    if (section) {
        const hiddenSections = ['cliente', 'admin'];
        
        document.querySelectorAll('.section').forEach(sec => {
            const secName = sec.id.replace('-section', '');
            if (!hiddenSections.includes(secName)) {
                sec.style.display = 'block';
                sec.classList.add('active');
            } else {
                sec.style.display = 'none';
                sec.classList.remove('active');
            }
        });
        
        const headerHeight = document.getElementById('header').offsetHeight;
        const sectionTop = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    mobileNav?.classList.toggle('active');
    
    if (mobileNav?.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

const navigation = new Navigation();
window.navigation = navigation;
