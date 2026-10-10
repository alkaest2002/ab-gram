---
title: Metriche di gruppo
order: 5
description: Le misure che descrivono il gruppo nel suo insieme.
---

Le metriche di gruppo **riassumono la struttura sociale con pochi numeri**.
Sono utili per confrontare gruppi diversi, oppure lo stesso gruppo in momenti
diversi (ad esempio prima e dopo un'attività di team building). Si dividono in
due famiglie:

- gli **indici di Moreno**, dal nome dello psicologo Jacob Moreno, ideatore del
  sociogramma, che misurano quanto il gruppo è unito e quanto è conflittuale;
- le **metriche di social network analysis (SNA)**, cioè di "analisi delle reti
  sociali", che descrivono la forma della rete di relazioni.

In tutte le formule, $n$ (o $N$) è il **numero di membri** del gruppo.

## Indici di Moreno

Gli indici di Moreno si calcolano sulle due tabelle (le *matrici di
adiacenza*) che registrano le preferenze e i rifiuti:

- $a_{ij} = 1$ se il membro $i$ **sceglie** il membro $j$, altrimenti $0$;
- $d_{ij} = 1$ se il membro $i$ **rifiuta** il membro $j$, altrimenti $0$.

Nelle formule compaiono spesso due elementi:

- il prodotto $a_{ij} a_{ji}$ vale $1$ solo se $i$ sceglie $j$ **e** $j$ sceglie
  $i$, cioè se la scelta è **reciproca**; negli altri casi vale $0$ (lo stesso
  vale per $d_{ij} d_{ji}$ con i rifiuti);
- il simbolo $\sum_{i,j}$ significa "somma su tutte le coppie di membri": si
  scorrono tutte le coppie e si sommano i valori trovati. Poiché ogni coppia
  viene considerata due volte (come $i,j$ e come $j,i$), una coppia reciproca
  contribuisce con $2$ alla somma.

Il numero $n(n-1)$ che compare in due formule è il **numero di relazioni
possibili**: ogni membro può esprimersi verso gli altri $n-1$ membri, e ci sono
$n$ membri.

### Coesione

Indica **quanto il gruppo è unito**: è la quota di coppie con scelta reciproca
sul totale di quelle possibili. Più il valore è alto, più nel gruppo ci sono
legami "confermati" da entrambe le parti.

$$
Coh = \frac{\sum_{i,j} a_{ij} a_{ji}}{n(n-1)}
$$

### Conflitto

Indica **quanto il gruppo è attraversato da tensioni**: è la quota di coppie con
rifiuto reciproco sul totale di quelle possibili. È la controparte negativa
della coesione.

$$
Con = \frac{\sum_{i,j} d_{ij} d_{ji}}{n(n-1)}
$$

### Reciprocità positiva

Indica **quanto le scelte vengono ricambiate**: mette a confronto le coppie con
scelta reciproca con tutte le scelte espresse nel gruppo. Il fattore
$\frac{1}{2}$ serve a contare ogni coppia reciproca **una sola volta**, e non
due.

$$
R^{+} = \frac{\frac{1}{2}\sum_{i,j} a_{ij} a_{ji}}{\sum_{i,j} a_{ij}}
$$

### Reciprocità negativa

Indica **quanto i rifiuti vengono ricambiati**: mette a confronto le coppie con
rifiuto reciproco con tutti i rifiuti espressi. Anche qui il fattore
$\frac{1}{2}$ conta ogni coppia una sola volta.

$$
R^{-} = \frac{\frac{1}{2}\sum_{i,j} d_{ij} d_{ji}}{\sum_{i,j} d_{ij}}
$$

## Metriche SNA

Le metriche SNA si calcolano sul **grafo diretto** delle preferenze (oppure dei
rifiuti). Un grafo è semplicemente una rete di punti collegati da linee: qui ogni
membro è un **nodo** (un punto) e ogni scelta è un **legame diretto** (una
freccia che va da chi sceglie a chi è scelto).

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

## Un esempio svolto

Riprendiamo il gruppo di quattro membri descritto nella sezione sui tipi di
legami, con le due matrici:

$$
A =
\begin{pmatrix}
0 & 1 & 1 & 0 \\\\
1 & 0 & 0 & 1 \\\\
0 & 1 & 0 & 1 \\\\
1 & 0 & 0 & 0
\end{pmatrix}
\qquad
D =
\begin{pmatrix}
0 & 0 & 1 & 0 \\\\
1 & 0 & 0 & 0 \\\\
0 & 0 & 0 & 1 \\\\
0 & 1 & 0 & 0
\end{pmatrix}
$$

Contando a mano troviamo che:

- le scelte espresse sono $7$ (la somma di tutti gli $1$ in $A$);
- l'unica coppia con scelta reciproca è quella tra i membri $1$ e $2$, quindi
  $\sum_{i,j} a_{ij} a_{ji} = 2$ (la coppia è contata due volte);
- nessun rifiuto è ricambiato, quindi $\sum_{i,j} d_{ij} d_{ji} = 0$;
- con $n = 4$ le relazioni possibili sono $n(n-1) = 12$.

Ne ricaviamo:

| Metrica | Calcolo | Risultato |
| ------- | ------- | --------- |
| Coesione | $2 / 12$ | circa $0{,}17$ |
| Conflitto | $0 / 12$ | $0$ |
| Reciprocità positiva | $\frac{1}{2} \cdot 2 / 7$ | circa $0{,}14$ |
| Densità | $7 / 12$ | circa $0{,}58$ |
| Reciprocità | $2 / 7$ | circa $0{,}29$ |

Il gruppo ha quindi una coesione bassa (solo una coppia si sceglie a vicenda) e
nessun conflitto reciproco, anche se un po' di rifiuti a senso unico ci sono.

## In sintesi

| Metrica | Famiglia | Cosa misura | Valore alto significa |
| ------- | -------- | ----------- | --------------------- |
| Coesione | Moreno | Quota di coppie con scelta reciproca | Gruppo più unito |
| Conflitto | Moreno | Quota di coppie con rifiuto reciproco | Gruppo più conflittuale |
| Reciprocità positiva | Moreno | Scelte reciproche rispetto a tutte le scelte | Scelte più spesso ricambiate |
| Reciprocità negativa | Moreno | Rifiuti reciproci rispetto a tutti i rifiuti | Rifiuti più spesso ricambiati |
| Densità | SNA | Legami presenti rispetto a quelli possibili | Rete più fitta |
| Centralizzazione | SNA | Concentrazione attorno al nodo più centrale | Rete più dipendente da una sola persona |
| Reciprocità | SNA | Legami ricambiati rispetto a tutti i legami | Legami più spesso ricambiati |
| Transitività | SNA | Tendenza a formare triangoli | Più "cerchie" chiuse di membri |
