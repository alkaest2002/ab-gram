---
title: Status sociometrico
order: 6
description: Come viene assegnato a ogni membro il codice di status sociometrico.
---

Lo **status sociometrico** ($ss_i$) è l'etichetta finale che riassume la
posizione di ciascun membro nel gruppo. A differenza degli indici visti nella
pagina sulle [metriche individuali](/docs/interpretare-il-report/05-metriche-individuali),
che sono numeri, qui si tratta di una **categoria**: l'algoritmo combina due
informazioni già incontrate — l'**impatto** ricevuto (quanto il membro è
visibile agli occhi degli altri) e il **bilancio** tra preferenze e rifiuti
(se prevalgono le une o gli altri) — e restituisce un codice da $0$ a $8$.

## In sintesi

L'algoritmo risponde a tre domande, nell'ordine:

1. **Il membro è visibile?** Ha ricevuto almeno un'opinione? Se no, è isolato o
   ignorato e la classificazione finisce qui.
2. **Quanto è visibile?** Rispetto agli altri membri visibili, il suo impatto è
   basso, medio o alto?
3. **Prevalgono le preferenze o i rifiuti?** Il bilancio è positivo, negativo o
   neutro?

Le risposte si combinano in una delle nove categorie. L'impatto basso ha la
precedenza sul bilancio.

## Le nove categorie

Ogni codice corrisponde a una categoria ben precisa:

| Codice | Categoria   | Impatto ricevuto | Bilancio  |
| :----: | ----------- | :--------------: | :-------: |
|   0    | isolato     |      nessuno     |     —     |
|   1    | ignorato    |      nessuno     |     —     |
|   2    | marginale   |       basso      | qualunque |
|   3    | apprezzato  |       medio      |  positivo |
|   4    | popolare    |       alto       |  positivo |
|   5    | malvisto    |       medio      |  negativo |
|   6    | rifiutato   |       alto       |  negativo |
|   7    | ambivalente |       medio      |   neutro  |
|   8    | controverso |       alto       |   neutro  |

La categoria dipende dal **livello di impatto** (basso, medio, alto) e, per i
livelli medio e alto, dal **bilancio** (positivo, negativo, neutro). Le prime due
righe sono un caso a parte: un membro che **non riceve alcuna opinione** è
classificato solo in base al fatto che ne abbia espresse o meno.

## I dati in ingresso

L'algoritmo riceve quattro valori per ogni membro:

- $rp_i$: **preferenze ricevute**;
- $rr_i$: **rifiuti ricevuti**;
- $\mathrm{espressività}_i = gp_i + gr_i$: opinioni **espresse** in totale;
- $n_i = rp_i + rr_i$: **impatto**, cioè opinioni **ricevute** in totale.

> **Attenzione alla notazione.** In questa pagina $n_i$ indica l'impatto del
> singolo membro (quante opinioni ha ricevuto), **non** il numero di membri del
> gruppo, indicato altrove con $n$. Con $N$ indichiamo invece il numero di
> membri **visibili**, cioè con $n_i > 0$.

## L'algoritmo di assegnazione

L'assegnazione procede in **quattro passi successivi**. Ogni passo è
matematicamente semplice; la complessità sta nel fatto che si susseguono e che
alcuni hanno priorità sugli altri.

### Passo 1 — Visibilità: isolato e ignorato

Questo passo ha **la precedenza su tutto il resto**. Si guarda soltanto se il
membro ha ricevuto opinioni ($n_i > 0$) e se ne ha espresse
($\mathrm{espressività}_i > 0$):

- **isolato** (0): nessuna opinione ricevuta **e** nessuna espressa
  ($n_i = 0$ e $\mathrm{espressività}_i = 0$);
- **ignorato** (1): nessuna opinione ricevuta **ma** qualcuna espressa
  ($n_i = 0$ e $\mathrm{espressività}_i > 0$).

In pratica l'isolato non partecipa affatto allo scambio di opinioni, mentre
l'ignorato esprime opinioni ma nessuno gliene rivolge. Tutti gli altri membri
($n_i > 0$) procedono al passo successivo.

### Passo 2 — Classificazione dell'impatto

Qui si divide l'impatto ricevuto in **basso**, **medio** e **alto**, usando i
percentili. Due dettagli sono importanti.

**Solo i membri "visibili".** I percentili si calcolano **esclusivamente sui
membri che hanno ricevuto almeno un'opinione** ($n_i > 0$). Se si includessero
anche gli isolati e gli ignorati, la lunga coda di zeri abbasserebbe le soglie
e, nelle reti poco dense, la categoria "marginale" rischierebbe di non essere
mai raggiunta.

Ordinati in senso crescente gli impatti dei soli
membri visibili, $x_0 \le x_1 \le \dots \le x_{N-1}$, il percentile $P$ è il
valore che occupa la posizione $\lfloor N \cdot P / 100 \rfloor$ (l'indice parte
da $0$):

$$
\text{percentile}(P) = x_{\left\lfloor \frac{N \cdot P}{100} \right\rfloor}
$$

Non c'è interpolazione: il risultato è sempre uno dei valori realmente
osservati. Con $P = 20$ si ottiene la **soglia bassa**, con $P = 80$ la
**soglia alta**:

- **impatto basso**: $n_i \le \text{percentile}(20)$;
- **impatto alto**: $n_i \ge \text{percentile}(80)$;
- **impatto medio**: tutti gli altri.

Le soglie sono **inclusive** ($\le$ e $\ge$): se più membri si trovano
esattamente su una soglia, vengono tutti classificati dalla stessa parte, e per
questo una classe può superare il $20\%$ teorico. Nei gruppi piccoli il
$20$-esimo percentile coincide spesso con il minimo e l'$80$-esimo con il
massimo: i percentili sono "grossolani" quando i membri sono pochi.

#### Il caso limite: percentili che collassano

Può capitare che soglia bassa e soglia alta **coincidano**. Succede quando
almeno il $60\%$ dei membri visibili condivide lo stesso valore, che diventa
allora la **mediana**. In quel caso non si può dividere il gruppo con i soliti
due percentili, e l'algoritmo decide in base a quanto è diseguale la
distribuzione, misurata con il **coefficiente di Gini** ($G$, da $0$ = perfetta
uguaglianza a $1$ = massima disuguaglianza) e con l'**escursione** (differenza
tra massimo e minimo). Tutto si calcola sui soli membri visibili.

**Prima condizione: la distribuzione è abbastanza diseguale?**

- sì, se $G \ge 0{,}3$, oppure $G \ge 0{,}2$ con escursione $\ge 3$;
- se la condizione **non** è soddisfatta, **tutti** i membri visibili sono
  trattati come impatto medio e il passo termina.

**Se lo è, si sceglie la strategia per individuare le code:**

1. **Percentili esterni ($5$ e $95$)**, solo se i membri visibili sono almeno
   $20$ (sotto questa soglia coinciderebbero con minimo e massimo). Ciascun lato
   viene usato solo se cade **strettamente** oltre la mediana: è la precauzione
   che impedisce alla massa di membri "in pari" di finire tutta in una coda.
   Se uno solo dei due lati è utilizzabile, l'altro resta vuoto.
2. **Regola stretta sulla mediana**, se nessun lato esterno è utilizzabile:
   impatto $<$ mediana = basso, impatto $>$ mediana = alto.

Se un membro risultasse sia basso sia alto, prevale sempre "basso".

### Passo 3 — Classificazione del bilancio

Il bilancio confronta preferenze e rifiuti ricevuti, ma non in modo "secco"
($rp$ contro $rr$): la soglia che separa "prevale il positivo" da "prevale il
negativo" è un **rapporto dinamico**, che si fa più severo quando le opinioni del gruppo sono
poche. La logica è: poche opinioni ricevute $\Rightarrow$ meno certezza
$\Rightarrow$ serve uno squilibrio più netto per parlare di prevalenza.

La soglia $t(n_i)$ dipende dall'impatto $n_i$:

$$
t(n_i) = 2 - 0{,}5 \cdot \frac{\max\bigl(0,\ \min(n_i - 3,\ 12)\bigr)}{12}
$$

In pratica:

- con $n_i \le 3$ la soglia vale $2{,}0$ (severa: serve il doppio);
- con $n_i \ge 15$ vale $1{,}5$ (più indulgente);
- in mezzo scende **linearmente** tra i due valori.

A questo punto il bilancio è:

- **positivo** se $rp_i > t(n_i) \cdot rr_i$;
- **negativo** se $rr_i > t(n_i) \cdot rp_i$;
- **neutro** in tutti gli altri casi.

Due conseguenze utili da ricordare: chi riceve solo preferenze ($rr_i = 0$) ha
sempre bilancio positivo, e viceversa per chi riceve solo rifiuti; il bilancio
neutro compare solo quando preferenze e rifiuti sono abbastanza vicini da non
superare la soglia.

### Passo 4 — Assegnazione finale: l'albero di decisione

L'ultimo passo combina i risultati dei tre precedenti con una regola a
**"prima corrispondenza vince"**: si scorre la lista di condizioni in ordine e,
per ogni membro, si applica la categoria legata alla **prima** condizione vera.
L'ordine conta, perché garantisce le priorità giuste.

| Priorità | Condizione                                | Categoria   | Codice |
| :------: | ----------------------------------------- | ----------- | :----: |
|    1     | nessuna opinione ricevuta né data         | isolato     |   0    |
|    2     | nessuna opinione ricevuta, ma ne ha date  | ignorato    |   1    |
|    3     | impatto basso                             | marginale   |   2    |
|    4     | impatto alto e bilancio positivo          | popolare    |   4    |
|    5     | impatto alto e bilancio negativo          | rifiutato   |   6    |
|    6     | impatto alto e bilancio neutro            | controverso |   8    |
|    7     | impatto medio e bilancio positivo         | apprezzato  |   3    |
|    8     | impatto medio e bilancio negativo         | malvisto    |   5    |
|    9     | impatto medio e bilancio neutro           | ambivalente |   7    |

Nota una conseguenza della priorità 3: **l'impatto basso vince sul bilancio**.
Un membro nella fascia bassa è "marginale" anche se le sue poche opinioni sono
per lo più negative. È una scelta voluta: con così poche opinioni il bilancio
non è un'informazione affidabile.

## Riepilogo dei parametri

| Parametro                                  | Valore                          |
| ------------------------------------------ | ------------------------------- |
| Percentili per impatto basso / alto        | $20$ / $80$ (per rango)         |
| Percentili esterni (caso collassato)       | $5$ / $95$, con $N \ge 20$      |
| Soglia di Gini per dividere il gruppo      | $G \ge 0{,}3$                   |
| Soglia di Gini attenuata                   | $G \ge 0{,}2$ e escursione $\ge 3$ |
| Rapporto soglia del bilancio, pochi dati   | $2{,}0$ (per $n_i \le 3$)       |
| Rapporto soglia del bilancio, molti dati   | $1{,}5$ (per $n_i \ge 15$)      |

## Un esempio svolto

Consideriamo un gruppo di sei membri con questi valori (per semplicità, quasi
nessuno esprime opinioni, così i numeri da seguire sono pochi):

| Membro | $rp$ | $rr$ | $gp$ | $gr$ | $n = rp + rr$ | espressività |
| :----: | :--: | :--: | :--: | :--: | :-----------: | :----------: |
|   1    |  0   |  0   |  0   |  0   |       0       |      0       |
|   2    |  0   |  0   |  2   |  0   |       0       |      2       |
|   3    |  1   |  0   |  0   |  0   |       1       |      0       |
|   4    |  5   |  1   |  0   |  0   |       6       |      0       |
|   5    |  1   |  5   |  0   |  0   |       6       |      0       |
|   6    |  3   |  1   |  0   |  0   |       4       |      0       |

**Passo 1 — Visibilità.** Il membro $1$ non riceve e non dà opinioni: è
**isolato**. Il membro $2$ non riceve opinioni ma ne dà due: è **ignorato**. Gli
altri quattro hanno $n > 0$ e proseguono.

**Passo 2 — Impatto.** Gli impatti dei membri visibili sono
$[1,\ 6,\ 6,\ 4]$, che ordinati danno $[1,\ 4,\ 6,\ 6]$ con $N = 4$. La soglia
bassa è $\text{percentile}(20) = x_{\lfloor 4 \cdot 20 / 100 \rfloor} = x_0 = 1$,
la soglia alta è $\text{percentile}(80) = x_{\lfloor 4 \cdot 80 / 100 \rfloor} = x_3 = 6$.
Le due soglie sono diverse, quindi non siamo nel caso limite. Ne risulta:

- impatto basso ($\le 1$): membro $3$;
- impatto alto ($\ge 6$): membri $4$ e $5$;
- impatto medio: membro $6$.

**Passo 3 — Bilancio.** La soglia vale $t = 2$ per il membro $3$ (con $n = 1$),
$t = 2 - 0{,}5 \cdot \frac{3}{12} = 1{,}875$ per i membri $4$ e $5$ (con $n = 6$)
e $t = 2 - 0{,}5 \cdot \frac{1}{12} \approx 1{,}958$ per il membro $6$ (con
$n = 4$). Ne risulta:

- membro $3$: $1 > 2 \cdot 0$, bilancio positivo (ma è basso, vedi sotto);
- membro $4$: $5 > 1{,}875 \cdot 1$, positivo;
- membro $5$: $5 > 1{,}875 \cdot 1$ per i rifiuti, negativo;
- membro $6$: $3 > 1{,}958 \cdot 1$, positivo.

**Passo 4 — Assegnazione.**

| Membro | Percorso                                   | Status     | Codice |
| :----: | ------------------------------------------ | ---------- | :----: |
|   1    | nessuna opinione ricevuta né data          | isolato    |   0    |
|   2    | nessuna opinione ricevuta, ma ne ha date   | ignorato   |   1    |
|   3    | impatto basso (il bilancio non conta)      | marginale  |   2    |
|   4    | alto + positivo                            | popolare   |   4    |
|   5    | alto + negativo                            | rifiutato  |   6    |
|   6    | medio + positivo                           | apprezzato |   3    |

Il membro $3$ mostra bene la priorità dell'impatto sul bilancio: riceve una sola
opinione, positiva, ma resta **marginale** perché è nella fascia bassa
dell'impatto.

## Un secondo esempio: percentili che collassano

Prendiamo $N = 10$ membri visibili, con impatti già ordinati:

$$
[1,\ 2,\ 2,\ 2,\ 2,\ 2,\ 2,\ 2,\ 2,\ 8]
$$

**Soglie.** $\text{percentile}(20) = x_{2} = 2$ e
$\text{percentile}(80) = x_{8} = 2$: coincidono, quindi siamo nel caso limite e
$2$ è la mediana.

**Condizione di disuguaglianza.** L'escursione è $8 - 1 = 7 \ge 3$ e il
coefficiente di Gini vale circa $0{,}25$, quindi $G \ge 0{,}2$ con escursione
$\ge 3$: la distribuzione è considerata abbastanza diseguale e il gruppo va
diviso. Senza questa condizione, tutti sarebbero stati trattati come impatto
medio.

**Strategia.** Con $N = 10 < 20$ i percentili esterni non si usano; si applica la
regola stretta sulla mediana:

- impatto basso ($< 2$): il membro con impatto $1$;
- impatto alto ($> 2$): il membro con impatto $8$;
- impatto medio: gli altri otto membri, con impatto $2$.

Notare l'effetto della regola stretta: con una soglia inclusiva ($\le 2$) otto
membri su dieci sarebbero finiti in fascia bassa, mentre così restano tutti
nella fascia media, che è dove ci si aspetta di trovare il gruppo "tipico".
