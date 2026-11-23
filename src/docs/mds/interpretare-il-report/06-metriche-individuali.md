---
title: Metriche individuali
order: 6
---

Le metriche individuali descrivono **la posizione di ciascun membro nel
gruppo**: chi è al centro dell'attenzione, chi è isolato, chi fa da ponte tra
gli altri. Si dividono in due famiglie:

- gli **indici di Moreno**, che contano in modo semplice le scelte e i rifiuti
  dati e ricevuti da ogni persona;
- le **centralità della social network analysis (SNA)**, cioè dell'"analisi
  delle reti sociali", che descrivono diverse forme di posizione strutturale,
  in alcuni casi tenendo conto anche dei legami indiretti.

Le misure riguardano le nomine raccolte, nel gruppo e nel momento considerati:
non sono valutazioni della persona, diagnosi o prove di ruoli sociali stabili.

In tutte le formule, $n$ è il **numero di membri** del gruppo e $i$ indica il
membro di cui stiamo calcolando la metrica.

## 1 Indici di Moreno

Gli indici di Moreno (dal nome dello psicologo Jacob Moreno, ideatore del
sociogramma) si ricavano da semplici somme sulle righe e sulle colonne delle
tabelle che registrano le relazioni, dette _matrici di adiacenza_:

- $a_{ij} = 1$ se il membro $i$ **sceglie** il membro $j$, altrimenti $0$;
- $b_{ij} = 1$ se il membro $i$ **rifiuta** il membro $j$, altrimenti $0$.

Per orientarsi nelle formule, basta ricordare che:

- il simbolo $\sum_{j}$ significa "somma su tutti gli altri membri $j$";
- sommare lungo **una riga** ($a_{ij}$, con $i$ fisso) conta ciò che il membro
  $i$ **esprime**; sommare lungo **una colonna** ($a_{ji}$, con $i$ fisso) conta
  ciò che il membro $i$ **riceve**;
- il prodotto $a_{ij} a_{ji}$ vale $1$ solo se $i$ sceglie $j$ **e** $j$ sceglie
  $i$, cioè se la scelta è **reciproca**.

### 1.1 Scelte ricevute e date

Sono i conteggi di base: quante opinioni, positive e negative, un membro riceve
dagli altri e quante ne esprime verso gli altri.

- **Scelte ricevute positive** ($rp_i$): quante preferenze ha ricevuto il
  membro $i$. Più è alto, più il membro è scelto dai compagni.

$$
rp_i = \sum_{j} a_{ji}
$$

- **Scelte ricevute negative** ($rr_i$): quanti rifiuti ha ricevuto.

$$
rr_i = \sum_{j} b_{ji}
$$

- **Scelte date positive** ($gp_i$): quante preferenze ha espresso.

$$
gp_i = \sum_{j} a_{ij}
$$

- **Scelte date negative** ($gr_i$): quanti rifiuti ha espresso.

$$
gr_i = \sum_{j} b_{ij}
$$

### 1.2 Scelte reciproche

Contano i casi in cui una nomina trova riscontro in una nomina dello stesso
segno nella direzione opposta. Non misurano direttamente sentimenti o intensità
della relazione.

- **Reciprocità positiva** ($mp_i$): quante preferenze del membro sono
  ricambiate, cioè con quante persone c'è una scelta a vicenda.

$$
mp_i = \sum_{j} a_{ij} a_{ji}
$$

- **Reciprocità negativa** ($mr_i$): quanti rifiuti del membro sono ricambiati,
  cioè con quante persone c'è un rifiuto a vicenda.

$$
mr_i = \sum_{j} b_{ij} b_{ji}
$$

### 1.3 Indici derivati

Si ottengono combinando i conteggi precedenti con somme e differenze, per
rispondere a domande più specifiche.

- **Impatto** ($im_i$): quante opinioni ha ricevuto in totale, positive e
  negative. Dice **quanto il membro è "visibile"** agli occhi degli altri,
  indipendentemente dal fatto che l'opinione sia buona o cattiva.

$$
im_i = rp_i + rr_i
$$

- **Bilancio** ($bl_i$): la differenza tra preferenze e rifiuti ricevuti. È
  positivo se riceve più preferenze che rifiuti, negativo nel caso opposto.

$$
bl_i = rp_i - rr_i
$$

- **Espressività** ($ei_i$): **numero totale di opinioni espresse** dal membro
  nella rilevazione, entro i limiti consentiti.

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
  numero lo squilibrio tra nomine positive e negative, ricevute ed espresse.
  Non misura direttamente la disponibilità personale ad accogliere gli altri.

$$
ai_i = bl_i + or_i
$$

- **Influenza** ($ii_i$): preferenze ricevute più preferenze reciproche. Le
  scelte ricambiate "pesano" quindi il doppio: è una scelta di costruzione
  dell'indice, non una prova di solidità del legame o di influenza effettiva.

$$
ii_i = rp_i + mp_i
$$

### 1.4 Status sociometrico

Lo **status sociometrico** ($ss_i$) è una categoria descrittiva: classifica
ogni membro in una di **nove categorie**, combinando due informazioni già viste,
l'impatto ricevuto (quanto il membro è visibile) e il bilancio tra preferenze e
rifiuti (se prevalgono gli uni o le altre). Le categorie, con il relativo
codice e la dizione mostrata nel report, sono:

| Codice | Categoria   | Etichetta nel report    |
| :----: | ----------- | ----------------------- |
|   0    | isolato     | Segnali di isolamento   |
|   1    | ignorato    | Riscontro assente       |
|   2    | marginale   | Indizi di marginalità   |
|   3    | apprezzato  | Apprezzato              |
|   4    | popolare    | Popolare                |
|   5    | malvisto    | Note di disapprovazione |
|   6    | rifiutato   | Segnali di rifiuto      |
|   7    | ambivalente | Elementi di ambivalenza |
|   8    | controverso | Accoglienza dibattuta   |

Le due colonne esprimono lo **stesso risultato** con un intento diverso. La
**categoria** è la classificazione sociometrica in senso stretto, cioè
un'etichetta analitica riferita ai dati raccolti (ad esempio "rifiutato"). La **dizione nel
report** ne attenua la formulazione trasformandola in un _segnale_
o in un _indicatore_ (ad esempio "segnali di rifiuto"). Il report usa infatti
questa seconda forma per descrivere la posizione di un membro senza
attribuirgli un giudizio sociale definitivo e potenzialmente stigmatizzante.

Le categorie non formano una graduatoria. «Isolato» indica assenza di nomine
sia ricevute sia espresse; «ignorato» indica assenza di nomine ricevute, ma
presenza di nomine espresse. Per gli altri membri contano il livello relativo
dell'impatto e una regola di prevalenza tra preferenze e rifiuti. Il bilancio
«neutro» usato per lo status non coincide necessariamente con $bl_i = 0$.

La regola che assegna il codice è più complessa delle formule viste finora,
perché procede in più passaggi successivi: ogni passaggio è matematicamente
semplice, ma nel loro insieme sono troppi per essere riassunti in una formula
leggibile. L'algoritmo è descritto nel documento successivo.

### 1.5 Un esempio svolto

Immaginiamo un gruppo di quattro membri, con le seguenti matrici delle scelte
($A$) e dei rifiuti ($B$):

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

Prendiamo il membro $1$. Le sue **scelte ricevute** si leggono sulla _colonna 1_
di $A$: lo scelgono il membro $2$ e il membro $4$, quindi $rp_1 = 2$. Le sue
**scelte date** si leggono sulla _riga 1_: sceglie il $2$ e il $3$, quindi
$gp_1 = 2$. Ripetendo il conteggio per tutti si ottiene:

| Metrica                         | Membro 1 | Membro 2 | Membro 3 | Membro 4 |
| ------------------------------- | :------: | :------: | :------: | :------: |
| Scelte ricevute positive ($rp$) |    2     |    2     |    1     |    2     |
| Scelte ricevute negative ($rr$) |    1     |    1     |    1     |    1     |
| Scelte date positive ($gp$)     |    2     |    2     |    2     |    1     |
| Scelte date negative ($gr$)     |    1     |    1     |    1     |    1     |
| Reciprocità positiva ($mp$)     |    1     |    1     |    0     |    0     |
| Reciprocità negativa ($mr$)     |    0     |    0     |    0     |    0     |
| Impatto ($im$)                  |    3     |    3     |    2     |    3     |
| Bilancio ($bl$)                 |    1     |    1     |    0     |    1     |
| Espressività ($ei$)             |    3     |    3     |    3     |    2     |
| Orientamento ($or$)             |    1     |    1     |    1     |    0     |
| Affiliazione ($ai$)             |    2     |    2     |    1     |    1     |
| Influenza ($ii$)                |    3     |    3     |    1     |    2     |

I membri $1$ e $2$ si distinguono per questi indici: sono gli unici ad avere una scelta
reciproca (si scelgono tra loro) e hanno i valori più alti di affiliazione e
influenza. Il membro $3$ è invece il meno scelto e con il bilancio più basso.

## 2 Centralità SNA

Le centralità misurano **quanto un nodo è importante nella rete del gruppo**.
In questo contesto la rete è un **grafico diretto**: ogni membro è un _nodo_ (un
punto) e ogni scelta è una _freccia_ che va da chi sceglie a chi è scelto.
Esistono molti modi di definire l'"importanza", e ogni centralità ne misura uno
diverso: chi ha più legami, chi è più vicino a tutti, chi fa da ponte, chi è
scelto da persone a loro volta importanti.

Un'avvertenza sulla notazione: in questa sezione $d(i)$ e $d(i,j)$ (con le
parentesi) indicano rispettivamente il **numero di legami** di un nodo e la
**distanza** tra due nodi, e non vanno confusi con $b_{ij}$ (senza parentesi),
che nella sezione precedente indicava il rifiuto.

Con meno di due membri, il report restituisce $0$ per tutte le centralità
individuali: è una convenzione dell'applicazione, anche per PageRank, che su
un singolo nodo avrebbe invece valore teorico $1$. L'intermediazione vale
$0$ anche con due membri, perché non esistono coppie di altri nodi tra cui
fare da intermediario; la sua formula normalizzata si applica per $n \ge 3$.

### 2.1 Grado

La **centralità di grado** conta quanti legami ha il membro, rapportati al
numero di altri membri ($n-1$). È la misura più
immediata di connessione. Per il grado entrante o uscente vale $1$ quando
sono presenti tutti i $n-1$ legami della direzione considerata. Il grado totale
somma entranti e uscenti e può arrivare a $2$ in una rete diretta.

$$
C_D(i) = \frac{d(i)}{n - 1}
$$

Si può calcolare separatamente per i legami **ricevuti** (entranti, $d_{\text{in}}$:
le frecce che arrivano al membro) e per quelli **espressi** (uscenti,
$d_{\text{out}}$: le frecce che partono dal membro):

$$
C_D^{\text{in}}(i) = \frac{d_{\text{in}}(i)}{n - 1}, \qquad C_D^{\text{out}}(i) = \frac{d_{\text{out}}(i)}{n - 1}
$$

**AB-Gram riporta la centralità di grado entrante (_in-degree centrality_)**
nel riquadro **DG** del report: è il numero di scelte ricevute dal membro,
diviso per $n-1$, cioè $C_D^{\text{in}}(i) = rp_i/(n-1)$. Non è il conteggio
grezzo delle scelte ricevute, né la centralità di grado uscente o totale.

### 2.2 Vicinanza

La **centralità di vicinanza** misura quanto il membro è **vicino** agli altri,
nella direzione dei legami **entranti**: l'implementazione considera quanti
pochi passaggi servono agli altri per raggiungere $i$ seguendo le frecce.
Nella formula, $R_i$ è l'insieme degli altri membri che possono raggiungere $i$,
$|R_i|$ ne è il numero e $d(j,i)$ è la lunghezza del percorso più breve da $j$
a $i$. La correzione di **Wasserman–Faust** moltiplica l'inverso della distanza
media per la quota di altri membri che possono raggiungere $i$, anche indirettamente.
Se tutti possono raggiungerlo, il valore non cambia; se nessuno può raggiungerlo, vale $0$.

$$
C_C(i) = \frac{|R_i|}{n-1} \cdot \frac{|R_i|}{\sum_{j \in R_i} d(j,i)}
$$

Per esempio, nella catena $A \to B \to C$, sia $B$ sia $C$ ricevono una scelta diretta (RP = 1).
Solo $A$ può raggiungere $B$, in un passo: la vicinanza di $B$ è $1/2$.
Entrambi gli altri membri raggiungono $C$, in due passi da $A$ e in uno da $B$: la vicinanza di $C$ è $2/3$.

### 2.3 Intermediazione

La **centralità di intermediazione** misura quanto il membro **fa da ponte**:
quante volte si trova sulla strada più breve tra due altri membri. Chi ha
un valore alto occupa una posizione di potenziale raccordo nella rete rilevata:
non significa necessariamente che controlli le informazioni o che queste
circolino seguendo le nomine. Nella formula, $\sigma_{st}$ è il numero di percorsi più brevi da $s$ a
$t$, e $\sigma_{st}(i)$ è il numero di quelli che passano per $i$; il rapporto
tra i due dice quale "quota" dei percorsi passa dal membro $i$. La somma considera solo coppie ordinate di membri distinti, entrambi diversi da $i$,
per cui esiste un percorso da $s$ a $t$ ($\sigma_{st}>0$).
Il denominatore $(n-1)(n-2)$ è il numero di coppie ordinate possibili e serve a
riportare il risultato tra $0$ e $1$. Con meno di tre membri nessuno può fare da ponte e il valore è $0$.

$$
C_B(i) = \frac{\sum_{s,t \ne i,\;s \ne t,\;\sigma_{st}>0} \frac{\sigma_{st}(i)}{\sigma_{st}}}{(n-1)(n-2)}
$$

### 2.4 PageRank

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

Questa forma vale quando ogni nodo ha almeno un legame uscente. Se ci sono
nodi senza uscite, l'implementazione redistribuisce uniformemente la loro massa:
al secondo membro si aggiunge $\frac{\alpha}{n}\sum_{j:\,d_{\text{out}}(j)=0} PR(j)$.

### 2.5 HITS

**HITS** distingue **due ruoli complementari** che un membro può avere
contemporaneamente:

- l'**autorità** ($a$): riceve legami da nodi con punteggio _hub_ elevato;
- l'**hub** ($h$): esprime legami verso nodi con punteggio di autorità elevato.

Sono ruoli matematici complementari: non indicano che qualcuno sappia scegliere
«bene», scelga le persone «giuste» o possieda autorità effettiva nel gruppo.

Le due definizioni si richiamano a vicenda ($\text{Out}(i)$ è l'insieme dei
membri scelti da $i$) e, come per il PageRank, i valori si calcolano per
approssimazioni successive, con normalizzazione dei punteggi. Le relazioni
seguenti indicano **proporzionalità**, non uguaglianza tra i punteggi finali:
le somme vengono normalizzate e, al termine, autorità e hub hanno ciascuno
somma $1$ sull'insieme dei membri.

$$
a(i) \propto \sum_{j \in \text{In}(i)} h(j), \qquad h(i) \propto \sum_{j \in \text{Out}(i)} a(j)
$$

Se la rete non ha legami o HITS non converge, il programma restituisce tutti
zeri: in quest'ultimo caso non sono punteggi interpretabili come assenza di
centralità.

### 2.6 CRN (coreness)

La **CRN** si calcola considerando la rete delle scelte, non quella dei rifiuti. La coreness è il più alto valore di $k$ per cui il membro appartiene a un nucleo dove ciascuno ha almeno $k$ legami con gli altri membri del nucleo. Si contano solo le scelte date e ricevute **all’interno del nucleo**: una scelta reciproca vale due legami per ciascuno dei due membri. Un membro isolato ha CRN pari a $0$.

### 2.7 Un esempio svolto

Riprendiamo il gruppo di quattro membri di prima, usando solo la matrice delle
scelte $A$ (le frecce sono: $1 \to 2$, $1 \to 3$, $2 \to 1$, $2 \to 4$,
$3 \to 2$, $3 \to 4$, $4 \to 1$). Per il **grado**, i legami entranti di ciascun
membro sono le scelte ricevute ($rp$) e quelli uscenti sono le scelte date
($gp$); con $n - 1 = 3$ si ottiene:

| Metrica                            |       Membro 1       |       Membro 2       |         Membro 3         |         Membro 4         |
| ---------------------------------- | :------------------: | :------------------: | :----------------------: | :----------------------: |
| Grado entrante ($C_D^{\text{in}}$) | $2/3 \approx 0{,}67$ | $2/3 \approx 0{,}67$ |   $1/3 \approx 0{,}33$   |   $2/3 \approx 0{,}67$   |
| Grado uscente ($C_D^{\text{out}}$) | $2/3 \approx 0{,}67$ | $2/3 \approx 0{,}67$ |   $2/3 \approx 0{,}67$   |   $1/3 \approx 0{,}33$   |
| Vicinanza ($C_C$)                  |    $3/4 = 0{,}75$    |    $3/4 = 0{,}75$    |      $3/5 = 0{,}60$      |      $3/4 = 0{,}75$      |
| Intermediazione ($C_B$)            |    $3/6 = 0{,}50$    | $1/6 \approx 0{,}17$ | $0{,}5/6 \approx 0{,}08$ | $0{,}5/6 \approx 0{,}08$ |
| CRN                                |          3           |          3           |            3             |            3             |

Qualche esempio di come si arriva ai numeri:

- **Vicinanza del membro 3.** Il membro $1$ lo raggiunge in un passo;
  il $2$ e il $4$ lo raggiungono in due passi, passando dal $1$. Quindi
  $|R_3| = 3$ e la somma delle distanze entranti è $1 + 2 + 2 = 5$, da cui
  $3/5$. È il valore più basso dell'esempio.
- **Intermediazione del membro 1.** Il membro $1$ sta sull'unico percorso più
  breve tra $2$ e $3$, tra $4$ e $2$ e tra $4$ e $3$: contribuisce con $3$ al
  numeratore, che diviso per $(n-1)(n-2) = 6$ dà $0{,}50$. Il membro $1$ è
  dunque il nodo con maggiore intermediazione in questa rete: ad esempio, il membro $4$ sceglie soltanto
  lui, e tutte le sue strade verso gli altri passano da lì.
- **CRN.** Sommando scelte date e ricevute, i quattro membri hanno rispettivamente $4, 4, 3, 3$ legami: l’intero gruppo è quindi un nucleo di ordine $3$. Per ottenere un nucleo di ordine $4$ bisognerebbe escludere i membri $3$ e $4$. Resterebbero $1$ e $2$, con la sola scelta reciproca: due legami ciascuno, non quattro. La CRN è dunque $3$ per tutti e quattro. A parità di punteggio condividono il rango $1$, che è anche il rango massimo.

Per **PageRank** e **HITS** il calcolo è iterativo, quindi qui riportiamo i
valori a cui si arriva dopo la convergenza, normalizzati in modo che la somma
dei quattro membri sia $1$:

| Metrica             | Membro 1 | Membro 2 | Membro 3 | Membro 4 |
| ------------------- | :------: | :------: | :------: | :------: |
| PageRank ($PR$)     |  0,337   |  0,258   |  0,181   |  0,224   |
| Autorità HITS ($a$) |  0,227   |  0,305   |  0,121   |  0,347   |
| Hub HITS ($h$)      |  0,227   |  0,305   |  0,347   |  0,121   |

Come si leggono questi numeri:

- **PageRank.** Il membro $1$ ha il PageRank più alto: lo scelgono il $2$ e il $4$, e
  il $4$ ha _come unica scelta_ proprio il $1$, quindi gli cede tutta la propria
  importanza. Come verifica, per il membro $1$ si ha
  $PR(1) = \frac{0{,}15}{4} + 0{,}85\left(\frac{PR(2)}{2} + \frac{PR(4)}{1}\right)
  \approx 0{,}0375 + 0{,}85\,(0{,}128887 + 0{,}223934) \approx 0{,}337$,
  dove il $2$ divide la propria importanza tra due scelte (il $1$ e il $4$),
  mentre il $4$ la dà tutta al $1$. Il membro $3$ ha il valore più basso perché
  riceve una sola scelta, e per di più da un membro che ne fa due.
- **HITS.** Il membro $4$ ha il **punteggio di autorità più alto**: è scelto da $2$ e $3$, che
  hanno punteggi hub elevati. Il membro $3$ ha invece il **punteggio hub più alto**: indica proprio il
  $2$ e il $4$, le due autorità più forti. Il membro $2$ ha punteggi elevati
  in entrambi i ruoli. Si noti la simmetria tra il $3$ e il $4$:
  i valori di autorità dell'uno coincidono con quelli di hub dell'altro, perché
  nel grafico i loro ruoli sono speculari.

## 3 In sintesi

| Metrica SNA     | Domanda a cui risponde                          | Valore alto significa                                              |
| --------------- | ----------------------------------------------- | ------------------------------------------------------------------ |
| Grado           | Quanti legami ha?                               | È molto collegato (o molto scelto, se si guarda il grado entrante) |
| Vicinanza       | Quanto è vicino a tutti gli altri?              | Molti membri lo raggiungono in pochi passaggi                      |
| Intermediazione | Quanto fa da ponte tra gli altri?               | Molti percorsi più brevi passano da lui                            |
| PageRank        | Chi lo sceglie ha a sua volta un PageRank alto? | Riceve contributi elevati secondo PageRank                         |
| HITS (autorità) | Riceve legami da hub con punteggi alti?         | Riceve legami da hub con punteggi alti                             |
| HITS (hub)      | Indica autorità con punteggi alti?              | Indica nodi con alta autorità HITS                                 |
| CRN             | A quale nucleo appartiene?                      | Nel nucleo ogni membro ha molti legami interni, dati o ricevuti    |
