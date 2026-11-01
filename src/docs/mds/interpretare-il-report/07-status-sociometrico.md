---
title: Status sociometrico
order: 7
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
   basso, medio o alto? Le soglie non sono fissate da un solo metodo: quattro
   metodi statistici le propongono e si adotta quello più in accordo con gli
   altri.
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
> gruppo. Con $N$ indichiamo invece il numero di
> membri **visibili**, cioè con $n_i > 0$. Infine $n$ (senza pedice) indica il
> numero di membri del gruppo, usato dal metodo binomiale.

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

Qui si divide l'impatto ricevuto in **basso**, **medio** e **alto**. Non esiste
un unico modo "giusto" di fissare le soglie, perché ogni metodo statistico ha
pregi e difetti a seconda della forma della distribuzione. L'algoritmo quindi
non ne sceglie uno a priori: **ne calcola quattro e adotta quello che si
trova più d'accordo con gli altri**. Il passo si articola in tre mosse:

1. quattro **metodi** propongono ciascuno una coppia di soglie (§ 4.2.1–4.2.4);
2. si sceglie la coppia per **consenso** tra i metodi (§ 4.2.5);
3. la coppia scelta viene **applicata** a tutti i membri (§ 4.2.6).

**Convenzione sulle soglie.** Ogni metodo restituisce una **soglia bassa** $L$
e una **soglia alta** $H$, con questo significato:

- impatto **basso** se $n_i \le L$;
- impatto **alto** se $n_i \ge H$;
- impatto **medio** negli altri casi.

Un lato può essere "mai segnalato" ($L = -\infty$ oppure $H = +\infty$). Se
**entrambi** i lati sono disattivati si parla di **nessuna divisione**: tutti i
membri sono classificati a impatto medio.

**Solo i membri "visibili".** Le soglie dei metodi basati sulla distribuzione
(percentili, Gini, Tukey) si calcolano **esclusivamente sui
membri che hanno ricevuto almeno un'opinione** ($n_i > 0$). Se si includessero
anche gli isolati e gli ignorati, la lunga coda di zeri abbasserebbe le soglie
e, nelle reti poco dense, la categoria "marginale" rischierebbe di non essere
mai raggiunta. Ordinati in senso crescente gli impatti dei soli membri
visibili, $x_0 \le x_1 \le \dots \le x_{N-1}$, il **percentile** $P$ è il valore
che occupa la posizione $\lfloor N \cdot P / 100 \rfloor$ (l'indice parte da
$0$):

$$
\text{percentile}(P) = x_{\left\lfloor \frac{N \cdot P}{100} \right\rfloor}
$$

Non c'è interpolazione: il risultato è sempre uno dei valori realmente
osservati. Con $P = 50$ si ottiene la **mediana**, $x_{\lfloor N/2 \rfloor}$
(per $N$ pari è il valore centrale superiore).

#### 4.2.1 Metodo dei percentili

**Intuizione:** segnalare solo le **code evidenti** della distribuzione.

- $L = \text{percentile}(20)$;
- $H = \text{percentile}(80)$.

Se le due soglie **coincidono** (la distribuzione è troppo piatta per
distinguere le code), il metodo propone **nessuna divisione**. I valori sono
$20/80$.

#### 4.2.2 Metodo di Gini

**Intuizione:** dividere il gruppo **solo se la disuguaglianza è reale**. La
disuguaglianza si misura con il **coefficiente di Gini** $G$ (da $0$ =
perfetta uguaglianza a $1$ = massima disuguaglianza) e con l'**escursione**
(differenza tra massimo e minimo), entrambi sui membri visibili. Si usa la
versione **campionaria corretta** del coefficiente (moltiplicata per
$N/(N-1)$): la formula di popolazione sottostima sistematicamente la
disuguaglianza nei gruppi piccoli, tipici dei test sociometrici.

**Prima condizione: la distribuzione è abbastanza diseguale?**

- sì, se $G \ge 0{,}3$, oppure $G \ge 0{,}2$ con escursione $\ge 3$;
- se la condizione **non** è soddisfatta, il metodo propone **nessuna
  divisione**.

**Se lo è, si sceglie la strategia per individuare le code:**

1. **Percentili esterni ($10$ e $90$)**, solo se i membri visibili sono almeno
   $20$ (nei gruppi più piccoli sarebbero troppo vicini a minimo e massimo). Ciascun lato
   viene usato solo se cade **strettamente** oltre la mediana: è la precauzione
   che impedisce alla massa di membri "in pari" di finire tutta in una coda.
   Se uno solo dei due lati è utilizzabile, l'altro resta disattivato.
2. **Regola stretta sulla mediana**, se nessun lato esterno è utilizzabile:
   $L$ è il **più grande valore strettamente inferiore** alla mediana e $H$ il
   **più piccolo valore strettamente superiore**. Se non esiste alcun valore
   da una delle due parti, quel lato resta disattivato.

#### 4.2.3 Metodo di Tukey

**Intuizione:** il classico criterio dei **valori anomali** basato sui
quartili, i "recinti interni" del box plot. Detti
$Q_1 = \text{percentile}(25)$ e $Q_3 = \text{percentile}(75)$ i quartili degli
impatti dei membri visibili e $IQR = Q_3 - Q_1$ lo scarto interquartile:

- $L = Q_1 - 1{,}5 \cdot IQR$;
- $H = Q_3 + 1{,}5 \cdot IQR$.

Se $IQR = 0$ i recinti collasserebbero sulla mediana e il metodo propone
**nessuna divisione**. È un metodo molto conservativo: segnala solo gli
scostamenti davvero estremi e, nei gruppi omogenei, spesso non segnala nessuno.

#### 4.2.4 Metodo binomiale (GB)

**Intuizione:** *che cosa produrrebbe il puro caso?* Se ogni opinione fosse
espressa a caso, il numero di opinioni ricevute da un membro seguirebbe una
distribuzione binomiale. I membri che si discostano molto da questo andamento
sono "insolitamente" poco o molto visibili.

Sia $n$ il numero di membri del gruppo (**tutti**, anche non visibili). Ogni
membro può ricevere opinioni da $n - 1$ altri membri, e la densità complessiva
della rete è

$$
p = \frac{\sum_i n_i}{n\,(n-1)}
$$

Sotto l'ipotesi di caso, le opinioni ricevute da un membro seguono
$X \sim \text{Binomiale}(n-1,\ p)$. Con livello $\alpha = 0{,}05$ **a due code**
(quindi $0{,}025$ per coda) le soglie sono:

- $L$ = il **massimo** $k$ tale che $P(X \le k) \le 0{,}025$;
- $H$ = il **minimo** $k$ tale che $P(X \ge k) \le 0{,}025$.

Se nessun $k$ soddisfa la condizione, quel lato non viene mai segnalato. Il
metodo propone **nessuna divisione** anche quando $n < 2$ oppure $p$ non è
strettamente compresa tra $0$ e $1$ (il modello non è applicabile).

> **Un'approssimazione.** Poiché $n_i = rp_i + rr_i$, un membro può ricevere
> sia una preferenza sia un rifiuto dallo stesso membro: l'impatto può quindi
> superare $n - 1$, cosa che il modello binomiale non prevede. La protezione
> $p < 1$ gestisce il caso estremo; per scostamenti moderati il metodo resta
> un'approssimazione ragionevole.

#### 4.2.5 Il consenso tra i metodi

**Intuizione:** nessun metodo è sempre migliore degli altri, quindi li si lascia
"votare". Si sceglie il metodo **più centrale**, cioè quello la cui
classificazione assomiglia di più a quella di tutti gli altri.

1. Ogni metodo etichetta ciascun membro visibile con $-1$ (basso), $0$ (medio)
   o $+1$ (alto); se un valore soddisfa entrambe le condizioni, prevale "basso".
2. L'**accordo** tra due metodi è il **numero** di membri visibili a cui
   assegnano la **stessa etichetta** (un conteggio intero: così il confronto è
   esatto, senza ambiguità di arrotondamento).
3. Il **punteggio** di un metodo è la somma dei suoi accordi con gli **altri
   tre**.
4. Vince il metodo col punteggio più alto, e le sue soglie $(L, H)$ sono quelle
   adottate.

**In caso di parità** si applicano, nell'ordine, due criteri:

1. prevale un metodo che propone una **divisione effettiva** (almeno un membro
   etichettato basso o alto) su uno che lascia tutti a impatto medio: a parità
   di accordo, la proposta che distingue qualcuno è più informativa;
2. a parità anche su questo, prevale il metodo che compare prima in
   quest'ordine di priorità:

$$
\text{Gini} \;>\; \text{percentili} \;>\; \text{Tukey} \;>\; \text{binomiale}
$$

L'ordine riflette la copertura dei casi: **Gini** è il primo perché è l'unico a
riconoscere le divisioni di *forma* (distribuzioni bimodali, code lunghe, un
gruppo di spicco separato dagli altri), mentre i **percentili** leggono la
posizione relativa moderata ma tendono a trascinare in coda i membri in pari
punteggio. Il binomiale è volutamente ultimo: i suoi limiti esatti segnalano
solo i casi estremi e, a parità di punteggio, è preferibile una divisione
basata sulla posizione relativa dentro il gruppo.

Questo meccanismo rende l'esito robusto: se un metodo si comporta in modo
anomalo in una data distribuzione, gli altri tre lo mettono in minoranza. Si
osservi anche che un metodo che propone "nessuna divisione" etichetta tutti
come medi e quindi concorda con gli altri soprattutto sui membri medi.

#### 4.2.6 Applicazione delle soglie

Le soglie scelte si applicano a **tutti** i membri con $n_i > 0$ (gli altri sono
già stati classificati al Passo 1):

- **impatto basso**: $n_i \le L$;
- **impatto alto**: $n_i \ge H$;
- **impatto medio**: tutti gli altri.

Le soglie sono **inclusive** ($\le$ e $\ge$): se più membri si trovano
esattamente su una soglia, vengono tutti classificati dalla stessa parte, e per
questo una classe può risultare più ampia di quanto suggerirebbe il percentile
nominale. Nei gruppi piccoli i percentili sono inoltre "grossolani" e tendono a
coincidere con minimo e massimo. Se un membro risultasse sia basso sia alto,
prevale sempre "basso".

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

| Parametro                                       | Valore                                   |
| ----------------------------------------------- | ---------------------------------------- |
| Metodi di soglia in competizione                | percentili, Gini, Tukey, binomiale       |
| Parità nel consenso                             | prima la divisione effettiva, poi Gini > percentili > Tukey > binomiale |
| Percentili per impatto basso / alto             | $20$ / $80$ (per rango)                  |
| Gini: coefficiente usato                        | campionario corretto ($\times\, N/(N-1)$) |
| Gini: soglia per dividere il gruppo             | $G \ge 0{,}3$                            |
| Gini: soglia attenuata                          | $G \ge 0{,}2$ e escursione $\ge 3$       |
| Gini: percentili esterni                        | $10$ / $90$, con $N \ge 20$ visibili     |
| Tukey: recinti interni                          | $Q_1 - 1{,}5 \cdot IQR$ / $Q_3 + 1{,}5 \cdot IQR$ |
| Binomiale: livello di significatività           | $\alpha = 0{,}05$ a due code ($0{,}025$ per coda) |
| Rapporto soglia del bilancio, pochi dati        | $2{,}0$ (per $n_i \le 3$)                |
| Rapporto soglia del bilancio, molti dati        | $1{,}5$ (per $n_i \ge 15$)               |

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

Il **valore assoluto** di $bns_i$ e $mls_i$ **non ha di per sé alcun significato**:
non esiste una soglia oltre la quale un punteggio è "buono" o "cattivo", né un
valore da considerare normale o anormale. Il punteggio dipende infatti da quanti
membri scelgono o rifiutano il soggetto e dalla posizione che gli assegnano, e
per questo va usato **solo per confronti** — tra membri dello stesso gruppo,
tipicamente dentro la stessa categoria di status — e non come misura assoluta.

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
$N = 6$ (e $n = 6$ membri nel gruppo). Calcoliamo le soglie proposte dai
quattro metodi.

- **Percentili.** $L = x_{\lfloor 6 \cdot 20/100 \rfloor} = x_1 = 2$ e
  $H = x_{\lfloor 6 \cdot 80/100 \rfloor} = x_4 = 5$. Sono diverse, quindi
  $(L, H) = (2, 5)$.
- **Gini.** $G \approx 0{,}26 \ge 0{,}2$ e l'escursione è $5 - 2 = 3 \ge 3$:
  la condizione attenuata è soddisfatta. Con $N < 20$ si usa la regola sulla
  mediana ($x_3 = 3$): il più grande valore inferiore è $2$ e il più piccolo
  superiore è $5$, quindi $(L, H) = (2, 5)$.
- **Tukey.** $Q_1 = x_1 = 2$, $Q_3 = x_4 = 5$, $IQR = 3$:
  $(L, H) = (-2{,}5;\ 9{,}5)$. Nessun impatto cade oltre i recinti.
- **Binomiale.** Le opinioni totali sono $19$, quindi
  $p = 19 / (6 \cdot 5) \approx 0{,}63$ e $X \sim \text{Binomiale}(5;\ 0{,}63)$.
  Si ha $P(X \le 0) \approx 0{,}007 \le 0{,}025$ ma
  $P(X \le 1) \approx 0{,}064 > 0{,}025$, quindi $L = 0$. Dall'altra parte
  $P(X \ge 5) \approx 0{,}10 > 0{,}025$: nessuna soglia alta. Risultato:
  $(L, H) = (0, +\infty)$, che però non etichetta nessuno (l'impatto minimo è
  $2$).

Etichettando i sei membri (basso/medio/alto) si ottiene:

| Metodo           | Etichette                 | Punteggio |
| ---------------- | ------------------------- | :-------: |
| percentili       | $-1, -1, -1, 0, +1, +1$   |    $8$    |
| Gini             | $-1, -1, -1, 0, +1, +1$   |    $8$    |
| Tukey            | $0, 0, 0, 0, 0, 0$        |    $8$    |
| binomiale        | $0, 0, 0, 0, 0, 0$        |    $8$    |

(Ad esempio il punteggio dei percentili è $6 + 1 + 1 = 8$: sei accordi con
Gini e uno ciascuno con Tukey e binomiale, sul membro a impatto medio.) Tutti
e quattro i metodi sono a pari merito, quindi decidono i criteri di parità:
Tukey e binomiale non etichettano nessuno, mentre percentili e Gini propongono
le stesse etichette; tra i due prevale **Gini** per priorità. Le soglie
adottate sono $(2, 5)$. Ne risulta:

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
$N = 6$ (e $n = 6$ membri nel gruppo). Calcoliamo le soglie proposte dai
quattro metodi.

- **Percentili.** $L = x_1 = 1$ e $H = x_4 = 5$, quindi $(L, H) = (1, 5)$.
- **Gini.** $G \approx 0{,}44 \ge 0{,}3$: distribuzione abbastanza diseguale.
  Con $N < 20$ si usa la regola sulla mediana ($x_3 = 2$): il più grande valore
  inferiore è $1$ e il più piccolo superiore è $5$, quindi $(L, H) = (1, 5)$.
- **Tukey.** $Q_1 = x_1 = 1$, $Q_3 = x_4 = 5$, $IQR = 4$:
  $(L, H) = (-5;\ 11)$. Nessun impatto cade oltre i recinti.
- **Binomiale.** Le opinioni totali sono $15$, quindi
  $p = 15 / (6 \cdot 5) = 0{,}5$ e $X \sim \text{Binomiale}(5;\ 0{,}5)$.
  $P(X \le 0) \approx 0{,}031 > 0{,}025$ e $P(X \ge 5) \approx 0{,}031 > 0{,}025$:
  nessuna delle due code raggiunge la significatività. Risultato: **nessuna
  divisione**.

| Metodo           | Etichette                 | Punteggio |
| ---------------- | ------------------------- | :-------: |
| percentili       | $-1, -1, -1, 0, +1, +1$   |    $8$    |
| Gini             | $-1, -1, -1, 0, +1, +1$   |    $8$    |
| Tukey            | $0, 0, 0, 0, 0, 0$        |    $8$    |
| binomiale        | $0, 0, 0, 0, 0, 0$        |    $8$    |

Anche qui i quattro metodi sono a pari merito; Tukey e binomiale non
etichettano nessuno, e tra i due che propongono una divisione effettiva
(percentili e Gini, con le stesse etichette) prevale per priorità **Gini** con
soglie $(1, 5)$. Ne risulta:

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
