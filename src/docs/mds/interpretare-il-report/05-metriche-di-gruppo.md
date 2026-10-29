---
title: Metriche di gruppo
order: 5
description: Le misure che descrivono il gruppo nel suo insieme.
---

Le metriche di gruppo **riassumono la struttura sociale con pochi numeri**.
Sono utili per confrontare gruppi diversi, oppure lo stesso gruppo in momenti
diversi.

### 1 Numero di nodi

Il numero di membri del gruppo. Nella formula, $V$ è l'insieme dei nodi e le
barre verticali $|\cdot|$ significano "quanti elementi contiene".

$$
N = |V|
$$

### 2 Numero di legami

Il numero di frecce presenti nel grafico, cioè il numero di scelte espresse
(oppure di rifiuti). Qui $\mathcal{E}$ è l'insieme dei legami.

$$
E = |\mathcal{E}|
$$

### 3 Legami reciproci

Un legame è **reciproco** quando esiste anche la freccia nella direzione opposta
(se $u$ sceglie $v$, anche $v$ sceglie $u$). La formula passa in rassegna ogni
legame $(u,v)$ e aggiunge $1$ se il legame di ritorno $(v,u)$ esiste, $0$ in
caso contrario. Il simbolo $\mathbf{1}[\dots]$ (detto *indicatore*) vale infatti
$1$ quando la condizione tra parentesi è vera e $0$ quando è falsa.

$$
E_{\leftrightarrow} = \sum_{(u,v)\in \mathcal{E}} \mathbf{1}[(v,u)\in \mathcal{E}]
$$

Attenzione: ogni coppia reciproca è formata da due legami, quindi viene contata
due volte.

### 4 Densità

Indica **quanto la rete è "fitta"**: è il rapporto tra i legami che ci sono e
quelli che potrebbero esserci. Vale $1$ in un grafico completo (tutti hanno
scelto tutti) e $0$ in un grafico senza legami.

$$
\Delta = \frac{E}{N(N-1)}
$$

### 5 Centralizzazione

Indica **quanto la rete ruota attorno a una sola persona**. Ogni nodo ha una
*centralità* $C_i$, un valore che misura quanto è "importante" nella rete (ad
esempio in base a quante scelte riceve); $C_{\max}$ è la centralità più alta
del gruppo. In questa sezione $C_i$ è il numero di scelte ricevute dal nodo $i$
(centralità di grado in ingresso): con questa scelta il denominatore $(N-1)^2$ è
il valore massimo possibile, raggiunto nella stella (una persona riceve $N-1$
scelte, tutte le altre nessuna). La formula misura quanto gli altri nodi restano distanti dal più
centrale. Vale $0$ se tutti i nodi sono ugualmente centrali, $1$ se tutto è
concentrato in un unico nodo (come in una "stella", con una persona al centro e
tutte le altre collegate solo a lei).

$$
C = \frac{\sum_{i=1}^{N} (C_{\max} - C_i)}{(N - 1)^2}
$$

### 6 Reciprocità

Indica **quanta parte dei legami viene ricambiata**: è il rapporto tra i legami
ricambiati e tutti i legami presenti.

$$
R = \frac{\sum_{i,j} a_{ij} a_{ji}}{\sum_{i,j} a_{ij}}
$$

### 7 Transitività

Misura la tendenza dei "vicini" di un nodo a essere collegati anche tra loro:
in altre parole, se $A$ è collegato a $B$ e a $C$, quanto è probabile che anche
$B$ e $C$ siano collegati? È il modo di tradurre in numeri il detto "gli amici
dei miei amici sono miei amici" (in tecnico, *coefficiente di clustering
globale*). Nella formula, $t_{\triangle}$ è il numero di **triangoli** presenti
nella rete (tre membri tutti collegati tra loro) e $d_v$ è il **numero di
legami** del nodo $v$ (grado, calcolato sul grafico non orientato: due membri
sono collegati se almeno uno dei due sceglie l'altro); il termine $\binom{d_v}{2}$ conta in quanti modi si
possono scegliere due dei suoi vicini. Il risultato vale $1$ quando ogni terna
di nodi collegati forma un triangolo.

$$
T = \frac{3 t_{\triangle}}{\sum_{v \in V} \binom{d_v}{2}}
$$

### 8 Indice di coesione

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
ricambiata. Il denominatore $N(N-1)$ è il numero di scelte possibili (ogni
membro può scegliere ogni altro).

$$
Coh_I = \frac{\sum_{i,j} a_{ij} a_{ji}}{N(N-1)}
$$

**Coesione di tipo II.** Rapporto tra le scelte reciproche e le scelte
effettivamente *espresse*: misura quanta parte delle scelte fatte viene
ricambiata, senza tener conto di quante scelte si sarebbero potute fare.
Coincide con l'*indice di reciprocità* della rete, ossia con la stessa misura
di reciprocità vista sopra applicata alle scelte.

$$
Coh_{II} = \frac{\sum_{i,j} a_{ij} a_{ji}}{\sum_{i,j} a_{ij}}
$$

### 9 Indice di conflitto

L'indice di conflitto è il "gemello" della coesione applicato ai rifiuti:
misura **quanto il gruppo è attraversato da tensioni reciproche**. Qui $b_{ij}$
vale $1$ se $i$ rifiuta $j$ e $0$ altrimenti, quindi $b_{ij}b_{ji}$ vale $1$
solo quando il rifiuto è ricambiato. Anche in questo caso si distinguono due
versioni.

**Conflitto di tipo I.** Rapporto tra i rifiuti reciproci e tutti i rifiuti
*possibili*: vale $1$ quando tutti si rifiutano a vicenda e $0$ quando nessun
rifiuto è ricambiato.

$$
Con_I = \frac{\sum_{i,j} b_{ij} b_{ji}}{N(N-1)}
$$

**Conflitto di tipo II.** Rapporto tra i rifiuti reciproci e i rifiuti
effettivamente *espressi*: misura quanta parte dei rifiuti fatti viene
ricambiata. Coincide con l'*indice di reciprocità* della rete dei rifiuti,
ossia con la stessa misura di reciprocità vista sopra, applicata però ai
legami negativi.

$$
Con_{II} = \frac{\sum_{i,j} b_{ij} b_{ji}}{\sum_{i,j} b_{ij}}
$$

## 10 Un esempio svolto

Immaginiamo un gruppo di quattro membri, con le seguenti matrici delle scelte
($A$) e dei rifiuti ($B$):

$$
A =
\begin{pmatrix}
0 & 1 & 1 & 0 \\\\
1 & 0 & 0 & 1 \\\\
0 & 1 & 0 & 1 \\\\
1 & 0 & 0 & 0
\end{pmatrix}
\qquad
B =
\begin{pmatrix}
0 & 0 & 1 & 0 \\\\
1 & 0 & 0 & 0 \\\\
0 & 0 & 0 & 1 \\\\
0 & 1 & 0 & 0
\end{pmatrix}
$$

Nella matrice $A$ ogni $1$ è una scelta ($1 \to 2$, $1 \to 3$, $2 \to 1$,
$2 \to 4$, $3 \to 2$, $3 \to 4$, $4 \to 1$); nella matrice $B$ ogni $1$ è un
rifiuto ($1 \to 3$, $2 \to 1$, $3 \to 4$, $4 \to 2$).

**Numero di nodi e di legami.** Il gruppo ha $N = 4$ nodi. Le frecce delle
scelte sono $7$, quindi $E = 7$.

**Legami reciproci.** L'unica coppia in cui $u$ sceglie $v$ *e* $v$ sceglie
$u$ è quella dei membri $1$ e $2$ (ci sono sia $1 \to 2$ sia $2 \to 1$). I due
legami vengono contati entrambi, perciò $E_{\leftrightarrow} = 2$.

**Densità.** Il rapporto tra i legami presenti e quelli possibili, con
$N(N-1) = 4 \cdot 3 = 12$ legami possibili:

$$
\Delta = \frac{E}{N(N-1)} = \frac{7}{12} \approx 0{,}58
$$

Il gruppo è abbastanza fitto: più della metà delle scelte possibili è espressa.

**Centralizzazione.** Usiamo come centralità $C_i$ il numero di scelte ricevute:
il membro $1$ ne riceve $2$ (dal $2$ e dal $4$), il $2$ ne riceve $2$ (dal $1$
e dal $3$), il $3$ ne riceve $1$ (dal $1$) e il $4$ ne riceve $2$ (dal $2$ e
dal $3$). Il massimo è $C_{\max} = 2$ e la somma delle distanze dal massimo è
$(2-2) + (2-2) + (2-1) + (2-2) = 1$. Dividendo per $(N-1)^2 = 9$:

$$
C = \frac{1}{9} \approx 0{,}11
$$

Il valore è basso: nessun membro accentra su di sé l'attenzione del gruppo.

**Reciprocità.** Il numeratore $\sum_{i,j} a_{ij} a_{ji}$ è proprio
$E_{\leftrightarrow} = 2$, mentre il denominatore è $E = 7$:

$$
R = \frac{2}{7} \approx 0{,}29
$$

Meno di un terzo delle scelte viene ricambiato.

**Transitività.** Per questa misura guardiamo il grafico come *non orientato*,
cioè consideriamo solo se due membri sono collegati (in un senso o nell'altro).
Qui tutti e sei i possibili collegamenti tra coppie esistono (le frecce coprono
le coppie $\{1,2\}$, $\{1,3\}$, $\{1,4\}$, $\{2,3\}$, $\{2,4\}$, $\{3,4\}$),
quindi il grafico è completo: ogni terna di membri forma un triangolo,
$t_{\triangle} = \binom{4}{3} = 4$. Ogni nodo ha grado $d_v = 3$, quindi
$\sum_v \binom{d_v}{2} = 4 \cdot \binom{3}{2} = 12$:

$$
T = \frac{3 \cdot 4}{12} = 1
$$

La rete è massimamente transitiva: ogni amico degli amici è a sua volta amico.

**Coesione.** La somma dei prodotti $a_{ij} a_{ji}$ vale $2$ (i due legami
reciproci tra $1$ e $2$). La coesione di tipo I la rapporta alle $N(N-1) = 12$
scelte possibili, quella di tipo II alle $7$ scelte espresse:

$$
Coh_I = \frac{2}{12} = \frac{1}{6} \approx 0{,}17,
\qquad
Coh_{II} = \frac{2}{7} \approx 0{,}29
$$

La coesione di tipo II coincide con la reciprocità, come previsto.

**Conflitto.** Nei rifiuti non c'è nessuna coppia reciproca
($\sum_{i,j} b_{ij} b_{ji} = 0$), quindi entrambi gli indici di conflitto
valgono $0$: il gruppo non ha tensioni ricambiate.

Riassumendo:

| Metrica | Valore |
| ------- | :----: |
| Numero di nodi ($N$) | $4$ |
| Numero di legami ($E$) | $7$ |
| Legami reciproci ($E_{\leftrightarrow}$) | $2$ |
| Densità ($\Delta$) | $7/12 \approx 0{,}58$ |
| Centralizzazione ($C$) | $1/9 \approx 0{,}11$ |
| Reciprocità ($R$) | $2/7 \approx 0{,}29$ |
| Transitività ($T$) | $1$ |
| Coesione di tipo I ($Coh_I$) | $1/6 \approx 0{,}17$ |
| Coesione di tipo II ($Coh_{II}$) | $2/7 \approx 0{,}29$ |
| Conflitto di tipo I ($Con_I$) | $0$ |
| Conflitto di tipo II ($Con_{II}$) | $0$ |
