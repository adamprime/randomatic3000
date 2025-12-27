// Options Manager - handles adding/removing options (2-20)

class OptionsManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.options = ['Option 1', 'Option 2'];
        this.minOptions = 2;
        this.maxOptions = 20;
        this.onChange = null;
    }
    
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="options-header">
                <h3>Options</h3>
                <span class="option-count">${this.options.length}/${this.maxOptions}</span>
            </div>
            <div class="options-list" id="options-list"></div>
            <button class="btn btn-add" id="add-option" ${this.options.length >= this.maxOptions ? 'disabled' : ''}>
                + Add Option
            </button>
        `;
        
        const list = this.container.querySelector('#options-list');
        this.options.forEach((opt, i) => {
            const row = document.createElement('div');
            row.className = 'option-row';
            row.innerHTML = `
                <span class="option-number">${i + 1}</span>
                <input type="text" class="option-input" value="${opt}" data-index="${i}">
                <button class="btn btn-remove" data-index="${i}" ${this.options.length <= this.minOptions ? 'disabled' : ''}>×</button>
            `;
            list.appendChild(row);
        });
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.container.querySelectorAll('.option-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.options[index] = e.target.value || `Option ${index + 1}`;
                this.triggerChange();
            });
        });
        
        this.container.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.removeOption(index);
            });
        });
        
        const addBtn = this.container.querySelector('#add-option');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.addOption());
        }
    }
    
    addOption() {
        if (this.options.length < this.maxOptions) {
            this.options.push(`Option ${this.options.length + 1}`);
            this.render();
            this.triggerChange();
        }
    }
    
    removeOption(index) {
        if (this.options.length > this.minOptions) {
            this.options.splice(index, 1);
            this.render();
            this.triggerChange();
        }
    }
    
    getOptions() {
        return [...this.options];
    }
    
    setOptions(options) {
        this.options = options.slice(0, this.maxOptions);
        if (this.options.length < this.minOptions) {
            while (this.options.length < this.minOptions) {
                this.options.push(`Option ${this.options.length + 1}`);
            }
        }
        this.render();
    }
    
    triggerChange() {
        if (this.onChange) {
            this.onChange(this.getOptions());
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = OptionsManager;
}
