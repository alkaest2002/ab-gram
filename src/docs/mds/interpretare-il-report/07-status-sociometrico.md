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
   basso, medio o alto? Le soglie non sono fissate da un solo metodo: sette
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

In questo passo l'impatto ricevuto viene suddiviso in tre classi: **basso**, **medio** e **alto**. Poiché non esiste un unico modo "giusto" di fissare le soglie (ogni metodo statistico ha pregi e difetti a seconda della forma della distribuzione), l'algoritmo applica più strategie di classificazione in parallelo e le fa "votare": ciascun metodo assegna una classe a ogni membro, e la classe finale è quella scelta dalla maggioranza. Il passo si articola in tre mosse:

1. sette **metodi** propongono ciascuno una coppia di soglie (§ 4.2.1–4.2.7);
2. ogni metodo **applica le proprie soglie** e classifica i membri (§ 4.2.8);
3. la classe finale di ogni membro è decisa per **maggioranza** tra i metodi
   che propongono una divisione (§ 4.2.9).

**Convenzione sulle soglie.** Ogni metodo restituisce una **soglia bassa** $L$
e una **soglia alta** $H$, con questo significato:

- impatto **basso** se $n_i \le L$;
- impatto **alto** se $n_i \ge H$;
- impatto **medio** negli altri casi.

Un lato può essere "mai segnalato" ($L = -\infty$ oppure $H = +\infty$). Se
**entrambi** i lati sono disattivati si parla di **nessuna divisione**: tutti i
membri sono classificati a impatto medio.

**Non tutti i metodi, però, propongono una divisione, né tutti propongono due
soglie.** Un metodo può **astenersi** del tutto (nessuna divisione), proporre
**entrambe** le soglie, oppure proporre **una sola**:

- **due lati** — percentili, Gini, Jenks, Tukey e binomiale calcolano sia $L$
  sia $H$ (anche se, per le loro regole interne, uno dei due lati può risultare
  disattivato, cioè infinito);
- **solo il lato alto** — *head/tail breaks* segnala esclusivamente $H$ e lascia
  sempre $L = -\infty$ (§ 4.2.4);
- **un solo lato, basso o alto** — il metodo dei piccoli gruppi isola di norma
  solo la coda più piccola, lasciando l'altro lato disattivato (§ 4.2.7).

Le soglie dei metodi basati sulla distribuzione
(percentili, Gini, Jenks, head/tail, Tukey, piccoli gruppi) si calcolano **esclusivamente sui
membri che hanno ricevuto almeno un'opinione** ($n_i > 0$). Se si includessero
anche gli isolati e gli ignorati, la lunga coda di zeri abbasserebbe le soglie
e, nelle reti poco dense, la categoria "marginale" rischierebbe di non essere
mai raggiunta.

#### 4.2.1 Metodo dei percentili

**Intuizione:** segnalare solo le **code evidenti** della distribuzione.

- $L = \text{percentile}(10)$;
- $H = \text{percentile}(90)$.

Il metodo **si astiene** (propone nessuna divisione) con meno di $5$ membri
visibili: con così pochi, "il 10% più basso" è una o due persone e non dice
nulla su code davvero evidenti.

Le soglie vengono poi **"ripulite dalle parità"**: una coda la cui soglia
raggiunge la mediana viene "tirata dentro", fino al valore più vicino
**strettamente** oltre la mediana (se esiste); se non esiste, quel lato non
viene segnalato. In questo modo i membri "in pari" con la mediana non
finisce mai in una coda. Su una distribuzione perfettamente piatta il metodo si
astiene, invece di votare sempre.

#### 4.2.2 Metodo di Gini

**Intuizione:** dividere il gruppo **solo se la disuguaglianza è reale**. La
disuguaglianza si misura con il **coefficiente di Gini** $G$ (da $0$ =
perfetta uguaglianza a $1$ = massima disuguaglianza) e con l'**escursione**
(differenza tra massimo e minimo), entrambi sugli impatti dei membri visibili.
Si usa la versione **campionaria corretta** del coefficiente (moltiplicata per
$N/(N-1)$), che non sottostima la disuguaglianza nei gruppi piccoli tipici dei
test sociometrici.

Il metodo **si astiene** con meno di $5$ membri visibili. Altrimenti la
distribuzione è considerata abbastanza diseguale se:

- $G \ge 0{,}3$, oppure
- $G \ge 0{,}2$ con escursione $\ge 3$.

Se la condizione **non** è soddisfatta, il metodo propone **nessuna divisione**.
Se lo è, Gini decide *se* dividere e i **percentili estremi** decidono *dove*:

$$
L = \text{percentile}(5), \qquad H = \text{percentile}(95)
$$

Le soglie vengono poi **"ripulite dalle parità"** come per i percentili: una
coda la cui soglia raggiunge la mediana viene "tirata dentro" fino al valore più
vicino **strettamente** oltre la mediana (se esiste), altrimenti quel lato resta
disattivato.

#### 4.2.3 Metodo di Jenks

**Intuizione:** individuare i **raggruppamenti naturali** della distribuzione:
le classi vengono scelte in modo da rendere **minima** la varianza interna a
ogni classe (e, di conseguenza, massima quella tra classi). È il criterio dei
*natural breaks* di Jenks, qui adattato a **tre classi** (bassa, media, alta).

Sugli impatti dei membri visibili, ordinati $x_0 \le x_1 \le \dots \le x_{N-1}$,
si cercano i due tagli che separano tre classi consecutive minimizzando la
somma delle varianze interne, detta $SDCM$. La bontà del partizionamento si
misura con il **goodness of variance fit**

$$
GVF = 1 - \frac{SDCM}{SDAM}
$$

dove $SDAM$ è la varianza totale degli impatti. Il metodo **si astiene** quando:

- ci sono meno di $5$ membri visibili;
- ci sono meno di $3$ valori distinti (non si possono formare tre classi);
- $GVF < 0{,}75$: la distribuzione è troppo "senza struttura" per giustificare
  una divisione.

Se il partizionamento è accettato, le tre classi sono contigue e definite da
due indici di taglio: la prima classe va da $x_0$ a $x_{i-1}$, la seconda da
$x_i$ a $x_{j-1}$, la terza da $x_j$ a $x_{N-1}$ (con $1 \le i < j \le N-1$).
Le soglie sono allora

- $L = x_{i-1}$, cioè l'ultimo valore della **prima** classe (la più bassa);
- $H = x_{j}$, cioè il primo valore della **terza** classe (la più alta).

Come per i percentili, poi una coda la cui soglia non resta **strettamente**
oltre la mediana viene disattivata: se $L \not< \mathrm{mediana}$ si pone
$L = -\infty$; se $H \not> \mathrm{mediana}$ si pone $H = +\infty$.

#### 4.2.4 Metodo head/tail breaks

**Intuizione:** nelle distribuzioni **a coda pesante** pochi valori molto alti
si staccano nettamente dalla massa dei valori piccoli. Il metodo *head/tail
breaks* separa ricorsivamente la "testa" (la minoranza di valori grandi) dalla
"coda" (il resto).

A ogni passo si calcola la media dei valori correnti e si considera "testa"
l'insieme dei valori **maggiori della media**. Si ripete sulla testa fino alla
**condizione classica di arresto**: la testa smette di essere una minoranza
(raggiunge il $40\%$ dei valori correnti), oppure non resta nulla da dividere
(tutti i valori sono uguali). Ogni media calcolata è un **punto di taglio**; i
tagli ordinano i valori in classi consecutive, dalla più bassa alla più alta.

- $L = -\infty$: il lato basso non viene **mai** segnalato;
- $H$ = il primo valore dell'**ultima** classe (la più alta), cioè la "testa"
  finale.

Il metodo **si astiene** del tutto con meno di $5$ membri visibili o quando non
produce alcun taglio (valori tutti uguali).

#### 4.2.5 Metodo di Tukey

**Intuizione:** il classico criterio dei **valori anomali** basato sui
quartili, i "recinti interni" del box plot. Detti
$Q_1 = \text{percentile}(25)$ e $Q_3 = \text{percentile}(75)$ i quartili degli
impatti dei membri visibili e $IQR = Q_3 - Q_1$ lo scarto interquartile, i
recinti sono

- $L = Q_1 - 1{,}5 \cdot IQR$;
- $H = Q_3 + 1{,}5 \cdot IQR$.

Se $IQR = 0$ non viene proposta alcuna soglia. Il moetodo di Tukey è conservativo: segnala solo gli
scostamenti davvero estremi e, nei gruppi omogenei, spesso non segnala nessuno.

#### 4.2.6 Metodo binomiale (GB)

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
$X \sim \text{Binomiale}(n-1,\ p)$. Con livello $\alpha = 0{,}01$ **a due code**
(quindi $0{,}005$ per coda) le soglie sono:

- $L$ = il **massimo** $k$ tale che $P(X \le k) \le 0{,}005$;
- $H$ = il **minimo** $k$ tale che $P(X \ge k) \le 0{,}005$.

Se nessun $k$ soddisfa la condizione, quel lato non viene mai segnalato. Il
metodo propone **nessuna divisione** anche quando $n < 2$ oppure $p$ non è
strettamente compresa tra $0$ e $1$ (il modello non è applicabile).

> **Un'approssimazione.** Poiché $n_i = rp_i + rr_i$, un membro può ricevere
> sia una preferenza sia un rifiuto dallo stesso membro: l'impatto può quindi
> superare $n - 1$, cosa che il modello binomiale non prevede. La protezione
> $p < 1$ gestisce il caso estremo; per scostamenti moderati il metodo resta
> un'approssimazione ragionevole.

#### 4.2.7 Metodo dei piccoli gruppi

**Intuizione:** con pochissimi membri visibili ($2 \le N < 5$) i percentili e il
Gini sono inaffidabili e i metodi basati sulla distribuzione si astengono. Qui si
cerca invece il **salto più grande** tra impatti consecutivi: se è un salto
"vero" e domina gli altri, si segnala **solo la coda più piccola** che quel salto
isola, lasciando il resto a impatto medio (così il bilancio può ancora decidere).

Sugli impatti visibili ordinati $x_0 \le x_1 \le \dots \le x_{N-1}$, i salti tra
valori consecutivi sono $g_i = x_i - x_{i-1}$ per $i = 1, \dots, N-1$. Siano
$g_{\max}$ il salto più grande e $g_2$ il secondo per grandezza; sia inoltre
$R = x_{N-1} - x_0$ l'escursione totale. Il metodo **si astiene** quando:

- $N < 2$ oppure $N \ge 5$ (è il complemento dei metodi che richiedono almeno $5$);
- $g_{\max} = 0$ (tutti gli impatti sono uguali);
- $g_{\max} < 2$ (un salto di una sola opinione non è abbastanza);
- il salto non domina gli altri: $g_{\max} < 2 \cdot g_2$ **e**
  $g_{\max} < 0{,}5 \cdot R$.

Se il salto è dominante, sia $k$ l'indice del valore **sopra** il salto massimo
(il salto è tra $x_{k-1}$ e $x_k$). Si segnala solo la coda più piccola:

- coda **bassa** più piccola $\Rightarrow$ $L = x_{k-1}$ e $H = +\infty$;
- coda **alta** più piccola $\Rightarrow$ $L = -\infty$ e $H = x_k$;
- code **uguali** (possibile solo con $N = 4$, due contro due) $\Rightarrow$
  $L = x_{k-1}$ e $H = x_k$.

Per esempio, con $[1, 1, 3]$ viene segnalato solo il $3$ come impatto alto e i
due $1$ restano medi; con $[1, 3, 3]$ viene segnalato solo l'$1$ come impatto
basso.

#### 4.2.8 Applicazione delle soglie di ciascun metodo

Ogni metodo applica le **proprie** soglie a tutti i membri con $n_i > 0$ (gli
altri sono già stati classificati al Passo 1):

- **impatto basso**: $n_i \le L$;
- **impatto alto**: $n_i \ge H$;
- **impatto medio**: tutti gli altri.

Le soglie sono **inclusive** ($\le$ e $\ge$): se più membri si trovano
esattamente su una soglia, vengono tutti classificati dalla stessa parte, e per
questo una classe può risultare più ampia di quanto suggerirebbe il percentile
nominale. Nei gruppi piccoli i percentili sono inoltre "grossolani" e tendono a
coincidere con minimo e massimo. Se un membro risultasse sia basso sia alto,
prevale sempre "basso".

#### 4.2.9 La votazione tra i metodi

**Intuizione:** nessun metodo è sempre migliore degli altri, quindi li si lascia
"votare": ogni metodo classifica ogni membro e vince la classe scelta dalla
**maggioranza**.

1. Ogni metodo etichetta ciascun membro visibile con $-1$ (basso), $0$ (medio)
   o $+1$ (alto); se un valore soddisfa entrambe le condizioni, prevale "basso".
2. Un metodo che propone **nessuna divisione** ($L = -\infty$, $H = +\infty$)
   **si astiene**: non partecipa al voto. Se *tutti* i metodi si astengono,
   non c'è alcuna divisione e tutti restano a impatto medio.
3. Per ogni membro si contano i voti dei **metodi non astenuti** per basso,
   medio e alto. La classe finale è quella con **più voti**.
4. **In caso di parità**, una classe non media (basso o alto) **prevale sulla
   media**; tra basso e alto prevale **basso**.

In questo modo un metodo che non vede alcuna divisione non può annacquare il
segnale degli altri: se un solo metodo riconosce una coda, la sua classificazione
resta l'unica disponibile e viene adottata.

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
| Metodi di soglia in competizione                | Jenks, head/tail, Gini, percentili, Tukey, binomiale, piccoli gruppi |
| Aggregazione tra i metodi                       | voto di maggioranza tra i metodi che dividono |
| Metodi che non dividono                         | si astengono (non votano)               |
| Parità nel voto                                 | non medio prevale su medio; basso prevale su alto |
| Membri visibili minimi per percentili, Gini, Jenks e head/tail | $5$                              |
| Percentili per impatto basso / alto             | $10$ / $95$ (per rango)                  |
| Pulizia delle soglie                            | mai sulla mediana; coda tirata al valore più vicino strettamente oltre |
| Gini: coefficiente usato                        | campionario corretto ($\times\, N/(N-1)$) |
| Gini: soglia per dividere il gruppo             | $G \ge 0{,}3$                            |
| Gini: soglia attenuata                          | $G \ge 0{,}2$ e escursione $\ge 3$       |
| Gini: percentili di taglio                      | $5$ / $95$                              |
| Jenks: numero di classi                         | $3$ (bassa, media, alta)                 |
| Jenks: goodness of variance fit minima          | $GVF \ge 0{,}75$                         |
| Head/tail: quota massima della testa            | $0{,}4$ (testa sotto il $40\%$ dei valori) |
| Tukey: recinti interni                          | $Q_1 - 1{,}5 \cdot IQR$ / $Q_3 + 1{,}5 \cdot IQR$ |
| Tukey: soglia applicata                         | valore osservato più vicino strettamente oltre il recinto |
| Binomiale: livello di significatività           | $\alpha = 0{,}01$ a due code ($0{,}005$ per coda) |
| Piccoli gruppi: membri visibili                 | $2 \le N < 5$ (solo sotto i $5$)         |
| Piccoli gruppi: salto minimo tra impatti        | $2$ (gap minimo)                          |
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
sette metodi.

- **Jenks.** Le tre classi $[2, 2, 2]$, $[3]$ e $[5, 5]$ hanno varianza interna
  nulla, quindi $GVF = 1 \ge 0{,}75$: il partizionamento è accettato. Ne
  risultano $L = 2$ (ultimo valore della prima classe) e $H = 5$ (primo valore
  della terza classe).
- **Head/tail.** La media è $19/6 \approx 3{,}17$; la testa è $[5, 5]$
  ($2$ valori su $6$, meno del $40\%$), poi la testa non si divide oltre.
  La prima classe (valori $\le 3{,}17$) ha ultimo valore $3$, l'ultima classe
  (valori $> 3{,}17$) ha primo valore $5$: $(L, H) = (3, 5)$.
- **Gini.** $G \approx 0{,}26 \ge 0{,}2$ e l'escursione è $5 - 2 = 3 \ge 3$:
  la condizione attenuata è soddisfatta. I percentili estremi danno
  $L = \text{percentile}(5) = x_0 = 2$ e
  $H = \text{percentile}(95) = x_5 = 5$, entrambi oltre la mediana, quindi
  $(L, H) = (2, 5)$.
- **Percentili.** $L = \text{percentile}(10) = x_0 = 2$ e
  $H = \text{percentile}(95) = x_5 = 5$. Entrambe le soglie cadono oltre la
  mediana ($2{,}5$), quindi $(L, H) = (2, 5)$.
- **Tukey.** $Q_1 = x_1 = 2$, $Q_3 = x_4 = 5$, $IQR = 3$: i recinti sono
  $F_L = -2{,}5$ e $F_H = 9{,}5$. Nessun impatto cade strettamente oltre i
  recinti, quindi il metodo si astiene.
- **Binomiale.** Le opinioni totali sono $19$, quindi
  $p = 19 / (6 \cdot 5) \approx 0{,}63$ e $X \sim \text{Binomiale}(5;\ 0{,}63)$.
  Con $\alpha = 0{,}01$ si ha $P(X \le 0) \approx 0{,}007 > 0{,}005$ e
  $P(X \ge 5) \approx 0{,}10 > 0{,}005$: nessuna delle due code raggiunge la
  significatività. Risultato: **nessuna divisione**.
- **Piccoli gruppi.** Il metodo si attiva solo con meno di $5$ membri visibili:
  qui $N = 6$, quindi si astiene.

Etichettando i sei membri in ordine di membro (basso/medio/alto) si ottiene:

| Metodo     | Etichette                 |
| ---------- | ------------------------- |
| Jenks      | $+1, +1, -1, 0, -1, -1$  |
| head/tail  | $+1, +1, -1, -1, -1, -1$ |
| Gini       | $+1, +1, -1, 0, -1, -1$  |
| percentili | $+1, +1, -1, 0, -1, -1$  |
| Tukey      | *si astiene*              |
| binomiale  | *si astiene*              |
| piccoli gruppi | *si astiene*           |
| **Voto**   | **alto, alto, basso, medio, basso, basso** |

Tukey, binomiale e piccoli gruppi non vedono alcuna divisione e si astengono. Votano Jenks,
head/tail, Gini e percentili: per $5$ concordano sull'alto e per $2$ sul basso;
per $3$ Jenks, Gini e percentili votano "medio" e prevalgono sul "basso" di
head/tail. Quindi $5$ diventa alto, $2$ basso e $3$ medio. Ne risulta:

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
sette metodi.

- **Jenks.** Le tre classi $[1, 1, 1]$, $[2]$ e $[5, 5]$ hanno varianza interna
  nulla, quindi $GVF = 1 \ge 0{,}75$: il partizionamento è accettato. Ne
  risultano $L = 1$ e $H = 5$.
- **Head/tail.** La media è $15/6 = 2{,}5$; la testa è $[5, 5]$
  ($2$ valori su $6$, meno del $40\%$), poi la testa non si divide oltre.
  La prima classe (valori $\le 2{,}5$) ha ultimo valore $2$, l'ultima classe
  (valori $> 2{,}5$) ha primo valore $5$: $(L, H) = (2, 5)$.
- **Gini.** $G \approx 0{,}44 \ge 0{,}3$: distribuzione abbastanza diseguale.
  I percentili estremi danno $L = \text{percentile}(5) = x_0 = 1$ e
  $H = \text{percentile}(95) = x_5 = 5$, entrambi oltre la mediana ($1{,}5$),
  quindi $(L, H) = (1, 5)$.
- **Percentili.** $L = \text{percentile}(10) = x_0 = 1$ e
  $H = \text{percentile}(95) = x_5 = 5$, entrambi oltre la mediana ($1{,}5$),
  quindi $(L, H) = (1, 5)$.
- **Tukey.** $Q_1 = x_1 = 1$, $Q_3 = x_4 = 5$, $IQR = 4$: i recinti sono
  $F_L = -5$ e $F_H = 11$. Nessun impatto cade strettamente oltre i recinti,
  quindi il metodo si astiene.
- **Binomiale.** Le opinioni totali sono $15$, quindi
  $p = 15 / (6 \cdot 5) = 0{,}5$ e $X \sim \text{Binomiale}(5;\ 0{,}5)$.
  $P(X \le 0) \approx 0{,}031 > 0{,}005$ e $P(X \ge 5) \approx 0{,}031 > 0{,}005$:
  nessuna delle due code raggiunge la significatività. Risultato: **nessuna
  divisione**.
- **Piccoli gruppi.** Anche qui $N = 6 \ge 5$: il metodo si astiene.

| Metodo     | Etichette                 |
| ---------- | ------------------------- |
| Jenks      | $-1, -1, -1, +1, +1, 0$  |
| head/tail  | $-1, -1, -1, +1, +1, -1$ |
| Gini       | $-1, -1, -1, +1, +1, 0$  |
| percentili | $-1, -1, -1, +1, +1, 0$  |
| Tukey      | *si astiene*              |
| binomiale  | *si astiene*              |
| piccoli gruppi | *si astiene*           |
| **Voto**   | **basso, basso, basso, alto, alto, medio** |

Anche qui Tukey, binomiale e piccoli gruppi si astengono. Votano Jenks, head/tail, Gini e
percentili: per $1$ concordano sul basso e per $5$ sull'alto; per $2$ Jenks,
Gini e percentili votano "medio" e prevalgono sul "basso" di head/tail. Quindi
$1$ diventa basso, $5$ alto e $2$ medio. Ne risulta:

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
