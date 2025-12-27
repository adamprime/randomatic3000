// BaseEngine - Abstract base class for all randomization engines

class BaseEngine {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
    
    getRandomIndex(length) {
        return Math.floor(Math.random() * length);
    }
    
    pick(options) {
        if (!options || options.length === 0) {
            throw new Error('Options array cannot be empty');
        }
        const index = this.getRandomIndex(options.length);
        return options[index];
    }
    
    shuffle(options) {
        if (!options || options.length === 0) {
            throw new Error('Options array cannot be empty');
        }
        const array = [...options];
        for (let i = array.length - 1; i > 0; i--) {
            const j = this.getRandomIndex(i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    async visualize(container, options, result) {
        // Override in subclasses for custom visualization
        if (container) {
            container.innerHTML = `<div class="result">${result}</div>`;
        }
        return result;
    }
    
    runTrials(options, count) {
        const results = {};
        options.forEach(opt => results[opt] = 0);
        
        for (let i = 0; i < count; i++) {
            const pick = this.pick(options);
            results[pick]++;
        }
        
        return results;
    }
    
    runOrderTrials(options, count) {
        const positionCounts = {};
        options.forEach(opt => {
            positionCounts[opt] = new Array(options.length).fill(0);
        });
        
        for (let i = 0; i < count; i++) {
            const shuffled = this.shuffle(options);
            shuffled.forEach((opt, pos) => {
                positionCounts[opt][pos]++;
            });
        }
        
        return positionCounts;
    }
}

// Export for both browser and potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaseEngine;
}
