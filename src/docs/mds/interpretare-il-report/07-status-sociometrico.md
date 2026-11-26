---
title: Status sociometrico
order: 7
---

<script setup>
    import { useSociogramStore } from "@/stores/sociogram";
    const store = useSociogramStore()
</script>

Lo **status sociometrico** ($ss_i$) descrive la posizione di un membro nel gruppo al momento della rilevazione. È una **categoria**, non un punteggio: dipende dal gruppo, dalla domanda posta e dalle risposte raccolte. Non è una diagnosi né una caratteristica stabile della persona.

Per interpretare lo status è utile distinguere due aspetti: l’**impatto** indica quante opinioni il membro ha ricevuto, contando insieme scelte e rifiuti; il **bilancio** indica se prevalgono le scelte, i rifiuti o nessuno dei due.

## 1 Dalle risposte allo status

Facciamo un esempio: una persona riceve quattro opinioni. Sono tante o poche? Se quasi tutti gli altri ne ricevono una, quattro sembrano tante; se quasi tutti ne ricevono dieci, le stesse quattro sembrano poche. È questo confronto con il gruppo che ci interessa quando parliamo di **impatto**. Per ora non importa se le quattro opinioni siano scelte o rifiuti.

Come si decide, allora, dove finisce un impatto basso e dove comincia uno medio o alto? Il report dispone di **nove metodi**, ma ne usa solo alcuni, a seconda di quanti membri hanno ricevuto almeno un’opinione (i **membri visibili**). Per ciascuno di loro, ogni metodo applicabile può votare per un impatto basso, medio o alto, oppure astenersi. Solo dopo si guarda al **bilancio**: di quelle quattro opinioni, quante sono scelte e quante rifiuti?

Sintesi del procedimento:

1. **Conteggio delle opinioni.** Il primo passo è contare il numero di scelte/rifiuti espressi e ricevuti. Se un membro non è stato scelto/rifiutato dagli altri, il suo status è già definito: _isolato_ se lui stesso non ha espresso alcuna opinione, _ignorato_ se ne ha espresse. Invece, per chi ha ricevuto almeno una scelta o un rifiuto, il procedimento prosegue.
2. **Classificazione dell’impatto.** I metodi applicabili confrontano il totale delle opinioni ricevute da ciascun membro visibile con quelli degli altri membri visibili. Il report combina i voti per assegnare la fascia di impatto. Se nessun metodo vota per quel membro, il suo impatto è medio.
3. **Classificazione del bilancio.** Il bilancio è positivo se prevalgono nettamente le scelte, negativo se prevalgono nettamente i rifiuti, neutro negli altri casi. Non basta una maggioranza numerica: per esempio, con due scelte e un rifiuto il bilancio resta neutro.
4. **Incrocio tra impatto e bilancio.** Per i membri visibili, la tabella del §2 mostra quale status sociometrico corrisponde a ciascuna combinazione di impatto e bilancio.

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

Se vuoi interpretare una dicitura del report, puoi fermarti a questa tabella. Per capire come viene assegnato lo status, prosegui con il §3; per seguire il calcolo su un gruppo di sette membri, vai al §6.

## 3 I dati in ingresso

L'algoritmo di assegnazione dello status sociometrico riceve quattro valori per ogni membro:

- $rp_i$: **scelte ricevute**;
- $rr_i$: **rifiuti ricevuti**;
- $\mathrm{espressività}_i = gp_i + gr_i$: opinioni **espresse** in totale;
- $n_i = rp_i + rr_i$: **impatto**, cioè opinioni **ricevute** in totale.

> **Attenzione alla notazione.** In questa pagina $n_i$ indica l'impatto del
> singolo membro (quante opinioni ha ricevuto), **non** il numero di membri del
> gruppo. Con $N$ indichiamo invece il numero di
> membri **visibili**, cioè con $n_i > 0$.

## 4 L'algoritmo di assegnazione

L’assegnazione procede in quattro passi: si verifica la visibilità, si classifica l’impatto, si valuta il bilancio e si assegna la categoria. Non tutti i membri attraversano tutti i passi: per chi non ha ricevuto opinioni basta il primo.

### 4.1 Visibilità: isolato e ignorato

Questo passo ha **la precedenza su tutto il resto**. Si guarda soltanto se il
membro ha ricevuto opinioni ($n_i > 0$) e se ne ha espresse
($\mathrm{espressività}_i > 0$):

- **isolato**: $n_i = 0$ e $\mathrm{espressività}_i = 0$;
- **ignorato**: $n_i = 0$ e $\mathrm{espressività}_i > 0$.

L’assenza di opinioni va interpretata con cautela: prima di trarne conclusioni sulle relazioni nel gruppo, occorre escludere mancate risposte o dati incompleti.

Per chi ha ricevuto almeno un’opinione ($n_i > 0$), la classificazione prosegue al passo successivo.

### 4.2 Classificazione dell'impatto

#### 4.2.1 Classificare l'impatto

Il report confronta ogni membro che ha ricevuto almeno un'opinione con gli altri membri visibili, in base al numero di opinioni ricevute, e lo assegna a una delle tre fasce seguenti:

- **Impatto basso**: il membro ha ricevuto poche opinioni rispetto agli altri.
- **Impatto alto**: il membro ha ricevuto molte opinioni rispetto agli altri.
- **Impatto medio**: il numero di opinioni non rientra in nessuna delle due fasce estreme.

Le nove strategie si distinguono per il numero di membri visibili a cui si applicano:

- **4–6:** Largest gap, Majority Baseline e Small groups.
- **7–35:** Fisher-Jenks Natural Breaks, Head/Tail Breaks e Inverted Head/Tail Breaks.
- **15–35:** Percentili, Robust Z-Score e Tukey Fences.

La classificazione finale dell’impatto dipende dai voti espressi (§ 4.2.7).

#### 4.2.2 Classificazione per 4–6 membri visibili

##### 4.2.2.1 LARGEST GAP

<table class="mb-12 border-y border-neutral-300 [&_th]:px-2 [&_th]:py-1 [&_th]:font-normal">
  <tbody>
    <tr><th scope="row">Intuizione</th><td><ul><li>dividere la distribuzione in corrispondenza dei <strong>due salti più grandi</strong> tra impatti consecutivi. Sugli impatti visibili ordinati $x_0 \le x_1 \le \dots \le x_{N-1}$ i salti sono $g_i = x_{i+1} - x_i$ per $i = 0, \dots, N-2$; i due salti più ampi individuano le due separazioni tra coda bassa, fascia media e coda alta</li><li>bilaterale con due salti selezionati; se si usa un solo salto, può segnalare soltanto il lato meno numeroso. Anche con due salti proposti può restare una sola coda o nessuna</li></ul></td></tr>
    <tr><th scope="row">Calcolo</th><td><ul><li><strong>Due salti distinguibili dagli altri:</strong> si usano entrambi, anche se hanno la stessa ampiezza. Le parità tra salti non selezionati non contano.</li><li><strong>Secondo e terzo salto di pari ampiezza:</strong> si usa soltanto il salto massimo e si segnala il lato meno numeroso.</li><li><strong>Nessuna scelta univoca nel caso precedente:</strong> se il massimo non è unico o separa due lati ugualmente numerosi, il metodo si astiene.</li></ul></td></tr>
    <tr><th scope="row">Soglie</th><td><ul><li>Con due salti di indici $c_1 &lt; c_2$:<ul><li><strong>Basso:</strong> $L = x_{c_1}$, l'ultimo valore della coda bassa.</li><li><strong>Alto:</strong> $H = x_{c_2 + 1}$, il primo valore della coda alta.</li></ul></li></ul></td></tr>
    <tr><th scope="row">Astensione</th><td><ul><li>Quando i membri visibili sono meno di 4 o più di 6.</li></ul></td></tr>
    <tr><th scope="row">Note</th><td><ul><li><strong>Esempi:</strong> Per esempio, con impatti visibili $[1, 3, 5, 7, 9, 11]$ tutti i salti valgono $2$ e il metodo si astiene. Si astiene anche con $[1, 3, 8, 10]$: il salto massimo vale $5$, ma divide i quattro membri in due gruppi uguali. Con $[1, 5, 5, 9]$, invece, i due salti massimi di ampiezza $4$ sono univocamente individuati: le soglie sono $L = 1$ e $H = 9$.</li></ul></td></tr>
  </tbody>
</table>

##### 4.2.2.2 MAJORITY BASELINE

<table class="mb-12 border-y border-neutral-300 [&_th]:px-2 [&_th]:py-1 [&_th]:font-normal">
  <tbody>
    <tr><th scope="row">Intuizione</th><td><ul><li>Il riferimento è il punteggio di impatto condiviso da <strong>più della metà</strong> dei membri visibili.</li><li>Il metodo valuta separatamente la coda bassa e quella alta.</li></ul></td></tr>
    <tr><th scope="row">Calcolo</th><td><ul><li>Si confronta ogni punteggio con il riferimento: uno scarto di <strong>almeno due opinioni</strong> verso il basso o verso l’alto rende il punteggio candidato alla rispettiva coda.</li></ul></td></tr>
    <tr><th scope="row">Soglie</th><td><ul><li><strong>Bassa:</strong> $L$ è il maggiore dei punteggi candidati alla coda bassa.</li><li><strong>Alta:</strong> $H$ è il minore dei punteggi candidati alla coda alta.</li><li>Un lato senza candidati resta disattivato. Le soglie proposte passano al controllo comune (§ 4.2.5).</li></ul></td></tr>
    <tr><th scope="row">Astensione</th><td><ul><li>Il metodo si astiene se i membri visibili sono meno di 4 o più di 6, se manca una maggioranza stretta o se nessun punteggio si discosta dal riferimento di almeno due opinioni.</li></ul></td></tr>
    <tr><th scope="row">Note</th><td><ul><li><strong>Esempio:</strong> con impatti $[1, 3, 3, 3, 5]$, tre membri su cinque hanno impatto $3$. Le soglie $L = 1$ e $H = 5$ superano il controllo: la fascia media contiene tre membri, contro uno in ciascuna coda.</li></ul></td></tr>
  </tbody>
</table>

##### 4.2.2.3 SMALL GROUPS

<table class="mb-12 border-y border-neutral-300 [&_th]:px-2 [&_th]:py-1 [&_th]:font-normal">
  <tbody>
    <tr><th scope="row">Intuizione</th><td><ul><li>il metodo cerca il <strong>salto più grande</strong> tra impatti consecutivi. Se il salto soddisfa i criteri di ampiezza e dominanza, il metodo segnala solo il gruppo meno numeroso. A parità di numerosità, propone il gruppo a sinistra come basso e quello a destra come alto, senza fascia media</li><li>unilaterale se le code hanno numerosità diversa; bilaterale se hanno pari numerosità</li></ul></td></tr>
    <tr><th scope="row">Calcolo</th><td><ul><li>Sugli impatti visibili ordinati $x_0 \le x_1 \le \dots \le x_{N-1}$, i salti tra valori consecutivi sono $g_i = x_i - x_{i-1}$ per $i = 1, \dots, N-1$.</li><li>Siano $g_{\max}$ il salto più grande e $g_2$ il secondo per grandezza; sia inoltre $R = x_{N-1} - x_0$ l'escursione totale.</li><li>Se il salto è dominante, sia $k$ l'indice del valore <strong>sopra</strong> il salto massimo (il salto è tra $x_{k-1}$ e $x_k$).</li><li>Se più salti massimi hanno la stessa ampiezza, viene scelto il <strong>primo</strong> nella sequenza ordinata, diversamente dalla regola di astensione del metodo largest gap.</li></ul></td></tr>
    <tr><th scope="row">Soglie</th><td><ul><li><strong>Coda bassa più piccola:</strong> $L = x_{k-1}$ e $H = +\infty$.</li><li><strong>Coda alta più piccola:</strong> $L = -\infty$ e $H = x_k$.</li><li><strong>Code di pari numerosità:</strong> $L = x_{k-1}$ e $H = x_k$.</li></ul></td></tr>
    <tr><th scope="row">Astensione</th><td><ul><li>Quando i membri visibili sono meno di 4 o più di 6.</li></ul></td></tr>
    <tr><th scope="row">Note</th><td><ul><li><strong>Astensione:</strong> <strong>Impatti tutti uguali:</strong> $g_{\max} = 0$. <strong>Salto troppo piccolo:</strong> $g_{\max} &lt; 2$. <strong>Salto non dominante:</strong> $g_{\max} &lt; 1{,}5 \cdot g_2$ <strong>e</strong> $g_{\max} &lt; 0{,}5 \cdot R$.</li><li><strong>Esempi:</strong> Per esempio, con $[1, 1, 1, 3]$ viene segnalato solo il $3$ come impatto alto e il metodo si astiene sui tre $1$; con $[1, 3, 3, 3]$ viene segnalato solo l'$1$ come impatto basso e il metodo si astiene sui tre $3$. Con $[1, 1, 5, 5]$ il salto divide il gruppo in due metà: entrambi gli $1$ sono bassi ed entrambi i $5$ sono alti.</li></ul></td></tr>
  </tbody>
</table>

#### 4.2.3 Strategie per 7–35 membri visibili

##### 4.2.3.1 FISHER-JENKS NATURAL BREAKS

<table class="mb-12 border-y border-neutral-300 [&_th]:px-2 [&_th]:py-1 [&_th]:font-normal">
  <tbody>
    <tr><th scope="row">Intuizione</th><td><ul><li>individuare i <strong>raggruppamenti naturali</strong> della distribuzione: il criterio dei <em>natural breaks</em> di Jenks riduce la variabilità all'interno dei gruppi per individuare le classi di impatto <strong>basso</strong>, <strong>medio</strong> e <strong>alto</strong></li><li>bilaterale: propone le due classi estreme; possono restare attive entrambe, una sola o nessuna</li></ul></td></tr>
    <tr><th scope="row">Calcolo</th><td><ul><li>Sugli impatti dei membri visibili, ordinati $x_0 \le x_1 \le \dots \le x_{N-1}$, si cercano i $k-1$ tagli che minimizzano la somma degli scarti quadratici dalle medie dei rispettivi gruppi, detta $SDCM$.</li><li>Si usa $k=5$ se ci sono almeno cinque valori distinti, altrimenti $k=3$ se ce ne sono tre o quattro.</li><li><strong>Prima di unire i gruppi</strong>, si misura la quota di variabilità spiegata dalla suddivisione con l'indice <strong>goodness of variance fit</strong> $GVF = 1 - \frac{SDCM}{SDAM}$, dove $SDAM$ è la somma degli scarti quadratici dalla media complessiva degli impatti.</li></ul></td></tr>
    <tr><th scope="row">Soglie</th><td><ul><li><strong>Basso:</strong> $L = x_{i-1}$, cioè l'ultimo valore della <strong>prima</strong> classe (la più bassa).</li><li><strong>Alto:</strong> $H = x_{j}$, cioè il primo valore della <strong>terza</strong> classe (la più alta).</li></ul></td></tr>
    <tr><th scope="row">Astensione</th><td><ul><li>Quando i membri visibili sono meno di 7.</li></ul></td></tr>
    <tr><th scope="row">Note</th><td><ul><li><strong>Astensione:</strong> <strong>Meno di $3$ valori distinti:</strong> Non si possono formare tre classi. <strong>$GVF &lt; 0{,}75$:</strong> La suddivisione spiega una quota insufficiente della variabilità degli impatti.</li><li><strong>Classi:</strong> Se il partizionamento è accettato, si conservano solo il primo e l'ultimo taglio. Con $k=5$, i gruppi $2$, $3$ e $4$ vengono uniti nella classe media; con $k=3$, le classi restano quelle del partizionamento. Indicando con $i$ e $j$ i due tagli conservati, la classe bassa va da $x_0$ a $x_{i-1}$, la media da $x_i$ a $x_{j-1}$ e l'alta da $x_j$ a $x_{N-1}$.</li></ul></td></tr>
  </tbody>
</table>

##### 4.2.3.2 HEAD/TAIL BREAKS

<table class="mb-12 border-y border-neutral-300 [&_th]:px-2 [&_th]:py-1 [&_th]:font-normal">
  <tbody>
    <tr><th scope="row">Intuizione</th><td><ul><li>nelle distribuzioni <strong>a coda pesante</strong> pochi valori molto alti si staccano nettamente dalla massa dei valori piccoli. Il metodo <em>head/tail breaks</em> separa ricorsivamente la "testa" (la minoranza di valori grandi) dalla "coda" (il resto)</li><li>unilaterale alto: può segnalare solo la testa finale, mai gli impatti bassi</li></ul></td></tr>
    <tr><th scope="row">Calcolo</th><td><ul><li>Si calcola la media dei valori correnti: è il punto di taglio.</li><li>La <em>testa</em> comprende i valori <strong>maggiori della media</strong>.</li><li>Se la testa comprende almeno il $40\%$ dei valori del passo corrente, il metodo si ferma. Altrimenti ripete il calcolo solo sulla testa.</li><li>Se tutti i valori rimasti sono uguali, non si eseguono altri tagli.</li></ul></td></tr>
    <tr><th scope="row">Soglie</th><td><ul><li><strong>Basso:</strong> $L = -\infty$: il lato basso non viene <strong>mai</strong> segnalato.</li><li><strong>Alto:</strong> $H$ = il primo valore dell'<strong>ultima</strong> classe (la più alta), cioè la "testa" finale.</li></ul></td></tr>
    <tr><th scope="row">Astensione</th><td><ul><li>Quando i membri visibili sono meno di 7.</li></ul></td></tr>
    <tr><th scope="row">Note</th><td><ul><li><strong>Astensione:</strong> Se non produce alcun taglio (valori tutti uguali), il metodo si astiene.</li></ul></td></tr>
  </tbody>
</table>

##### 4.2.3.3 INVERTED HEAD/TAIL BREAKS

<table class="mb-12 border-y border-neutral-300 [&_th]:px-2 [&_th]:py-1 [&_th]:font-normal">
  <tbody>
    <tr><th scope="row">Intuizione</th><td><ul><li>è l'immagine speculare del metodo <em>head/tail</em>: nelle distribuzioni con una <strong>coda rada verso il basso</strong>, pochi valori molto bassi si staccano nettamente dalla massa dei valori più alti. Il metodo separa ricorsivamente la "coda" (la minoranza di valori piccoli) dal resto</li><li>unilaterale basso: può segnalare solo la coda finale, mai gli impatti alti</li></ul></td></tr>
    <tr><th scope="row">Calcolo</th><td><ul><li>Si calcola la media dei valori correnti: è il punto di taglio.</li><li>La <em>coda</em> comprende i valori <strong>minori della media</strong>.</li><li>Se la coda comprende almeno il $40\%$ dei valori del passo corrente, il metodo si ferma. Altrimenti ripete il calcolo solo sulla coda.</li><li>Se tutti i valori rimasti sono uguali, non si eseguono altri tagli.</li></ul></td></tr>
    <tr><th scope="row">Soglie</th><td><ul><li><strong>Basso:</strong> $L$ = il valore più alto della <strong>coda finale</strong> (l'ultima classe, la più bassa).</li><li><strong>Alto:</strong> $H = +\infty$: il lato alto non viene <strong>mai</strong> segnalato.</li></ul></td></tr>
    <tr><th scope="row">Astensione</th><td><ul><li>Quando i membri visibili sono meno di 7.</li></ul></td></tr>
    <tr><th scope="row">Note</th><td><ul><li><strong>Astensione:</strong> Se non produce alcun taglio (valori tutti uguali), il metodo si astiene.</li></ul></td></tr>
  </tbody>
</table>

#### 4.2.4 Strategie per 15–35 membri visibili

##### 4.2.4.1 PERCENTILI

<table class="mb-12 border-y border-neutral-300 [&_th]:px-2 [&_th]:py-1 [&_th]:font-normal">
  <tbody>
    <tr><th scope="row">Intuizione</th><td><ul><li>individuare le posizioni <strong>relativamente basse e alte</strong> nel gruppo</li><li>bilaterale: propone due code di pari numerosità nominale; possono restare attive entrambe, una sola o nessuna</li></ul></td></tr>
    <tr><th scope="row">Calcolo</th><td><ul><li>Sugli impatti visibili ordinati $x_0 \le \dots \le x_{N-1}$, si pone $r = \lceil 0{,}15N \rceil$. Il simbolo $\lceil\cdot\rceil$ indica l'arrotondamento all'intero superiore.</li><li>Il programma usa quindi il rango più vicino per la coda bassa e lo stesso rango contato dall'alto per la coda alta, <strong>senza interpolazione</strong>.</li><li>Non è la stessa convenzione dei quartili dei gradi descritti nelle metriche di gruppo; la soglia alta può inoltre differire dall'usuale percentile all'$85\%$ calcolato contando dal basso.</li></ul></td></tr>
    <tr><th scope="row">Soglie</th><td><ul><li><strong>Basso:</strong> $L = x_{r-1}$.</li><li><strong>Alto:</strong> $H = x_{N-r}$.</li></ul></td></tr>
    <tr><th scope="row">Astensione</th><td><ul><li>Quando i membri visibili sono meno di 15.</li></ul></td></tr>
    <tr><th scope="row">Note</th><td><ul><li><strong>Esempio:</strong> Le soglie individuano nominalmente il $15\%$ inferiore e superiore: con $N = 20$ corrispondono a tre persone per coda, prima del controllo di separazione e degli effetti delle parità.</li><li><strong>Limiti:</strong> La scelta del $15$° e dell'$85$° percentile è <strong>euristica</strong>: descrive posizioni relative, non rappresenta una soglia di significatività statistica e non garantisce la presenza di gruppi nettamente separati né la stabilità delle classificazioni rispetto a piccole variazioni nelle nomine.</li><li><strong>Riferimenti:</strong> Per i controlli comuni si veda il § 4.2.5; per l’applicazione delle soglie, il § 4.2.6.</li></ul></td></tr>
  </tbody>
</table>

##### 4.2.4.2 ROBUST Z-SCORE

<table class="mb-12 border-y border-neutral-300 [&_th]:px-2 [&_th]:py-1 [&_th]:font-normal">
  <tbody>
    <tr><th scope="row">Intuizione</th><td><ul><li>un impatto è insolito se è lontano dalla <strong>mediana</strong> rispetto a quanto se ne discostano di solito gli altri impatti. Per misurare questo scostamento tipico si usa la <strong>deviazione assoluta mediana</strong> (MAD). Il criterio è poco sensibile ai valori estremi, ma non è sempre preferibile agli altri metodi</li><li>bilaterale: cerca anomalie in entrambe le direzioni; può segnalare una sola coda o nessuna</li></ul></td></tr>
    <tr><th scope="row">Calcolo</th><td><ul><li>Calcolare la mediana $m$ degli impatti visibili e $MAD = \max\bigl(\text{mediana}(\lvert x_i-m\rvert),\ 0{,}5\bigr)$. Il minimo evita la divisione per zero.</li><li>Con $z_i = \frac{x_i-m}{1{,}4826\cdot MAD}$, sono anomali i valori con $\lvert z_i\rvert > 3{,}5$.</li><li>$F_L = m - 3{,}5 \cdot 1{,}4826 \cdot MAD$.</li><li>$F_H = m + 3{,}5 \cdot 1{,}4826 \cdot MAD$.</li></ul></td></tr>
    <tr><th scope="row">Soglie</th><td><ul><li><strong>Basso:</strong> $L = \max\{x_i : x_i &lt; F_L\}$. Se nessun valore soddisfa $x_i &lt; F_L$, si pone $L = -\infty$.</li><li><strong>Alto:</strong> $H = \min\{x_i : x_i > F_H\}$. Se nessun valore soddisfa $x_i > F_H$, si pone $H = +\infty$.</li></ul></td></tr>
    <tr><th scope="row">Astensione</th><td><ul><li>Quando i membri visibili sono meno di 15 o più di 35.</li></ul></td></tr>
  </tbody>
</table>

##### 4.2.4.3 TUKEY FENCES

<table class="mb-12 border-y border-neutral-300 [&_th]:px-2 [&_th]:py-1 [&_th]:font-normal">
  <tbody>
    <tr><th scope="row">Intuizione</th><td><ul><li>una variante del criterio di Tukey per i <strong>valori anomali</strong>, basata sui quartili. Il programma usa un moltiplicatore $1$, non il consueto $1{,}5$ degli <em>inner fences</em> del box plot. Sugli impatti visibili ordinati $x_0 \le \dots \le x_{N-1}$, si individuano i quartili contando lo stesso numero di posizioni dai due estremi. Si usano quindi valori osservati, senza interpolazione.</li><li>bilaterale: cerca valori oltre entrambi i recinti; può segnalare una sola coda o nessuna</li></ul></td></tr>
    <tr><th scope="row">Calcolo</th><td><ul><li>Calcolare $Q_1 = x_{\lceil 0{,}25N \rceil - 1}, Q_3 = x_{N - \lceil 0{,}25N \rceil}$.</li><li>Calcolare lo scarto interquartile $IQR = Q_3 - Q_1$.</li><li>$F_L = Q_1 - IQR$.</li><li>$F_H = Q_3 + IQR$.</li></ul></td></tr>
    <tr><th scope="row">Soglie</th><td><ul><li><strong>Basso:</strong> $L = \max\{x_i : x_i &lt; F_L\}$. Se nessun valore soddisfa $x_i &lt; F_L$, si pone $L = -\infty$.</li><li><strong>Alto:</strong> $H = \min\{x_i : x_i > F_H\}$. Se nessun valore soddisfa $x_i > F_H$, si pone $H = +\infty$.</li></ul></td></tr>
    <tr><th scope="row">Astensione</th><td><ul><li>Quando i membri visibili sono meno di 15 o più di 35, oppure quando $IQR = 0$.</li></ul></td></tr>
    <tr><th scope="row">Note</th><td><ul><li><strong>Confronto:</strong> Con moltiplicatore $1$ il criterio è meno restrittivo della versione usuale con $1{,}5$.</li></ul></td></tr>
  </tbody>
</table>

#### 4.2.5 Controllo finale delle soglie proposte

Questo controllo si applica a tutti i nove metodi.

1. **Non separare impatti uguali.** Se il confine proposto divide due membri con lo stesso impatto, si elimina la soglia corrispondente anziché spostarla. Si contano quindi i membri delle fasce rimaste. Se non resta alcuna soglia, il metodo si astiene.
2. **Verificare la numerosità della fascia media.** La fascia media deve contenere più membri di **ciascuna** coda attiva, non delle due code sommate. Per esempio, due membri nella fascia bassa, tre nella media e due nell’alta soddisfano il criterio. Se il criterio è rispettato, le soglie rimaste sono definitive.
3. **Valutare una fusione, se necessaria.** Se la verifica fallisce con una sola soglia attiva, il metodo si astiene. Con due soglie, prova a unire la fascia media a quella bassa oppure a quella alta. Una fusione è ammessa solo se la nuova fascia media è più numerosa della coda rimasta. Se entrambe sono ammesse, si sceglie quella che mantiene i valori più omogenei all’interno delle fasce (minor **costo di Ward**). Se i costi sono equivalenti o nessuna fusione è ammessa, il metodo si astiene.

Dopo una fusione resta una sola soglia: il metodo voterà soltanto per la coda che ha mantenuto, non per i membri della fascia accorpata.

#### 4.2.6 Applicazione delle soglie di ciascun metodo

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

#### 4.2.7 La votazione tra i metodi

**Intuizione:** nessun metodo è sempre migliore degli altri. Per ogni membro,
ciascun metodo esprime un voto oppure si astiene. Prevale la classe con il
**maggior numero di voti espressi per quel membro**.

1. Ogni metodo etichetta con $-1$ (basso) i membri che ricadono nel lato basso
   attivo e con $+1$ (alto) quelli che ricadono nel lato alto attivo; etichetta
   con $0$ (medio) i membri compresi tra le due soglie **solo quando entrambe
   sono finite**. Sui membri che non classifica (perché il lato corrispondente è
   disattivato) il metodo **si astiene** e non esprime alcun voto. Se un valore
   soddisfa entrambe le condizioni, prevale "basso".
2. Per ogni numerosità supportata ($4 \le N \le 35$), almeno tre metodi sono
   ammessi in base alla numerosità: con $N = 4$ sono largest gap, `majorityBaselineStrategy` e
   small groups.
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

### 4.3 Classificazione del bilancio

Per classificare il bilancio non basta confrontare il numero di scelte ($rp$)
con quello dei rifiuti ($rr$). Si usa un **rapporto di soglia variabile**:
quando un membro riceve poche opinioni, il criterio di prevalenza è più severo. La logica è: poche opinioni ricevute $\Rightarrow$ meno certezza
$\Rightarrow$ serve uno squilibrio più netto per parlare di prevalenza.

La soglia $t(n_i)$ dipende dall'impatto $n_i$:

$$
t(n_i) = 2 - 0{,}5 \cdot \frac{\max\bigl(0,\ \min(n_i - 3,\ 12)\bigr)}{12}
$$

In pratica:

- con $n_i \le 3$ la soglia vale $2{,}0$ (serve **più del doppio**);
- dalla quarta alla quindicesima opinione, la soglia scende ogni volta dello stesso passo: il calo complessivo di $0{,}5$ è ripartito sulle **12 opinioni aggiuntive** che portano il totale da 3 a 15. A 9 opinioni la soglia è $1{,}75$; a 12 è ancora $1{,}625$;
- a 15 opinioni la soglia raggiunge $1{,}5$ e resta a quel valore anche se il totale aumenta.

Per esempio, con 2 scelte e 1 rifiuto il bilancio è **neutro**: le scelte sono esattamente il doppio dei rifiuti, ma devono essere _più_ del doppio. Con 6 scelte e 3 rifiuti la proporzione è identica, ma le opinioni sono 9: il rapporto di 2 supera la soglia di $1{,}75$ e il bilancio è **positivo**.

A questo punto il bilancio è:

- **positivo** se $rp_i > t(n_i) \cdot rr_i$;
- **negativo** se $rr_i > t(n_i) \cdot rp_i$;
- **neutro** in tutti gli altri casi.

Questa classe di bilancio non è il semplice segno dell'indice $bl_i = rp_i - rr_i$:
può risultare neutra anche se i due conteggi sono diversi. È una regola
operativa, non un test di significatività.

Per i membri visibili, due conseguenze utili da ricordare: chi riceve solo scelte ($rr_i = 0$) ha
sempre bilancio positivo, e viceversa per chi riceve solo rifiuti; il bilancio
neutro compare solo quando scelte e rifiuti sono abbastanza vicini da non
superare la soglia.

### 4.4 Assegnazione finale: l'albero di decisione

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

## 5 Bonus e malus: distinguere dentro lo stesso status

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

- Un **bonus alto** ($bns_i$) può dipendere da molte scelte ricevute,
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

## 6 Un esempio svolto

### 6.1 Calcolo dello status sociometrico

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
$N = 7$. Calcoliamo le soglie proposte dai nove metodi.

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
- **`majorityBaselineStrategy` e Small groups.** Entrambi si applicano solo con 4–6 membri visibili: con $N = 7$ si astengono.

Etichettando i sette membri in ordine di membro (basso/medio/alto) si ottiene:

| Metodo                     | Etichette                                         |
| -------------------------- | ------------------------------------------------- |
| Jenks                      | $+1, +1, \cdot, \cdot, \cdot, \cdot, \cdot$       |
| Largest gap                | _si astiene_                                      |
| Head/tail                  | $+1, +1, \cdot, \cdot, \cdot, \cdot, \cdot$       |
| Inverted head/tail         | _si astiene_                                      |
| Percentili                 | _si astiene_                                      |
| Tukey                      | _si astiene_                                      |
| Robust z-score             | _si astiene_                                      |
| `majorityBaselineStrategy` | _si astiene_                                      |
| Small groups               | _si astiene_                                      |
| **Voto**                   | **alto, alto, medio, medio, medio, medio, medio** |

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

### 6.2 Calcolo del bonus/malus

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

## 7 Un secondo esempio: rifiuti e malus

### 7.1 Calcolo dello status sociometrico

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
$N = 7$. Calcoliamo le soglie proposte dai nove metodi.

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
- **`majorityBaselineStrategy` e Small groups.** Entrambi si applicano solo con 4–6 membri visibili: con $N = 7$ si astengono.

Etichettando i sette membri in ordine di membro (basso/medio/alto) si ottiene:

| Metodo                     | Etichette                                         |
| -------------------------- | ------------------------------------------------- |
| Jenks                      | $\cdot, \cdot, \cdot, +1, +1, \cdot, \cdot$       |
| largest gap                | _si astiene_                                      |
| head/tail                  | $\cdot, \cdot, \cdot, +1, +1, \cdot, \cdot$       |
| inverted head/tail         | _si astiene_                                      |
| percentili                 | _si astiene_                                      |
| Tukey                      | _si astiene_                                      |
| robust z-score             | _si astiene_                                      |
| `majorityBaselineStrategy` | _si astiene_                                      |
| small groups               | _si astiene_                                      |
| **Voto**                   | **medio, medio, medio, alto, alto, medio, medio** |

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

### 7.2 Calcolo del bonus/malus

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
