// RandoMatic 3000 - Main Application

class RandoMatic {
    constructor() {
        this.engines = {
            crypto: new CryptoEngine(),
            wheel: new WheelEngine(),
            dice: new DiceEngine(),
            cards: new CardsEngine(),
            lottery: new LotteryEngine(),
            coins: new CoinsEngine()
        };
        
        this.currentEngine = this.engines.wheel;
        this.optionsManager = new OptionsManager('options-panel');
        this.trialRunner = new TrialRunner('trials-panel');
        this.resultsDisplay = new ResultsDisplay('results-panel');
        
        this.mode = 'pick';
        this.theme = localStorage.getItem('theme') || 'light';
    }
    
    init() {
        this.applyTheme();
        this.renderEngineSelector();
        this.renderModeSelector();
        this.optionsManager.render();
        this.trialRunner.render();
        this.resultsDisplay.render();
        
        this.bindEvents();
        
        this.optionsManager.setOptions(['Thing 1', 'Thing 2', 'Thing 3']);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = this.theme === 'dark' ? '☀️' : '🌓';
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }
    
    renderEngineSelector() {
        const selector = document.getElementById('engine-selector');
        if (!selector) return;
        
        selector.innerHTML = Object.entries(this.engines).map(([id, engine]) => `
            <button class="btn btn-engine ${id === this.currentEngine.id ? 'active' : ''}" 
                    data-engine="${id}">
                ${this.getEngineIcon(id)} ${engine.name}
            </button>
        `).join('');
    }
    
    renderModeSelector() {
        const selector = document.getElementById('mode-selector');
        if (!selector) return;
        
        selector.innerHTML = `
            <button class="btn btn-mode ${this.mode === 'pick' ? 'active' : ''}" data-mode="pick">
                🎯 Pick Winner
            </button>
            <button class="btn btn-mode ${this.mode === 'order' ? 'active' : ''}" data-mode="order">
                📋 Determine Order
            </button>
        `;
    }
    
    getEngineIcon(id) {
        const icons = {
            crypto: '🔐',
            wheel: '🎡',
            dice: '🎲',
            cards: '🃏',
            lottery: '🎱',
            coins: '🪙'
        };
        return icons[id] || '⚙️';
    }
    
    bindEvents() {
        document.getElementById('engine-selector')?.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-engine');
            if (btn) {
                const engineId = btn.dataset.engine;
                this.currentEngine = this.engines[engineId];
                this.renderEngineSelector();
                this.resultsDisplay.clear();
            }
        });
        
        document.getElementById('mode-selector')?.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-mode');
            if (btn) {
                this.mode = btn.dataset.mode;
                this.renderModeSelector();
                this.resultsDisplay.clear();
            }
        });

        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        document.getElementById('single-run')?.addEventListener('click', () => {
            this.runSingle();
        });
        
        this.optionsManager.onChange = (options) => {
            this.resultsDisplay.setOptions(options);
            this.resultsDisplay.clear();
        };
        
        this.trialRunner.onTrialComplete = (current, total) => {
            const options = this.optionsManager.getOptions();
            
            if (this.mode === 'pick') {
                const result = this.currentEngine.pick(options);
                this.resultsDisplay.addResult(result);
            } else {
                const shuffled = this.currentEngine.shuffle(options);
                this.resultsDisplay.addPositionResult(shuffled);
                this.resultsDisplay.addResult(shuffled[0]);
            }
            
            this.resultsDisplay.render();
        };
        
        this.trialRunner.onAllComplete = () => {
            this.resultsDisplay.render();
        };
    }
    
    async runSingle() {
        const options = this.optionsManager.getOptions();
        const vizContainer = document.getElementById('visualization');
        
        let result;
        if (this.mode === 'pick') {
            result = this.currentEngine.pick(options);
        } else {
            result = this.currentEngine.shuffle(options);
        }
        
        await this.currentEngine.visualize(vizContainer, options, 
            this.mode === 'pick' ? result : result[0]);
        
        if (this.mode === 'pick') {
            this.resultsDisplay.addResult(result);
        } else {
            this.resultsDisplay.addPositionResult(result);
            this.resultsDisplay.addResult(result[0]);
            
            const orderDisplay = document.createElement('div');
            orderDisplay.className = 'order-result';
            orderDisplay.innerHTML = `<strong>Order:</strong> ${result.join(' → ')}`;
            vizContainer.appendChild(orderDisplay);
        }
        
        this.resultsDisplay.render();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new RandoMatic();
    window.app.init();
});
