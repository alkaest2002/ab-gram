---
title: Metriche individuali
order: 5
description: Le misure che descrivono il ruolo di ogni singolo membro.
---

Le metriche individuali descrivono **la posizione di ciascun membro nel
gruppo**: chi è al centro dell'attenzione, chi è isolato, chi fa da ponte tra
gli altri. Si dividono in due famiglie:

- gli **indici di Moreno**, che contano in modo semplice le scelte e i rifiuti
  dati e ricevuti da ogni persona;
- le **centralità della social network analysis (SNA)**, cioè dell'"analisi
  delle reti sociali", che misurano quanto una persona è importante nella rete
  di relazioni, tenendo conto anche dei legami indiretti.

In tutte le formule, $n$ è il **numero di membri** del gruppo e $i$ indica il
membro di cui stiamo calcolando la metrica.

## Indici di Moreno

Gli indici di Moreno (dal nome dello psicologo Jacob Moreno, ideatore del
sociogramma) si ricavano da semplici somme sulle righe e sulle colonne delle
tabelle che registrano le relazioni, dette *matrici di adiacenza*:

- $a_{ij} = 1$ se il membro $i$ **sceglie** il membro $j$, altrimenti $0$;
- $d_{ij} = 1$ se il membro $i$ **rifiuta** il membro $j$, altrimenti $0$.

Per orientarsi nelle formule, basta ricordare che:

- il simbolo $\sum_{j}$ significa "somma su tutti gli altri membri $j$";
- sommare lungo **una riga** ($a_{ij}$, con $i$ fisso) conta ciò che il membro
  $i$ **esprime**; sommare lungo **una colonna** ($a_{ji}$, con $i$ fisso) conta
  ciò che il membro $i$ **riceve**;
- il prodotto $a_{ij} a_{ji}$ vale $1$ solo se $i$ sceglie $j$ **e** $j$ sceglie
  $i$, cioè se la scelta è **reciproca**.

### Scelte ricevute e date

Sono i conteggi di base: quante opinioni, positive e negative, un membro riceve
dagli altri e quante ne esprime verso gli altri.

- **Scelte ricevute positive** ($rp_i$): quante preferenze ha ricevuto il
  membro $i$. Più è alto, più il membro è scelto dai compagni.

$$
rp_i = \sum_{j} a_{ji}
$$

- **Scelte ricevute negative** ($rr_i$): quanti rifiuti ha ricevuto.

$$
rr_i = \sum_{j} d_{ji}
$$

- **Scelte date positive** ($gp_i$): quante preferenze ha espresso.

$$
gp_i = \sum_{j} a_{ij}
$$

- **Scelte date negative** ($gr_i$): quanti rifiuti ha espresso.

$$
gr_i = \sum_{j} d_{ij}
$$

### Scelte reciproche

Contano i casi in cui il sentimento espresso dal membro viene ricambiato.

- **Reciprocità positiva** ($mp_i$): quante preferenze del membro sono
  ricambiate, cioè con quante persone c'è una scelta a vicenda.

$$
mp_i = \sum_{j} a_{ij} a_{ji}
$$

- **Reciprocità negativa** ($mr_i$): quanti rifiuti del membro sono ricambiati,
  cioè con quante persone c'è un rifiuto a vicenda.

$$
mr_i = \sum_{j} d_{ij} d_{ji}
$$

### Indici derivati

Si ottengono combinando i conteggi precedenti con somme e differenze, per
rispondere a domande più specifiche.

- **Impatto** ($im_i$): quante opinioni ha ricevuto in totale, positive e
  negative. Dice **quanto il membro è "visibile"** agli occhi degli altri,
  indipendentemente dal fatto che l'opinione sia buona o cattiva.

$$
im_i = rp_i + rr_i
$$

- **Bilancio** ($bl_i$): la differenza tra preferenze e rifiuti ricevuti. È
  positivo se il membro è più apprezzato che rifiutato, negativo nel caso
  opposto.

$$
bl_i = rp_i - rr_i
$$

- **Espressività** ($ei_i$): quante opinioni ha espresso in totale. Dice **quanto
  il membro si "sbilancia"** verso gli altri.

$$
ei_i = gp_i + gr_i
$$

- **Orientamento** ($or_i$): la differenza tra preferenze e rifiuti espressi. È
  positivo se il membro tende a scegliere più che a rifiutare, negativo se
  accade il contrario.

$$
or_i = gp_i - gr_i
$$

- **Affiliazione** ($ai_i$): somma di bilancio e orientamento. Unisce in un solo
  numero quanto il membro è ben accolto dagli altri e quanto è lui stesso
  disposto ad accogliere.

$$
ai_i = bl_i + or_i
$$

- **Influenza** ($ii_i$): preferenze ricevute più preferenze reciproche. Le
  scelte ricambiate "pesano" quindi il doppio, perché indicano un legame solido.

$$
ii_i = rp_i + mp_i
$$

### Status sociometrico

Lo **stato sociometrico** ($ss_i$) è una vera e propria etichetta: classifica
ogni membro in una di **nove categorie**, combinando due informazioni già viste,
l'impatto ricevuto (quanto il membro è visibile) e il bilancio tra preferenze e
rifiuti (se prevalgono gli uni o le altre). Le categorie, con il relativo
codice, sono:

| Codice | Categoria |
| :----: | --------- |
| 0 | isolato |
| 1 | ignorato |
| 2 | marginale |
| 3 | apprezzato |
| 4 | popolare |
| 5 | malvisto |
| 6 | rifiutato |
| 7 | ambivalente |
| 8 | controverso |

In generale, le categorie vanno da chi non riceve alcuna opinione (isolato) a
chi ne riceve molte e discordanti (controverso), passando per situazioni in cui
prevale poca attenzione (ignorato, marginale), il consenso (apprezzato,
popolare) oppure il rifiuto (malvisto, rifiutato).

La regola che assegna il codice è più complessa delle formule viste finora,
perché procede in più passaggi successivi: ogni passaggio è matematicamente
semplice, ma nel loro insieme sono troppi per essere riassunti in una formula
leggibile. Per questo motivo la formula viene riportata nel <RouterLink to="/docs/interpretare-il-report/06-status-sociometrico">documento successivo</RouterLink>.

### Un esempio svolto

Immaginiamo un gruppo di quattro membri, con le seguenti matrici delle scelte
($A$) e dei rifiuti ($D$):

$$
A =
\begin{pmatrix}
0 & 1 & 1 & 0 \\\\
1 & 0 & 0 & 1 \\\\
0 & 1 & 0 & 1 \\\\
1 & 0 & 0 & 0
\end{pmatrix}
\qquad
D =
\begin{pmatrix}
0 & 0 & 1 & 0 \\\\
1 & 0 & 0 & 0 \\\\
0 & 0 & 0 & 1 \\\\
0 & 1 & 0 & 0
\end{pmatrix}
$$

Prendiamo il membro $1$. Le sue **scelte ricevute** si leggono sulla *colonna 1*
di $A$: lo scelgono il membro $2$ e il membro $4$, quindi $rp_1 = 2$. Le sue
**scelte date** si leggono sulla *riga 1*: sceglie il $2$ e il $3$, quindi
$gp_1 = 2$. Ripetendo il conteggio per tutti si ottiene:

| Metrica | Membro 1 | Membro 2 | Membro 3 | Membro 4 |
| ------- | :------: | :------: | :------: | :------: |
| Scelte ricevute positive ($rp$) | 2 | 2 | 1 | 2 |
| Scelte ricevute negative ($rr$) | 1 | 1 | 1 | 1 |
| Scelte date positive ($gp$) | 2 | 2 | 2 | 1 |
| Scelte date negative ($gr$) | 1 | 1 | 1 | 1 |
| Reciprocità positiva ($mp$) | 1 | 1 | 0 | 0 |
| Reciprocità negativa ($mr$) | 0 | 0 | 0 | 0 |
| Impatto ($im$) | 3 | 3 | 2 | 3 |
| Bilancio ($bl$) | 1 | 1 | 0 | 1 |
| Espressività ($ei$) | 3 | 3 | 3 | 2 |
| Orientamento ($or$) | 1 | 1 | 1 | 0 |
| Affiliazione ($ai$) | 2 | 2 | 1 | 1 |
| Influenza ($ii$) | 3 | 3 | 1 | 2 |

I membri $1$ e $2$ risultano i più coinvolti: sono gli unici ad avere una scelta
reciproca (si scelgono tra loro) e hanno i valori più alti di affiliazione e
influenza. Il membro $3$ è invece il meno scelto e con il bilancio più basso.

## Centralità SNA

Le centralità misurano **quanto un nodo è importante nella rete del gruppo**.
In questo contesto la rete è un **grafo diretto**: ogni membro è un *nodo* (un
punto) e ogni scelta è una *freccia* che va da chi sceglie a chi è scelto.
Esistono molti modi di definire l'"importanza", e ogni centralità ne misura uno
diverso: chi ha più legami, chi è più vicino a tutti, chi fa da ponte, chi è
scelto da persone a loro volta importanti.

Un'avvertenza sulla notazione: in questa sezione $d(i)$ e $d(i,j)$ (con le
parentesi) indicano rispettivamente il **numero di legami** di un nodo e la
**distanza** tra due nodi, e non vanno confusi con $d_{ij}$ (senza parentesi),
che nella sezione precedente indicava il rifiuto.

### Grado

La **centralità di grado** conta quanti legami ha il membro, rapportati al
numero massimo possibile ($n-1$, cioè tutti gli altri membri). È la misura più
intuitiva di "popolarità": vale $1$ se il membro è collegato a tutti.

$$
C_D(i) = \frac{d(i)}{n - 1}
$$

Si può calcolare separatamente per i legami **ricevuti** (entranti, $d_{\text{in}}$:
le frecce che arrivano al membro) e per quelli **espressi** (uscenti,
$d_{\text{out}}$: le frecce che partono dal membro):

$$
C_D^{\text{in}}(i) = \frac{d_{\text{in}}(i)}{n - 1}, \qquad C_D^{\text{out}}(i) = \frac{d_{\text{out}}(i)}{n - 1}
$$

### Vicinanza

La **centralità di vicinanza** misura quanto il membro è **vicino** agli altri,
cioè quanti pochi "passaggi" servono in media per raggiungerli seguendo le
frecce. Nella formula, $R_i$ è l'insieme dei membri **raggiungibili** da $i$,
$|R_i|$ ne è il numero e $d(i,j)$ è la lunghezza del percorso più breve da $i$ a
$j$ (cioè il numero minimo di frecce da seguire). Più il valore è alto, più il
membro è "a portata di mano" di tutti gli altri.

$$
C_C(i) = \frac{|R_i|}{\sum_{j \in R_i} d(i,j)}
$$

### Intermediazione

La **centralità di intermediazione** misura quanto il membro **fa da ponte**:
quante volte si trova sulla strada più breve tra due altri membri. Chi ha
un valore alto controlla in qualche modo il passaggio delle informazioni nel
gruppo. Nella formula, $\sigma_{st}$ è il numero di percorsi più brevi da $s$ a
$t$, e $\sigma_{st}(i)$ è il numero di quelli che passano per $i$; il rapporto
tra i due dice quale "quota" dei percorsi passa dal membro $i$. La condizione
$s \neq i \neq t$ indica che si considerano solo coppie $s,t$ diverse da $i$.
Il denominatore $(n-1)(n-2)$ è il numero di coppie possibili e serve a
riportare il risultato tra $0$ e $1$.

$$
C_B(i) = \frac{\sum_{s \neq i \neq t} \frac{\sigma_{st}(i)}{\sigma_{st}}}{(n-1)(n-2)}
$$

### PageRank

Il **PageRank** (l'algoritmo ideato per ordinare le pagine web) dà importanza ai
legami ricevuti **in base all'importanza di chi li esprime**: essere scelti da
una persona molto scelta vale più che essere scelti da una persona che nessuno
sceglie. Nella formula, $\text{In}(i)$ è l'insieme dei membri che scelgono $i$ e
$d_{\text{out}}(j)$ è il numero di persone scelte da $j$: l'importanza di $j$
viene quindi **divisa** tra tutti coloro che $j$ sceglie.

Il parametro $\alpha = 0.85$ si può immaginare così: una persona che passa da un
membro all'altro seguendo le frecce lo fa nell'$85\%$ dei casi, mentre nel
restante $15\%$ salta a un membro a caso (da qui il termine $\frac{1 - \alpha}{n}$).

Poiché l'importanza di ciascun membro dipende da quella degli altri, il calcolo
procede per approssimazioni successive, fino a quando i valori si stabilizzano.

$$
PR(i) = \frac{1 - \alpha}{n} + \alpha \sum_{j \in \text{In}(i)} \frac{PR(j)}{d_{\text{out}}(j)}, \qquad \alpha = 0.85
$$

### HITS

**HITS** distingue **due ruoli complementari** che un membro può avere
contemporaneamente:

- l'**autorità** ($a$): chi riceve legami da buoni *hub*, cioè è scelto da chi
  sa scegliere bene;
- l'**hub** ($h$): chi indica buone *autorità*, cioè sceglie le persone giuste.

Le due definizioni si richiamano a vicenda ($\text{Out}(i)$ è l'insieme dei
membri scelti da $i$) e, come per il PageRank, i valori si calcolano per
approssimazioni successive.

$$
a(i) = \sum_{j \in \text{In}(i)} h(j), \qquad h(i) = \sum_{j \in \text{Out}(i)} a(j)
$$

### Un esempio svolto

Riprendiamo il gruppo di quattro membri di prima, usando solo la matrice delle
scelte $A$ (le frecce sono: $1 \to 2$, $1 \to 3$, $2 \to 1$, $2 \to 4$,
$3 \to 2$, $3 \to 4$, $4 \to 1$). Per il **grado**, i legami entranti di ciascun
membro sono le scelte ricevute ($rp$) e quelli uscenti sono le scelte date
($gp$); con $n - 1 = 3$ si ottiene:

| Metrica | Membro 1 | Membro 2 | Membro 3 | Membro 4 |
| ------- | :------: | :------: | :------: | :------: |
| Grado entrante ($C_D^{\text{in}}$) | $2/3 \approx 0{,}67$ | $2/3 \approx 0{,}67$ | $1/3 \approx 0{,}33$ | $2/3 \approx 0{,}67$ |
| Grado uscente ($C_D^{\text{out}}$) | $2/3 \approx 0{,}67$ | $2/3 \approx 0{,}67$ | $2/3 \approx 0{,}67$ | $1/3 \approx 0{,}33$ |
| Vicinanza ($C_C$) | $3/4 = 0{,}75$ | $3/4 = 0{,}75$ | $3/4 = 0{,}75$ | $3/5 = 0{,}60$ |
| Intermediazione ($C_B$) | $3/6 = 0{,}50$ | $1/6 \approx 0{,}17$ | $0{,}5/6 \approx 0{,}08$ | $0{,}5/6 \approx 0{,}08$ |

Qualche esempio di come si arriva ai numeri:

- **Vicinanza del membro 4.** Dal membro $4$ si raggiunge il $1$ in un passo,
  mentre il $2$ e il $3$ richiedono due passi (passando dal $1$). Quindi
  $|R_4| = 3$ e la somma delle distanze è $1 + 2 + 2 = 5$, da cui $3/5$. Il
  membro $4$ ha la vicinanza più bassa perché sceglie una sola persona e deve
  passare da lei per arrivare a tutti gli altri.
- **Intermediazione del membro 1.** Il membro $1$ sta sull'unico percorso più
  breve tra $2$ e $3$, tra $4$ e $2$ e tra $4$ e $3$: contribuisce con $3$ al
  numeratore, che diviso per $(n-1)(n-2) = 6$ dà $0{,}50$. Il membro $1$ è
  dunque il vero "ponte" del gruppo: ad esempio, il membro $4$ sceglie soltanto
  lui, e tutte le sue strade verso gli altri passano da lì.

Per **PageRank** e **HITS** il calcolo è iterativo, quindi qui riportiamo i
valori a cui si arriva dopo la convergenza, normalizzati in modo che la somma
dei quattro membri sia $1$:

| Metrica | Membro 1 | Membro 2 | Membro 3 | Membro 4 |
| ------- | :------: | :------: | :------: | :------: |
| PageRank ($PR$) | 0,337 | 0,258 | 0,181 | 0,224 |
| Autorità HITS ($a$) | 0,227 | 0,305 | 0,121 | 0,347 |
| Hub HITS ($h$) | 0,227 | 0,305 | 0,347 | 0,121 |

Come si leggono questi numeri:

- **PageRank.** Il membro $1$ è il più importante: lo scelgono il $2$ e il $4$, e
  il $4$ ha *come unica scelta* proprio il $1$, quindi gli cede tutta la propria
  importanza. Come verifica, per il membro $1$ si ha
  $PR(1) = \frac{0{,}15}{4} + 0{,}85\left(\frac{PR(2)}{2} + \frac{PR(4)}{1}\right)
  \approx 0{,}0375 + 0{,}85\,(0{,}129 + 0{,}224) \approx 0{,}337$,
  dove il $2$ divide la propria importanza tra due scelte (il $1$ e il $4$),
  mentre il $4$ la dà tutta al $1$. Il membro $3$ ha il valore più basso perché
  riceve una sola scelta, e per di più da un membro che ne fa due.
- **HITS.** Il membro $4$ è la **migliore autorità**: è scelto da $2$ e $3$, che
  sono ottimi hub. Il membro $3$ è invece il **miglior hub**: indica proprio il
  $2$ e il $4$, le due autorità più forti. Il membro $2$ è il più equilibrato,
  perché è alto in entrambi i ruoli. Si noti la simmetria tra il $3$ e il $4$:
  i valori di autorità dell'uno coincidono con quelli di hub dell'altro, perché
  nel grafo i loro ruoli sono speculari.

## In sintesi

| Centralità | Domanda a cui risponde | Valore alto significa |
| ---------- | ---------------------- | --------------------- |
| Grado | Quanti legami ha? | È molto collegato (o molto scelto, se si guarda il grado entrante) |
| Vicinanza | Quanto è vicino a tutti gli altri? | Può raggiungere gli altri con pochi passaggi |
| Intermediazione | Quanto fa da ponte tra gli altri? | Molti percorsi più brevi passano da lui |
| PageRank | Chi lo sceglie è a sua volta importante? | È scelto da persone importanti |
| HITS (autorità) | È scelto da chi sceglie bene? | È un riferimento riconosciuto |
| HITS (hub) | Sceglie le persone giuste? | Indica buoni riferimenti agli altri |
