// scripts/projects.js

class ProjectsManager {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.applyFilter(this.currentFilter); // Apply initial filter
        this.setupEventListeners();
        this.setupCodeModal();
    }

    async loadProjects() {
        try {
            if (window.portfolioData && window.portfolioData.projects) {
                this.projects = window.portfolioData.projects;
            } else {
                const response = await fetch('data/portfolio-data.json');
                const data = await response.json();
                this.projects = data.projects;
                if (!window.portfolioData) window.portfolioData = data;
            }
            this.filteredProjects = [...this.projects]; // Default to all projects
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showErrorMessage();
        }
    }

    renderProjects() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        grid.innerHTML = this.filteredProjects.length > 0 
            ? this.filteredProjects.map(project => this.createProjectCard(project)).join('')
            : this.showEmptyFilterMessage();
        
        // *** THIS IS THE FIX ***
        // After adding new cards to the DOM, tell the global observer from main.js
        // to find them and watch them.
        if (window.observePageElements) {
            window.observePageElements();
        }
        
        // Initialize highlight.js for code blocks
        if (typeof hljs !== 'undefined') {
            document.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        }
    }

    createProjectCard(project) {
        const technologies = project.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        const statusClass = project.status === 'completed' ? 'status-completed' : 'status-in-progress';
        
        return `
            <div class="project-card-detailed ${statusClass}" data-category="${this.getProjectCategory(project)}" data-id="${project.id}">
                <div class="project-header">
                    <h3 class="project-name">${project.name}</h3>
                    <span class="project-year">${project.year}</span>
                </div>
                <p class="project-description">${project.detailedDescription || project.description}</p>
                <div class="project-technologies">
                    ${technologies}
                </div>
                <div class="project-actions">
                    ${project.githubUrl ? `<a href="${project.githubUrl}" class="btn btn-outline btn-sm" target="_blank">View Code</a>` : ''}
                    ${project.liveUrl ? `<a href="${project.liveUrl}" class="btn btn-primary btn-sm" target="_blank">Live Demo</a>` : ''}
                    ${project.codeSnippets && project.codeSnippets.length > 0 ? 
                        `<button class="btn btn-secondary btn-sm view-code-btn" data-project="${project.id}">View Snippet</button>` : ''}
                </div>
            </div>
        `;
    }

    getProjectCategory(project) {
        const tech = project.technologies.join(' ').toLowerCase();
        
        if (tech.includes('ai') || tech.includes('ml') || tech.includes('gemini') || tech.includes('nlp') || tech.includes('vision api')) {
            return 'ai';
        }
        if (tech.includes('c++') || tech.includes('c')) {
            return 'systems';
        }
        if (tech.includes('algorithms') || tech.includes('data structures') || tech.includes('dsa') || tech.includes('string manipulation')) {
            return 'algorithms';
        }
        if (tech.includes('react') || tech.includes('javascript') || tech.includes('typescript') || tech.includes('html')) {
            return 'web';
        }
        return 'other';
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.applyFilter(filter);
                
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // View code buttons (using event delegation on the grid)
        document.getElementById('projectsGrid').addEventListener('click', (e) => {
            const button = e.target.closest('.view-code-btn');
            if (button) {
                const projectId = button.dataset.project;
                this.showCodeModal(projectId, 0);
            }
        });
    }

    applyFilter(filter) {
        this.currentFilter = filter;
        
        if (filter === 'all') {
            this.filteredProjects = [...this.projects];
        } else {
            this.filteredProjects = this.projects.filter(project => 
                this.getProjectCategory(project) === filter
            );
        }
        
        this.renderProjects();
    }

    showEmptyFilterMessage() {
        return `<p class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem 0;">No projects found for this category.</p>`;
    }

    setupCodeModal() {
        this.modal = document.getElementById('codeModal');
        this.closeBtn = document.getElementById('closeModal');
        this.copyBtn = document.getElementById('copyCode');
        
        if (!this.modal || !this.closeBtn || !this.copyBtn) {
            console.warn('Code modal elements not found.');
            return;
        }
        
        this.closeBtn.addEventListener('click', () => this.hideCodeModal());
        this.copyBtn.addEventListener('click', () => this.copyCodeToClipboard());
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideCodeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.hideCodeModal();
            }
        });
    }

    showCodeModal(projectId, snippetIndex = 0) {
        const project = this.projects.find(p => p.id == projectId);
        if (!project || !project.codeSnippets || project.codeSnippets.length === 0) return;
        
        const snippet = project.codeSnippets[snippetIndex];
        if (!snippet) return;
        
        document.getElementById('modalTitle').textContent = project.name;
        document.getElementById('fileName').textContent = snippet.filename;
        
        const codeElement = document.getElementById('codeSnippet');
        codeElement.textContent = snippet.code;
        codeElement.className = `language-${snippet.language}`;
        
        if (typeof hljs !== 'undefined') {
            hljs.highlightElement(codeElement);
        }
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideCodeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    async copyCodeToClipboard() {
        const code = document.getElementById('codeSnippet').textContent;
        try {
            await navigator.clipboard.writeText(code);
            this.copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.copyBtn.textContent = 'Copy';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
            this.copyBtn.textContent = 'Failed';
            setTimeout(() => {
                this.copyBtn.textContent = 'Copy';
            }, 2000);
        }
    }

    showErrorMessage() {
        const grid = document.getElementById('projectsGrid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-message" style="grid-column: 1 / -1; text-align: center;">
                    <h3>Unable to load projects</h3>
                    <p>Please check your internet connection and try again.</p>
                </div>
            `;
        }
    }
}

// Initialize Projects Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsManager();
});