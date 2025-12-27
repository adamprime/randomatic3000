// Trial Runner - handles running multiple trials

class TrialRunner {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.trialCount = 50;
        this.presets = [25, 50, 100];
        this.isRunning = false;
        this.onTrialComplete = null;
        this.onAllComplete = null;
        this.currentEngine = null;
    }
    
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="trials-header">
                <h3>Trials</h3>
            </div>
            <div class="trial-presets">
                ${this.presets.map(p => `
                    <button class="btn btn-preset ${p === this.trialCount ? 'active' : ''}" data-count="${p}">
                        ${p}
                    </button>
                `).join('')}
                <input type="number" class="trial-custom" id="custom-trials" 
                       value="${this.trialCount}" min="1" max="1000" placeholder="Custom">
            </div>
            <div class="trial-controls">
                <button class="btn btn-run" id="run-trials">▶ Run Trials</button>
                <button class="btn btn-stop" id="stop-trials" disabled>◼ Stop</button>
            </div>
            <div class="trial-progress" id="trial-progress">
                <div class="progress-bar">
                    <div class="progress-fill" id="progress-fill"></div>
                </div>
                <span class="progress-text" id="progress-text">Ready</span>
            </div>
        `;
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.container.querySelectorAll('.btn-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.trialCount = parseInt(e.target.dataset.count);
                this.container.querySelector('#custom-trials').value = this.trialCount;
                this.container.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        const customInput = this.container.querySelector('#custom-trials');
        customInput.addEventListener('change', (e) => {
            this.trialCount = Math.max(1, Math.min(1000, parseInt(e.target.value) || 50));
            e.target.value = this.trialCount;
            this.container.querySelectorAll('.btn-preset').forEach(b => {
                b.classList.toggle('active', parseInt(b.dataset.count) === this.trialCount);
            });
        });
        
        this.container.querySelector('#run-trials').addEventListener('click', () => {
            this.runTrials();
        });
        
        this.container.querySelector('#stop-trials').addEventListener('click', () => {
            this.stopTrials();
        });
    }
    
    setEngine(engine) {
        this.currentEngine = engine;
    }
    
    async runTrials() {
        if (this.isRunning || !this.onTrialComplete) return;
        
        this.isRunning = true;
        this.container.querySelector('#run-trials').disabled = true;
        this.container.querySelector('#stop-trials').disabled = false;
        
        const progressFill = this.container.querySelector('#progress-fill');
        const progressText = this.container.querySelector('#progress-text');
        
        for (let i = 0; i < this.trialCount && this.isRunning; i++) {
            const progress = ((i + 1) / this.trialCount) * 100;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${i + 1} / ${this.trialCount}`;
            
            if (this.onTrialComplete) {
                this.onTrialComplete(i + 1, this.trialCount);
            }
            
            await new Promise(r => setTimeout(r, 10));
        }
        
        this.isRunning = false;
        this.container.querySelector('#run-trials').disabled = false;
        this.container.querySelector('#stop-trials').disabled = true;
        progressText.textContent = `Complete: ${this.trialCount} trials`;
        
        if (this.onAllComplete) {
            this.onAllComplete(this.trialCount);
        }
    }
    
    stopTrials() {
        this.isRunning = false;
    }
    
    getTrialCount() {
        return this.trialCount;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrialRunner;
}
