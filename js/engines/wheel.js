// WheelEngine - Classic spinning wheel visualization

class WheelEngine extends BaseEngine {
    constructor() {
        super('Wheel Spin', 'wheel');
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8B500', '#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9',
            '#92A8D1', '#955251', '#B565A7', '#009B77', '#DD4124'
        ];
    }
    
    getWheelColors(count) {
        return this.colors.slice(0, count);
    }
    
    async visualize(container, options, result) {
        if (!container) return result;
        
        container.innerHTML = '';
        container.className = 'viz-wheel';
        
        const canvas = document.createElement('canvas');
        const size = Math.min(container.offsetWidth || 400, container.offsetHeight || 400, 400);
        canvas.width = size;
        canvas.height = size;
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2 - 20;
        const sliceAngle = (2 * Math.PI) / options.length;
        const colors = this.getWheelColors(options.length);
        
        const winningIndex = options.indexOf(result);
        const targetAngle = winningIndex * sliceAngle + sliceAngle / 2;
        const totalRotation = Math.PI * 8 + (2 * Math.PI - targetAngle);
        
        let currentRotation = 0;
        const duration = 3000;
        const startTime = performance.now();
        
        const drawWheel = (rotation) => {
            ctx.clearRect(0, 0, size, size);
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            
            options.forEach((opt, i) => {
                const startAngle = i * sliceAngle;
                const endAngle = startAngle + sliceAngle;
                
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, radius, startAngle, endAngle);
                ctx.closePath();
                ctx.fillStyle = colors[i % colors.length];
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                ctx.save();
                ctx.rotate(startAngle + sliceAngle / 2);
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 14px Arial';
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 2;
                const text = opt.length > 12 ? opt.substring(0, 10) + '..' : opt;
                ctx.fillText(text, radius - 10, 0);
                ctx.restore();
            });
            
            ctx.restore();
            
            ctx.beginPath();
            ctx.moveTo(centerX + radius + 10, centerY);
            ctx.lineTo(centerX + radius - 20, centerY - 15);
            ctx.lineTo(centerX + radius - 20, centerY + 15);
            ctx.closePath();
            ctx.fillStyle = '#333';
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
            ctx.fillStyle = '#333';
            ctx.fill();
        };
        
        return new Promise(resolve => {
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                
                currentRotation = eased * totalRotation;
                drawWheel(currentRotation);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve(result);
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = WheelEngine;
}
