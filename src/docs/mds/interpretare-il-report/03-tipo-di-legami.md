---
title: Tipi di legami
order: 3
---

AB-Gram classifica i legami a partire dalle **scelte e dai rifiuti registrati**
per ciascuna coppia di membri. Queste risposte si riferiscono alla domanda e al
momento della rilevazione: non descrivono necessariamente un'amicizia, un
conflitto stabile o tutti i sentimenti delle persone coinvolte.

La direzione conta: `i → j` indica ciò che il membro $i$ esprime verso il
membro $j$. Per interpretarla, il programma considera anche la risposta nella
direzione opposta, `j → i`.

## 1 Le matrici delle scelte e dei rifiuti

Le risposte sono rappresentate da due **matrici di adiacenza**, cioè tabelle
quadrate con gli stessi membri sulle righe e sulle colonne:

- $a_{ij} = 1$ se $i$ sceglie $j$, altrimenti $0$; la matrice $A$ contiene le scelte;
- $b_{ij} = 1$ se $i$ rifiuta $j$, altrimenti $0$; la matrice $B$ contiene i rifiuti.

Ogni **riga** rappresenta le risposte espresse da un membro; ogni **colonna**
quelle ricevute. La diagonale è esclusa dall'analisi: non si considerano scelte
o rifiuti verso se stessi.

Per esempio, $a_{12} = 1$ significa che il membro 1 sceglie il membro 2.
$b_{21} = 0$ significa invece che il membro 2 non ha espresso un rifiuto verso
il membro 1: **non significa che lo abbia scelto**.

> L'assenza di una nomina non dimostra indifferenza. Può dipendere dalla
> consegna, dal numero di risposte consentite o dalla mancata compilazione.

## 2 Come leggere le formule

Nelle formule, i valori $1$ e $0$ sono trattati come vero e falso.

| Simbolo | Significato                               | Esempio                                         |
| ------- | ----------------------------------------- | ----------------------------------------------- |
| $\land$ | «e»: entrambe le condizioni devono valere | $a_{ij} \land a_{ji}$: i due membri si scelgono |
| $\neg$  | «non»: la condizione non deve valere      | $\neg b_{ij}$: $i$ non rifiuta $j$              |

Le definizioni seguenti descrivono la **direzione da $i$ a $j$**, come nel
calcolo del programma. Quando $j$ esprime sia una scelta sia un rifiuto verso
$i$, la stessa direzione può comparire in più tipi: le categorie non sono
sempre mutuamente esclusive.

## 3 I sette tipi del report

### 3.1 T1 — Scelte reciproche

$i$ sceglie $j$ senza rifiutarlo, e $j$ sceglie $i$.

$$
a_{ij} \land \neg b_{ij} \land a_{ji}
$$

Se nessuno dei due esprime rifiuti, entrambe le direzioni appartengono a T1.
La definizione non esclude un eventuale rifiuto di $j$ verso $i$: in quel caso
la direzione $i \to j$ appartiene anche a T5.

### 3.2 T2 — Scelte non reciproche

$i$ sceglie $j$ senza rifiutarlo; $j$ non esprime né scelta né rifiuto verso $i$.

$$
a_{ij} \land \neg b_{ij} \land \neg a_{ji} \land \neg b_{ji}
$$

### 3.3 T3 — Rifiuti non reciproci

$i$ rifiuta $j$ senza sceglierlo; $j$ non esprime né scelta né rifiuto verso $i$.

$$
b_{ij} \land \neg a_{ij} \land \neg a_{ji} \land \neg b_{ji}
$$

### 3.4 T4 — Rifiuti reciproci

$i$ rifiuta $j$ senza sceglierlo, e $j$ rifiuta $i$.

$$
b_{ij} \land \neg a_{ij} \land b_{ji}
$$

Se nessuno dei due esprime scelte, entrambe le direzioni appartengono a T4.
Se $j$ esprime anche una scelta verso $i$, la direzione $i \to j$ appartiene
anche a T6.

### 3.5 T5 — Scelte contraccambiate da rifiuti

$i$ sceglie $j$ senza rifiutarlo, mentre $j$ rifiuta $i$.

$$
a_{ij} \land \neg b_{ij} \land b_{ji}
$$

### 3.6 T6 — Rifiuti contraccambiati da scelte

$i$ rifiuta $j$ senza sceglierlo, mentre $j$ sceglie $i$.

$$
b_{ij} \land \neg a_{ij} \land a_{ji}
$$

T5 e T6 descrivono i due punti di vista di uno scambio contrapposto. Se $i$
sceglie $j$ e $j$ rifiuta $i$, senza altre risposte tra loro, `i → j` è T5 e
`j → i` è T6.

### 3.7 T7 — Scelte e rifiuti insieme

$i$ esprime sia una scelta sia un rifiuto verso $j$, indipendentemente da ciò
che esprime $j$.

$$
a_{ij} \land b_{ij}
$$

È una compresenza di risposte da contestualizzare, non una diagnosi di
«ambivalenza» della persona. T7 compare nella pagina generale dei tipi di
relazione, ma non nel riepilogo T1–T6 delle pagine individuali.

## 4 Fasce e conteggi

Il report raggruppa i tipi in tre fasce:

| Etichetta nel report                   | Tipi           |
| -------------------------------------- | -------------- |
| Relazioni sane                         | T1, T2         |
| Relazioni potenzialmente problematiche | T3             |
| Relazioni problematiche                | T4, T5, T6, T7 |

Queste sono **etichette operative del report**, non giudizi sulle persone né
prove della qualità complessiva di una relazione. Vanno lette insieme alle
risposte di partenza, soprattutto nei casi di scelta e rifiuto compresenti.

Nella pagina generale si contano le **direzioni elencate**, non le coppie
uniche: due membri che si scelgono senza rifiutarsi producono due voci T1,
`i → j` e `j → i`. I totali di fascia sommano le voci dei tipi che contengono;
se una direzione compare in più tipi, contribuisce più volte al totale.

Nelle pagine individuali il conteggio segue invece l'attribuzione al membro:
i tipi reciproci T1 e T4 contano la coppia una volta per ciascun membro;
i tipi direzionali sono attribuiti a chi esprime la risposta. Non confrontare
quindi i due riepiloghi come se usassero la stessa unità di conteggio.
