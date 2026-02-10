/* ============================================================
   timer.js — Compte à rebours du réacteur
   Supporte: targetDate (deadline fixe) ou hours/minutes/seconds
   ============================================================ */

class CountdownTimer {
    constructor(displayElement, options = {}) {
        this.display = displayElement;
        this.interval = null;
        this.onTick = options.onTick || null;
        this.onEnd = options.onEnd || null;
        this.remaining = 0;
        this.ended = false;

        if (options.targetDate) {
            // Compte à rebours vers une date/heure cible
            this.targetTime = new Date(options.targetDate).getTime();
        } else {
            // Compte à rebours fixe (fallback)
            const totalMs = (options.hours * 3600 + (options.minutes || 0) * 60 + (options.seconds || 0)) * 1000;
            this.targetTime = Date.now() + totalMs;
        }
    }

    start() {
        this.tick();
        this.interval = setInterval(() => this.tick(), 1000);
    }

    tick() {
        const now = Date.now();
        this.remaining = Math.max(0, Math.floor((this.targetTime - now) / 1000));

        this.render();

        if (this.remaining <= 0 && !this.ended) {
            this.ended = true;
            this.stop();
            if (this.onEnd) this.onEnd();
        }

        if (this.onTick) this.onTick(this.remaining);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    render() {
        const h = Math.floor(this.remaining / 3600);
        const m = Math.floor((this.remaining % 3600) / 60);
        const s = this.remaining % 60;

        const text = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        this.display.textContent = text;

        // Change color based on remaining time
        if (this.remaining <= 0) {
            this.display.style.color = '#ff3333';
            this.display.style.textShadow = '0 0 20px rgba(255,51,51,0.5)';
            this.display.textContent = '00:00:00 — TEMPS ÉCOULÉ';
        } else if (this.remaining < 600) { // < 10 min
            this.display.style.color = '#ff3333';
            this.display.style.textShadow = '0 0 20px rgba(255,51,51,0.5)';
        } else if (this.remaining < 1800) { // < 30 min
            this.display.style.color = '#ffcc00';
            this.display.style.textShadow = '0 0 15px rgba(255,204,0,0.3)';
        }

        // Red alert border when <= 1h20 remaining
        const mainScreen = document.getElementById('screen-main');
        if (mainScreen) {
            if (this.remaining > 0 && this.remaining <= 4800) {
                mainScreen.classList.add('alert-border');
            } else {
                mainScreen.classList.remove('alert-border');
            }
        }

        // Game over screen at <= 30 min
        if (this.remaining > 0 && this.remaining <= 1800 && !this._gameOverShown) {
            this._gameOverShown = true;
            this.showGameOver();
        }
    }

    getFormatted() {
        const h = Math.floor(this.remaining / 3600);
        const m = Math.floor((this.remaining % 3600) / 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    showGameOver() {
        this.stop();
        const overlay = document.getElementById('screen-gameover');
        if (!overlay) return;

        // ASCII skull made of 0 and 1
        const skull = [
            '         0001111111000         ',
            '       011111111111111100      ',
            '      01111111111111111110     ',
            '     0111111111111111111110    ',
            '    011111111111111111111110   ',
            '   01111111111111111111111110  ',
            '   01111111111111111111111110  ',
            '   01110001111111111100011110  ',
            '   01100000111111110000001110  ',
            '   01100000011111100000001110  ',
            '   01110000011111100000011110  ',
            '   01111000111111111000111110  ',
            '   01111111111001111111111110  ',
            '    0111111110000011111111100  ',
            '     011111100000001111111100  ',
            '      0111110010010011111100   ',
            '       01111100000001111100    ',
            '        011110000000111100     ',
            '         0101010101010100      ',
            '          010101010101         ',
            '           01010101            ',
        ].join('\n');

        const skullEl = document.getElementById('skull-ascii');
        if (skullEl) skullEl.textContent = skull;

        // Matrix rain
        const rainContainer = document.getElementById('gameover-rain');
        if (rainContainer) {
            rainContainer.innerHTML = '';
            for (let i = 0; i < 40; i++) {
                const col = document.createElement('div');
                col.className = 'rain-column';
                col.style.left = (i * 2.5) + '%';
                col.style.animationDuration = (1.5 + Math.random() * 3) + 's';
                col.style.animationDelay = (Math.random() * 2) + 's';
                let chars = '';
                for (let j = 0; j < 30; j++) {
                    chars += Math.random() > 0.5 ? '1' : '0';
                    chars += '\n';
                }
                col.textContent = chars;
                rainContainer.appendChild(col);
            }
        }

        overlay.classList.remove('hidden');

        // Restart button
        const btn = document.getElementById('btn-restart');
        if (btn) {
            btn.addEventListener('click', () => {
                localStorage.removeItem('reactor7_save');
                // Store a 3h countdown target for the new session
                const newTarget = Date.now() + 3 * 3600 * 1000;
                localStorage.setItem('reactor7_restart', newTarget.toString());
                location.reload();
            });
        }
    }
}

window.CountdownTimer = CountdownTimer;
