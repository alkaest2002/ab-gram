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
   basso, medio o alto? Le soglie non sono fissate da un solo metodo: otto
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

1. otto **metodi** propongono ciascuno una coppia di soglie (§ 4.2.1–4.2.8);
2. ogni metodo **applica le proprie soglie** e classifica i membri (§ 4.2.9);
3. la classe finale di ogni membro è decisa per **maggioranza** tra i metodi
   che propongono una divisione (§ 4.2.10).

**Convenzione sulle soglie.** Ogni metodo restituisce una **soglia bassa** $L$
e una **soglia alta** $H$, con questo significato:

- impatto **basso** se $n_i \le L$;
- impatto **alto** se $n_i \ge H$;
- impatto **medio** negli altri casi.

Un lato può essere "mai segnalato" ($L = -\infty$ oppure $H = +\infty$). Se
**entrambi** i lati sono disattivati si parla di **nessuna divisione**: tutti i
membri sono classificati a impatto medio.

**Controllo di separazione.** Prima di consegnare le soglie, ogni metodo
verifica che le classi siano davvero **separate da almeno un voto**: se il
massimo dei valori bassi coincide col primo valore medio, la soglia bassa viene
disattivata ($L = -\infty$); se l'ultimo valore medio coincide col primo valore
alto, viene disattivata la soglia alta ($H = +\infty$). Così non si divide mai
tra valori identici.

**Non tutti i metodi, però, propongono una divisione, né tutti propongono due
soglie.** Un metodo può **astenersi** del tutto (nessuna divisione), proporre
**entrambe** le soglie, oppure proporre **una sola**:

- **due lati** — percentili, Jenks, Tukey, binomiale, largest gap e robust
  z-score calcolano sia $L$
  sia $H$ (anche se, per le loro regole interne, uno dei due lati può risultare
  disattivato, cioè infinito);
- **solo il lato alto** — *head/tail breaks* segnala esclusivamente $H$ e lascia
  sempre $L = -\infty$ (§ 4.2.5);
- **un solo lato, basso o alto** — il metodo dei piccoli gruppi isola di norma
  solo la coda più piccola, lasciando l'altro lato disattivato (§ 4.2.8).

Le soglie dei metodi basati sulla distribuzione
(percentili, Jenks, head/tail, Tukey, largest gap, robust z-score, piccoli gruppi) si calcolano **esclusivamente sui
membri che hanno ricevuto almeno un'opinione** ($n_i > 0$). Se si includessero
anche gli isolati e gli ignorati, la lunga coda di zeri abbasserebbe le soglie
e, nelle reti poco dense, la categoria "marginale" rischierebbe di non essere
mai raggiunta.

**Pochissimi membri visibili.** Se i membri visibili sono **meno di tre**, non
c'è abbastanza varietà per distinguere tre classi: la votazione viene saltata e
tutti i membri visibili restano a impatto medio.

#### 4.2.1 Metodo dei percentili

**Intuizione:** segnalare solo le **code evidenti** della distribuzione.

- $L = \text{percentile}(10)$;
- $H = \text{percentile}(90)$.

Il metodo **si astiene** (propone nessuna divisione) con meno di $5$ membri
visibili: con così pochi, "il 10% più basso" è una o due persone e non dice
nulla su code davvero evidenti.

Le soglie vengono poi sottoposte al **controllo di separazione** (§ 4.2): una
coda la cui soglia coincide con il valore adiacente dell'altra classe — il
massimo dei valori bassi è uguale al primo valore medio, oppure il primo valore
della coda alta è uguale all'ultimo valore medio — viene disattivata. In questo
modo non si divide mai tra valori identici: su una distribuzione perfettamente
piatta il metodo si astiene, invece di votare sempre.

#### 4.2.2 Metodo largest gap

**Intuizione:** dividere la distribuzione in corrispondenza dei **due salti più
grandi** tra impatti consecutivi. Sugli impatti visibili ordinati
$x_0 \le x_1 \le \dots \le x_{N-1}$ i salti sono $g_i = x_i - x_{i-1}$ per
$i = 1, \dots, N-1$; i due salti più ampi individuano le due separazioni
naturale tra coda bassa, fascia media e coda alta.

Il metodo **si astiene** con più di $4$ membri visibili (è pensato per i gruppi
piccoli). Le soglie sono

- $L = x_{c_1}$, l'ultimo valore della coda bassa;
- $H = x_{c_2 + 1}$, il primo valore della coda alta,

dove $c_1 < c_2$ sono gli indici dei due salti più grandi. Vale poi il
**controllo di separazione** (§ 4.2): una coda il cui salto è vuoto (i due
valori ai lati sono uguali) viene disattivata.

#### 4.2.3 Metodo robust z-score

**Intuizione:** segnalare come anomali i valori che si discostano **troppo** dal
centro della distribuzione, misurando la distanza non con la media (sensibile
agli outlier) ma con la **mediana** e la **deviazione assoluta mediana** (MAD).
È un'alternativa più robusta di Tukey quando ci sono valori estremi.

Sia $m$ la mediana degli impatti dei membri visibili e sia
$MAD = \max\bigl(\text{mediana}(|x_i - m|),\ 0{,}5\bigr)$ (il minimo $0{,}5$
evita di dividere per zero quando i dati sono poco dispersi). Si definisce

$$
z_i = \frac{x_i - m}{1{,}4826 \cdot MAD}
$$

e si considerano anomali i valori con $|z_i| > 3{,}5$. Le soglie sono il valore
osservato più vicino **strettamente oltre** i due recinti

- $L = m - 3{,}5 \cdot 1{,}4826 \cdot MAD$;
- $H = m + 3{,}5 \cdot 1{,}4826 \cdot MAD$.

Il metodo **si astiene** con meno di $5$ membri visibili. Vale poi il
**controllo di separazione** (§ 4.2).

#### 4.2.4 Metodo di Jenks

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

Come per i percentili, poi una coda la cui soglia non è **separata** dal valore
adiacente viene disattivata (controllo di separazione, § 4.2): se l'ultimo
valore della prima classe è uguale al primo della seconda si pone $L = -\infty$;
se l'ultimo valore della seconda è uguale al primo della terza si pone
$H = +\infty$.

#### 4.2.5 Metodo head/tail breaks

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

#### 4.2.6 Metodo di Tukey

**Intuizione:** il classico criterio dei **valori anomali** basato sui
quartili, i "recinti interni" del box plot. Detti
$Q_1 = \text{percentile}(25)$ e $Q_3 = \text{percentile}(75)$ i quartili degli
impatti dei membri visibili e $IQR = Q_3 - Q_1$ lo scarto interquartile, i
recinti sono

- $L = Q_1 - 1 \cdot IQR$;
- $H = Q_3 + 1 \cdot IQR$.

Il metodo **si astiene** con meno di $3$ membri visibili oppure se $IQR = 0$.
Il metodo di Tukey è conservativo: segnala solo gli scostamenti davvero estremi
e, nei gruppi omogenei, spesso non segnala nessuno.

#### 4.2.7 Metodo binomiale (GB)

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
metodo propone **nessuna divisione** anche quando $n < 5$ oppure $p$ non è
strettamente compresa tra $0$ e $1$ (il modello non è applicabile).

> **Un'approssimazione.** Poiché $n_i = rp_i + rr_i$, un membro può ricevere
> sia una preferenza sia un rifiuto dallo stesso membro: l'impatto può quindi
> superare $n - 1$, cosa che il modello binomiale non prevede. La protezione
> $p < 1$ gestisce il caso estremo; per scostamenti moderati il metodo resta
> un'approssimazione ragionevole.

#### 4.2.8 Metodo dei piccoli gruppi

**Intuizione:** con pochissimi membri visibili ($3 \le N < 5$) i percentili sono
inaffidabili e i metodi basati sulla distribuzione si astengono. Qui si cerca
invece il **salto più grande** tra impatti consecutivi: se è un salto
"vero" e domina gli altri, si segnala **solo la coda più piccola** che quel salto
isola, lasciando il resto a impatto medio (così il bilancio può ancora decidere).

Sugli impatti visibili ordinati $x_0 \le x_1 \le \dots \le x_{N-1}$, i salti tra
valori consecutivi sono $g_i = x_i - x_{i-1}$ per $i = 1, \dots, N-1$. Siano
$g_{\max}$ il salto più grande e $g_2$ il secondo per grandezza; sia inoltre
$R = x_{N-1} - x_0$ l'escursione totale. Il metodo **si astiene** quando:

- $N < 3$ oppure $N \ge 5$ (è il complemento dei metodi che richiedono almeno $5$);
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

#### 4.2.9 Applicazione delle soglie di ciascun metodo

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

#### 4.2.10 La votazione tra i metodi

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

**Perché la maggioranza? Il teorema della giuria di Condorcet.** Affidarsi alla
maggioranza non è una scelta arbitraria: discende dal **teorema della giuria di
Condorcet**. Se ogni "giurato" (qui, ogni metodo) ha probabilità $p > 1/2$ di
dare la risposta giusta e i giurati decidono in modo **indipendente**, allora:

- la decisione a maggioranza ha **più probabilità di essere corretta** di
  qualunque giurato preso singolarmente;
- al crescere del numero di giurati, la probabilità che la maggioranza sia
  corretta **tende a $1$**.

L'intuizione è che gli errori dei singoli metodi tendono a cancellarsi a
vicenda, mentre le risposte corrette si sommano: anche se ogni metodo è
debolmente migliore del caso, mettendoli insieme il gruppo diventa molto più
affidabile di ciascuno.

> **Un avvertimento importante.** Le ipotesi del teorema (indipendenza e
> $p > 1/2$ per ogni giurato) qui valgono solo **in parte**: i metodi lavorano
> sugli stessi dati e sono quindi **correlati** tra loro — se i dati sono
> ambigui, possono sbagliare *tutti insieme*. Per questo il voto di maggioranza
> va letto come un'**euristica robusta** (un modo per non dipendere da un unico
> metodo), non come una garanzia matematica di correttezza.

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
| Metodi di soglia in competizione                | Jenks, largest gap, head/tail, percentili, Tukey, robust z-score, binomiale, piccoli gruppi |
| Aggregazione tra i metodi                       | voto di maggioranza tra i metodi che dividono |
| Metodi che non dividono                         | si astengono (non votano)               |
| Parità nel voto                                 | non medio prevale su medio; basso prevale su alto |
| Votazione con meno di $3$ membri visibili       | saltata: tutti restano a impatto medio  |
| Membri visibili minimi per percentili, Jenks, head/tail e robust z-score | $5$                              |
| Membri del gruppo minimi per binomiale          | $5$                                      |
| Membri visibili minimi per Tukey                | $3$                                      |
| Membri visibili per largest gap                 | al massimo $4$ (gruppi piccoli)          |
| Membri visibili per piccoli gruppi              | $3 \le N < 5$                            |
| Percentili per impatto basso / alto             | $10$ / $90$                              |
| Controllo di separazione                        | coda disattivata se la soglia coincide col valore adiacente |
| Jenks: numero di classi                         | $3$ (bassa, media, alta)                 |
| Jenks: goodness of variance fit minima          | $GVF \ge 0{,}75$                         |
| Head/tail: quota massima della testa            | $0{,}4$ (testa sotto il $40\%$ dei valori) |
| Tukey: recinti interni                          | $Q_1 - 1 \cdot IQR$ / $Q_3 + 1 \cdot IQR$ |
| Robust z-score: soglia                          | $3{,}5$ (scala MAD $1{,}4826$, minimo MAD $0{,}5$) |
| Binomiale: livello di significatività           | $\alpha = 0{,}01$ a due code ($0{,}005$ per coda) |
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
$N = 6$ (e $n = 6$ membri nel gruppo). Calcoliamo le soglie proposte dagli
otto metodi.

- **Jenks.** Le tre classi $[2, 2, 2]$, $[3]$ e $[5, 5]$ hanno varianza interna
  nulla, quindi $GVF = 1 \ge 0{,}75$: il partizionamento è accettato. Ne
  risultano $L = 2$ e $H = 5$.
- **Largest gap.** Con più di $4$ membri visibili ($N = 6$) il metodo si
  astiene.
- **Head/tail.** La media è $19/6 \approx 3{,}17$; la testa è $[5, 5]$
  ($2$ valori su $6$, meno del $40\%$). L'ultima classe (valori $> 3{,}17$)
  ha primo valore $5$: $H = 5$ e $L = -\infty$ (il lato basso non è mai
  segnalato).
- **Percentili.** $L = \text{percentile}(10) = x_0 = 2$ e
  $H = \text{percentile}(90) = x_5 = 5$. Entrambe le soglie coincidono con un
  valore adiacente identico (il $2$ e il $5$ sono ripetuti), quindi il
  **controllo di separazione** le disattiva entrambe: il metodo si astiene.
- **Tukey.** $Q_1 = x_1 = 2$, $Q_3 = x_4 = 5$, $IQR = 3$: i recinti sono
  $F_L = 2 - 3 = -1$ e $F_H = 5 + 3 = 8$. Nessun impatto cade strettamente
  oltre i recinti, quindi il metodo si astiene.
- **Robust z-score.** La mediana è $2{,}5$ e $MAD = 0{,}5$: i recinti sono
  $2{,}5 \pm 3{,}5 \cdot 1{,}4826 \cdot 0{,}5 \approx -0{,}09$ e $5{,}09$.
  Nessun impatto cade oltre, quindi il metodo si astiene.
- **Binomiale.** Le opinioni totali sono $19$, quindi
  $p = 19 / (6 \cdot 5) \approx 0{,}63$ e $X \sim \text{Binomiale}(5;\ 0{,}63)$.
  Con $\alpha = 0{,}01$ si ha $P(X \le 0) \approx 0{,}007 > 0{,}005$ e
  $P(X \ge 5) \approx 0{,}10 > 0{,}005$: nessuna delle due code raggiunge la
  significatività. Risultato: **nessuna divisione**.
- **Piccoli gruppi.** Il metodo si attiva solo con $3 \le N < 5$:
  qui $N = 6$, quindi si astiene.

Etichettando i sei membri in ordine di membro (basso/medio/alto) si ottiene:

| Metodo     | Etichette                 |
| ---------- | ------------------------- |
| Jenks      | $+1, +1, -1, 0, -1, -1$  |
| largest gap| *si astiene*              |
| head/tail  | $+1, +1, 0, 0, 0, 0$     |
| percentili | *si astiene*              |
| Tukey      | *si astiene*              |
| robust z-score | *si astiene*           |
| binomiale  | *si astiene*              |
| piccoli gruppi | *si astiene*           |
| **Voto**   | **alto, alto, basso, medio, basso, basso** |

Votano soltanto Jenks e head/tail: entrambi concordano sull'alto per $5$; per
$2$ il voto "basso" di Jenks prevale sul "medio" di head/tail (una classe non
media prevale sulla media in caso di parità). Quindi $5$ diventa alto, $2$ basso
e $3$ medio. Ne risulta:

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
$N = 6$ (e $n = 6$ membri nel gruppo). Calcoliamo le soglie proposte dagli
otto metodi.

- **Jenks.** Le tre classi $[1, 1, 1]$, $[2]$ e $[5, 5]$ hanno varianza interna
  nulla, quindi $GVF = 1 \ge 0{,}75$: il partizionamento è accettato. Ne
  risultano $L = 1$ e $H = 5$.
- **Largest gap.** Con più di $4$ membri visibili ($N = 6$) il metodo si
  astiene.
- **Head/tail.** La media è $15/6 = 2{,}5$; la testa è $[5, 5]$
  ($2$ valori su $6$, meno del $40\%$). L'ultima classe (valori $> 2{,}5$)
  ha primo valore $5$: $H = 5$ e $L = -\infty$.
- **Percentili.** $L = \text{percentile}(10) = x_0 = 1$ e
  $H = \text{percentile}(90) = x_5 = 5$. Entrambe le soglie coincidono con un
  valore adiacente identico, quindi il **controllo di separazione** le
  disattiva: il metodo si astiene.
- **Tukey.** $Q_1 = x_1 = 1$, $Q_3 = x_4 = 5$, $IQR = 4$: i recinti sono
  $F_L = 1 - 4 = -3$ e $F_H = 5 + 4 = 9$. Nessun impatto cade strettamente
  oltre i recinti, quindi il metodo si astiene.
- **Robust z-score.** La mediana è $1{,}5$ e $MAD = 0{,}5$: i recinti sono
  $1{,}5 \pm 3{,}5 \cdot 1{,}4826 \cdot 0{,}5 \approx -1{,}09$ e $4{,}09$.
  Il valore $5$ cade oltre il recinto alto, quindi $H = 5$ e $L = -\infty$.
- **Binomiale.** Le opinioni totali sono $15$, quindi
  $p = 15 / (6 \cdot 5) = 0{,}5$ e $X \sim \text{Binomiale}(5;\ 0{,}5)$.
  $P(X \le 0) \approx 0{,}031 > 0{,}005$ e $P(X \ge 5) \approx 0{,}031 > 0{,}005$:
  nessuna delle due code raggiunge la significatività. Risultato: **nessuna
  divisione**.
- **Piccoli gruppi.** Anche qui $N = 6 \ge 5$: il metodo si astiene.

| Metodo     | Etichette                 |
| ---------- | ------------------------- |
| Jenks      | $-1, -1, -1, +1, +1, 0$  |
| largest gap| *si astiene*              |
| head/tail  | $0, 0, 0, +1, +1, 0$     |
| percentili | *si astiene*              |
| Tukey      | *si astiene*              |
| robust z-score | $0, 0, 0, +1, +1, 0$  |
| binomiale  | *si astiene*              |
| piccoli gruppi | *si astiene*           |
| **Voto**   | **medio, medio, medio, alto, alto, medio** |

Votano Jenks, head/tail e robust z-score. Per $5$ concordano tutti sull'alto;
per $1$ il solo voto "basso" di Jenks è superato dai due voti "medio" di
head/tail e robust z-score, quindi $1$ resta medio. Ne risulta:

- impatto basso: nessuno;
- impatto alto ($\ge 5$): membri $4$ e $5$;
- impatto medio: membri $1$, $2$, $3$ e $6$.

**Passo 3 — Bilancio.** Non ci sono scelte ($rp = 0$), quindi il bilancio è
sempre negativo.

**Passo 4 — Assegnazione.**

| Membro | Percorso                    | Status    | Codice |
| :----: | --------------------------- | --------- | :----: |
|   1    | medio + negativo            | malvisto  |   5    |
|   2    | medio + negativo            | malvisto  |   5    |
|   3    | medio + negativo            | malvisto  |   5    |
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

| Membro | Status     | $bns_i$ | $mls_i$ |
| :----: | ---------- | :-----: | :-----: |
|   1    | malvisto   |    0    |   34    |
|   2    | malvisto   |    0    |   33    |
|   3    | malvisto   |    0    |   33    |
|   4    | rifiutato  |    0    |   175   |
|   5    | rifiutato  |    0    |   171   |
|   6    | malvisto   |    0    |   67    |

Il membro $4$ ha un malus più alto del membro $5$ ($175$ contro $171$): è stato
rifiutato **prima** nelle sequenze di rifiuto altrui. A parità di status
**rifiutato**, il membro $4$ occupa quindi la posizione meno favorevole.
