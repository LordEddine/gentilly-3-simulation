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
    }

    getFormatted() {
        const h = Math.floor(this.remaining / 3600);
        const m = Math.floor((this.remaining % 3600) / 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
}

window.CountdownTimer = CountdownTimer;
