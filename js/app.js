/* ============================================================
   app.js — Logique principale de l'application
   OPÉRATION RÉACTEUR-7
   ============================================================ */

// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
    // Codes de déverrouillage (l'enseignant les donne en classe)
    unlockCodes: {
        level1: 'ALPHA',
        level2: 'BRAVO',
        level3: 'CHARLIE',
        level4: 'DELTA'
    },
    // Durée du timer — compte à rebours vers 17h30 le 10 février 2026
    timer: { targetDate: '2026-02-10T17:30:00' },
    // Messages radio programmés (délai en secondes après le login)
    radioMessages: [
        { delay: 10,  sender: 'Poste de contrôle', text: 'Équipe cyber connectée. Bienvenue dans l\'opération.', urgent: false },
        { delay: 45,  sender: 'Technicienne Chen', text: 'Les capteurs du réacteur 7 envoient encore des données incohérentes...', urgent: false },
        { delay: 120, sender: 'Équipe de nuit', text: 'On voit du trafic sur des ports qu\'on ne reconnaît pas. C\'est quoi le port 4444 ?', urgent: false },
        { delay: 300, sender: 'Commandant Lavoie', text: 'Rapport intermédiaire : l\'IP suspecte est toujours active sur le réseau.', urgent: true },
        { delay: 600, sender: 'Technicienne Chen', text: 'Température affichée 510°C ! Mais les capteurs physiques disent 312°C. Quelqu\'un manipule les données !', urgent: true },
        { delay: 900, sender: 'Sécurité périmètre', text: 'RAS côté physique. L\'attaque est purement logicielle.', urgent: false },
        { delay: 1200, sender: 'Commandant Lavoie', text: 'L\'attaquant semble avoir mis en place une persistance. Vérifiez le crontab.', urgent: true },
        { delay: 1800, sender: 'Direction générale', text: 'Le gouvernement demande un rapport. Avancez sur la neutralisation.', urgent: false },
        { delay: 2400, sender: 'Technicienne Chen', text: 'Bonne nouvelle : les capteurs reviennent à la normale si on coupe le port 4444.', urgent: false },
        { delay: 3600, sender: 'Commandant Lavoie', text: 'Il nous reste peu de temps. Finalisez vos scripts de défense.', urgent: true },
        { delay: 5400, sender: 'Direction générale', text: 'On a besoin du rapport final. Le temps presse.', urgent: true },
    ],
};

// ============================================================
// STATE
// ============================================================
let state = {
    agentName: '',
    currentLevel: 'briefing',
    unlockedLevels: ['briefing'],
    timer: null,
    soundEnabled: false,
    radioTimeouts: [],
    loginTime: null
};

// ============================================================
// LOCALSTORAGE — SAUVEGARDE / RESTAURATION
// ============================================================
const SAVE_KEY = 'reactor7_save';

function saveProgress() {
    const data = {
        agentName: state.agentName,
        unlockedLevels: state.unlockedLevels,
        currentLevel: state.currentLevel,
        completedObjectives: {},
        loginTime: state.loginTime
    };
    // Récupérer les objectifs depuis les terminaux
    if (window._terminals) {
        window._terminals.forEach((term, levelId) => {
            data.completedObjectives[levelId] = Array.from(term.completedObjectives);
        });
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}
window.saveProgress = saveProgress;

function loadProgress() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

// ============================================================
// BOOT SEQUENCE
// ============================================================
const BOOT_ASCII = `
    ██████╗ ███████╗ █████╗  ██████╗████████╗███████╗██╗   ██╗██████╗       ███████╗
    ██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝██╔════╝██║   ██║██╔══██╗      ╚════██║
    ██████╔╝█████╗  ███████║██║        ██║   █████╗  ██║   ██║██████╔╝█████╗    ██╔╝
    ██╔══██╗██╔══╝  ██╔══██║██║        ██║   ██╔══╝  ██║   ██║██╔══██╗╚════╝   ██╔╝
    ██║  ██║███████╗██║  ██║╚██████╗   ██║   ███████╗╚██████╔╝██║  ██║         ██║
    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚══════╝ ╚═════╝ ╚═╝  ╚═╝         ╚═╝
`;

const BOOT_LINES = [
    '[BIOS] Initialisation du système de sécurité nucléaire...',
    '[BIOS] Vérification de l\'intégrité mémoire... OK',
    '[KERN] Chargement du kernel sécurisé v5.15.0-gentilly...',
    '[KERN] Montage des systèmes de fichiers chiffrés... OK',
    '[NET ] Initialisation interface réseau eth0... 192.168.1.100',
    '[NET ] Vérification du pare-feu... ACTIF',
    '[SEC ] Chargement des certificats SSL... OK',
    '[SEC ] Vérification des signatures... OK',
    '[SCDA] Connexion aux capteurs du réacteur 7... OK',
    '[SCDA] Température: 312.5°C — NORMAL',
    '[SCDA] Pression: 155.2 bar — NORMAL',
    '[MON ] Activation du système de surveillance réseau...',
    '[MON ] Détection d\'anomalies... ⚠ TRAFIC SUSPECT DÉTECTÉ',
    '[ALRT] ████ ALERTE DE SÉCURITÉ ████',
    '[ALRT] Connexions non autorisées détectées sur les ports 4444, 31337',
    '[ALRT] Source: 10.0.0.55 — RÉSEAU EXTERNE',
    '[SYS ] Activation du protocole d\'incident RÉACTEUR-7...',
    '[SYS ] En attente de l\'équipe d\'intervention cyber...',
    '',
    '═══ SYSTÈME PRÊT — AUTHENTIFICATION REQUISE ═══',
];

async function runBootSequence() {
    const asciiEl = document.getElementById('boot-ascii');
    const textEl = document.getElementById('boot-text');
    const progressBar = document.getElementById('boot-progress-bar');
    const statusEl = document.getElementById('boot-status');

    // Show ASCII art
    asciiEl.textContent = BOOT_ASCII;
    asciiEl.style.opacity = '0';
    await wait(300);
    asciiEl.style.transition = 'opacity 1s';
    asciiEl.style.opacity = '1';
    await wait(1200);

    // Boot lines one by one
    for (let i = 0; i < BOOT_LINES.length; i++) {
        const line = document.createElement('div');
        line.className = 'line';
        line.textContent = BOOT_LINES[i];

        // Color alerts red
        if (BOOT_LINES[i].includes('ALRT') || BOOT_LINES[i].includes('SUSPECT') || BOOT_LINES[i].includes('⚠')) {
            line.style.color = '#ff3333';
        }
        if (BOOT_LINES[i].includes('═══')) {
            line.style.color = '#00ff41';
            line.style.fontWeight = 'bold';
        }

        textEl.appendChild(line);

        // Update progress
        const progress = ((i + 1) / BOOT_LINES.length) * 100;
        progressBar.style.width = progress + '%';

        // Scroll boot text
        textEl.scrollTop = textEl.scrollHeight;

        await wait(150 + Math.random() * 200);
    }

    statusEl.textContent = 'SYSTÈME PRÊT — REDIRECTION VERS L\'AUTHENTIFICATION...';
    await wait(1500);

    // Transition to login
    switchScreen('screen-boot', 'screen-login');
    document.getElementById('agent-name').focus();
}

// ============================================================
// SCREEN MANAGEMENT
// ============================================================
function switchScreen(fromId, toId) {
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);

    from.classList.add('glitch');
    setTimeout(() => {
        from.classList.remove('active');
        from.classList.remove('glitch');
        to.classList.add('active');
    }, 300);
}

// ============================================================
// LOGIN
// ============================================================
function setupLogin() {
    const input = document.getElementById('agent-name');
    const btn = document.getElementById('btn-login');
    const hint = document.getElementById('login-hint');

    input.addEventListener('input', () => {
        const val = input.value.trim();
        if (val.length >= 2) {
            btn.classList.add('enabled');
            btn.disabled = false;
            btn.querySelector('.btn-text').textContent = '[ ACCÉDER AU SYSTÈME ]';
        } else {
            btn.classList.remove('enabled');
            btn.disabled = true;
            btn.querySelector('.btn-text').textContent = '[ ACCÈS REFUSÉ ]';
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim().length >= 2) {
            performLogin();
        }
    });

    btn.addEventListener('click', () => {
        if (input.value.trim().length >= 2) {
            performLogin();
        }
    });
}

function performLogin() {
    const input = document.getElementById('agent-name');
    const hint = document.getElementById('login-hint');
    const name = input.value.trim().toUpperCase();

    // Vérifier si une session sauvegardée correspond à ce nom
    const savedData = loadProgress();
    const isReturning = savedData && savedData.agentName === name;

    if (isReturning) {
        // Restaurer l'état sauvegardé
        state.agentName = savedData.agentName;
        state.unlockedLevels = savedData.unlockedLevels || ['briefing'];
        state.currentLevel = savedData.currentLevel || 'briefing';
        state.loginTime = savedData.loginTime || Date.now();
    } else {
        // Nouvelle partie — effacer l'ancienne sauvegarde
        localStorage.removeItem(SAVE_KEY);
        state.agentName = name;
        state.loginTime = Date.now();
        state.unlockedLevels = ['briefing'];
        state.currentLevel = 'briefing';
    }

    // Sauvegarder immédiatement
    saveProgress();

    // Animation d'authentification
    hint.textContent = 'Vérification des accréditations...';
    hint.style.color = '#ffcc00';

    setTimeout(() => {
        if (isReturning) {
            hint.textContent = `Bienvenue, Agent ${name}. Session restaurée.`;
        } else {
            hint.textContent = `Bienvenue, Agent ${name}. Accès autorisé.`;
        }
        hint.style.color = '#00ff41';

        setTimeout(() => {
            switchScreen('screen-login', 'screen-main');
            initializeMain(isReturning ? savedData : null);
        }, 1000);
    }, 1500);
}

// ============================================================
// MAIN INTERFACE
// ============================================================
function initializeMain(savedData = null) {
    // Set agent name
    document.getElementById('agent-badge').textContent = `AGENT: ${state.agentName}`;

    // Update agent name in mission complete
    document.querySelectorAll('.agent-name-display').forEach(el => {
        el.textContent = state.agentName;
    });

    // Start timer — use restart target (3h) if available, otherwise fixed date
    const timerEl = document.getElementById('main-timer');
    const restartTarget = localStorage.getItem('reactor7_restart');
    if (restartTarget) {
        const targetMs = parseInt(restartTarget, 10);
        const targetDate = new Date(targetMs).toISOString();
        state.timer = new CountdownTimer(timerEl, { targetDate: targetDate });
    } else {
        state.timer = new CountdownTimer(timerEl, CONFIG.timer);
    }
    state.timer.start();

    // Briefing : typewriter ou affichage instantané
    if (savedData) {
        showBriefingInstant();
    } else {
        startBriefing();
    }

    // Schedule radio messages
    scheduleRadioMessages();

    // Setup navigation
    setupNavigation();

    // Setup unlock system
    setupUnlockSystem();

    // Setup report
    setupReport();

    // Setup sound button
    setupSound();

    // Autoplay ambiance after login (user interaction already happened)
    startAmbiance();

    // Initialize simulated terminals
    initTerminals();

    // Setup file explorer
    setupFileExplorer();

    // Écouter les événements de complétion de niveau
    document.addEventListener('level-complete', (e) => {
        const completedLevel = e.detail.level;
        const nextLevelMap = { level1: 'level2', level2: 'level3', level3: 'level4' };
        const nextLevel = nextLevelMap[completedLevel];

        if (nextLevel && !state.unlockedLevels.includes(nextLevel)) {
            state.unlockedLevels.push(nextLevel);
            updateNavState(nextLevel);

            const clearanceLevel = state.unlockedLevels.length - 1;
            document.getElementById('clearance-badge').textContent = `NIVEAU ${clearanceLevel}`;

            showToast('Système', `✅ ${formatLevelName(completedLevel)} complété ! ${formatLevelName(nextLevel)} déverrouillé.`, false);
            addRadioMessage('Système', `Niveau de clearance augmenté. ${formatLevelName(nextLevel)} accessible.`, false);

            // Flash sur le bouton de navigation
            const navBtn = document.getElementById('nav-' + nextLevel);
            if (navBtn) {
                navBtn.classList.add('level-unlocked-flash');
                setTimeout(() => navBtn.classList.remove('level-unlocked-flash'), 3000);
            }

            // Sauvegarder la progression
            saveProgress();
        }
    });

    // Restaurer l'état sauvegardé
    if (savedData) {
        restoreSavedState(savedData);
    }
}

// ============================================================
// CONSTANTES DU BRIEFING
// ============================================================
const BRIEFING_LINES = [
    '> TRANSMISSION ENTRANTE — PRIORITÉ MAXIMALE',
    '> SOURCE : Équipe de surveillance, Poste de nuit',
    '> DATE : 14 mars 2026, 02h47',
    '',
    '> La centrale nucléaire de Gentilly-3 détecte des anomalies',
    '> dans son réseau interne.',
    '',
    '> Le système de surveillance signale un TRAFIC INHABITUEL',
    '> sur plusieurs ports.',
    '',
    '> Les capteurs de température du réacteur 7 envoient des',
    '> valeurs incohérentes. Pic à 510°C détecté.',
    '',
    '> L\'équipe de nuit suspecte une CYBERATTAQUE EN COURS.',
    '',
    '> Vous êtes l\'équipe d\'intervention en cybersécurité.',
    '> Votre mission : analyser, identifier et neutraliser la menace.',
    '',
    '> FIN DE TRANSMISSION ═══════════════════════════════'
];

// ============================================================
// BRIEFING TYPEWRITER (nouveau joueur)
// ============================================================
function startBriefing() {
    const target = document.getElementById('briefing-text');
    const tw = new Typewriter(target, {
        speed: 25,
        lineDelay: 400,
        onComplete: () => {
            // Show cards and mission after typing
            const cards = document.getElementById('briefing-cards');
            const mission = document.getElementById('briefing-mission');
            cards.style.display = '';
            cards.style.animation = 'fadeIn 0.5s ease';
            setTimeout(() => {
                mission.style.display = '';
                mission.style.animation = 'fadeIn 0.5s ease';
                // Afficher le code ALPHA après le briefing
                setTimeout(() => {
                    const codeReveal = document.getElementById('code-reveal-briefing');
                    if (codeReveal) {
                        codeReveal.classList.remove('hidden');
                        codeReveal.style.animation = 'fadeIn 0.8s ease';
                    }
                }, 800);
            }, 500);
        }
    });

    tw.type(BRIEFING_LINES);
}

// ============================================================
// BRIEFING INSTANTANÉ (joueur de retour)
// ============================================================
function showBriefingInstant() {
    const target = document.getElementById('briefing-text');
    BRIEFING_LINES.forEach(line => {
        const div = document.createElement('div');
        div.className = 'line';
        div.textContent = line;
        if (line.includes('ALRT') || line.includes('CYBERATTAQUE') || line.includes('⚠')) {
            div.style.color = '#ff3333';
        }
        if (line.includes('═══')) {
            div.style.color = '#00ff41';
            div.style.fontWeight = 'bold';
        }
        target.appendChild(div);
    });

    // Afficher directement les cartes et la mission
    document.getElementById('briefing-cards').style.display = '';
    document.getElementById('briefing-mission').style.display = '';

    // Toujours afficher le code ALPHA après le briefing
    const codeReveal = document.getElementById('code-reveal-briefing');
    if (codeReveal) codeReveal.classList.remove('hidden');
}

// ============================================================
// RESTAURATION DE L'ÉTAT SAUVEGARDÉ
// ============================================================
function restoreSavedState(savedData) {
    // Restaurer les niveaux déverrouillés
    state.unlockedLevels.forEach(level => {
        if (level !== 'briefing') updateNavState(level);
    });

    // Mettre à jour le badge clearance
    const clearanceLevel = state.unlockedLevels.length - 1;
    document.getElementById('clearance-badge').textContent = `NIVEAU ${clearanceLevel}`;

    // Naviguer vers le dernier niveau consulté
    navigateTo(state.currentLevel);

    // Restaurer les objectifs dans les terminaux
    if (savedData.completedObjectives && window._terminals) {
        window._terminals.forEach((term, levelId) => {
            const savedObjs = savedData.completedObjectives[levelId];
            if (savedObjs && savedObjs.length > 0) {
                term.restoreObjectives(savedObjs);
            }
        });
    }

    // Afficher les bannières si niveaux complétés
    ['level1', 'level2', 'level3'].forEach(levelId => {
        if (LEVEL_OBJECTIVES[levelId]) {
            const totalObjs = LEVEL_OBJECTIVES[levelId].length;
            const savedObjs = savedData.completedObjectives?.[levelId] || [];
            if (savedObjs.length >= totalObjs) {
                const banner = document.getElementById(`banner-${levelId}`);
                if (banner) banner.classList.remove('hidden');
            }
        }
    });
}

// ============================================================
// EXPLORATEUR DE FICHIERS (SIDEBAR)
// ============================================================
function setupFileExplorer() {
    // Toggle folder
    const folder = document.getElementById('folder-logs');
    const fileList = document.getElementById('file-list-logs');
    if (folder && fileList) {
        folder.addEventListener('click', () => {
            folder.classList.toggle('collapsed');
            fileList.classList.toggle('collapsed');
            const toggle = folder.querySelector('.folder-toggle');
            toggle.textContent = folder.classList.contains('collapsed') ? '▶' : '▼';
        });
    }

    // Click on files
    document.querySelectorAll('.file-item').forEach(item => {
        item.addEventListener('click', () => {
            const filePath = item.dataset.file;
            if (filePath && typeof VIRTUAL_FS !== 'undefined' && VIRTUAL_FS[filePath]) {
                openFileViewer(filePath, VIRTUAL_FS[filePath]);
            }
        });
    });

    // Close file viewer
    const overlay = document.getElementById('file-viewer-overlay');
    const closeBtn = document.getElementById('file-viewer-close');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');
        });
    }
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.add('hidden');
        });
    }

    // Escape key closes viewer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay && !overlay.classList.contains('hidden')) {
            overlay.classList.add('hidden');
        }
    });
}

function openFileViewer(filePath, content) {
    const overlay = document.getElementById('file-viewer-overlay');
    const title = document.getElementById('file-viewer-title');
    const contentEl = document.getElementById('file-viewer-content');

    title.textContent = filePath;
    contentEl.textContent = content;

    overlay.classList.remove('hidden');
}

// ============================================================
// NAVIGATION
// ============================================================
function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.dataset.level;
            if (state.unlockedLevels.includes(level)) {
                navigateTo(level);
            }
        });
    });
}

function navigateTo(level) {
    // Hide all content sections
    document.querySelectorAll('.level-content').forEach(el => {
        el.classList.add('hidden');
    });

    // Show target
    const target = document.getElementById('content-' + level);
    if (target) {
        target.classList.remove('hidden');
        target.style.animation = 'fadeIn 0.4s ease';
    }

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.level === level) {
            btn.classList.add('active');
        }
    });

    state.currentLevel = level;

    // Scroll to top
    document.getElementById('main-panel').scrollTop = 0;

    // Sauvegarder la progression
    saveProgress();
}

// ============================================================
// UNLOCK SYSTEM
// ============================================================
function setupUnlockSystem() {
    const input = document.getElementById('unlock-code');
    const btn = document.getElementById('btn-unlock');
    const hint = document.getElementById('unlock-hint');

    btn.addEventListener('click', () => attemptUnlock());
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') attemptUnlock();
    });

    function attemptUnlock() {
        const code = input.value.trim().toUpperCase();
        if (!code) return;

        let unlocked = null;

        // Check which level this code unlocks
        for (const [level, levelCode] of Object.entries(CONFIG.unlockCodes)) {
            if (code === levelCode && !state.unlockedLevels.includes(level)) {
                unlocked = level;
                break;
            }
        }

        if (unlocked) {
            state.unlockedLevels.push(unlocked);
            updateNavState(unlocked);
            navigateTo(unlocked);

            hint.textContent = `✅ ${unlocked.toUpperCase()} déverrouillé !`;
            hint.className = 'unlock-hint success';

            // Update clearance
            const clearanceLevel = state.unlockedLevels.length - 1;
            document.getElementById('clearance-badge').textContent = `NIVEAU ${clearanceLevel}`;

            // Toast notification
            showToast('Système', `Accès au ${formatLevelName(unlocked)} autorisé.`, false);

            // Radio message
            addRadioMessage('Système', `Niveau de clearance augmenté. ${formatLevelName(unlocked)} accessible.`, false);

            input.value = '';

            // Sauvegarder la progression
            saveProgress();
        } else if (Object.values(CONFIG.unlockCodes).includes(code)) {
            hint.textContent = '⚠ Niveau déjà déverrouillé.';
            hint.className = 'unlock-hint error';
        } else {
            hint.textContent = '❌ Code invalide. Contactez votre commandant.';
            hint.className = 'unlock-hint error';
            input.classList.add('glitch');
            setTimeout(() => input.classList.remove('glitch'), 300);
        }

        setTimeout(() => { hint.textContent = ''; }, 4000);
    }
}

function updateNavState(level) {
    const navBtn = document.getElementById('nav-' + level);
    if (navBtn) {
        navBtn.classList.remove('locked');
        navBtn.classList.add('unlocked');
        const statusSpan = navBtn.querySelector('.nav-status');
        statusSpan.textContent = '●';
        statusSpan.className = 'nav-status status-unlocked';
    }
}

function formatLevelName(level) {
    const names = {
        level1: 'Niveau 1 — Analyse des Logs',
        level2: 'Niveau 2 — Surveillance Réseau',
        level3: 'Niveau 3 — Scripts de Défense',
        level4: 'Niveau 4 — Rapport Final'
    };
    return names[level] || level;
}

// ============================================================
// RADIO MESSAGES
// ============================================================
function scheduleRadioMessages() {
    CONFIG.radioMessages.forEach(msg => {
        const timeout = setTimeout(() => {
            addRadioMessage(msg.sender, msg.text, msg.urgent);
            showToast(msg.sender, msg.text, msg.urgent);
        }, msg.delay * 1000);

        state.radioTimeouts.push(timeout);
    });
}

function addRadioMessage(sender, text, urgent) {
    const feed = document.getElementById('radio-feed');
    const div = document.createElement('div');
    div.className = 'radio-msg' + (urgent ? ' urgent' : '');

    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    div.innerHTML = `
        <span class="radio-time">[${time}]</span>
        <span class="radio-text"><strong>${sender}:</strong> ${text}</span>
    `;

    feed.appendChild(div);
    feed.scrollTop = feed.scrollHeight;
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(sender, text, urgent) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast' + (urgent ? ' urgent' : '');

    toast.innerHTML = `
        <div class="toast-sender">📻 ${sender}</div>
        <div>${text}</div>
    `;

    container.appendChild(toast);

    // Remove after animation
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 8500);
}

// ============================================================
// HINT TOGGLE
// ============================================================
window.toggleHint = function(btn) {
    const content = btn.nextElementSibling;
    if (content) {
        content.classList.toggle('hidden');
        btn.textContent = content.classList.contains('hidden') ? '💡 Indice' : '🔒 Masquer l\'indice';
    }
};

// ============================================================
// REPORT
// ============================================================
function setupReport() {
    const textarea = document.getElementById('report-textarea');
    const chars = document.getElementById('report-chars');
    const submitBtn = document.getElementById('btn-submit-report');

    if (textarea) {
        // Pre-fill agent name
        textarea.value = `Agent ${state.agentName}, Rapport d'incident — Centrale Gentilly-3\n\n`;

        textarea.addEventListener('input', () => {
            chars.textContent = `${textarea.value.length} caractères`;

            if (textarea.value.length > 100) {
                submitBtn.classList.add('enabled');
            } else {
                submitBtn.classList.remove('enabled');
            }
        });

        submitBtn.addEventListener('click', () => {
            if (textarea.value.length > 100) {
                submitReport();
            }
        });
    }
}

function submitReport() {
    const reportText = document.getElementById('report-textarea').value;
    const commentText = (document.getElementById('report-comment') || {}).value || '';

    // Generate .md file and download
    downloadReportMD(reportText, commentText);

    const complete = document.getElementById('mission-complete');
    complete.classList.remove('hidden');
    complete.style.animation = 'fadeIn 1s ease';
    complete.querySelector('.agent-name-display').textContent = state.agentName;

    // Stop timer
    if (state.timer) state.timer.stop();

    // Radio message
    addRadioMessage('Commandant Lavoie', `Agent ${state.agentName}, rapport reçu. Mission accomplie. Bon travail.`, false);
    showToast('Commandant Lavoie', 'Rapport reçu. Mission accomplie !', false);

    // Scroll to complete
    setTimeout(() => {
        complete.scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

function downloadReportMD(reportText, commentText) {
    const now = new Date();
    const date = now.toLocaleDateString('fr-CA');
    const time = now.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });

    let md = `# RAPPORT D'INCIDENT — OPÉRATION RÉACTEUR-7\n`;
    md += `## Centrale Nucléaire Gentilly-3\n\n`;
    md += `- **Agent :** ${state.agentName}\n`;
    md += `- **Date de soumission :** ${date} à ${time}\n`;
    md += `- **Classification :** SECRET\n\n`;
    md += `---\n\n`;
    md += `## Rapport d'incident\n\n`;
    md += reportText + '\n\n';
    md += `---\n\n`;

    if (commentText.trim()) {
        md += `## Commentaire pour l'exercice et le prof\n\n`;
        md += commentText + '\n\n';
        md += `---\n\n`;
    }

    md += `> Généré automatiquement par le système RÉACTEUR-7\n`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport_${state.agentName.replace(/\s+/g, '_')}_${date}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}



// ============================================================
// AUDIO AMBIANCE
// ============================================================
function setupSound() {
    const btn = document.getElementById('btn-sound');
    const audio = document.getElementById('ambiance-audio');

    btn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;

        if (state.soundEnabled) {
            btn.textContent = '\u{1F50A}';
            btn.classList.add('active');
            audio.volume = 0.35;
            audio.play().catch(() => {});
        } else {
            btn.textContent = '\u{1F507}';
            btn.classList.remove('active');
            audio.pause();
        }
    });
}

function startAmbiance() {
    const audio = document.getElementById('ambiance-audio');
    const btn = document.getElementById('btn-sound');

    audio.volume = 0.35;
    audio.play().then(() => {
        // Autoplay worked — update UI
        state.soundEnabled = true;
        btn.textContent = '\u{1F50A}';
        btn.classList.add('active');
    }).catch(() => {
        // Autoplay blocked — user will click the button
        console.log('[AUDIO] Autoplay bloqué. Cliquez sur le bouton son.');
    });
}

// ============================================================
// UTILITY
// ============================================================
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Toujours afficher boot + login
    setupLogin();
    runBootSequence();
});
