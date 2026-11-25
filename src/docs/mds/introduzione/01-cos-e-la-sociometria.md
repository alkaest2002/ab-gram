---
title: La sociometria di Moreno
order: 1
---

La **sociometria** studia le relazioni tra i membri di un gruppo attraverso la
raccolta e l'analisi delle loro preferenze. Il suo scopo è **misurare e
rappresentare** i legami di scelta e di rifiuto, per comprendere come il gruppo
si organizza al suo interno.

Non descrive le persone in assoluto: mette in luce la loro **posizione
relazionale in un determinato gruppo**, rispetto a una situazione specifica.

## 1 Le origini

La sociometria si sviluppa negli anni Trenta del Novecento grazie allo psichiatra
**Jacob L. Moreno**. La sua intuizione è che, per comprendere un gruppo, non
basti osservarlo dall'esterno: occorre conoscere anche le preferenze espresse
dai suoi membri.

Chiedere con chi una persona vorrebbe svolgere un'attività — e con chi
preferirebbe non svolgerla — permette di esplorare una rete di relazioni che
non sempre coincide con i ruoli formali o con le interazioni più visibili.

## 2 L'idea di base

Il punto di partenza è il **questionario sociometrico**. A ogni membro si chiede
di indicare le persone del gruppo che sceglierebbe per una determinata
situazione e, se previsto dal questionario, quelle che non sceglierebbe.

La situazione a cui si riferisce la domanda definisce il **criterio
sociometrico**. Per esempio:

> Con chi vorresti lavorare a un progetto di gruppo?

Il criterio è essenziale per interpretare le risposte: scegliere qualcuno come
compagno di lavoro non significa necessariamente sceglierlo anche per
trascorrere il tempo libero. **Cambiando il criterio, può cambiare la rete delle
preferenze.**

Le risposte vengono organizzate e rappresentate attraverso due strumenti:

- la **matrice sociometrica**, una tabella in cui righe e colonne corrispondono
  ai membri del gruppo e le celle registrano le scelte e i rifiuti;
- il **sociogramma**, una rappresentazione grafica in cui le persone sono nodi e
  le relazioni sono frecce, orientate da chi esprime una preferenza a chi la
  riceve.

Una scelta non è necessariamente ricambiata: Anna può scegliere Bea senza che
Bea scelga Anna. Per questo le relazioni hanno una **direzione**.

### 2.1 Un esempio

Consideriamo un gruppo formato da Anna, Bea e Carlo. Nella matrice seguente le
righe indicano **chi esprime** una scelta o un rifiuto e le colonne **chi lo
riceve**. Il segno `+` indica una scelta, il segno `−` un rifiuto; una cella vuota
fuori dalla diagonale indica che non è stata espressa nessuna delle due
indicazioni.

|           | Anna | Bea | Carlo |
| --------- | :--: | :-: | :---: |
| **Anna**  |  ·   |  +  |   ·   |
| **Bea**   |  ·   |  ·  |   −   |
| **Carlo** |  +   |  ·  |   ·   |

Anna sceglie Bea, Bea rifiuta Carlo e Carlo sceglie Anna. La diagonale è esclusa:
nel questionario non si indicano scelte o rifiuti verso se stessi.

**L'assenza di una scelta non equivale a un rifiuto.** Una persona non indicata
potrebbe semplicemente non rientrare tra le scelte espresse, soprattutto
se il questionario limita il numero di risposte.

Per analizzare separatamente i due tipi di relazione, la tabella può essere
tradotta in due **matrici di adiacenza**: una per le scelte ($A$) e una per i
rifiuti ($B$). Righe e colonne mantengono lo stesso ordine (Anna, Bea, Carlo).
Ogni elemento vale $1$ se la relazione è stata espressa e $0$ altrimenti; gli
elementi sulla diagonale valgono $0$.

$$
A =
\begin{pmatrix}
0 & 1 & 0 \\\\
0 & 0 & 0 \\\\
1 & 0 & 0
\end{pmatrix}
\qquad
B =
\begin{pmatrix}
0 & 0 & 0 \\\\
0 & 0 & 1 \\\\
0 & 0 & 0
\end{pmatrix}
$$

## 3 Gli indici sociometrici

Dalle risposte si ricavano **indici sociometrici** che sintetizzano la posizione
dei singoli membri e alcune caratteristiche del gruppo. Si distinguono due
famiglie:

- gli indici **individuali**, che descrivono le scelte e i rifiuti ricevuti o
  espressi da ciascun membro e quanto queste relazioni siano ricambiate;
- gli indici **di gruppo**, che descrivono aspetti complessivi della rete, come
  la reciprocità delle scelte o la diffusione dei rifiuti.

A partire da specifici criteri di classificazione si può inoltre definire lo
**status sociometrico** di un membro: una categoria che ne sintetizza la
posizione nel gruppo, non un tratto stabile della sua personalità.

La definizione e il metodo di calcolo di ciascuna metrica disponibile in
**AB-Gram** sono illustrati nelle sezioni dedicate della documentazione.

Alcuni indici sociometrici combinano scelte e rifiuti, per esempio confrontando
quelli ricevuti da uno stesso membro. In AB-Gram, invece, le misure di
**Social Network Analysis** vengono calcolate separatamente sulla rete delle
scelte e su quella dei rifiuti. Si tratta di due prospettive complementari,
illustrate anche in _Cos'è la Social Network Analysis_.

## 4 A cosa serve e come interpretarla

La sociometria aiuta a individuare preferenze reciproche, sottogruppi e persone
che ricevono poche scelte o molti rifiuti. Affiancata all'osservazione e alla
conoscenza del contesto, può orientare interventi educativi e organizzativi
nella scuola, nel lavoro e nello sport.

I risultati richiedono però alcune cautele:

- **Descrivono un momento e un criterio.** Le relazioni possono cambiare nel
  tempo e variare a seconda dell'attività proposta.
- **Non spiegano da soli le cause.** Ricevere poche scelte non basta, per
  esempio, a concludere che una persona sia esclusa dal gruppo.
- **Dipendono da come si raccolgono i dati.** La formulazione delle domande, il
  numero di indicazioni consentite e la partecipazione dei membri incidono
  sulla lettura dei risultati.
- **Richiedono riservatezza.** Scelte e rifiuti sono informazioni delicate:
  vanno trattate con cura, evitando esposizioni pubbliche ed etichette
  stigmatizzanti.

L'analisi sociometrica è quindi un **punto di partenza per comprendere il gruppo
e progettare interventi**, non un giudizio definitivo sulle persone.
