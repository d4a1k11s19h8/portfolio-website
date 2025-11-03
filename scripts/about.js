// scripts/about.js
class AboutManager {
    constructor() {
        this.skillsData = [];
        this.skillsContainer = document.getElementById('skillsContainer');
        this.init();
    }

    async init() {
        await this.loadSkillsData();
        this.renderSkills(); // Build the HTML
        this.animateSkillBars(); // Animate the new HTML
        this.setupEventListeners();
        
        // Use the global function from main.js to animate elements
        if (window.observePageElements) {
            window.observePageElements();
        }
    }

    async loadSkillsData() {
        try {
            // Wait for global data if it's not ready
            while (!window.portfolioData) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            this.skillsData = window.portfolioData.skills;
        } catch (error) {
            console.error('Error loading skills data:', error);
            if (this.skillsContainer) {
                this.skillsContainer.innerHTML = '<p class="error-message">Could not load skills.</p>';
            }
        }
    }

    renderSkills() {
        if (!this.skillsContainer || !this.skillsData) return;

        this.skillsContainer.innerHTML = ''; // Clear hardcoded content

        this.skillsData.forEach(category => {
            const categoryEl = document.createElement('div');
            categoryEl.className = 'skill-category-detailed fade-in'; // Add fade-in for animation

            const skillsListHTML = category.items.map(skill => `
                <div class="skill-level">
                    <span class="skill-name">${skill.name}</span>
                    <div class="skill-bar">
                        <div class="skill-progress" data-level="${skill.level}"></div>
                    </div>
                </div>
            `).join('');

            categoryEl.innerHTML = `
                <h3>${category.category}</h3>
                <div class="skill-levels">
                    ${skillsListHTML}
                </div>
            `;
            
            this.skillsContainer.appendChild(categoryEl);
        });
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    const level = skillBar.dataset.level;
                    skillBar.style.width = `${level}%`;
                    skillBar.style.opacity = '1';
                    observer.unobserve(skillBar); // Stop observing after animation
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.opacity = '0';
            bar.style.transition = 'width 1.5s ease-in-out, opacity 0.5s ease-in-out';
            observer.observe(bar);
        });
    }

    setupEventListeners() {
        const achievementCards = document.querySelectorAll('.achievement-card');
        achievementCards.forEach(card => {
            card.addEventListener('mouseenter', this.handleAchievementHover);
            card.addEventListener('mouseleave', this.handleAchievementLeave);
        });

        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.addEventListener('click', this.handleTimelineClick);
        });
    }

    handleAchievementHover(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = 'var(--shadow-lg)';
    }

    handleAchievementLeave(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = 'var(--shadow)';
    }

    handleTimelineClick(e) {
        const item = e.currentTarget;
        const wasActive = item.classList.contains('active');
        
        document.querySelectorAll('.timeline-item').forEach(i => {
            i.classList.remove('active');
        });
        
        if (!wasActive) {
            item.classList.add('active');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AboutManager();
});