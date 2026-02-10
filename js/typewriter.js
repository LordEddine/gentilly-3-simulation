/* ============================================================
   typewriter.js — Effet d'écriture progressive
   ============================================================ */

class Typewriter {
    constructor(element, options = {}) {
        this.element = element;
        this.speed = options.speed || 30;
        this.lineDelay = options.lineDelay || 300;
        this.onComplete = options.onComplete || null;
        this.cursor = null;
    }

    async type(lines) {
        this.element.innerHTML = '';
        this.cursor = document.createElement('span');
        this.cursor.className = 'cursor';
        this.element.appendChild(this.cursor);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const span = document.createElement('div');
            span.style.minHeight = '1.6em';
            this.element.insertBefore(span, this.cursor);

            for (let j = 0; j < line.length; j++) {
                span.textContent += line[j];
                this.scrollToBottom();
                await this.wait(this.speed + Math.random() * 15);
            }

            if (i < lines.length - 1) {
                await this.wait(this.lineDelay);
            }
        }

        // Remove cursor after typing
        setTimeout(() => {
            if (this.cursor && this.cursor.parentNode) {
                this.cursor.remove();
            }
            if (this.onComplete) this.onComplete();
        }, 800);
    }

    scrollToBottom() {
        const panel = document.getElementById('main-panel');
        if (panel) {
            panel.scrollTop = panel.scrollHeight;
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use
window.Typewriter = Typewriter;
