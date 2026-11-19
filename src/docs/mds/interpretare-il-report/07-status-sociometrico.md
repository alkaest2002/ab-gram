---
title: Status sociometrico
order: 7
---

<script setup>
    import { useSociogramStore } from "@/stores/sociogram";
    const store = useSociogramStore()
</script>

Lo **status sociometrico** ($ss_i$) è l'etichetta finale che riassume la
posizione di ciascun membro nella rilevazione. Non è una caratteristica stabile
della persona né una diagnosi: dipende dal gruppo, dalla domanda e dai dati raccolti. A differenza degli indici visti nella
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
   basso, medio o alto? Le soglie non sono fissate da un solo metodo: nove
   metodi propongono soglie; per ogni membro si contano i voti delle strategie
   che lo classificano.
3. **Prevalgono le preferenze o i rifiuti?** Il bilancio è positivo, negativo o
   neutro?

Le risposte si combinano in una delle nove categorie. L'impatto basso ha la
precedenza sul bilancio.

## 2 Le nove categorie

Ogni codice corrisponde a una categoria ben precisa. La tabella mostra sia la
**categoria tecnica** usata dall'algoritmo, sia la **formulazione usata nel
report**:

| Codice | Categoria tecnica | Nel report              | Impatto | Bilancio  |
| :----: | ----------------- | ----------------------- | :-----: | :-------: |
|   0    | isolato           | segnali di isolamento   | nessuno |     —     |
|   1    | ignorato          | riscontro assente       | nessuno |     —     |
|   2    | marginale         | indizi di marginalità   |  basso  | qualunque |
|   3    | apprezzato        | apprezzato              |  medio  | positivo  |
|   4    | popolare          | popolare                |  alto   | positivo  |
|   5    | malvisto          | note di disapprovazione |  medio  | negativo  |
|   6    | rifiutato         | segnali di rifiuto      |  alto   | negativo  |
|   7    | ambivalente       | elementi di ambivalenza |  medio  |  neutro   |
|   8    | controverso       | accoglienza dibattuta   |  alto   |  neutro   |

> **Nel report si usa la formulazione morbida.** La categoria tecnica (ad
> esempio _rifiutato_ o _malvisto_) è una classificazione dell'algoritmo; nel
> report compare invece una formulazione descrittiva (ad esempio _segnali di
> rifiuto_ o _note di disapprovazione_). Questa scelta è un tentativo di
> **evitare l'etichettamento sociale**: presentiamo lo stesso risultato come un
> indizio o un segnale da osservare, non come una definizione stabile della
> persona.

**Il codice numerico è un identificatore, non un punteggio.** I numeri da 0 a 8 sono
soltanto una convenzione per identificare le categorie: non indicano un ordine,
un punteggio o una gravità crescente. Due codici vicini non sono più simili tra
loro di due codici lontani; ciò che conta è esclusivamente la categoria a cui
il codice è associato.

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

Nei dati raccolti, il membro classificato come isolato non ha nomine in
entrata né in uscita; quello classificato come ignorato ne esprime, ma non ne
riceve. Prima di interpretarli come segnali relazionali, occorre verificare
che non dipendano da mancate risposte o dati incompleti. Tutti gli altri membri
($n_i > 0$) procedono al passo successivo.

### 4.2 Passo 2 — Classificazione dell'impatto

In questo passo l'impatto ricevuto viene suddiviso in tre classi: **basso**,
**medio** e **alto**. L'algoritmo combina più strategie, sensibili ad aspetti
diversi della distribuzione. Ogni metodo può classificare un membro oppure
astenersi; per quel membro viene scelta la classe con più voti, applicando le
regole di spareggio. Non occorre una maggioranza assoluta e non viene scelto
un unico metodo vincitore per tutto il gruppo. Il passo si articola in tre mosse:

1. nove **metodi** propongono ciascuno una coppia di soglie (§ 4.2.1–4.2.9);
2. ogni metodo **applica le proprie soglie** e classifica i membri (§ 4.2.10);
3. la classe finale di ogni membro è decisa dal **maggior numero di voti** tra i metodi
   che propongono una divisione (§ 4.2.11).

**Convenzione sulle soglie.** Ogni metodo restituisce una **soglia bassa** $L$
e una **soglia alta** $H$, con questo significato:

- impatto **basso** se $n_i \le L$ (lato basso attivo, $L$ finito);
- impatto **alto** se $n_i \ge H$ (lato alto attivo, $H$ finito);
- impatto **medio** se **entrambe** le soglie sono finite e $L < n_i < H$.

Un lato può essere "mai segnalato" ($L = -\infty$ oppure $H = +\infty$). Se
**entrambi** i lati sono disattivati si parla di **nessuna divisione**: il
metodo si astiene e non vota alcun membro. Se è disattivato **un solo** lato, il
metodo classifica soltanto il lato rimasto attivo e **si astiene su tutti gli
altri** membri: non li etichetta come medi, ma semplicemente non esprime alcun
voto su di essi.

**Controllo di separazione.** Prima di consegnare le soglie, i metodi basati sulla distribuzione
verificano che le classi siano davvero **separate da almeno un voto**: se il
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
- **solo il lato alto** — _head/tail breaks_ segnala esclusivamente $H$ e lascia
  sempre $L = -\infty$ (§ 4.2.5);
- **solo il lato basso** — _inverted head/tail breaks_ segnala esclusivamente
  $L$ e lascia sempre $H = +\infty$ (§ 4.2.6);
- **un solo lato, basso o alto** — il metodo dei piccoli gruppi isola di norma
  solo la coda più piccola, lasciando l'altro lato disattivato (§ 4.2.9).

Le soglie dei metodi basati sulla distribuzione
(percentili, Jenks, head/tail, inverted head/tail, Tukey, largest gap, robust z-score, piccoli gruppi) si calcolano **esclusivamente sui
membri che hanno ricevuto almeno un'opinione** ($n_i > 0$). Se si includessero
anche gli isolati e gli ignorati, la lunga coda di zeri abbasserebbe le soglie
e, nelle reti poco dense, la categoria "marginale" rischierebbe di non essere
mai raggiunta.

**Pochissimi membri visibili.** Se i membri visibili sono **meno di quattro**,
non c'è abbastanza varietà per distinguere tre classi: la votazione viene
saltata e tutti i membri visibili restano a impatto medio. Da $4$ a $35$ membri
visibili, almeno due metodi sono sempre ammessi al voto in base alla numerosità:
con $N = n = 4$ sono largest gap e piccoli gruppi. Il binomiale usa invece
la numerosità totale $n$ del gruppo ed è ammesso da $5$ a $35$ membri. I metodi
ammessi possono comunque astenersi se i dati non soddisfano i loro controlli interni.

#### 4.2.1 Metodo dei percentili

**Intuizione:** individuare le posizioni **relativamente basse e alte** nel gruppo.

Sugli impatti visibili ordinati $x_0 \le \dots \le x_{N-1}$, si pone
$r = \lceil 0{,}15N \rceil$ e, prima del controllo di separazione:

- $L = x_{r-1}$;
- $H = x_{N-r}$.

Il simbolo $\lceil\cdot\rceil$ indica l'arrotondamento all'intero superiore.
Il programma usa quindi il rango più vicino per la coda bassa e lo stesso
rango contato dall'alto per la coda alta, **senza interpolazione**. Non è la
stessa convenzione dei quartili dei gradi descritti nelle metriche di gruppo;
la soglia alta può inoltre differire dall'usuale percentile all'$85\%$
calcolato contando dal basso.

Il metodo è ammesso con **da $20$ a $35$ membri visibili** e si astiene al di
fuori di questo intervallo. Le soglie individuano nominalmente il $15\%$
inferiore e superiore: con $N = 20$ corrispondono a tre persone per coda,
prima del controllo di separazione e degli effetti delle parità.

La scelta del $15$° e dell'$85$° percentile è **euristica**: descrive posizioni
relative, non rappresenta una soglia di significatività statistica e non
garantisce la presenza di gruppi nettamente separati né la stabilità delle
classificazioni rispetto a piccole variazioni nelle nomine.

Le soglie vengono poi sottoposte al **controllo di separazione** (§ 4.2): una
coda la cui soglia coincide con il valore adiacente dell'altra classe — il
massimo dei valori bassi è uguale al primo valore medio, oppure il primo valore
della coda alta è uguale all'ultimo valore medio — viene disattivata. In questo
modo non si divide mai tra valori identici: su una distribuzione perfettamente
piatta il metodo si astiene, invece di votare sempre.

#### 4.2.2 Metodo largest gap

**Intuizione:** dividere la distribuzione in corrispondenza dei **due salti più
grandi** tra impatti consecutivi. Sugli impatti visibili ordinati
$x_0 \le x_1 \le \dots \le x_{N-1}$ i salti sono $g_i = x_{i+1} - x_i$ per
$i = 0, \dots, N-2$; i due salti più ampi individuano le due separazioni
tra coda bassa, fascia media e coda alta.

Il metodo **si astiene quando la scelta dei due salti è ambigua**: il
secondo salto più ampio ha la stessa ampiezza del terzo. Sono invece ammessi
due salti massimi uguali, purché entrambi siano strettamente più ampi di
tutti gli altri; le parità tra salti non selezionati non impediscono il voto.

Per esempio, con impatti visibili $[1, 3, 5, 7, 9, 11]$ tutti i salti valgono
$2$ e il metodo si astiene. Si astiene anche con $[1, 3, 8, 10]$: il salto
massimo vale $5$, ma non è possibile scegliere univocamente il secondo tra i
due salti di ampiezza $2$. Con $[1, 5, 5, 9]$, invece, i due salti massimi di
ampiezza $4$ sono univocamente individuati: le soglie sono $L = 1$ e $H = 9$.

Il metodo è ammesso con **da $4$ a $6$ membri visibili** e si astiene al di
fuori di questo intervallo: è pensato per i gruppi piccoli. Le soglie sono

- $L = x_{c_1}$, l'ultimo valore della coda bassa;
- $H = x_{c_2 + 1}$, il primo valore della coda alta,

dove $c_1 < c_2$ sono gli indici dei due salti più grandi. Vale poi il
**controllo di separazione** (§ 4.2): una coda il cui salto è vuoto (i due
valori ai lati sono uguali) viene disattivata.

#### 4.2.3 Metodo robust z-score

**Intuizione:** segnalare come anomali i valori che si discostano **troppo** dal
centro della distribuzione, misurando la distanza non con la media (sensibile
agli outlier) ma con la **mediana** e la **deviazione assoluta mediana** (MAD).
È un criterio robusto basato sulla distanza dalla mediana; non è sempre
preferibile agli altri metodi.

Sia $m$ la mediana degli impatti dei membri visibili e sia
$MAD = \max\bigl(\text{mediana}(|x_i - m|),\ 0{,}5\bigr)$ (il minimo $0{,}5$
evita di dividere per zero quando i dati sono poco dispersi). Si definisce

$$
z_i = \frac{x_i - m}{1{,}4826 \cdot MAD}
$$

e si considerano anomali i valori con $|z_i| > 3{,}5$. I due **recinti** sono

- $F_L = m - 3{,}5 \cdot 1{,}4826 \cdot MAD$;
- $F_H = m + 3{,}5 \cdot 1{,}4826 \cdot MAD$.

Le **soglie effettive** sono invece i valori osservati più vicini
strettamente oltre i recinti:

$$
L = \max\{x_i : x_i < F_L\}, \qquad
H = \min\{x_i : x_i > F_H\}
$$

Se non ci sono valori sotto il recinto basso si pone $L = -\infty$; se non
ce ne sono sopra il recinto alto si pone $H = +\infty$.

Il metodo è ammesso con **da $7$ a $35$ membri visibili** e si astiene al di
fuori di questo intervallo. Vale poi il **controllo di separazione** (§ 4.2).

#### 4.2.4 Metodo di Jenks

**Intuizione:** individuare i **raggruppamenti naturali** della distribuzione:
le classi vengono scelte in modo da rendere **minima** la varianza interna a
ogni classe (e, di conseguenza, massima quella tra classi). È il criterio dei
_natural breaks_ di Jenks, qui adattato a **tre classi** (bassa, media, alta).

Sugli impatti dei membri visibili, ordinati $x_0 \le x_1 \le \dots \le x_{N-1}$,
si cercano i due tagli che separano tre classi consecutive minimizzando la
somma degli scarti quadratici dalle medie delle rispettive classi, detta $SDCM$. La bontà del partizionamento si
misura con il **goodness of variance fit**

$$
GVF = 1 - \frac{SDCM}{SDAM}
$$

dove $SDAM$ è la somma degli scarti quadratici dalla media complessiva degli impatti. Il metodo **si astiene** quando:

- non ci sono da $7$ a $35$ membri visibili;
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
si staccano nettamente dalla massa dei valori piccoli. Il metodo _head/tail
breaks_ separa ricorsivamente la "testa" (la minoranza di valori grandi) dalla
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

Il metodo è ammesso con **da $7$ a $35$ membri visibili**; si astiene al di
fuori di questo intervallo o quando non produce alcun taglio (valori tutti
uguali).

#### 4.2.6 Metodo inverted head/tail breaks

**Intuizione:** è l'immagine speculare del metodo _head/tail_: nelle
distribuzioni con una **coda rada verso il basso**, pochi valori molto bassi si
staccano nettamente dalla massa dei valori più alti. Il metodo separa
ricorsivamente la "coda" (la minoranza di valori piccoli) dal resto.

A ogni passo si calcola la media dei valori correnti e si considera "coda"
l'insieme dei valori **minori della media**. Si ripete sulla coda fino alla
**condizione di arresto speculare**: la coda smette di essere una minoranza
(raggiunge il $40\%$ dei valori correnti), oppure non resta nulla da dividere
(tutti i valori sono uguali). Ogni media calcolata è un **punto di taglio**.

- $L$ = il valore più alto della **coda finale** (l'ultima classe, la più
  bassa);
- $H = +\infty$: il lato alto non viene **mai** segnalato.

Il metodo è ammesso con **da $7$ a $35$ membri visibili**; si astiene al di
fuori di questo intervallo o quando non produce alcun taglio (valori tutti
uguali).

#### 4.2.7 Metodo di Tukey

**Intuizione:** una variante del criterio di Tukey per i **valori anomali**,
basata sui quartili. Il programma usa un moltiplicatore $1$, non il consueto
$1{,}5$ degli _inner fences_ del box plot. Sugli impatti visibili ordinati
$x_0 \le \dots \le x_{N-1}$, i quartili sono valori osservati scelti con
ranghi speculari, senza interpolazione:

$$
Q_1 = x_{\lceil 0{,}25N \rceil - 1}, \qquad
Q_3 = x_{N - \lceil 0{,}25N \rceil}
$$

Detto $IQR = Q_3 - Q_1$ lo scarto interquartile, i recinti usati sono

- recinto basso: $Q_1 - 1 \cdot IQR$;
- recinto alto: $Q_3 + 1 \cdot IQR$.

Il metodo è ammesso con **da $7$ a $35$ membri visibili**; si astiene al di
fuori di questo intervallo oppure se $IQR = 0$. Le soglie effettive sono il massimo valore osservato strettamente sotto il
recinto basso e il minimo valore strettamente sopra quello alto; un lato
senza valori oltre il recinto viene disattivato. Con moltiplicatore $1$ il
criterio è meno restrittivo della versione usuale con $1{,}5$.

#### 4.2.8 Metodo binomiale (GB)

**Intuizione:** _che cosa produrrebbe il puro caso?_ Se ogni opinione fosse
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
metodo propone **nessuna divisione** anche quando il gruppo non ha da $5$ a
$35$ membri oppure $p$ non è strettamente compresa tra $0$ e $1$ (il modello
non è applicabile).

> **Un'approssimazione.** Poiché $n_i = rp_i + rr_i$, un membro può ricevere
> sia una preferenza sia un rifiuto dallo stesso membro: l'impatto può quindi
> superare $n - 1$, cosa che il modello binomiale non prevede. La protezione
> $p < 1$ esclude alcuni casi estremi, ma non risolve questa incompatibilità
> quando $p$ resta inferiore a $1$. Inoltre il modello presuppone prove
> indipendenti con uguale probabilità, ipotesi non garantite dalle nomine.
> Le soglie sono quindi riferite a un modello semplificato, non dimostrano che
> una posizione sia statisticamente anomala nel gruppo reale.

#### 4.2.9 Metodo dei piccoli gruppi

**Intuizione:** con **da $4$ a $6$ membri visibili** serve un criterio
dedicato ai piccoli gruppi. Qui si cerca
invece il **salto più grande** tra impatti consecutivi: se è un salto
"vero" e domina gli altri, si segnala **solo la coda più piccola** che quel salto
isola, astenendosi sugli altri membri (non li vota né come bassi né come medi).

Sugli impatti visibili ordinati $x_0 \le x_1 \le \dots \le x_{N-1}$, i salti tra
valori consecutivi sono $g_i = x_i - x_{i-1}$ per $i = 1, \dots, N-1$. Siano
$g_{\max}$ il salto più grande e $g_2$ il secondo per grandezza; sia inoltre
$R = x_{N-1} - x_0$ l'escursione totale. Il metodo **si astiene** quando:

- $N < 4$ oppure $N > 6$;
- $g_{\max} = 0$ (tutti gli impatti sono uguali);
- $g_{\max} < 2$ (un salto di una sola opinione non è abbastanza);
- il salto non domina gli altri: $g_{\max} < 1{,}5 \cdot g_2$ **e**
  $g_{\max} < 0{,}5 \cdot R$.

Se il salto è dominante, sia $k$ l'indice del valore **sopra** il salto massimo
(il salto è tra $x_{k-1}$ e $x_k$). Se più salti massimi hanno la stessa
ampiezza, viene scelto il **primo** nella sequenza ordinata, diversamente
dalla regola di astensione del metodo largest gap. Si segnala solo la coda
più piccola:

- coda **bassa** più piccola $\Rightarrow$ $L = x_{k-1}$ e $H = +\infty$;
- coda **alta** più piccola $\Rightarrow$ $L = -\infty$ e $H = x_k$;
- code **uguali** (possibile con $N = 4$, due contro due, o $N = 6$, tre contro tre) $\Rightarrow$
  $L = x_{k-1}$ e $H = x_k$.

Per esempio, con $[1, 1, 1, 3]$ viene segnalato solo il $3$ come impatto alto e
il metodo si astiene sui tre $1$; con $[1, 3, 3, 3]$ viene segnalato solo l'$1$
come impatto basso e il metodo si astiene sui tre $3$.

#### 4.2.10 Applicazione delle soglie di ciascun metodo

Ogni metodo applica le **proprie** soglie ai membri con $n_i > 0$ (gli altri
sono già stati classificati al Passo 1):

- **impatto basso**: $n_i \le L$, se il lato basso è attivo ($L$ finito);
- **impatto alto**: $n_i \ge H$, se il lato alto è attivo ($H$ finito);
- **impatto medio**: $L < n_i < H$, ma solo quando **entrambe** le soglie sono
  finite. Se un lato è disattivato, i membri che non cadono nel lato attivo
  **non** vengono votati: il metodo si astiene su di essi.

Le soglie sono **inclusive** ($\le$ e $\ge$): se più membri si trovano
esattamente su una soglia attiva, vengono tutti classificati dalla stessa
parte. Nel metodo dei percentili la quota nominale del $15\%$ può essere
superata per l'arrotondamento del numero di membri della coda; se invece una
parità attraversa il confine di rango scelto, il controllo di separazione
disattiva quella coda, anziché ampliarla. Se un membro risultasse sia basso
sia alto, prevale sempre "basso".

#### 4.2.11 La votazione tra i metodi

**Intuizione:** nessun metodo è sempre migliore degli altri, quindi li si lascia
"votare": ogni metodo classifica i membri che riesce a classificare e vince la
classe con il **maggior numero di voti espressi per quel membro**.

1. Ogni metodo etichetta con $-1$ (basso) i membri che ricadono nel lato basso
   attivo e con $+1$ (alto) quelli che ricadono nel lato alto attivo; etichetta
   con $0$ (medio) i membri compresi tra le due soglie **solo quando entrambe
   sono finite**. Sui membri che non classifica (perché il lato corrispondente è
   disattivato) il metodo **si astiene** e non esprime alcun voto. Se un valore
   soddisfa entrambe le condizioni, prevale "basso".
2. Per ogni numerosità supportata ($4 \le N \le 35$), almeno due metodi sono
   ammessi in base alla numerosità: con $N = n = 4$ sono largest gap e piccoli
   gruppi. Il binomiale considera il totale $n$, non i soli visibili $N$. Un metodo ammesso che propone **nessuna
   divisione** ($L = -\infty$, $H = +\infty$) **si astiene del tutto**: non
   partecipa al voto. Se _tutti_ i metodi si astengono, non c'è alcuna divisione
   e tutti restano a impatto medio.
3. Per ogni membro si contano i voti espressi per basso, medio e alto. Un membro
   per cui **nessun** metodo ha votato resta a impatto medio; negli altri casi la
   classe finale è quella con **più voti**.
4. **In caso di parità**, una classe non media (basso o alto) **prevale sulla
   media**; tra basso e alto prevale **basso**.

In questo modo un metodo che non vede alcuna divisione non può annacquare il
segnale degli altri: se un solo metodo riconosce una coda, la sua classificazione
resta l'unica disponibile e viene adottata. Allo stesso modo, un metodo a una
sola soglia (come _head/tail_) vota solo per la coda che segnala e non "spinge"
i restanti membri verso la classe media.

**Perché combinare più metodi?** È una scelta euristica per non dipendere da
un solo criterio di soglia. Non garantisce però maggiore accuratezza: i metodi
lavorano sugli stessi dati, possono produrre risultati correlati e non hanno
una probabilità nota di individuare una classificazione «corretta».

Il teorema della giuria di Condorcet non giustifica direttamente questa regola:
la sua formulazione classica riguarda decisioni binarie con ipotesi specifiche
sull'indipendenza e sull'accuratezza dei votanti; qui ci sono tre classi,
astensioni e spareggi. Anche l'accordo di più strategie non equivale a una
validazione dello status. Se vota un solo metodo, il risultato esprime soltanto
quel criterio, non un consenso tra metodi.

### 4.3 Passo 3 — Classificazione del bilancio

Il bilancio confronta preferenze e rifiuti ricevuti, ma non in modo "secco"
($rp$ contro $rr$): la soglia che separa "prevale il positivo" da "prevale il
negativo" è un **rapporto dinamico**, che si fa più severo quando le opinioni
ricevute dal singolo membro sono poche. La logica è: poche opinioni ricevute $\Rightarrow$ meno certezza
$\Rightarrow$ serve uno squilibrio più netto per parlare di prevalenza.

La soglia $t(n_i)$ dipende dall'impatto $n_i$:

$$
t(n_i) = 2 - 0{,}5 \cdot \frac{\max\bigl(0,\ \min(n_i - 3,\ 12)\bigr)}{12}
$$

In pratica:

- con $n_i \le 3$ la soglia vale $2{,}0$ (serve **più del doppio**);
- con $n_i \ge 15$ vale $1{,}5$ (più indulgente);
- in mezzo scende **linearmente** tra i due valori.

A questo punto il bilancio è:

- **positivo** se $rp_i > t(n_i) \cdot rr_i$;
- **negativo** se $rr_i > t(n_i) \cdot rp_i$;
- **neutro** in tutti gli altri casi.

Questa classe di bilancio non è il semplice segno dell'indice $bl_i = rp_i - rr_i$:
può risultare neutra anche se i due conteggi sono diversi. È una regola
operativa, non un test di significatività.

Per i membri visibili, due conseguenze utili da ricordare: chi riceve solo preferenze ($rr_i = 0$) ha
sempre bilancio positivo, e viceversa per chi riceve solo rifiuti; il bilancio
neutro compare solo quando preferenze e rifiuti sono abbastanza vicini da non
superare la soglia.

### 4.4 Passo 4 — Assegnazione finale: l'albero di decisione

L'ultimo passo combina i risultati dei tre precedenti con una regola a
**"prima corrispondenza vince"**: si scorre la lista di condizioni in ordine e,
per ogni membro, si applica la categoria legata alla **prima** condizione vera.
L'ordine conta, perché garantisce le priorità giuste.

| Priorità | Condizione                               | Categoria   | Codice |
| :------: | ---------------------------------------- | ----------- | :----: |
|    1     | nessuna opinione ricevuta né data        | isolato     |   0    |
|    2     | nessuna opinione ricevuta, ma ne ha date | ignorato    |   1    |
|    3     | impatto basso                            | marginale   |   2    |
|    4     | impatto alto e bilancio positivo         | popolare    |   4    |
|    5     | impatto alto e bilancio negativo         | rifiutato   |   6    |
|    6     | impatto alto e bilancio neutro           | controverso |   8    |
|    7     | impatto medio e bilancio positivo        | apprezzato  |   3    |
|    8     | impatto medio e bilancio negativo        | malvisto    |   5    |
|    9     | impatto medio e bilancio neutro          | ambivalente |   7    |

Nota una conseguenza della priorità 3: **l'impatto basso vince sul bilancio**.
Un membro nella fascia bassa è "marginale" anche se le sue poche opinioni sono
per lo più negative. Per scelta dell'algoritmo, in questa fascia il bilancio
non viene usato per distinguere ulteriormente lo status. È una priorità
operativa: «basso» è relativo alla distribuzione e non significa necessariamente
che il numero assoluto di opinioni sia trascurabile.

## 5 Riepilogo dei parametri

| Parametro                                                 | Valore                                                                                                          |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Metodi di soglia in competizione                          | Jenks, largest gap, head/tail, inverted head/tail, percentili, Tukey, robust z-score, binomiale, piccoli gruppi |
| Aggregazione tra i metodi                                 | classe con più voti tra i metodi che classificano il membro                                                     |
| Metodi che non dividono                                   | si astengono (non votano)                                                                                       |
| Metodi a una sola soglia                                  | votano solo la coda attiva; si astengono sugli altri membri                                                     |
| Parità nel voto                                           | non medio prevale su medio; basso prevale su alto                                                               |
| Votazione con meno di $4$ membri visibili                 | saltata: tutti restano a impatto medio                                                                          |
| Comitato minimo per $4 \le N \le 35$                      | almeno $2$ metodi ammessi in base alla numerosità                                                               |
| Membri visibili per percentili                            | $20 \le N \le 35$                                                                                               |
| Membri visibili per Jenks, head/tail e inverted head/tail | $7 \le N \le 35$                                                                                                |
| Membri visibili per Tukey e robust z-score                | $7 \le N \le 35$                                                                                                |
| Membri del gruppo per binomiale                           | $5 \le n \le 35$                                                                                                |
| Membri visibili per largest gap                           | $4 \le N \le 6$                                                                                                 |
| Membri visibili per piccoli gruppi                        | $4 \le N \le 6$                                                                                                 |
| Percentili per impatto basso / alto                       | $15$ / $85$                                                                                                     |
| Controllo di separazione                                  | coda disattivata se la soglia coincide col valore adiacente                                                     |
| Jenks: numero di classi                                   | $3$ (bassa, media, alta)                                                                                        |
| Jenks: goodness of variance fit minima                    | $GVF \ge 0{,}75$                                                                                                |
| Head/tail e inverted head/tail: quota massima             | $0{,}4$ (testa/coda sotto il $40\%$ dei valori)                                                                 |
| Tukey: "inner fences"                                     | $Q_1 - 1 \cdot IQR$ / $Q_3 + 1 \cdot IQR$                                                                       |
| Robust z-score: soglia                                    | $3{,}5$ (scala MAD $1{,}4826$, minimo MAD $0{,}5$)                                                              |
| Binomiale: livello di significatività                     | $\alpha = 0{,}05$ a due code ($0{,}025$ per coda)                                                               |
| Piccoli gruppi: salto minimo tra impatti                  | $2$ (gap minimo)                                                                                                |
| Rapporto soglia del bilancio, pochi dati                  | $2{,}0$ (per $n_i \le 3$)                                                                                       |
| Rapporto soglia del bilancio, molti dati                  | $1{,}5$ (per $n_i \ge 15$)                                                                                      |

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

- Un **bonus alto** ($bns_i$) può dipendere da molte preferenze ricevute,
  da posizioni iniziali nelle liste o da entrambe le cose.
- Un **malus alto** ($mls_i$) può dipendere da molti rifiuti ricevuti,
  da posizioni iniziali nelle liste o da entrambe le cose.

L'ordine è interpretabile come priorità solo se la consegna richiedeva
esplicitamente una graduazione: il programma pesa l'ordine registrato, ma non
può stabilire se rispecchi davvero un'intensità di preferenza o rifiuto.

Questi punteggi consentono un confronto descrittivo tra membri nello stesso
status, tenendo distinti numero e ordine delle nomine. Non definiscono da soli
una graduatoria sociale: bonus e malus possono entrambi essere alti e non vanno
ridotti automaticamente a un unico giudizio di posizione «favorevole».

Il **valore assoluto** di $bns_i$ e $mls_i$ **non ha di per sé alcun significato**:
non esiste una soglia oltre la quale un punteggio è "buono" o "cattivo", né un
valore da considerare normale o anormale. Il punteggio dipende infatti da quanti
membri scelgono o rifiutano il soggetto e dalla posizione che gli assegnano, e
per questo va usato **solo per confronti** — tra membri dello stesso gruppo,
tipicamente dentro la stessa categoria di status — e non come misura assoluta.

## 7 Un esempio svolto

### 7.1 Calcolo dello status sociometrico

Consideriamo un gruppo di **sette membri** che esprimono le proprie preferenze, in
ordine dalla prima all'ultima (per semplicità non ci sono rifiuti):

| Membro | Scelte (in ordine) |
| ------ | ------------------ |
| 1      | 2, 3, 4, 5, 6, 7   |
| 2      | 1, 3, 4, 5, 6, 7   |
| 3      | 1, 2, 4            |
| 4      | 1, 2               |
| 5      | 1, 2               |
| 6      | 1, 2               |
| 7      | 1, 2               |

Dalle nomine ricaviamo $rp$ (scelte ricevute), $gp$
(scelte espresse) e l'impatto $n_i = rp_i$ (non essendoci rifiuti, $rr = 0$):

| Membro | $rp$ | $gp$ | $n_i = rp_i$ |
| ------ | ---- | ---- | ------------ |
| 1      | 6    | 6    | 6            |
| 2      | 6    | 6    | 6            |
| 3      | 2    | 3    | 2            |
| 4      | 3    | 2    | 3            |
| 5      | 2    | 2    | 2            |
| 6      | 2    | 2    | 2            |
| 7      | 2    | 2    | 2            |

**Passo 1 — Visibilità.** Tutti hanno $n_i > 0$, quindi nessuno è isolato o
ignorato: tutti proseguono.

**Passo 2 — Impatto.** Gli impatti, ordinati, sono $[2, 2, 2, 2, 3, 6, 6]$ con
$N = n = 7$. Calcoliamo le soglie proposte dai nove metodi.

- **Jenks.** Le classi $[2, 2, 2, 2]$, $[3]$ e $[6, 6]$
  hanno varianza interna nulla: $SDCM = 0$, $SDAM = 150/7$ e
  $GVF = 1$. Le soglie sono $L = 2$ e $H = 6$.
- **Largest gap.** Con $N = 7 > 6$ il metodo non è ammesso e si astiene.
- **Head/tail.** La media è $23/7 \approx 3{,}286$. La testa $[6, 6]$
  contiene $2/7 < 0{,}4$ dei membri; alla successiva iterazione i valori sono
  uguali e non si producono altri tagli. Quindi $L = -\infty$ e $H = 6$.
- **Inverted head/tail.** Alla stessa media, la coda è $[2, 2, 2, 2, 3]$:
  contiene $5/7 \ge 0{,}4$ dei membri, quindi la ricorsione si arresta subito.
  Le soglie sono $L = 3$ e $H = +\infty$.
- **Percentili.** Con $N = 7 < 20$ il metodo non è ammesso e si astiene.
- **Tukey.** I quartili sono $Q_1 = 2$ e $Q_3 = 6$, quindi
  $IQR = 4$ e i recinti sono $-2$ e $10$. Nessun valore è
  strettamente oltre i recinti: **nessuna divisione**.
- **Robust z-score.** La mediana è $2$ e la MAD grezza è $0$, portata
  al minimo $0{,}5$. I recinti sono $2 \pm 2{,}59455$, cioè
  $-0{,}59455$ e $4{,}59455$. Solo i due $6$ superano il recinto alto:
  $L = -\infty$ e $H = 6$.
- **Binomiale.** Le opinioni totali sono $23$, quindi $p = 23/42$
  e $X \sim \text{Binomiale}(6;\ 23/42)$. Si ha
  $P(X \le 0) \approx 0{,}00857 \le 0{,}025$, mentre
  $P(X \le 1) \approx 0{,}07082 > 0{,}025$: quindi $L = 0$.
  Invece $P(X \ge 6) \approx 0{,}02697 > 0{,}025$: il lato alto è
  disattivato. La soglia bassa è finita, ma non classifica alcun membro
  visibile: su tutti e sette il metodo si astiene.
- **Piccoli gruppi.** Con $N = 7 > 6$ il metodo non è ammesso e si astiene.

Etichettando i sette membri in ordine di membro (basso/medio/alto) si ottiene:

| Metodo             | Etichette                                         |
| ------------------ | ------------------------------------------------- |
| Jenks              | $+1, +1, -1, 0, -1, -1, -1$                       |
| largest gap        | _si astiene_                                      |
| head/tail          | $+1, +1, \cdot, \cdot, \cdot, \cdot, \cdot$       |
| inverted head/tail | $\cdot, \cdot, -1, -1, -1, -1, -1$                |
| percentili         | _si astiene_                                      |
| Tukey              | _si astiene_                                      |
| robust z-score     | $+1, +1, \cdot, \cdot, \cdot, \cdot, \cdot$       |
| binomiale          | _si astiene_                                      |
| piccoli gruppi     | _si astiene_                                      |
| **Voto**           | **alto, alto, basso, basso, basso, basso, basso** |

Nella tabella, $\cdot$ indica un membro su cui il metodo si astiene (non vota).
I membri $1$ e $2$ ricevono tre voti per alto e nessun voto contrario.
I quattro membri con impatto $2$ ricevono due voti per basso (Jenks e
inverted head/tail). Il membro $4$ riceve un voto per medio da Jenks e
uno per basso da inverted head/tail: nello spareggio prevale **basso**.
Ne risulta:

- impatto basso: membri $3$, $4$, $5$, $6$, $7$;
- impatto alto: membri $1$ e $2$;
- nessun membro a impatto medio.

**Passo 3 — Bilancio.** Non ci sono rifiuti ($rr = 0$), quindi il bilancio è
sempre positivo.

**Passo 4 — Assegnazione.**

| Membro | Percorso        | Status    | Codice |
| ------ | --------------- | --------- | ------ |
| 1      | alto + positivo | popolare  | 4      |
| 2      | alto + positivo | popolare  | 4      |
| 3      | basso           | marginale | 2      |
| 4      | basso           | marginale | 2      |
| 5      | basso           | marginale | 2      |
| 6      | basso           | marginale | 2      |
| 7      | basso           | marginale | 2      |

I membri $1$ e $2$ finiscono entrambi nella categoria **popolare**:
ricevono lo stesso numero di scelte ($6$). Per distinguerli serve guardare
**all'ordine** delle nomine.

### 7.2 Calcolo del bonus/malus

Con $M = 35$, il contributo di una nomina al posto $p_j(i)$ è
$M - p_j(i) + 1$. Calcoliamo il bonus dei due membri **popolari**:

- **Membro 1.** È indicato per primo da tutti e sei i membri che lo
  scelgono: $bns_1 = 6 \cdot 35 = 210$.
- **Membro 2.** È indicato per primo solo dal membro $1$ e per secondo
  dagli altri cinque: $bns_2 = 35 + 5 \cdot 34 = 205$.

Non essendoci rifiuti, il malus è $0$ per tutti. Ripetendo per gli altri si
ottiene:

| Membro | Status    | $bns_i$ | $mls_i$ |
| ------ | --------- | ------- | ------- |
| 1      | popolare  | 210     | 0       |
| 2      | popolare  | 205     | 0       |
| 3      | marginale | 68      | 0       |
| 4      | marginale | 99      | 0       |
| 5      | marginale | 64      | 0       |
| 6      | marginale | 62      | 0       |
| 7      | marginale | 60      | 0       |

Il membro $1$ ha un bonus più alto del membro $2$ ($210$ contro $205$):
è stato scelto **prima** nelle sequenze altrui. A parità di conteggio e di
status, questa differenza riguarda l'ordine registrato, non il valore sociale
delle due persone.

## 8 Un secondo esempio: rifiuti e malus

### 8.1 Calcolo dello status sociometrico

Consideriamo un altro gruppo di **sette membri**, con soli rifiuti (nessuna scelta),
in ordine dal primo all'ultimo:

| Membro | Rifiuti (in ordine) |
| ------ | ------------------- |
| 1      | 4, 5, 2, 7          |
| 2      | 4, 5, 3             |
| 3      | 4, 5, 6             |
| 4      | 5, 1                |
| 5      | 4, 6                |
| 6      | 4, 5                |
| 7      | 4, 5                |

Dalle nomine ricaviamo $rr$ (rifiuti ricevuti), $gr$
(rifiuti espressi) e l'impatto $n_i = rr_i$ (non essendoci scelte, $rp = 0$):

| Membro | $rr$ | $gr$ | $n_i = rr_i$ |
| ------ | ---- | ---- | ------------ |
| 1      | 1    | 4    | 1            |
| 2      | 1    | 3    | 1            |
| 3      | 1    | 3    | 1            |
| 4      | 6    | 2    | 6            |
| 5      | 6    | 2    | 6            |
| 6      | 2    | 2    | 2            |
| 7      | 1    | 2    | 1            |

**Passo 1 — Visibilità.** Tutti hanno $n_i > 0$, quindi nessuno è isolato o
ignorato: tutti proseguono.

**Passo 2 — Impatto.** Gli impatti, ordinati, sono $[1, 1, 1, 1, 2, 6, 6]$ con
$N = n = 7$. Calcoliamo le soglie proposte dai nove metodi.

- **Jenks.** Le classi $[1, 1, 1, 1]$, $[2]$ e $[6, 6]$
  hanno varianza interna nulla: $SDCM = 0$, $SDAM = 236/7$ e
  $GVF = 1$. Le soglie sono $L = 1$ e $H = 6$.
- **Largest gap.** Con $N = 7 > 6$ il metodo non è ammesso e si astiene.
- **Head/tail.** La media è $18/7 \approx 2{,}571$. La testa $[6, 6]$
  contiene $2/7 < 0{,}4$ dei membri; alla successiva iterazione i valori sono
  uguali e non si producono altri tagli. Quindi $L = -\infty$ e $H = 6$.
- **Inverted head/tail.** Alla stessa media, la coda è $[1, 1, 1, 1, 2]$:
  contiene $5/7 \ge 0{,}4$ dei membri, quindi la ricorsione si arresta subito.
  Le soglie sono $L = 2$ e $H = +\infty$.
- **Percentili.** Con $N = 7 < 20$ il metodo non è ammesso e si astiene.
- **Tukey.** I quartili sono $Q_1 = 1$ e $Q_3 = 6$, quindi
  $IQR = 5$ e i recinti sono $-4$ e $11$. Nessun valore è
  strettamente oltre i recinti: **nessuna divisione**.
- **Robust z-score.** La mediana è $1$ e la MAD grezza è $0$, portata
  al minimo $0{,}5$. I recinti sono $1 \pm 2{,}59455$, cioè
  $-1{,}59455$ e $3{,}59455$. Solo i due $6$ superano il recinto alto:
  $L = -\infty$ e $H = 6$.
- **Binomiale.** Le opinioni totali sono $18$, quindi $p = 18/42 = 3/7$
  e $X \sim \text{Binomiale}(6;\ 3/7)$. Si ha
  $P(X \le 0) \approx 0{,}03482 > 0{,}025$: il lato basso è disattivato.
  Invece $P(X \ge 6) \approx 0{,}00620 \le 0{,}025$, mentre
  $P(X \ge 5) \approx 0{,}05577 > 0{,}025$: quindi $H = 6$.
- **Piccoli gruppi.** Con $N = 7 > 6$ il metodo non è ammesso e si astiene.

Etichettando i sette membri in ordine di membro (basso/medio/alto) si ottiene:

| Metodo             | Etichette                                         |
| ------------------ | ------------------------------------------------- |
| Jenks              | $-1, -1, -1, +1, +1, 0, -1$                       |
| largest gap        | _si astiene_                                      |
| head/tail          | $\cdot, \cdot, \cdot, +1, +1, \cdot, \cdot$       |
| inverted head/tail | $-1, -1, -1, \cdot, \cdot, -1, -1$                |
| percentili         | _si astiene_                                      |
| Tukey              | _si astiene_                                      |
| robust z-score     | $\cdot, \cdot, \cdot, +1, +1, \cdot, \cdot$       |
| binomiale          | $\cdot, \cdot, \cdot, +1, +1, \cdot, \cdot$       |
| piccoli gruppi     | _si astiene_                                      |
| **Voto**           | **basso, basso, basso, alto, alto, basso, basso** |

Nella tabella, $\cdot$ indica un membro su cui il metodo si astiene (non vota).
I membri $4$ e $5$ ricevono quattro voti per alto e nessun voto contrario.
I quattro membri con impatto $1$ ricevono due voti per basso (Jenks e
inverted head/tail). Il membro $6$ riceve un voto per medio da Jenks e
uno per basso da inverted head/tail: nello spareggio prevale **basso**.
Ne risulta:

- impatto basso: membri $1$, $2$, $3$, $6$, $7$;
- impatto alto: membri $4$ e $5$;
- nessun membro a impatto medio.

**Passo 3 — Bilancio.** Non ci sono scelte ($rp = 0$), quindi il bilancio è
sempre negativo.

**Passo 4 — Assegnazione.**

| Membro | Percorso        | Status    | Codice |
| ------ | --------------- | --------- | ------ |
| 1      | basso           | marginale | 2      |
| 2      | basso           | marginale | 2      |
| 3      | basso           | marginale | 2      |
| 4      | alto + negativo | rifiutato | 6      |
| 5      | alto + negativo | rifiutato | 6      |
| 6      | basso           | marginale | 2      |
| 7      | basso           | marginale | 2      |

I membri $4$ e $5$ finiscono entrambi nella categoria **rifiutato**:
ricevono lo stesso numero di rifiuti ($6$). Per distinguerli serve guardare
**all'ordine** delle nomine.

### 8.2 Calcolo del bonus/malus

Con $M = 35$, il contributo di una nomina al posto $p_j(i)$ è
$M - p_j(i) + 1$. Calcoliamo il malus dei due membri **rifiutati**:

- **Membro 4.** È indicato per primo da tutti e sei i membri che lo
  rifiutano: $mls_4 = 6 \cdot 35 = 210$.
- **Membro 5.** È indicato per primo solo dal membro $4$ e per secondo
  dagli altri cinque: $mls_5 = 35 + 5 \cdot 34 = 205$.

Non essendoci scelte, il bonus è $0$ per tutti. Ripetendo per gli altri si
ottiene:

| Membro | Status    | $bns_i$ | $mls_i$ |
| ------ | --------- | ------- | ------- |
| 1      | marginale | 0       | 34      |
| 2      | marginale | 0       | 33      |
| 3      | marginale | 0       | 33      |
| 4      | rifiutato | 0       | 210     |
| 5      | rifiutato | 0       | 205     |
| 6      | marginale | 0       | 67      |
| 7      | marginale | 0       | 32      |

Il membro $4$ ha un malus più alto del membro $5$ ($210$ contro $205$):
è stato rifiutato **prima** nelle sequenze altrui. A parità di conteggio e di
status, questa differenza riguarda l'ordine registrato, non misura da sola la
gravità del rifiuto o del disagio.
