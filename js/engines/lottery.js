// LotteryEngine - Lottery ball tumbling visualization

class LotteryEngine extends BaseEngine {
    constructor() {
        super('Lottery Balls', 'lottery');
        this.ballColors = [
            '#EF476F', '#FFD166', '#06D6A0', '#118AB2', '#073B4C',
            '#F78C6B', '#83D483', '#0CB0A9', '#FFC857', '#E9724C',
            '#C5283D', '#255F85', '#9381FF', '#B8B8FF', '#F8F9FA',
            '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'
        ];
    }
    
    async visualize(container, options, result) {
        if (!container) return result;
        
        container.innerHTML = '';
        container.className = 'viz-lottery';
        
        const machine = document.createElement('div');
        machine.className = 'lottery-machine';
        container.appendChild(machine);
        
        const balls = options.map((opt, i) => {
            const ball = document.createElement('div');
            ball.className = 'lottery-ball';
            ball.style.backgroundColor = this.ballColors[i % this.ballColors.length];
            ball.textContent = (i + 1).toString();
            ball.dataset.option = opt;
            
            ball.style.left = `${Math.random() * 80 + 10}%`;
            ball.style.top = `${Math.random() * 60 + 20}%`;
            
            machine.appendChild(ball);
            return ball;
        });
        
        const tumbleFrames = 40;
        let frame = 0;
        
        return new Promise(resolve => {
            const tumble = () => {
                balls.forEach(ball => {
                    const currentLeft = parseFloat(ball.style.left);
                    const currentTop = parseFloat(ball.style.top);
                    
                    let newLeft = currentLeft + (Math.random() * 20 - 10);
                    let newTop = currentTop + (Math.random() * 20 - 10);
                    
                    newLeft = Math.max(5, Math.min(85, newLeft));
                    newTop = Math.max(10, Math.min(70, newTop));
                    
                    ball.style.left = `${newLeft}%`;
                    ball.style.top = `${newTop}%`;
                    ball.style.transform = `rotate(${Math.random() * 360}deg)`;
                });
                
                frame++;
                
                if (frame < tumbleFrames) {
                    setTimeout(tumble, 50);
                } else {
                    const winningBall = balls.find(b => b.dataset.option === result);
                    
                    balls.forEach(ball => {
                        if (ball === winningBall) {
                            ball.style.transition = 'all 0.5s ease-out';
                            ball.style.left = '50%';
                            ball.style.top = '85%';
                            ball.style.transform = 'translateX(-50%) scale(1.5)';
                            ball.style.zIndex = '10';
                            ball.classList.add('winner');
                            
                            const label = document.createElement('div');
                            label.className = 'ball-label';
                            label.textContent = result;
                            ball.appendChild(label);
                        } else {
                            ball.style.opacity = '0.4';
                        }
                    });
                    
                    setTimeout(() => resolve(result), 600);
                }
            };
            
            tumble();
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LotteryEngine;
}
