---
title: Metriche di gruppo
order: 5
description: Le misure che descrivono il gruppo nel suo insieme.
---

Le metriche di gruppo **riassumono la struttura sociale con pochi numeri**.
Sono utili per confrontare gruppi diversi, oppure lo stesso gruppo in momenti
diversi.

### Numero di nodi

Il numero di membri del gruppo. Nella formula, $V$ è l'insieme dei nodi e le
barre verticali $|\cdot|$ significano "quanti elementi contiene".

$$
N = |V|
$$

### Numero di legami

Il numero di frecce presenti nel grafo, cioè il numero di scelte espresse
(oppure di rifiuti). Qui $\mathcal{E}$ è l'insieme dei legami.

$$
E = |\mathcal{E}|
$$

### Legami reciproci

Un legame è **reciproco** quando esiste anche la freccia nella direzione opposta
(se $u$ sceglie $v$, anche $v$ sceglie $u$). La formula passa in rassegna ogni
legame $(u,v)$ e aggiunge $1$ se il legame di ritorno $(v,u)$ esiste, $0$ in
caso contrario. Il simbolo $\mathbf{1}[\dots]$ (detto *indicatore*) vale infatti
$1$ quando la condizione tra parentesi è vera e $0$ quando è falsa.

$$
E_{\leftrightarrow} = \sum_{(u,v)\in E} \mathbf{1}[(v,u)\in E]
$$

Attenzione: ogni coppia reciproca è formata da due legami, quindi viene contata
due volte.

### Densità

Indica **quanto la rete è "fitta"**: è il rapporto tra i legami che ci sono e
quelli che potrebbero esserci. Vale $1$ in un grafo completo (tutti hanno
scelto tutti) e $0$ in un grafo senza legami.

$$
D = \frac{E}{N(N-1)}
$$

### Centralizzazione

Indica **quanto la rete ruota attorno a una sola persona**. Ogni nodo ha una
*centralità* $C_i$, un valore che misura quanto è "importante" nella rete (ad
esempio in base a quante scelte riceve); $C_{\max}$ è la centralità più alta
del gruppo. La formula misura quanto gli altri nodi restano distanti dal più
centrale. Vale $0$ se tutti i nodi sono ugualmente centrali, $1$ se tutto è
concentrato in un unico nodo (come in una "stella", con una persona al centro e
tutte le altre collegate solo a lei).

$$
C = \frac{\sum_{i=1}^{n} (C_{\max} - C_i)}{(n - 1)^2}
$$

### Reciprocità

Indica **quanta parte dei legami viene ricambiata**: è il rapporto tra i legami
ricambiati e tutti i legami presenti.

$$
R = \frac{\sum_{i,j} a_{ij} a_{ji}}{\sum_{i,j} a_{ij}}
$$

### Transitività

Misura la tendenza dei "vicini" di un nodo a essere collegati anche tra loro:
in altre parole, se $A$ è collegato a $B$ e a $C$, quanto è probabile che anche
$B$ e $C$ siano collegati? È il modo di tradurre in numeri il detto "gli amici
dei miei amici sono miei amici" (in tecnico, *coefficiente di clustering
globale*). Nella formula, $t_{\triangle}$ è il numero di **triangoli** presenti
nella rete (tre membri tutti collegati tra loro) e $d_v$ è il **numero di
legami** del nodo $v$; il termine $\binom{d_v}{2}$ conta in quanti modi si
possono scegliere due dei suoi vicini. Il risultato vale $1$ quando ogni terna
di nodi collegati forma un triangolo.

$$
T = \frac{3 t_{\triangle}}{\sum_{v \in V} \binom{d_v}{2}}
$$

### Indice di coesione

L'indice di coesione misura **quanto il gruppo è unito**, contando le scelte
reciproche. Qui $a_{ij}$ vale $1$ se $i$ sceglie $j$ e $0$ altrimenti, così il
prodotto $a_{ij}a_{ji}$ vale $1$ solo quando la scelta è ricambiata. Il
numeratore $\sum_{i,j} a_{ij}a_{ji}$ è esattamente il numero di legami
reciproci $E_{\leftrightarrow}$ descritto sopra (ogni coppia ricambiata conta
per due). Come per la reciprocità, si distinguono due versioni, che rispondono
a domande diverse.

**Coesione di tipo I.** Rapporto tra le scelte reciproche e tutte le scelte
*possibili*: misura quanto il gruppo è coeso rispetto a quanto potrebbe esserlo.
Vale $1$ quando tutti si scelgono a vicenda e $0$ quando nessuna scelta è
ricambiata. Il denominatore $n(n-1)$ è il numero di scelte possibili (ogni
membro può scegliere ogni altro).

$$
Coh_I = \frac{\sum_{i,j} a_{ij} a_{ji}}{n(n-1)}
$$

**Coesione di tipo II.** Rapporto tra le scelte reciproche e le scelte
effettivamente *espresse*: misura quanta parte delle scelte fatte viene
ricambiata, senza tener conto di quante scelte si sarebbero potute fare.
Coincide con la *reciprocità* delle scelte vista sopra.

$$
Coh_{II} = \frac{\sum_{i,j} a_{ij} a_{ji}}{\sum_{i,j} a_{ij}}
$$

### Indice di conflitto

L'indice di conflitto è il "gemello" della coesione applicato ai rifiuti:
misura **quanto il gruppo è attraversato da tensioni reciproche**. Qui $d_{ij}$
vale $1$ se $i$ rifiuta $j$ e $0$ altrimenti, quindi $d_{ij}d_{ji}$ vale $1$
solo quando il rifiuto è ricambiato. Anche in questo caso si distinguono due
versioni.

**Conflitto di tipo I.** Rapporto tra i rifiuti reciproci e tutti i rifiuti
*possibili*: vale $1$ quando tutti si rifiutano a vicenda e $0$ quando nessun
rifiuto è ricambiato.

$$
Con_I = \frac{\sum_{i,j} d_{ij} d_{ji}}{n(n-1)}
$$

**Conflitto di tipo II.** Rapporto tra i rifiuti reciproci e i rifiuti
effettivamente *espressi*: misura quanta parte dei rifiuti fatti viene
ricambiata.

$$
Con_{II} = \frac{\sum_{i,j} d_{ij} d_{ji}}{\sum_{i,j} d_{ij}}
$$
