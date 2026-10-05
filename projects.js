
const FEATURED_PROJECTS = [
    {
        name: 'C.E.R.A.S.',
        description: 'Linguagem experimental para programação em Latim.' + '<br>' + 'ainda em desenvolvimento.',
        url: 'https://github.com/Dan-Martins-Cypher/C.E.R.A.S.',
        homepage: '',
        stars: 0,
        language: 'C'
    },
    {
        name: 'scripts VC',
        description: 'Scripts para visão computacional com integração e automação em ambiente Git.',
        url: 'https://github.com/Dan-Martins-Cypher/PORT',
        homepage: '',
        stars: 0,
        language: 'Python'
    },
    {
        name: 'UDP packet sender',
        description: 'Ferramenta para envio de pacotes UDP com testes de rede e comunicação em tempo real.',
        url: 'https://github.com/Dan-Martins-Cypher/PORT',
        homepage: '',
        stars: 0,
        language: 'Python'
    }
];

function normalizeProjectName(name) {
    return String(name || '')
        .trim()
        .toLowerCase()
        .replace(/[_()]+/g, ' ')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, ' ');
}


function setupScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    const header = document.querySelector('header[role="banner"]');

    if (!scrollBtn && !header) return;

    let lastScrollY = window.scrollY || 0;

    const syncHeaderState = () => {
        if (!header || window.innerWidth > 768) {
            header?.classList.remove('mobile-header-hidden');
            if (header) {
                header.style.transform = '';
                header.style.opacity = '';
                header.style.pointerEvents = '';
            }
            return;
        }

        const currentScrollY = window.scrollY;
        const shouldHide = currentScrollY > lastScrollY && currentScrollY > 30;

        header.classList.toggle('mobile-header-hidden', shouldHide);
        header.style.transform = shouldHide ? 'translateY(-120%)' : '';
        header.style.opacity = shouldHide ? '0' : '';
        header.style.pointerEvents = shouldHide ? 'none' : '';

        lastScrollY = currentScrollY;
    };

    syncHeaderState();

    window.addEventListener('scroll', syncHeaderState);
    window.addEventListener('resize', syncHeaderState);

    window.addEventListener('scroll', () => {
        if (scrollBtn && window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else if (scrollBtn) {
            scrollBtn.classList.remove('visible');
        }
    });
    
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function setupContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const subject = form.querySelector('#subject').value;
        const message = form.querySelector('#message').value;
        
   
        const mailtoLink = `mailto:daniel@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\n${message}`)}`;
        

        showNotification('Redirecionando para seu email...', 'success');

        setTimeout(() => {
            window.location.href = mailtoLink;
            form.reset();
        }, 500);
    });
}


function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: var(--bg-secondary);
        color: var(--accent-primary);
        border: 2px solid var(--accent-primary);
        border-radius: 4px;
        z-index: 1000;
        font-family: var(--font-mono);
        box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}


async function fetchGitHubProjects() {
    return FEATURED_PROJECTS;
}

function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('role', 'article');
    

    const languagePrefixes = {
        'Python': '[PY]',
        'Haskell': '[HS]',
        'JavaScript': '[JS]',
        'TypeScript': '[TS]',
        'Rust': '[RS]',
        'Go': '[GO]',
        'C++': '[C++]'
    };
    
    const prefix = languagePrefixes[project.language] || '[CODE]';
    

    const description = project.description.substring(0, 120);
    
    card.innerHTML = `
        <header class="project-header terminal-titlebar">
            <span class="terminal-controls" aria-hidden="true"><span></span><span></span><span></span></span>
            <span class="terminal-window-name">~/projects/${project.name}</span>
            <span class="project-language">${project.language}</span>
        </header>
        <section class="project-body">
            <h3 class="project-title"><span class="syntax-keyword">${prefix}</span> ${project.name}</h3>
            <p class="project-command"><span class="syntax-variable">$</span> cat README.md</p>
            <p class="project-description">${description}${project.description.length > 120 ? '...' : ''}</p>
            
            <div class="project-stats">
                <span class="project-stat">
                    ${project.stars} stars
                </span>
                ${project.language ? `<span class="project-stat">${project.language}</span>` : ''}
            </div>
            
            <nav class="project-links">
                <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-link">
                    Código
                </a>
                ${project.homepage ? `<a href="${project.homepage}" target="_blank" rel="noopener noreferrer" class="project-link">Demo</a>` : ''}
            </nav>
        </section>
    `;
    
    return card;
}


async function renderProjects() {
    const container = document.querySelector('.projects-container');
    
    if (!container) return;
    

    container.innerHTML = '<article class="loading"><output class="terminal-output">$ npm install projects...</output></article>';
    
    try {
        const projects = await fetchGitHubProjects();
        
        const visibleProjects = projects.length > 0 ? projects : FEATURED_PROJECTS;

        if (visibleProjects.length === 0) {
            container.innerHTML = `
                <article class="loading">
                    <output class="terminal-output">
                        $ ls -la projects/
                        <br>connection timeout [error]
                        <br>Verifique <a href="https://github.com/Dan-Martins-Cypher" target="_blank">GitHub</a> para ver os projetos
                    </output>
                </article>
            `;
            return;
        }

        container.innerHTML = '';
        visibleProjects.slice(0, 3).forEach(project => {
            const card = createProjectCard(project);
            container.appendChild(card);
        });

        const cards = container.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
        });
        
    } catch (error) {
        console.error('Erro ao renderizar projetos:', error);
        container.innerHTML = `
            <article class="loading">
                <output class="terminal-output">
                    $ npm install projects/
                    <br>[error] Connection failed
                    <br>Visite <a href="https://github.com/Dan-Martins-Cypher" target="_blank">github.com/Dan-Martins-Cypher</a>
                </output>
            </article>
        `;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    setupScrollToTop();
    setupContactForm();
    

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});


const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
