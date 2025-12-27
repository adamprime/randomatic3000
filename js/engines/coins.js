// CoinsEngine - Coin flip cascade visualization

class CoinsEngine extends BaseEngine {
    constructor() {
        super('Coin Cascade', 'coins');
    }
    
    getRequiredFlips(optionCount) {
        return Math.ceil(Math.log2(optionCount));
    }
    
    async visualize(container, options, result) {
        if (!container) return result;
        
        container.innerHTML = '';
        container.className = 'viz-coins';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'coins-wrapper';
        container.appendChild(wrapper);
        
        const flipCount = this.getRequiredFlips(options.length);
        const resultIndex = options.indexOf(result);
        const binary = resultIndex.toString(2).padStart(flipCount, '0');
        
        const coins = [];
        for (let i = 0; i < flipCount; i++) {
            const coinContainer = document.createElement('div');
            coinContainer.className = 'coin-container';
            
            const coin = document.createElement('div');
            coin.className = 'coin';
            coin.innerHTML = `
                <div class="coin-inner">
                    <div class="coin-front">H</div>
                    <div class="coin-back">T</div>
                </div>
            `;
            
            coinContainer.appendChild(coin);
            wrapper.appendChild(coinContainer);
            coins.push({ container: coinContainer, coin, target: binary[i] });
        }
        
        return new Promise(resolve => {
            let flipIndex = 0;
            
            const flipNext = () => {
                if (flipIndex >= coins.length) {
                    const resultDisplay = document.createElement('div');
                    resultDisplay.className = 'coins-result';
                    resultDisplay.innerHTML = `
                        <div class="binary">${binary.split('').map(b => b === '0' ? 'H' : 'T').join(' ')}</div>
                        <div class="winner">${result}</div>
                    `;
                    wrapper.appendChild(resultDisplay);
                    
                    setTimeout(() => resolve(result), 300);
                    return;
                }
                
                const { coin, target } = coins[flipIndex];
                coin.classList.add('flipping');
                
                let flips = 0;
                const maxFlips = 8 + Math.floor(Math.random() * 4);
                
                const flipAnimation = setInterval(() => {
                    flips++;
                    coin.querySelector('.coin-inner').style.transform = 
                        `rotateY(${flips * 180}deg)`;
                    
                    if (flips >= maxFlips) {
                        clearInterval(flipAnimation);
                        
                        const finalRotation = target === '0' ? 0 : 180;
                        coin.querySelector('.coin-inner').style.transform = 
                            `rotateY(${finalRotation}deg)`;
                        coin.classList.remove('flipping');
                        coin.classList.add('done');
                        
                        flipIndex++;
                        setTimeout(flipNext, 300);
                    }
                }, 80);
            };
            
            setTimeout(flipNext, 200);
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CoinsEngine;
}
