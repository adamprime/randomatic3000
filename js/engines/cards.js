// CardsEngine - Card shuffle visualization

class CardsEngine extends BaseEngine {
    constructor() {
        super('Card Shuffle', 'cards');
        this.suits = ['♠', '♥', '♦', '♣'];
        this.cardColors = ['#1a1a2e', '#dc3545', '#dc3545', '#1a1a2e'];
    }
    
    async visualize(container, options, result) {
        if (!container) return result;
        
        container.innerHTML = '';
        container.className = 'viz-cards';
        
        const deck = document.createElement('div');
        deck.className = 'card-deck';
        container.appendChild(deck);
        
        const cards = options.map((opt, i) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.option = opt;
            
            const suit = this.suits[i % 4];
            const color = this.cardColors[i % 4];
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <span class="card-suit" style="color: ${color}">${suit}</span>
                        <span class="card-label">${opt.substring(0, 8)}</span>
                    </div>
                    <div class="card-back"></div>
                </div>
            `;
            
            card.style.left = `${50 + i * 5}px`;
            card.style.top = `${50 + i * 2}px`;
            card.style.zIndex = i;
            
            deck.appendChild(card);
            return card;
        });
        
        const shuffleRounds = 5;
        let round = 0;
        
        return new Promise(resolve => {
            const shuffleAnimation = () => {
                cards.forEach((card, i) => {
                    const randomX = Math.random() * 200 - 50;
                    const randomY = Math.random() * 100;
                    const randomRotate = Math.random() * 30 - 15;
                    
                    card.style.transition = 'all 0.3s ease-out';
                    card.style.left = `${randomX}px`;
                    card.style.top = `${randomY}px`;
                    card.style.transform = `rotate(${randomRotate}deg)`;
                    card.style.zIndex = Math.floor(Math.random() * options.length);
                });
                
                round++;
                
                if (round < shuffleRounds) {
                    setTimeout(shuffleAnimation, 400);
                } else {
                    setTimeout(() => {
                        const winningCard = cards.find(c => c.dataset.option === result);
                        
                        cards.forEach((card, i) => {
                            if (card === winningCard) {
                                card.style.left = '50%';
                                card.style.top = '20px';
                                card.style.transform = 'translateX(-50%) scale(1.3)';
                                card.style.zIndex = 100;
                                card.classList.add('winner');
                            } else {
                                card.style.left = `${30 + i * 40}px`;
                                card.style.top = '150px';
                                card.style.transform = 'rotate(0deg) scale(0.8)';
                                card.style.opacity = '0.5';
                            }
                        });
                        
                        setTimeout(() => resolve(result), 500);
                    }, 300);
                }
            };
            
            setTimeout(shuffleAnimation, 100);
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardsEngine;
}
