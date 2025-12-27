// CryptoEngine - Uses crypto.getRandomValues() for cryptographically secure randomness
// Visualization: Matrix-style falling green characters

class CryptoEngine extends BaseEngine {
    constructor() {
        super('Crypto Random', 'crypto');
        this.usesCrypto = typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function';
    }
    
    getRandomIndex(length) {
        if (this.usesCrypto) {
            const array = new Uint32Array(1);
            crypto.getRandomValues(array);
            return array[0] % length;
        }
        return Math.floor(Math.random() * length);
    }
    
    async visualize(container, options, result) {
        if (!container) return result;
        
        container.innerHTML = '';
        container.className = 'viz-crypto';
        
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth || 400;
        canvas.height = container.offsetHeight || 300;
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const columns = Math.floor(canvas.width / 20);
        const drops = new Array(columns).fill(1);
        const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789';
        
        let frames = 0;
        const maxFrames = 60;
        
        return new Promise(resolve => {
            const animate = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#00ff88';
                ctx.font = '18px monospace';
                
                for (let i = 0; i < drops.length; i++) {
                    const char = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillStyle = Math.random() > 0.9 ? '#ffffff' : '#00ff88';
                    ctx.fillText(char, i * 20, drops[i] * 20);
                    
                    if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
                
                frames++;
                
                if (frames < maxFrames) {
                    requestAnimationFrame(animate);
                } else {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    ctx.fillStyle = '#00ff88';
                    ctx.font = 'bold 32px monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    const text = typeof result === 'string' ? result : JSON.stringify(result);
                    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
                    
                    ctx.shadowColor = '#00ff88';
                    ctx.shadowBlur = 20;
                    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
                    
                    resolve(result);
                }
            };
            
            animate();
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoEngine;
}
