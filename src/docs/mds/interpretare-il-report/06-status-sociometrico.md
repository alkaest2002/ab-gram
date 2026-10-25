---
title: Status sociometrico
order: 6
description: Come viene assegnato a ogni membro il codice di status sociometrico.
---

Lo **status sociometrico** ($ss_i$) è l'etichetta finale che riassume la
posizione di ciascun membro nel gruppo. A differenza degli indici visti nella
pagina sulle metriche individuali,
che sono numeri, qui si tratta di una **categoria**: l'algoritmo combina due
informazioni già incontrate — l'**impatto** ricevuto (quanto il membro è
visibile agli occhi degli altri) e il **bilancio** tra preferenze e rifiuti
(se prevalgono le une o gli altri) — e restituisce un codice da $0$ a $8$.

## 1 In sintesi

L'algoritmo risponde a tre domande, nell'ordine:

1. **Il membro è visibile?** Ha ricevuto almeno un'opinione? Se no, è isolato o
   ignorato e la classificazione finisce qui.
2. **Quanto è visibile?** Rispetto agli altri membri visibili, il suo impatto è
   basso, medio o alto?
3. **Prevalgono le preferenze o i rifiuti?** Il bilancio è positivo, negativo o
   neutro?

Le risposte si combinano in una delle nove categorie. L'impatto basso ha la
precedenza sul bilancio.

## 2 Le nove categorie

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

> **Il codice numerico non ha alcun significato.** I numeri da 0 a 8 sono
> soltanto una convenzione per identificare le categorie: non indicano un ordine,
> un punteggio o una gravità crescente. Due codici vicini non sono più simili tra
> loro di due codici lontani; ciò che conta è esclusivamente la categoria a cui
> il codice è associato.

La categoria dipende dal **livello di impatto** (basso, medio, alto) e, per i
livelli medio e alto, dal **bilancio** (positivo, negativo, neutro). Le prime due
righe sono un caso a parte: un membro che **non riceve alcuna opinione** è
classificato solo in base al fatto che ne abbia espresse o meno.

## 3 I dati in ingresso

L'algoritmo riceve quattro valori per ogni membro:

- $rp_i$: **preferenze ricevute**;
- $rr_i$: **rifiuti ricevuti**;
- $\mathrm{espressività}_i = gp_i + gr_i$: opinioni **espresse** in totale;
- $n_i = rp_i + rr_i$: **impatto**, cioè opinioni **ricevute** in totale.

> **Attenzione alla notazione.** In questa pagina $n_i$ indica l'impatto del
> singolo membro (quante opinioni ha ricevuto), **non** il numero di membri del
> gruppo, indicato altrove con $n$. Con $N$ indichiamo invece il numero di
> membri **visibili**, cioè con $n_i > 0$.

## 4 L'algoritmo di assegnazione

L'assegnazione procede in **quattro passi successivi**. Ogni passo è
matematicamente semplice; la complessità sta nel fatto che si susseguono e che
alcuni hanno priorità sugli altri.

### 4.1 Passo 1 — Visibilità: isolato e ignorato

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

### 4.2 Passo 2 — Classificazione dell'impatto

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

#### 4.2.1 Il caso limite: percentili che collassano

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

### 4.3 Passo 3 — Classificazione del bilancio

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

### 4.4 Passo 4 — Assegnazione finale: l'albero di decisione

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

## 5 Riepilogo dei parametri

| Parametro                                  | Valore                          |
| ------------------------------------------ | ------------------------------- |
| Percentili per impatto basso / alto        | $20$ / $80$ (per rango)         |
| Percentili esterni (caso collassato)       | $5$ / $95$, con $N \ge 20$      |
| Soglia di Gini per dividere il gruppo      | $G \ge 0{,}3$                   |
| Soglia di Gini attenuata                   | $G \ge 0{,}2$ e escursione $\ge 3$ |
| Rapporto soglia del bilancio, pochi dati   | $2{,}0$ (per $n_i \le 3$)       |
| Rapporto soglia del bilancio, molti dati   | $1{,}5$ (per $n_i \ge 15$)      |

## 6 Bonus e malus: distinguere dentro lo stesso status

Lo status sociometrico raggruppa i membri in **nove categorie**, ma non dice
nulla sull'ordine tra due membri che ricadono nella **stessa** categoria. Per
questo si usano due punteggi complementari, il **bonus** ($bns_i$) e il **malus**
($mls_i$), che tengono conto **dell'ordine** con cui un membro viene scelto o
rifiutato, e non solo del numero di scelte e rifiuti ricevuti (cioè di $rp_i$ e
$rr_i$).

Per calcolarli si immagina che le scelte e i rifiuti di ciascun membro siano
espressi **in ordine di preferenza**: la prima persona indicata è quella che si
sceglie (o si rifiuta) per prima, l'ultima è quella indicata per ultima. Sia
$p_j(i)$ la posizione, a partire da $1$, del membro $i$ nella sequenza
ordinata delle scelte (per il bonus) o dei rifiuti (per il malus) del membro
$j$. Ogni scelta o rifiuto ricevuto "pesa" di più se il membro è indicato tra i
primi e di meno se è indicato tra gli ultimi:

$$
bns_i = \sum_{j \in S_i} (M - p_j(i) + 1), \qquad mls_i = \sum_{j \in R_i} (M - p_j(i) + 1)
$$

dove $M$ è il numero massimo teorico di membri ($35$), $S_i$ è l'insieme dei membri
che scelgono $i$ e $R_i$ è l'insieme dei membri che lo rifiutano. Il termine
$M - p_j(i) + 1$ vale $M$ quando $i$ è indicato per primo e diminuisce di $1$
per ogni posizione successiva.

- Un **bonus alto** ($bns_i$) significa che il membro è stato **scelto tra i
  primi** nelle sequenze di preferenza degli altri: non solo è apprezzato, ma è
  tra le prime persone a cui gli altri pensano.
- Un **malus alto** ($mls_i$) significa che il membro è stato **rifiutato tra i
  primi**: è tra le prime persone indicate come rifiuto.

Questi punteggi aiutano quindi a **ipotizzare una graduatoria** tra membri che
ricadono nello stesso status sociometrico: a parità di categoria, chi ha un
bonus più alto (o un malus più basso) occupa una posizione più favorevole
all'interno del gruppo.

## 7 Un esempio svolto

### 7.1 Calcolo dello status sociometrico

Consideriamo un gruppo di sei membri che esprimono le proprie preferenze, in
ordine dalla prima all'ultima (per semplicità non ci sono rifiuti):

| Membro | Scelte (in ordine) |
| :----: | ------------------ |
|   1    | 2, 3, 4, 5, 6      |
|   2    | 1, 3, 4, 5, 6      |
|   3    | 1, 2, 4            |
|   4    | 1, 2               |
|   5    | 1, 2               |
|   6    | 1, 2               |

Dalle scelte ricaviamo $rp$ (scelte ricevute), $gp$ (scelte date) e l'impatto
$n = rp$ (non essendoci rifiuti, $rr = 0$):

| Membro | $rp$ | $gp$ | $n = rp$ |
| :----: | :--: | :--: | :------: |
|   1    |  5   |  5   |    5     |
|   2    |  5   |  5   |    5     |
|   3    |  2   |  3   |    2     |
|   4    |  3   |  2   |    3     |
|   5    |  2   |  2   |    2     |
|   6    |  2   |  2   |    2     |

**Passo 1 — Visibilità.** Tutti hanno $n > 0$, quindi nessuno è isolato o
ignorato: tutti proseguono.

**Passo 2 — Impatto.** Gli impatti, ordinati, sono $[2, 2, 2, 3, 5, 5]$ con
$N = 6$. La soglia bassa è
$\text{percentile}(20) = x_{\lfloor 6 \cdot 20 / 100 \rfloor} = x_1 = 2$
e la soglia alta è
$\text{percentile}(80) = x_{\lfloor 6 \cdot 80 / 100 \rfloor} = x_4 = 5$.
Le due soglie sono diverse, quindi non siamo nel caso limite. Ne risulta:

- impatto basso ($\le 2$): membri $3$, $5$ e $6$;
- impatto alto ($\ge 5$): membri $1$ e $2$;
- impatto medio: membro $4$.

**Passo 3 — Bilancio.** Non ci sono rifiuti ($rr = 0$), quindi il bilancio è
sempre positivo.

**Passo 4 — Assegnazione.**

| Membro | Percorso                    | Status     | Codice |
| :----: | --------------------------- | ---------- | :----: |
|   1    | alto + positivo             | popolare   |   4    |
|   2    | alto + positivo             | popolare   |   4    |
|   3    | basso                       | marginale  |   2    |
|   4    | medio + positivo            | apprezzato |   3    |
|   5    | basso                       | marginale  |   2    |
|   6    | basso                       | marginale  |   2    |

I membri $1$ e $2$ finiscono entrambi nella categoria **popolare**: ricevono lo
stesso numero di scelte ($5$) e hanno lo stesso status. Per distinguerli serve
guardare **all'ordine** con cui sono stati scelti: è qui che entrano in gioco
bonus e malus.

### 7.2 Calcolo del bonus/malus

Con $M = 35$, il contributo di chi indica $i$ al posto $p_j(i)$ è
$M - p_j(i) + 1$. Calcoliamo il bonus dei due membri **popolari**:

- **Membro 1.** È indicato per primo da tutti e cinque i membri che lo scelgono:
  $bns_1 = 5 \cdot 35 = 175$.
- **Membro 2.** È indicato per primo solo dal membro $1$ e per secondo dagli
  altri quattro: $bns_2 = 35 + 4 \cdot 34 = 171$.

Non essendoci rifiuti, il malus è $0$ per tutti. Ripetendo per gli altri si
ottiene:

| Membro | Status     | $bns_i$ | $mls_i$ |
| :----: | ---------- | :-----: | :-----: |
|   1    | popolare   |   175   |    0    |
|   2    | popolare   |   171   |    0    |
|   3    | marginale  |    68   |    0    |
|   4    | apprezzato |    99   |    0    |
|   5    | marginale  |    64   |    0    |
|   6    | marginale  |    62   |    0    |

Il membro $1$ ha un bonus più alto del membro $2$ ($175$ contro $171$) pur
avendo lo stesso numero di scelte ricevute: è stato indicato **prima** nelle
preferenze altrui. A parità di status **popolare**, il membro $1$ occupa quindi
la posizione più favorevole.

## 8 Un secondo esempio: rifiuti e malus

### 8.1 Calcolo dello status sociometrico

Riprendiamo la stessa idea, ma con soli rifiuti (nessuna scelta), sempre in
ordine dal primo all'ultimo:

| Membro | Rifiuti (in ordine) |
| :----: | ------------------- |
|   1    | 4, 5, 2             |
|   2    | 4, 5, 3             |
|   3    | 4, 5, 6             |
|   4    | 5, 1                |
|   5    | 4, 6                |
|   6    | 4, 5                |

Ricaviamo $rr$ (rifiuti ricevuti), $gr$ (rifiuti dati) e l'impatto $n = rr$
(non essendoci scelte, $rp = 0$):

| Membro | $rr$ | $gr$ | $n = rr$ |
| :----: | :--: | :--: | :------: |
|   1    |  1   |  3   |    1     |
|   2    |  1   |  3   |    1     |
|   3    |  1   |  3   |    1     |
|   4    |  5   |  2   |    5     |
|   5    |  5   |  2   |    5     |
|   6    |  2   |  2   |    2     |

**Passo 1 — Visibilità.** Tutti hanno $n > 0$, quindi nessuno è isolato o
ignorato: tutti proseguono.

**Passo 2 — Impatto.** Gli impatti, ordinati, sono $[1, 1, 1, 2, 5, 5]$ con
$N = 6$. La soglia bassa è
$\text{percentile}(20) = x_{\lfloor 6 \cdot 20 / 100 \rfloor} = x_1 = 1$
e la soglia alta è
$\text{percentile}(80) = x_{\lfloor 6 \cdot 80 / 100 \rfloor} = x_4 = 5$.
Le due soglie sono diverse, quindi non siamo nel caso limite. Ne risulta:

- impatto basso ($\le 1$): membri $1$, $2$ e $3$;
- impatto alto ($\ge 5$): membri $4$ e $5$;
- impatto medio: membro $6$.

**Passo 3 — Bilancio.** Non ci sono scelte ($rp = 0$), quindi il bilancio è
sempre negativo.

**Passo 4 — Assegnazione.**

| Membro | Percorso                    | Status    | Codice |
| :----: | --------------------------- | --------- | :----: |
|   1    | basso                       | marginale |   2    |
|   2    | basso                       | marginale |   2    |
|   3    | basso                       | marginale |   2    |
|   4    | alto + negativo             | rifiutato |   6    |
|   5    | alto + negativo             | rifiutato |   6    |
|   6    | medio + negativo            | malvisto  |   5    |

I membri $4$ e $5$ finiscono entrambi nella categoria **rifiutato**: ricevono lo
stesso numero di rifiuti ($5$) e hanno lo stesso status. Anche qui, per
distinguerli serve guardare **all'ordine** dei rifiuti.

### 8.2 Calcolo del bonus/malus

Calcoliamo il malus dei due membri **rifiutati**:

- **Membro 4.** È indicato per primo da tutti e cinque i membri che lo
  rifiutano: $mls_4 = 5 \cdot 35 = 175$.
- **Membro 5.** È indicato per primo solo dal membro $4$ e per secondo dagli
  altri quattro: $mls_5 = 35 + 4 \cdot 34 = 171$.

Non essendoci scelte, il bonus è $0$ per tutti. Ripetendo per gli altri si
ottiene:

| Membro | Status    | $bns_i$ | $mls_i$ |
| :----: | --------- | :-----: | :-----: |
|   1    | marginale |    0    |   34    |
|   2    | marginale |    0    |   33    |
|   3    | marginale |    0    |   33    |
|   4    | rifiutato |    0    |   175   |
|   5    | rifiutato |    0    |   171   |
|   6    | malvisto  |    0    |   67    |

Il membro $4$ ha un malus più alto del membro $5$ ($175$ contro $171$): è stato
rifiutato **prima** nelle sequenze di rifiuto altrui. A parità di status
**rifiutato**, il membro $4$ occupa quindi la posizione meno favorevole.
