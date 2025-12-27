// DiceEngine - Dice rolling visualization

class DiceEngine extends BaseEngine {
    constructor() {
        super('Dice Roll', 'dice');
    }
    
    getDiceFace(number) {
        const dots = {
            1: [[1, 1]],
            2: [[0, 0], [2, 2]],
            3: [[0, 0], [1, 1], [2, 2]],
            4: [[0, 0], [0, 2], [2, 0], [2, 2]],
            5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
            6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]]
        };
        return dots[number] || dots[1];
    }
    
    async visualize(container, options, result) {
        if (!container) return result;
        
        container.innerHTML = '';
        container.className = 'viz-dice';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'dice-wrapper';
        container.appendChild(wrapper);
        
        const diceCount = Math.min(Math.ceil(options.length / 6), 3);
        const dice = [];
        
        for (let i = 0; i < diceCount; i++) {
            const die = document.createElement('div');
            die.className = 'die';
            die.innerHTML = this.renderDieFace(1);
            wrapper.appendChild(die);
            dice.push(die);
        }
        
        const resultIndex = options.indexOf(result);
        const rolls = 15;
        let currentRoll = 0;
        
        return new Promise(resolve => {
            const rollInterval = setInterval(() => {
                dice.forEach(die => {
                    const face = Math.floor(Math.random() * 6) + 1;
                    die.innerHTML = this.renderDieFace(face);
                    die.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
                });
                
                currentRoll++;
                
                if (currentRoll >= rolls) {
                    clearInterval(rollInterval);
                    
                    const finalFace = (resultIndex % 6) + 1;
                    dice.forEach((die, i) => {
                        const face = i === 0 ? finalFace : Math.floor(Math.random() * 6) + 1;
                        die.innerHTML = this.renderDieFace(face);
                        die.style.transform = 'rotate(0deg)';
                    });
                    
                    const resultLabel = document.createElement('div');
                    resultLabel.className = 'dice-result';
                    resultLabel.textContent = result;
                    wrapper.appendChild(resultLabel);
                    
                    resolve(result);
                }
            }, 100);
        });
    }
    
    renderDieFace(number) {
        const dots = this.getDiceFace(number);
        let html = '<div class="die-face">';
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const hasDot = dots.some(([r, c]) => r === row && c === col);
                html += `<div class="die-cell ${hasDot ? 'dot' : ''}"></div>`;
            }
        }
        html += '</div>';
        return html;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiceEngine;
}
