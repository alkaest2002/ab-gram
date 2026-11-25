---
title: Status sociometrico
order: 7
---

<script setup>
    import { useSociogramStore } from "@/stores/sociogram";
    const store = useSociogramStore()
</script>

Lo **status sociometrico** ($ss_i$) descrive la posizione di un membro nel gruppo al momento della rilevazione. È una **categoria**, non un punteggio: dipende dal gruppo, dalla domanda posta e dalle risposte raccolte. Non è una diagnosi né una caratteristica stabile della persona.

Per interpretare lo status è utile distinguere due aspetti: l’**impatto** indica quante opinioni il membro ha ricevuto, contando insieme preferenze e rifiuti; il **bilancio** indica se prevalgono le preferenze, i rifiuti o nessuno dei due. Un impatto alto, quindi, non significa necessariamente che il membro sia apprezzato.

## 1 In sintesi: dalle risposte allo status

Una persona riceve quattro opinioni: sono tante o poche? Se quasi tutti gli altri ne ricevono una, quattro sembrano tante; se quasi tutti ne ricevono dieci, le stesse quattro sembrano poche. È questo confronto con il gruppo che ci interessa quando parliamo di **impatto**. Per ora non importa se le quattro opinioni sono preferenze o rifiuti.

Come si decide, allora, dove finisce un impatto basso e dove comincia uno medio o alto? Anziché affidarsi a una sola regola, il report usa **otto strategie di classificazione**. Possiamo pensarle come **otto votanti**: ciascuno legge gli stessi numeri secondo la propria regola e il report combina i loro voti per classificare l’impatto. Solo dopo si guarda al **bilancio**: di quelle quattro opinioni, quante sono scelte e quante rifiuti?

1. **Conteggio delle opinioni espresse e ricevute.** Se il membro non ne ha ricevuta nessuna, lo status è già definito: _isolato_ se non ne ha neppure espresse, _ignorato_ se ne ha espresse. Per chi ha ricevuto almeno una preferenza o un rifiuto, il calcolo prosegue.
2. **Classificazione dell’impatto.** Per ogni membro si sommano le preferenze e i rifiuti ricevuti. Tra gli otto votanti, uno guarda alla posizione del totale nella graduatoria del gruppo, un altro ai salti tra un conteggio e il successivo. Per ciascun membro, ogni votante può indicare un impatto **basso**, **medio** o **alto**, oppure astenersi.
3. **Classificazione del bilancio.** Si confrontano le preferenze e i rifiuti ricevuti. Il bilancio è **positivo** se prevalgono nettamente le preferenze, **negativo** se prevalgono nettamente i rifiuti e **neutro** se non emerge una prevalenza chiara. Neutro, quindi, non significa necessariamente che i due conteggi siano uguali.
4. **Incrocio tra impatto e bilancio.** Con un impatto **basso**, la categoria è sempre _marginale_. Con un impatto **medio**, un bilancio positivo corrisponde ad _apprezzato_, uno negativo a _malvisto_ e uno neutro ad _ambivalente_. Con un impatto **alto**, le tre categorie corrispondenti sono _popolare_, _rifiutato_ e _controverso_.
5. **Presentazione del risultato nel report.** La tabella seguente affianca a ogni categoria la dicitura che si legge nel report: per esempio, _rifiutato_ compare come _segnali di rifiuto_. Bonus e malus, descritti nel § 6, non modificano lo status.

## 2 Le categorie sociometriche

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

> **Il report descrive ciò che emerge dalle risposte, non la persona.** Per esempio, alla categoria tecnica _rifiutato_ corrisponde la dicitura _segnali di rifiuto_. Il risultato è lo stesso, ma la formulazione invita a interpretarlo nel contesto del gruppo e della rilevazione.

**Il codice numerico è un identificatore, non un punteggio.** I numeri da 0 a 8 sono
soltanto una convenzione per identificare le categorie: non indicano un ordine,
un punteggio o una gravità crescente. Due codici vicini non sono più simili tra
loro di due codici lontani; ciò che conta è esclusivamente la categoria a cui
il codice è associato.

La categoria dipende dal **livello di impatto** (basso, medio, alto) e dal **bilancio** (positivo, negativo, neutro). Le prime due righe sono un caso a parte: un membro che **non riceve alcuna opinione** è
classificato solo in base al fatto che ne abbia espresse (ignorato) o meno (isolato).

### 2.1 Gli otto metodi per classificare l'impatto

Tra i membri che hanno ricevuto almeno un’opinione, otto metodi cercano di distinguere chi ne ha ricevute poche o molte rispetto agli altri:

- **Percentili**: individua le due fasce estreme della graduatoria per numero di opinioni ricevute.
- **Largest gap**: divide la graduatoria nei punti in cui i due salti sono maggiori.
- **Robust z-score**: segnala i valori molto lontani dalla mediana rispetto alla dispersione tipica.
- **Jenks**: cerca tre gruppi con valori simili al loro interno.
- **Head/tail breaks**: usa medie successive per individuare gli impatti alti.
- **Inverted head/tail breaks**: applica lo stesso principio agli impatti bassi.
- **Tukey**: segnala i valori che superano i limiti calcolati dai quartili.
- **Piccoli gruppi**: con quattro membri visibili, cerca un salto netto che separi una minoranza dagli altri.

La classe di impatto deriva dal voto dei metodi che non si astengono (§ 4.2).

## 3 I dati in ingresso

L'algoritmo riceve quattro valori per ogni membro:

- $rp_i$: **preferenze ricevute**;
- $rr_i$: **rifiuti ricevuti**;
- $\mathrm{espressività}_i = gp_i + gr_i$: opinioni **espresse** in totale;
- $n_i = rp_i + rr_i$: **impatto**, cioè opinioni **ricevute** in totale.

> **Attenzione alla notazione.** In questa pagina $n_i$ indica l'impatto del
> singolo membro (quante opinioni ha ricevuto), **non** il numero di membri del
> gruppo. Con $N$ indichiamo invece il numero di
> membri **visibili**, cioè con $n_i > 0$.

## 4 L'algoritmo di assegnazione

L’assegnazione procede in quattro passi: si verifica la visibilità, si classifica l’impatto, si valuta il bilancio e si assegna la categoria. Non tutti i membri attraversano tutti i passi: per chi non ha ricevuto opinioni basta il primo.

### 4.1 Passo 1 — Visibilità: isolato e ignorato

Questo passo ha **la precedenza su tutto il resto**. Si guarda soltanto se il
membro ha ricevuto opinioni ($n_i > 0$) e se ne ha espresse
($\mathrm{espressività}_i > 0$):

- **isolato** (0): nessuna opinione ricevuta **e** nessuna espressa
  ($n_i = 0$ e $\mathrm{espressività}_i = 0$);
- **ignorato** (1): nessuna opinione ricevuta **ma** qualcuna espressa
  ($n_i = 0$ e $\mathrm{espressività}_i > 0$).

L’assenza di opinioni va interpretata con cautela: prima di trarne conclusioni sulle relazioni nel gruppo, occorre escludere mancate risposte o dati incompleti. Per chi ha ricevuto almeno un’opinione ($n_i > 0$), la classificazione prosegue al passo successivo.

### 4.2 Passo 2 — Classificazione dell'impatto

Le otto strategie non cercano tutte la stessa cosa. Una strategia **bilaterale** cerca sia gli impatti bassi sia quelli alti; una strategia **unilaterale** cerca una sola delle due fasce estreme (o _code_). Cercare una fascia non significa necessariamente trovarla: anche un metodo ammesso in base alla numerosità può astenersi.

Nelle schede che seguono, $N$ indica il numero di membri **visibili**, cioè di quanti hanno ricevuto almeno un’opinione. Tutti gli otto metodi confrontano soltanto gli impatti dei membri visibili. Le lettere $L$ e $H$ indicano rispettivamente la soglia bassa e quella alta.

Le schede spiegano **come si propongono** le soglie. Il § 4.2.9 descrive **come si controllano**; i §§ 4.2.10–4.2.11 spiegano come le soglie definitive diventano voti e come si decide la classe di ciascun membro.

#### 4.2.1 Metodo dei percentili

| Aspetto       | Descrizione                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------- |
| Numerosità    | $15 \le N \le 35$ membri visibili                                                                             |
| Comportamento | bilaterale: propone due code di pari numerosità nominale; possono restare attive entrambe, una sola o nessuna |
| Funzionamento | individuare le posizioni **relativamente basse e alte** nel gruppo                                            |

Sugli impatti visibili ordinati $x_0 \le \dots \le x_{N-1}$, si pone
$r = \lceil 0{,}15N \rceil$ e, prima del controllo di separazione:

| Lato  | Soglia proposta |
| ----- | --------------- |
| Basso | $L = x_{r-1}$   |
| Alto  | $H = x_{N-r}$   |

Il simbolo $\lceil\cdot\rceil$ indica l'arrotondamento all'intero superiore.
Il programma usa quindi il rango più vicino per la coda bassa e lo stesso
rango contato dall'alto per la coda alta, **senza interpolazione**. Non è la
stessa convenzione dei quartili dei gradi descritti nelle metriche di gruppo;
la soglia alta può inoltre differire dall'usuale percentile all'$85\%$
calcolato contando dal basso.

Le soglie individuano nominalmente il $15\%$
inferiore e superiore: con $N = 20$ corrispondono a tre persone per coda,
prima del controllo di separazione e degli effetti delle parità.

La scelta del $15$° e dell'$85$° percentile è **euristica**: descrive posizioni
relative, non rappresenta una soglia di significatività statistica e non
garantisce la presenza di gruppi nettamente separati né la stabilità delle
classificazioni rispetto a piccole variazioni nelle nomine.

Per i controlli comuni si veda il § 4.2.9; per l’applicazione delle soglie, il § 4.2.10.

#### 4.2.2 Metodo largest gap

| Aspetto       | Descrizione                                                                                                                                                                                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Numerosità    | $4 \le N \le 6$ membri visibili                                                                                                                                                                                                                                                                                                |
| Comportamento | bilaterale con due salti selezionati; se si usa un solo salto, può segnalare soltanto il lato meno numeroso. Anche con due salti proposti può restare una sola coda o nessuna                                                                                                                                                  |
| Funzionamento | dividere la distribuzione in corrispondenza dei **due salti più grandi** tra impatti consecutivi. Sugli impatti visibili ordinati $x_0 \le x_1 \le \dots \le x_{N-1}$ i salti sono $g_i = x_{i+1} - x_i$ per $i = 0, \dots, N-2$; i due salti più ampi individuano le due separazioni tra coda bassa, fascia media e coda alta |

**Come si risolvono le parità:**

| Situazione                                 | Decisione                                                                                             |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Due salti distinguibili dagli altri        | si usano entrambi, anche se hanno la stessa ampiezza. Le parità tra salti non selezionati non contano |
| Secondo e terzo salto di pari ampiezza     | si usa soltanto il salto massimo e si segnala il lato meno numeroso                                   |
| Nessuna scelta univoca nel caso precedente | se il massimo non è unico o separa due lati ugualmente numerosi, il metodo si astiene                 |

Per esempio, con impatti visibili $[1, 3, 5, 7, 9, 11]$ tutti i salti valgono
$2$ e il metodo si astiene. Si astiene anche con $[1, 3, 8, 10]$: il salto
massimo vale $5$, ma divide i quattro membri in due gruppi uguali. Con $[1, 5, 5, 9]$, invece, i due salti massimi di
ampiezza $4$ sono univocamente individuati: le soglie sono $L = 1$ e $H = 9$.

Con due salti, le soglie proposte sono

| Lato  | Soglia proposta                                    |
| ----- | -------------------------------------------------- |
| Basso | $L = x_{c_1}$, l'ultimo valore della coda bassa    |
| Alto  | $H = x_{c_2 + 1}$, il primo valore della coda alta |

dove $c_1 < c_2$ sono gli indici dei due salti più grandi.

#### 4.2.3 Metodo robust z-score

| Aspetto       | Descrizione                                                                                                                                                                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Numerosità    | $15 \le N \le 35$ membri visibili                                                                                                                                                                                                                                                                          |
| Comportamento | bilaterale: cerca anomalie in entrambe le direzioni; può segnalare una sola coda o nessuna                                                                                                                                                                                                                 |
| Funzionamento | un impatto è insolito se è lontano dalla **mediana** rispetto a quanto se ne discostano di solito gli altri impatti. Per misurare questo scostamento tipico si usa la **deviazione assoluta mediana** (MAD). Il criterio è poco sensibile ai valori estremi, ma non è sempre preferibile agli altri metodi |

Sia $m$ la mediana degli impatti dei membri visibili e sia
$MAD = \max\bigl(\text{mediana}(|x_i - m|),\ 0{,}5\bigr)$ (il minimo $0{,}5$
evita di dividere per zero quando i dati sono poco dispersi). Si definisce

$$
z_i = \frac{x_i - m}{1{,}4826 \cdot MAD}
$$

e si considerano anomali i valori con $|z_i| > 3{,}5$. I due **recinti** sono

| Lato  | Recinto                                    |
| ----- | ------------------------------------------ |
| Basso | $F_L = m - 3{,}5 \cdot 1{,}4826 \cdot MAD$ |
| Alto  | $F_H = m + 3{,}5 \cdot 1{,}4826 \cdot MAD$ |

Le **soglie effettive** sono invece i valori osservati più vicini
strettamente oltre i recinti:

$$
L = \max\{x_i : x_i < F_L\}, \qquad
H = \min\{x_i : x_i > F_H\}
$$

Se non ci sono valori sotto il recinto basso si pone $L = -\infty$; se non
ce ne sono sopra il recinto alto si pone $H = +\infty$.

#### 4.2.4 Metodo di Jenks

| Aspetto       | Descrizione                                                                                                                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Numerosità    | $7 \le N \le 35$ membri visibili                                                                                                                                                                                           |
| Comportamento | bilaterale: propone le due classi estreme; possono restare attive entrambe, una sola o nessuna                                                                                                                             |
| Funzionamento | individuare i **raggruppamenti naturali** della distribuzione: il criterio dei _natural breaks_ di Jenks riduce la variabilità all'interno dei gruppi per individuare le classi di impatto **basso**, **medio** e **alto** |

Sugli impatti dei membri visibili, ordinati $x_0 \le x_1 \le \dots \le x_{N-1}$,
si cercano i $k-1$ tagli che minimizzano la somma degli scarti quadratici dalle
medie dei rispettivi gruppi, detta $SDCM$. Si usa $k=5$ se ci sono almeno
cinque valori distinti, altrimenti $k=3$ se ce ne sono tre o quattro.
**Prima di unire i gruppi**, si misura la quota di variabilità spiegata dalla
suddivisione con l'indice **goodness of variance fit**:

$$
GVF = 1 - \frac{SDCM}{SDAM}
$$

dove $SDAM$ è la somma degli scarti quadratici dalla media complessiva degli impatti. Il metodo **si astiene** quando:

| Condizione di astensione    | Motivo                                                                         |
| --------------------------- | ------------------------------------------------------------------------------ |
| Meno di $3$ valori distinti | Non si possono formare tre classi                                              |
| $GVF < 0{,}75$              | La suddivisione spiega una quota insufficiente della variabilità degli impatti |

Se il partizionamento è accettato, si conservano solo il primo e l'ultimo
taglio. Con $k=5$, i gruppi $2$, $3$ e $4$ vengono uniti nella classe media;
con $k=3$, le classi restano quelle del partizionamento. Indicando con $i$ e
$j$ i due tagli conservati, la classe bassa va da $x_0$ a $x_{i-1}$, la media
da $x_i$ a $x_{j-1}$ e l'alta da $x_j$ a $x_{N-1}$.
Le soglie proposte sono allora

| Lato  | Soglia proposta                                                           |
| ----- | ------------------------------------------------------------------------- |
| Basso | $L = x_{i-1}$, cioè l'ultimo valore della **prima** classe (la più bassa) |
| Alto  | $H = x_{j}$, cioè il primo valore della **terza** classe (la più alta)    |

#### 4.2.5 Metodo head/tail breaks

| Aspetto       | Descrizione                                                                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Numerosità    | $7 \le N \le 35$ membri visibili                                                                                                                                                                                                            |
| Comportamento | unilaterale alto: può segnalare solo la testa finale, mai gli impatti bassi                                                                                                                                                                 |
| Funzionamento | nelle distribuzioni **a coda pesante** pochi valori molto alti si staccano nettamente dalla massa dei valori piccoli. Il metodo _head/tail breaks_ separa ricorsivamente la "testa" (la minoranza di valori grandi) dalla "coda" (il resto) |

**Come si procede:**

| Fase                  | Regola                                                                                                                                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Taglio                | Si calcola la media dei valori correnti: è il punto di taglio. La _testa_ comprende i valori **maggiori della media**                                                                                       |
| Arresto o ripetizione | Se la testa comprende almeno il $40\%$ dei valori del passo corrente, il metodo si ferma. Altrimenti ripete il calcolo solo sulla testa. Se tutti i valori rimasti sono uguali, non si eseguono altri tagli |

**Soglie proposte:**

| Lato  | Soglia proposta                                                                    |
| ----- | ---------------------------------------------------------------------------------- |
| Basso | $L = -\infty$: il lato basso non viene **mai** segnalato                           |
| Alto  | $H$ = il primo valore dell'**ultima** classe (la più alta), cioè la "testa" finale |

Se non produce alcun taglio (valori tutti uguali), il metodo si astiene.

#### 4.2.6 Metodo inverted head/tail breaks

| Aspetto       | Descrizione                                                                                                                                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Numerosità    | $7 \le N \le 35$ membri visibili                                                                                                                                                                                                                                               |
| Comportamento | unilaterale basso: può segnalare solo la coda finale, mai gli impatti alti                                                                                                                                                                                                     |
| Funzionamento | è l'immagine speculare del metodo _head/tail_: nelle distribuzioni con una **coda rada verso il basso**, pochi valori molto bassi si staccano nettamente dalla massa dei valori più alti. Il metodo separa ricorsivamente la "coda" (la minoranza di valori piccoli) dal resto |

**Come si procede:**

| Fase                  | Regola                                                                                                                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Taglio                | Si calcola la media dei valori correnti: è il punto di taglio. La _coda_ comprende i valori **minori della media**                                                                                        |
| Arresto o ripetizione | Se la coda comprende almeno il $40\%$ dei valori del passo corrente, il metodo si ferma. Altrimenti ripete il calcolo solo sulla coda. Se tutti i valori rimasti sono uguali, non si eseguono altri tagli |

**Soglie proposte:**

| Lato  | Soglia proposta                                                                |
| ----- | ------------------------------------------------------------------------------ |
| Basso | $L$ = il valore più alto della **coda finale** (l'ultima classe, la più bassa) |
| Alto  | $H = +\infty$: il lato alto non viene **mai** segnalato                        |

Se non produce alcun taglio (valori tutti uguali), il metodo si astiene.

#### 4.2.7 Metodo di Tukey

| Aspetto       | Descrizione                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Numerosità    | $15 \le N \le 35$ membri visibili                                                                                                                                                                                                                                                                                                                                                           |
| Comportamento | bilaterale: cerca valori oltre entrambi i recinti; può segnalare una sola coda o nessuna                                                                                                                                                                                                                                                                                                    |
| Funzionamento | una variante del criterio di Tukey per i **valori anomali**, basata sui quartili. Il programma usa un moltiplicatore $1$, non il consueto $1{,}5$ degli _inner fences_ del box plot. Sugli impatti visibili ordinati $x_0 \le \dots \le x_{N-1}$, si individuano i quartili contando lo stesso numero di posizioni dai due estremi. Si usano quindi valori osservati, senza interpolazione: |

$$
Q_1 = x_{\lceil 0{,}25N \rceil - 1}, \qquad
Q_3 = x_{N - \lceil 0{,}25N \rceil}
$$

Detto $IQR = Q_3 - Q_1$ lo scarto interquartile, i recinti usati sono

| Lato  | Recinto             |
| ----- | ------------------- |
| Basso | $Q_1 - 1 \cdot IQR$ |
| Alto  | $Q_3 + 1 \cdot IQR$ |

Il metodo si astiene se $IQR = 0$. Le soglie effettive sono il massimo valore osservato strettamente sotto il
recinto basso e il minimo valore strettamente sopra quello alto; un lato
senza valori oltre il recinto viene disattivato. Con moltiplicatore $1$ il
criterio è meno restrittivo della versione usuale con $1{,}5$.

#### 4.2.8 Metodo dei piccoli gruppi

| Aspetto       | Descrizione                                                                                                                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Numerosità    | $4 \le N \le 6$ membri visibili                                                                                                                                                                                               |
| Comportamento | unilaterale a direzione variabile: può segnalare il lato basso oppure quello alto, mai entrambi                                                                                                                               |
| Funzionamento | il metodo cerca il **salto più grande** tra impatti consecutivi. Se il salto è abbastanza ampio e separa due gruppi di dimensioni diverse, il metodo segnala **solo il gruppo meno numeroso** e si astiene sugli altri membri |

Sugli impatti visibili ordinati $x_0 \le x_1 \le \dots \le x_{N-1}$, i salti tra
valori consecutivi sono $g_i = x_i - x_{i-1}$ per $i = 1, \dots, N-1$. Siano
$g_{\max}$ il salto più grande e $g_2$ il secondo per grandezza; sia inoltre
$R = x_{N-1} - x_0$ l'escursione totale. Il metodo **si astiene** quando:

| Caso                 | Condizione di astensione                                      |
| -------------------- | ------------------------------------------------------------- |
| Impatti tutti uguali | $g_{\max} = 0$                                                |
| Salto troppo piccolo | $g_{\max} < 2$                                                |
| Salto non dominante  | $g_{\max} < 1{,}5 \cdot g_2$ **e** $g_{\max} < 0{,}5 \cdot R$ |

Se il salto è dominante, sia $k$ l'indice del valore **sopra** il salto massimo
(il salto è tra $x_{k-1}$ e $x_k$). Se più salti massimi hanno la stessa
ampiezza, viene scelto il **primo** nella sequenza ordinata, diversamente
dalla regola di astensione del metodo largest gap. Si segnala solo la coda
più piccola:

| Numerosità delle code                 | Esito                         |
| ------------------------------------- | ----------------------------- |
| Coda bassa più piccola                | $L = x_{k-1}$ e $H = +\infty$ |
| Coda alta più piccola                 | $L = -\infty$ e $H = x_k$     |
| Code uguali (2 contro 2 o 3 contro 3) | Il metodo si astiene          |

Per esempio, con $[1, 1, 1, 3]$ viene segnalato solo il $3$ come impatto alto e
il metodo si astiene sui tre $1$; con $[1, 3, 3, 3]$ viene segnalato solo l'$1$
come impatto basso e il metodo si astiene sui tre $3$.

#### 4.2.9 Controllo finale delle soglie proposte

Questo controllo si applica a tutti gli otto metodi.

1. **Non separare impatti uguali.** Se il confine proposto divide due membri con lo stesso impatto, si elimina la soglia corrispondente anziché spostarla. Si contano quindi i membri delle fasce rimaste. Se non resta alcuna soglia, il metodo si astiene.
2. **Verificare la numerosità della fascia media.** La fascia media deve contenere più membri di **ciascuna** coda attiva, non delle due code sommate. Per esempio, due membri nella fascia bassa, tre nella media e due nell’alta soddisfano il criterio. Se il criterio è rispettato, le soglie rimaste sono definitive.
3. **Valutare una fusione, se necessaria.** Se la verifica fallisce con una sola soglia attiva, il metodo si astiene. Con due soglie, prova a unire la fascia media a quella bassa oppure a quella alta. Una fusione è ammessa solo se la nuova fascia media è più numerosa della coda rimasta. Se entrambe sono ammesse, si sceglie quella che mantiene i valori più omogenei all’interno delle fasce (minor **costo di Ward**). Se i costi sono equivalenti o nessuna fusione è ammessa, il metodo si astiene.

Dopo una fusione resta una sola soglia: il metodo voterà soltanto per la coda che ha mantenuto, non per i membri della fascia accorpata.

#### 4.2.10 Applicazione delle soglie di ciascun metodo

Ogni metodo applica le **proprie** soglie ai membri con $n_i > 0$ (gli altri
sono già stati classificati al Passo 1):

- **impatto basso**: $n_i \le L$, se il lato basso è attivo ($L$ finito);
- **impatto alto**: $n_i \ge H$, se il lato alto è attivo ($H$ finito);
- **impatto medio**: $L < n_i < H$, ma solo quando **entrambe** le soglie sono
  finite. Se una sola soglia è attiva, il metodo **si astiene** per i membri
  che non rientrano nella coda corrispondente.

Le soglie sono **inclusive** ($\le$ e $\ge$): se più membri si trovano
esattamente su una soglia attiva, vengono tutti classificati dalla stessa
parte. Nel metodo dei percentili la quota nominale del $15\%$ può essere
superata per l'arrotondamento del numero di membri della coda; se invece una
parità attraversa il confine di rango scelto, il controllo di separazione
disattiva quella coda, anziché ampliarla. Se un membro risultasse sia basso
sia alto, prevale sempre "basso".

#### 4.2.11 La votazione tra i metodi

**Intuizione:** nessun metodo è sempre migliore degli altri. Per ogni membro,
ciascun metodo esprime un voto oppure si astiene. Prevale la classe con il
**maggior numero di voti espressi per quel membro**.

1. Ogni metodo etichetta con $-1$ (basso) i membri che ricadono nel lato basso
   attivo e con $+1$ (alto) quelli che ricadono nel lato alto attivo; etichetta
   con $0$ (medio) i membri compresi tra le due soglie **solo quando entrambe
   sono finite**. Sui membri che non classifica (perché il lato corrispondente è
   disattivato) il metodo **si astiene** e non esprime alcun voto. Se un valore
   soddisfa entrambe le condizioni, prevale "basso".
2. Per ogni numerosità supportata ($4 \le N \le 35$), almeno due metodi sono
   ammessi in base alla numerosità: con $N = 4$ sono largest gap e piccoli
   gruppi.
   Un metodo ammesso che **non individua alcuna divisione** ($L = -\infty$, $H = +\infty$) **si astiene del tutto**: non
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

### 4.3 Passo 3 — Classificazione del bilancio

Per classificare il bilancio non basta confrontare il numero di preferenze ($rp$)
con quello dei rifiuti ($rr$). Si usa un **rapporto di soglia variabile**:
quando un membro riceve poche opinioni, il criterio di prevalenza è più severo. La logica è: poche opinioni ricevute $\Rightarrow$ meno certezza
$\Rightarrow$ serve uno squilibrio più netto per parlare di prevalenza.

La soglia $t(n_i)$ dipende dall'impatto $n_i$:

$$
t(n_i) = 2 - 0{,}5 \cdot \frac{\max\bigl(0,\ \min(n_i - 3,\ 12)\bigr)}{12}
$$

In pratica:

- con $n_i \le 3$ la soglia vale $2{,}0$ (serve **più del doppio**);
- con $n_i \ge 15$ vale $1{,}5$ (criterio meno restrittivo);
- per i valori intermedi scende **linearmente** tra i due valori.

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

L'ultimo passo combina i risultati dei tre precedenti. Per ogni membro si
esaminano le condizioni nell'ordine indicato in tabella e si assegna la
categoria associata alla **prima condizione soddisfatta**.

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

| Parametro                                                 | Valore                                                                                                  |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Metodi di soglia in competizione                          | Jenks, largest gap, head/tail, inverted head/tail, percentili, Tukey, robust z-score, piccoli gruppi    |
| Aggregazione tra i metodi                                 | classe con più voti tra i metodi che classificano il membro                                             |
| Metodi che non dividono                                   | si astengono (non votano)                                                                               |
| Metodi a una sola soglia                                  | votano solo la coda attiva; si astengono sugli altri membri                                             |
| Parità nel voto                                           | basso e alto prevalgono su medio; basso prevale su alto                                                 |
| Votazione con meno di $4$ membri visibili                 | saltata: tutti restano a impatto medio                                                                  |
| Comitato minimo per $4 \le N \le 35$                      | almeno $2$ metodi ammessi in base alla numerosità                                                       |
| Membri visibili per percentili                            | $15 \le N \le 35$                                                                                       |
| Membri visibili per Jenks, head/tail e inverted head/tail | $7 \le N \le 35$                                                                                        |
| Membri visibili per Tukey e robust z-score                | $15 \le N \le 35$                                                                                       |
| Membri visibili per largest gap                           | $4 \le N \le 6$                                                                                         |
| Membri visibili per piccoli gruppi                        | $4 \le N \le 6$                                                                                         |
| Percentili per impatto basso / alto                       | $15$ / $85$                                                                                             |
| Controllo di separazione                                  | coda disattivata se la soglia coincide col valore adiacente                                             |
| Jenks: numero di gruppi iniziali                          | $5$ con almeno cinque valori distinti (si uniscono i gruppi 2–4); $3$ con tre o quattro valori distinti |
| Jenks: goodness of variance fit minima                    | $GVF \ge 0{,}75$                                                                                        |
| Head/tail e inverted head/tail: quota massima             | $0{,}4$ (testa/coda sotto il $40\%$ dei valori)                                                         |
| Tukey: "inner fences"                                     | $Q_1 - 1 \cdot IQR$ / $Q_3 + 1 \cdot IQR$                                                               |
| Robust z-score: soglia                                    | $3{,}5$ (scala MAD $1{,}4826$, minimo MAD $0{,}5$)                                                      |
| Piccoli gruppi: salto minimo tra impatti                  | $2$ (gap minimo)                                                                                        |
| Rapporto soglia del bilancio, pochi dati                  | $2{,}0$ (per $n_i \le 3$)                                                                               |
| Rapporto soglia del bilancio, molti dati                  | $1{,}5$ (per $n_i \ge 15$)                                                                              |

## 6 Bonus e malus: distinguere dentro lo stesso status

Lo status sociometrico raggruppa i membri in **nove categorie**, ma non dice
nulla sull'ordine tra due membri che ricadono nella **stessa** categoria. Per
questo si usano due punteggi complementari, il **bonus** ($bns_i$) e il **malus**
($mls_i$), che tengono conto **dell'ordine** con cui un membro viene scelto o
rifiutato, e non solo del numero di scelte e rifiuti ricevuti (cioè di $rp_i$ e
$rr_i$).

Per calcolare i due punteggi si assume che ciascun membro indichi **in ordine
di preferenza** le persone che sceglie e, in un elenco distinto, quelle che
rifiuta. Sia
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

L'ordine indica una priorità solo se la consegna chiedeva esplicitamente di
ordinare le scelte e i rifiuti. Il programma attribuisce un peso alla posizione
registrata, ma non può stabilire se rifletta l'intensità della preferenza o del rifiuto.

Questi punteggi consentono un confronto descrittivo tra membri nello stesso
status, tenendo distinti numero e ordine delle nomine. Non definiscono da soli
una graduatoria sociale: bonus e malus possono entrambi essere alti e non vanno
ridotti automaticamente a un unico giudizio di posizione «favorevole».

Il **valore assoluto** di $bns_i$ e $mls_i$ **non ha di per sé alcun significato**:
non esiste una soglia oltre la quale un punteggio è "buono" o "cattivo", né un
valore da considerare normale o anormale. Il punteggio dipende infatti da quanti
membri scelgono o rifiutano il soggetto e dalla posizione che gli assegnano, e
per questo va usato **solo per confronti** — tra membri dello stesso gruppo,
di norma all'interno della stessa categoria di status — e non come misura assoluta.

## 7 Un esempio svolto

### 7.1 Calcolo dello status sociometrico

In questo gruppo di **sette membri** non ci sono rifiuti. Ogni riga riporta
le scelte di un membro, dalla prima all'ultima:

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
$N = 7$. Calcoliamo le soglie proposte dagli otto metodi.

- **Jenks.** Ci sono solo tre valori distinti, quindi si usa $k=3$. Le classi $[2, 2, 2, 2]$, $[3]$ e $[6, 6]$
  hanno varianza interna nulla: $SDCM = 0$, $SDAM = 150/7$ e
  $GVF = 1$. Solo unendo la fascia media alla coda bassa si ottiene una maggioranza: cinque membri contro i due della coda alta. Restano quindi $L = -\infty$ e $H = 6$.
- **Largest gap.** Con $N = 7 > 6$ il metodo non è ammesso e si astiene.
- **Head/tail.** La media è $23/7 \approx 3{,}286$. La testa $[6, 6]$
  contiene $2/7 < 0{,}4$ dei membri; alla successiva iterazione i valori sono
  uguali e non si producono altri tagli. Quindi $L = -\infty$ e $H = 6$.
- **Inverted head/tail.** Alla stessa media, la coda è $[2, 2, 2, 2, 3]$:
  contiene $5/7 \ge 0{,}4$ dei membri, quindi la ricorsione si arresta subito.
  Restano solo due membri nella fascia media contro cinque nella coda bassa: il metodo si astiene.
- **Percentili.** Con $N = 7 < 15$ il metodo non è ammesso e si astiene.
- **Tukey e robust z-score.** Con soli sette membri visibili entrambi si astengono: ne servono almeno quindici.
- **Piccoli gruppi.** Con $N = 7 > 6$ il metodo non è ammesso e si astiene.

Etichettando i sette membri in ordine di membro (basso/medio/alto) si ottiene:

| Metodo             | Etichette                                         |
| ------------------ | ------------------------------------------------- |
| Jenks              | $+1, +1, \cdot, \cdot, \cdot, \cdot, \cdot$       |
| largest gap        | _si astiene_                                      |
| head/tail          | $+1, +1, \cdot, \cdot, \cdot, \cdot, \cdot$       |
| inverted head/tail | _si astiene_                                      |
| percentili         | _si astiene_                                      |
| Tukey              | _si astiene_                                      |
| robust z-score     | _si astiene_                                      |
| piccoli gruppi     | _si astiene_                                      |
| **Voto**           | **alto, alto, medio, medio, medio, medio, medio** |

Nella tabella, $\cdot$ indica un membro su cui il metodo si astiene (non vota).
I membri $1$ e $2$ ricevono ciascuno due voti per l’impatto alto: uno da Jenks e uno da head/tail. Gli altri cinque non ricevono voti e restano a impatto medio.

**Passo 3 — Bilancio.** Non ci sono rifiuti ($rr = 0$), quindi il bilancio è
sempre positivo.

**Passo 4 — Assegnazione.**

| Membro | Percorso         | Status     | Codice |
| ------ | ---------------- | ---------- | ------ |
| 1      | alto + positivo  | popolare   | 4      |
| 2      | alto + positivo  | popolare   | 4      |
| 3      | medio + positivo | apprezzato | 3      |
| 4      | medio + positivo | apprezzato | 3      |
| 5      | medio + positivo | apprezzato | 3      |
| 6      | medio + positivo | apprezzato | 3      |
| 7      | medio + positivo | apprezzato | 3      |

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

Poiché non ci sono rifiuti, il malus è $0$ per tutti. La tabella riporta i risultati per ciascun membro:

| Membro | Status     | $bns_i$ | $mls_i$ |
| ------ | ---------- | ------- | ------- |
| 1      | popolare   | 210     | 0       |
| 2      | popolare   | 205     | 0       |
| 3      | apprezzato | 68      | 0       |
| 4      | apprezzato | 99      | 0       |
| 5      | apprezzato | 64      | 0       |
| 6      | apprezzato | 62      | 0       |
| 7      | apprezzato | 60      | 0       |

Il membro $1$ ha un bonus più alto del membro $2$ ($210$ contro $205$):
compare più spesso **al primo posto** tra le scelte. A parità di status e di scelte ricevute,
la differenza di bonus riflette l'ordine delle nomine, non il valore sociale delle due persone.

## 8 Un secondo esempio: rifiuti e malus

### 8.1 Calcolo dello status sociometrico

In questo secondo gruppo di **sette membri** non ci sono scelte. Ogni riga riporta
i rifiuti espressi da un membro, dal primo all'ultimo:

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
$N = 7$. Calcoliamo le soglie proposte dagli otto metodi.

- **Jenks.** Ci sono solo tre valori distinti, quindi si usa $k=3$. Le classi $[1, 1, 1, 1]$, $[2]$ e $[6, 6]$
  hanno varianza interna nulla: $SDCM = 0$, $SDAM = 236/7$ e
  $GVF = 1$. Solo unendo la fascia media alla coda bassa si ottiene una maggioranza: cinque membri contro i due della coda alta. Restano quindi $L = -\infty$ e $H = 6$.
- **Largest gap.** Con $N = 7 > 6$ il metodo non è ammesso e si astiene.
- **Head/tail.** La media è $18/7 \approx 2{,}571$. La testa $[6, 6]$
  contiene $2/7 < 0{,}4$ dei membri; alla successiva iterazione i valori sono
  uguali e non si producono altri tagli. Quindi $L = -\infty$ e $H = 6$.
- **Inverted head/tail.** Alla stessa media, la coda è $[1, 1, 1, 1, 2]$:
  contiene $5/7 \ge 0{,}4$ dei membri, quindi la ricorsione si arresta subito.
  Restano solo due membri nella fascia media contro cinque nella coda bassa: il metodo si astiene.
- **Percentili.** Con $N = 7 < 15$ il metodo non è ammesso e si astiene.
- **Tukey e robust z-score.** Con soli sette membri visibili entrambi si astengono: ne servono almeno quindici.
- **Piccoli gruppi.** Con $N = 7 > 6$ il metodo non è ammesso e si astiene.

Etichettando i sette membri in ordine di membro (basso/medio/alto) si ottiene:

| Metodo             | Etichette                                         |
| ------------------ | ------------------------------------------------- |
| Jenks              | $\cdot, \cdot, \cdot, +1, +1, \cdot, \cdot$       |
| largest gap        | _si astiene_                                      |
| head/tail          | $\cdot, \cdot, \cdot, +1, +1, \cdot, \cdot$       |
| inverted head/tail | _si astiene_                                      |
| percentili         | _si astiene_                                      |
| Tukey              | _si astiene_                                      |
| robust z-score     | _si astiene_                                      |
| piccoli gruppi     | _si astiene_                                      |
| **Voto**           | **medio, medio, medio, alto, alto, medio, medio** |

Nella tabella, $\cdot$ indica un membro su cui il metodo si astiene (non vota).
I membri $4$ e $5$ ricevono ciascuno due voti per l’impatto alto: uno da Jenks e uno da head/tail. Gli altri cinque non ricevono voti e restano a impatto medio.

**Passo 3 — Bilancio.** Non ci sono scelte ($rp = 0$), quindi il bilancio è
sempre negativo.

**Passo 4 — Assegnazione.**

| Membro | Percorso         | Status    | Codice |
| ------ | ---------------- | --------- | ------ |
| 1      | medio + negativo | malvisto  | 5      |
| 2      | medio + negativo | malvisto  | 5      |
| 3      | medio + negativo | malvisto  | 5      |
| 4      | alto + negativo  | rifiutato | 6      |
| 5      | alto + negativo  | rifiutato | 6      |
| 6      | medio + negativo | malvisto  | 5      |
| 7      | medio + negativo | malvisto  | 5      |

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

Poiché non ci sono scelte, il bonus è $0$ per tutti. La tabella riporta i risultati per ciascun membro:

| Membro | Status    | $bns_i$ | $mls_i$ |
| ------ | --------- | ------- | ------- |
| 1      | malvisto  | 0       | 34      |
| 2      | malvisto  | 0       | 33      |
| 3      | malvisto  | 0       | 33      |
| 4      | rifiutato | 0       | 210     |
| 5      | rifiutato | 0       | 205     |
| 6      | malvisto  | 0       | 67      |
| 7      | malvisto  | 0       | 32      |

Il membro $4$ ha un malus più alto del membro $5$ ($210$ contro $205$):
compare più spesso **al primo posto** tra i rifiuti. A parità di status e di rifiuti ricevuti,
la differenza di malus riflette l'ordine delle nomine. Da sola non misura la gravità del rifiuto o del disagio.
