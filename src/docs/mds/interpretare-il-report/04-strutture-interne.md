---
title: Strutture interne
order: 4
---

Oltre alle metriche, il report descrive alcune **strutture interne** della rete
delle scelte: diadi simmetriche, clique, componenti connesse e comunità di
Louvain. Queste strutture aiutano a esplorare come si distribuiscono i legami
rilevati, ma non dimostrano, da sole, amicizia, affiatamento o appartenenza a
un sottogruppo nella vita quotidiana.

Come nella sezione precedente, $a_{ij} = 1$ significa che il membro $i$
**sceglie** il membro $j$, e $a_{ij} = 0$ che non lo sceglie.

## Che cos'è una struttura interna

Con **struttura interna** indichiamo un insieme di membri individuato nella
rete secondo un criterio preciso. Diadi, clique e componenti connesse hanno
definizioni matematiche esatte; Louvain è invece un algoritmo euristico che
cerca una suddivisione con modularità elevata, senza garantire di trovare la
migliore possibile.

Occorre distinguere due piani: **la struttura presente nei dati** e **il suo
significato nel gruppo reale**. Il secondo richiede un confronto con le
osservazioni e con il contesto della rilevazione. Ogni risultato dipende dalla
domanda posta, dalle risposte raccolte e dal momento in cui sono state espresse.

## Perché analizziamo solo le scelte

Le strutture presentate in questa sezione si basano sulle **scelte**, cioè sui
legami positivi della matrice $A$. L'obiettivo è descrivere le connessioni
espresse rispetto al criterio del questionario.

Anche una rete di rifiuti può essere analizzata matematicamente, ma richiede
un'interpretazione diversa: una catena di rifiuti non equivale a un percorso
di affinità. Inoltre, un rifiuto riferito a un'attività specifica non dimostra,
da solo, ostilità o conflitto tra le persone.

## 1 Diadi

In questa pagina, una **diade simmetrica** è una coppia di membri che si
scelgono a vicenda:

$$
a_{ij} = a_{ji} = 1
$$

In parole: $i$ sceglie $j$ **e** $j$ sceglie $i$. È la forma più semplice di
reciprocità nelle risposte, non una conferma della qualità del rapporto.

Si distingue dalla **diade asimmetrica**, in cui uno solo dei due sceglie
l'altro:

$$
a_{ij} = 1 \quad \text{e} \quad a_{ji} = 0
$$

Vale anche il caso speculare. Il report delle diadi mostra soltanto le coppie
reciproche. L'assenza di reciprocità non implica necessariamente un rifiuto:
una mancata scelta può dipendere anche dai limiti del questionario.

## 2 Clique

Una **clique** è un insieme in cui ogni coppia di membri è collegata da almeno
una scelta, senza richiedere che sia reciproca:

$$
\forall\, i, j \in C,\ i \neq j : \quad a_{ij} = 1 \ \lor\ a_{ji} = 1
$$

Per leggere la formula:

- $C$ è l'insieme di membri esaminato;
- $\forall$ significa "per ogni" e $\lor$ significa "oppure";
- per **ogni** coppia di membri diversi di $C$, almeno uno sceglie l'altro.

Si parla di clique **massimale** quando non è possibile aggiungere un altro
membro mantenendo questa proprietà. "Massimale" non significa necessariamente
"la più grande della rete".

Una coppia collegata è tecnicamente una clique di due membri; per esplorare i
sottogruppi, l'interesse si concentra soprattutto sugli insiemi di almeno tre
membri. Le clique descrivono una trama fitta di scelte dirette, non
necessariamente una cerchia di amici o un gruppo affiatato.

## 3 Componenti connesse

Una **componente connessa** è un insieme massimale di membri collegati da
percorsi secondo un dato criterio. Un percorso può passare attraverso più
membri intermedi: non richiede una scelta diretta tra ogni coppia.

Si distinguono tre varianti:

- **Componenti deboli**: tutti i membri sono raggiungibili tra loro
  **ignorando la direzione** delle scelte.
- **Componenti forti**: tutti i membri sono raggiungibili tra loro
  **seguendo la direzione** delle scelte.
- **Componenti forti con soli legami reciproci**: si usano soltanto i legami
  per cui $a_{ij} = a_{ji} = 1$. Poiché ogni collegamento vale nei due versi,
  queste componenti sono gli insiemi connessi ottenuti unendo le diadi
  simmetriche.

### 3.1 Un esempio

Immagina tre membri e nessun'altra scelta oltre a queste:

$$
1 \rightarrow 2 \rightarrow 3
$$

- C'è una sola **componente debole**: ignorando la direzione, tutti sono
  collegati.
- Le **componenti forti** sono tre: $\{1\}$, $\{2\}$ e $\{3\}$. Seguendo le
  frecce, dal membro $3$ non si può tornare agli altri.
- Anche considerando **solo i legami reciproci** si ottengono tre componenti
  di un solo membro, perché non ci sono scelte reciproche.

Un membro può quindi formare una componente da solo anche se ha scelte in
entrata o in uscita: dipende dal criterio adottato.

### 3.2 Come si confrontano i criteri

Le componenti sono annidate:

$$
\text{comp. forte reciproca} \ \subseteq\ \text{comp. forte} \ \subseteq\ \text{comp. debole}
$$

Ogni componente forte con soli legami reciproci è contenuta in una componente
forte, a sua volta contenuta in una componente debole. Un criterio più
restrittivo può dividere la rete in insiemi più piccoli, ma non misura una
maggiore "solidità" affettiva dei rapporti.

Solo tra **componenti deboli distinte** non esistono scelte di collegamento,
in nessuna direzione, nei dati raccolti. Tra componenti forti distinte possono
invece esserci scelte a senso unico. In entrambi i casi, non si può concludere
che nella realtà manchino contatti o comunicazioni.

## 4 Clique o componenti: che differenza c'è?

### 4.1 Legame diretto o percorso

- **La clique richiede una scelta diretta tra ogni coppia**, in almeno una
  direzione.
- **La componente richiede un percorso**, secondo il criterio adottato.
  Può quindi contenere lunghe catene di intermediari e poche scelte dirette.

### 4.2 Sovrapposizione

Per ciascuno dei tre criteri, le componenti **dividono** l'insieme dei membri:
ognuno appartiene a una sola componente. Le clique possono invece
**sovrapporsi**: lo stesso membro può appartenere a più clique, oppure a
nessuna clique di almeno tre membri.

### 4.3 Una clique non è necessariamente una componente forte

Considera le sole scelte $1 \rightarrow 2$, $1 \rightarrow 3$ e
$2 \rightarrow 3$. L'insieme $\{1, 2, 3\}$ è una clique, perché ogni coppia è
collegata. Non è una componente forte, perché dal membro $3$ non si raggiungono
gli altri. In questa rete di tre membri è invece una componente debole.

### 4.4 Una componente non è necessariamente una clique

Considera il ciclo:

$$
1 \rightarrow 2 \rightarrow 3 \rightarrow 4 \rightarrow 1
$$

Tutti raggiungono tutti seguendo le frecce: è una componente forte. Non è una
clique, perché mancano scelte dirette tra $1$ e $3$ e tra $2$ e $4$.

Ogni clique è contenuta in una componente debole, ma non vale il contrario.
La clique non va quindi inserita nella scala reciproca → forte → debole:
descrive la presenza di collegamenti diretti, non soltanto la raggiungibilità.

## 5 Comunità di Louvain

L'algoritmo di **Louvain** cerca una suddivisione della rete con **modularità**
elevata: privilegia comunità nelle quali le scelte interne sono più numerose
di quanto previsto da un modello di riferimento che tiene conto dei gradi
dei nodi.

Non cerca gruppi necessariamente separati: tra comunità diverse possono
esistere scelte. Ogni membro viene assegnato a una sola comunità nella
suddivisione ottenuta.

### 5.1 La modularità Q

La **modularità** ($Q$) è un indice senza unità di misura che valuta una
suddivisione rispetto al modello di riferimento:

- $Q$ vicino a $0$: la suddivisione presenta uno scarto ridotto rispetto al
  riferimento;
- $Q$ positivo e più alto: le scelte interne alle comunità sono più
  concentrate rispetto a quel riferimento.

$Q$ non misura il benessere del gruppo e non dimostra, da solo, che esistano
sottogruppi socialmente significativi. Un valore vicino a zero non prova che
le relazioni siano casuali; un valore elevato non equivale a un test di
significatività. I confronti tra reti diverse richiedono cautela.

### 5.2 Cosa cambia rispetto alle altre strutture

Diadi, clique e componenti seguono definizioni esatte, ma **non tutte dividono
il gruppo**: diadi e clique possono sovrapporsi. Le comunità di Louvain
costituiscono invece una partizione ottenuta tramite ottimizzazione euristica.

La suddivisione può variare tra esecuzioni e al cambiare dei dati. È utile per
formulare ipotesi sull'organizzazione della rete, non per attribuire ai membri
appartenenze rigide o identità stabili.

## 6 In sintesi

| Struttura                                  | Criterio                                        | Cautela di lettura                                          |
| ------------------------------------------ | ----------------------------------------------- | ----------------------------------------------------------- |
| Diade simmetrica                           | Due membri si scelgono a vicenda                | Reciprocità delle risposte, non misura di affiatamento      |
| Clique                                     | Almeno una scelta diretta tra ogni coppia       | Non richiede reciprocità; può sovrapporsi ad altre clique   |
| Componente forte con soli legami reciproci | Percorsi formati soltanto da scelte reciproche  | Può contenere lunghe catene, non solo legami diretti        |
| Componente forte                           | Percorsi in entrambi i versi seguendo le frecce | Può avere collegamenti a senso unico con altre componenti   |
| Componente debole                          | Percorsi ignorando la direzione delle scelte    | La connessione riguarda i dati, non tutti i rapporti reali  |
| Comunità di Louvain                        | Partizione con modularità elevata               | È un risultato euristico, non un'appartenenza sociale certa |
