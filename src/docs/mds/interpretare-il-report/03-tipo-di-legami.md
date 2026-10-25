---
title: Tipi di legami
order: 3
description: Come classificare le relazioni tra i membri del gruppo.
---

In un gruppo, ogni persona può esprimere un sentimento verso le altre: può
sceglierne qualcuna (ad esempio, "con lui lavorerei volentieri") oppure
rifiutarla ("con lei preferirei non lavorare"). Per ogni coppia di membri
possiamo quindi guardare i sentimenti espressi **in entrambe le direzioni** e
usarli per classificare il loro legame.

Per farlo in modo preciso, usiamo due simboli:

- $a_{ij} = 1$ se il membro $i$ **sceglie** il membro $j$ (altrimenti vale $0$);
- $b_{ij} = 1$ se il membro $i$ **rifiuta** il membro $j$ (altrimenti vale $0$).

Le lettere $i$ e $j$ sono semplici etichette: indicano due membri qualsiasi del
gruppo, ad esempio il membro $1$ e il membro $2$.

## Come registrare le relazioni: la matrice di adiacenza

Un modo comodo per tenere in ordine tutte le scelte e i rifiuti è una tabella
quadrata, detta **matrice di adiacenza**. Righe e colonne rappresentano gli
stessi membri del gruppo, nello stesso ordine, e ogni casella contiene $1$ se
quella relazione esiste e $0$ se non esiste. Ne servono due: una per le scelte
($A$) e una per i rifiuti ($B$).

Per leggere la tabella basta ricordare due regole:

- **ogni riga** mostra ciò che quel membro *esprime* verso gli altri (relazioni
  in uscita);
- **ogni colonna** mostra ciò che quel membro *riceve* dagli altri (relazioni in
  entrata).

La **diagonale** (dall'alto a sinistra al basso a destra) contiene sempre $0$,
perché nessuno può scegliere o rifiutare se stesso.

Ecco un esempio con un gruppo di quattro membri:

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

Per trovare un valore, si parte dalla riga di chi esprime il sentimento e si
scende fino alla colonna di chi lo riceve:

- $a_{12} = 1$ (riga 1, colonna 2): il membro $1$ **sceglie** il membro $2$;
- $b_{31} = 0$ (riga 3, colonna 1): il membro $3$ **non rifiuta** il membro $1$.

## Come leggere le formule

Nelle definizioni che seguono compaiono tre simboli della logica, che si
leggono come parole di uso comune:

| Simbolo | Si legge | Esempio |
| ------- | -------- | ------- |
| $\land$ | "e" (devono valere entrambe le condizioni) | $a_{ij} \land a_{ji}$: $i$ sceglie $j$ **e** $j$ sceglie $i$ |
| $\neg$  | "non" (la condizione è falsa) | $\neg b_{ij}$: $i$ **non** rifiuta $j$ |
| $\lor$  | "oppure" (basta che valga almeno una delle due) | usato solo nei sentimenti contrapposti |

In ogni formula consideriamo quattro sentimenti possibili, due per ciascuna
direzione: $i$ sceglie $j$ ($a_{ij}$), $i$ rifiuta $j$ ($b_{ij}$), $j$ sceglie
$i$ ($a_{ji}$) e $j$ rifiuta $i$ ($b_{ji}$). Ogni tipo di legame stabilisce
quali di questi quattro sentimenti ci sono e quali no.

## Legami non problematici

Sono i legami in cui non compare alcun rifiuto: c'è almeno una scelta, e
nessuno dei due membri respinge l'altro.

### Preferenza a senso unico

Un membro sceglie l'altro, ma l'altro non risponde in nessun modo: non lo
sceglie e non lo rifiuta.

$$
a_{ij} \land \neg b_{ij} \land \neg a_{ji} \land \neg b_{ji}
$$

In parole: $i$ sceglie $j$, **e** $i$ non lo rifiuta, **e** $j$ non sceglie $i$,
**e** $j$ non rifiuta $i$.

### Preferenza reciproca

I due membri si scelgono a vicenda, e nessuno dei due rifiuta l'altro. È il
legame più positivo possibile.

$$
a_{ij} \land \neg b_{ij} \land a_{ji} \land \neg b_{ji}
$$

In parole: $i$ sceglie $j$ **e** $j$ sceglie $i$, senza alcun rifiuto da
nessuna delle due parti.

## Legami problematici

Sono i legami in cui compare almeno un rifiuto, oppure in cui i due membri
provano sentimenti opposti l'uno verso l'altro. Meritano attenzione perché
possono creare tensioni nel gruppo.

### Rifiuto a senso unico

Un membro rifiuta l'altro, ma l'altro non esprime né scelta né rifiuto (magari
non si è nemmeno accorto della cosa).

$$
b_{ij} \land \neg a_{ij} \land \neg a_{ji} \land \neg b_{ji}
$$

In parole: $i$ rifiuta $j$, **e** non lo sceglie, **e** $j$ non sceglie $i$,
**e** non lo rifiuta.

### Rifiuto reciproco

I due membri si rifiutano a vicenda, e nessuno dei due esprime una scelta.

$$
b_{ij} \land \neg a_{ij} \land b_{ji} \land \neg a_{ji}
$$

In parole: $i$ rifiuta $j$ **e** $j$ rifiuta $i$, senza alcuna scelta da
nessuna delle due parti.

### Sentimenti contrapposti

Uno dei due membri sceglie l'altro, che però lo rifiuta: i sentimenti vanno in
direzioni opposte. Può succedere in due modi, a seconda di chi sceglie e di chi
rifiuta; per questo la formula ha due parti collegate da "oppure" ($\lor$).

$$
(a_{ij} \land \neg b_{ij} \land \neg a_{ji} \land b_{ji}) \lor
(\neg a_{ij} \land b_{ij} \land a_{ji} \land \neg b_{ji})
$$

In parole:

- **primo caso:** $i$ sceglie $j$, ma $j$ rifiuta $i$;
- **secondo caso:** $i$ rifiuta $j$, ma $j$ sceglie $i$.

Basta che si verifichi uno dei due casi perché il legame sia di questo tipo.

## Legami ambivalenti

Un legame è ambivalente quando un membro sceglie e rifiuta
lo stesso membro.

$$
a_{ij} \land b_{ij}
$$

## In sintesi

| Tipo di legame | Cosa succede | Problematico? |
| -------------- | ------------ | :-----------: |
| Preferenza a senso unico | Uno sceglie, l'altro non esprime nulla | No |
| Preferenza reciproca | Si scelgono a vicenda | No |
| Rifiuto a senso unico | Uno rifiuta, l'altro non esprime nulla | Sì |
| Rifiuto reciproco | Si rifiutano a vicenda | Sì |
| Sentimenti contrapposti | Uno sceglie, l'altro rifiuta | Sì |
| Legami ambivalenti | Uno sceglie e rifiuta lo stesso membro | Sì |
