// Results Display - shows trial results and rankings

class ResultsDisplay {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.results = {};
        this.positionResults = {};
        this.totalTrials = 0;
        this.options = [];
    }
    
    render() {
        if (!this.container) return;
        
        const hasResults = Object.keys(this.results).length > 0;
        
        this.container.innerHTML = `
            <div class="results-header">
                <h3>Results</h3>
                ${hasResults ? '<button class="btn btn-clear" id="clear-results">Clear</button>' : ''}
            </div>
            <div class="results-content" id="results-content">
                ${hasResults ? this.renderResults() : '<p class="no-results">Run trials to see results</p>'}
            </div>
        `;
        
        if (hasResults) {
            this.container.querySelector('#clear-results')?.addEventListener('click', () => {
                this.clear();
            });
        }
    }
    
    renderResults() {
        const sorted = Object.entries(this.results)
            .sort((a, b) => b[1] - a[1]);
        
        const maxCount = Math.max(...Object.values(this.results));
        
        let html = '<div class="results-bars">';
        
        sorted.forEach(([option, count], index) => {
            const percentage = (count / this.totalTrials * 100).toFixed(1);
            const barWidth = (count / maxCount * 100);
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            
            html += `
                <div class="result-row">
                    <div class="result-label">
                        <span class="medal">${medal}</span>
                        <span class="option-name">${option}</span>
                    </div>
                    <div class="result-bar-container">
                        <div class="result-bar" style="width: ${barWidth}%"></div>
                        <span class="result-count">${count} (${percentage}%)</span>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        if (Object.keys(this.positionResults).length > 0) {
            html += this.renderPositionResults();
        }
        
        html += `
            <div class="results-summary">
                <strong>Total Trials:</strong> ${this.totalTrials}<br>
                <strong>Winner:</strong> ${sorted[0]?.[0] || 'N/A'} with ${sorted[0]?.[1] || 0} wins
            </div>
        `;
        
        return html;
    }
    
    renderPositionResults() {
        const options = Object.keys(this.positionResults);
        if (options.length === 0) return '';
        
        const positions = this.positionResults[options[0]]?.length || 0;
        
        let html = '<div class="position-results"><h4>Position Rankings</h4>';
        html += '<table class="position-table"><thead><tr><th>Option</th>';
        
        for (let i = 0; i < positions; i++) {
            html += `<th>${this.getOrdinal(i + 1)}</th>`;
        }
        html += '</tr></thead><tbody>';
        
        const avgPositions = {};
        options.forEach(opt => {
            avgPositions[opt] = this.positionResults[opt].reduce((sum, count, pos) => 
                sum + count * (pos + 1), 0) / this.totalTrials;
        });
        
        const sortedOptions = options.sort((a, b) => avgPositions[a] - avgPositions[b]);
        
        sortedOptions.forEach(opt => {
            html += `<tr><td>${opt}</td>`;
            this.positionResults[opt].forEach(count => {
                const pct = (count / this.totalTrials * 100).toFixed(0);
                html += `<td>${pct}%</td>`;
            });
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        html += `<p class="suggested-order"><strong>Suggested Order:</strong> ${sortedOptions.join(' → ')}</p>`;
        html += '</div>';
        
        return html;
    }
    
    getOrdinal(n) {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
    
    addResult(option) {
        if (!this.results[option]) {
            this.results[option] = 0;
        }
        this.results[option]++;
        this.totalTrials++;
    }
    
    addPositionResult(shuffledOrder) {
        shuffledOrder.forEach((opt, pos) => {
            if (!this.positionResults[opt]) {
                this.positionResults[opt] = new Array(shuffledOrder.length).fill(0);
            }
            this.positionResults[opt][pos]++;
        });
    }
    
    setOptions(options) {
        this.options = [...options];
    }
    
    clear() {
        this.results = {};
        this.positionResults = {};
        this.totalTrials = 0;
        this.render();
    }
    
    getResults() {
        return { ...this.results };
    }
    
    getPositionResults() {
        return { ...this.positionResults };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResultsDisplay;
}
