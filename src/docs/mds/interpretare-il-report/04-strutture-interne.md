---
title: Strutture interne
order: 4
---

Chi è collegato direttamente, e chi soltanto tramite altri membri? Le
**strutture interne** del report rispondono a domande diverse sulla stessa rete
di scelte: le clique mostrano i legami diretti, le componenti i percorsi e le
comunità di Louvain e Leiden la concentrazione dei legami.

Il report seleziona soltanto le strutture con **almeno tre nodi**, cioè tre
membri. Questa soglia riguarda ciò che viene mostrato, non la definizione
matematica delle strutture.

Come nella sezione precedente, $a_{ij} = 1$ significa che il membro $i$
**sceglie** il membro $j$, e $a_{ij} = 0$ che non lo sceglie.

## Che cos'è una struttura interna

Con **struttura interna** indichiamo un insieme di membri individuato nella
rete secondo un criterio preciso. Clique e componenti connesse hanno
definizioni matematiche esatte; Louvain e Leiden sono invece algoritmi euristici
che cercano una suddivisione con modularità elevata, senza garantire di trovare
la migliore possibile.

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

## 1 Clique

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

Una coppia collegata è tecnicamente una clique di due membri; il report la esclude perché non raggiunge la soglia
di tre nodi. Le clique descrivono una trama fitta di scelte dirette, non
necessariamente una cerchia di amici o un gruppo affiatato.

## 2 Componenti connesse

Una **componente connessa** è un insieme massimale di membri collegati da
percorsi secondo un dato criterio. Un percorso può passare attraverso più
membri intermedi: non richiede una scelta diretta tra ogni coppia.

Si distinguono tre varianti:

- **Componenti deboli**: tutti i membri sono raggiungibili tra loro
  **ignorando la direzione** delle scelte.
- **Componenti forti**: da ogni membro si può raggiungere ogni altro membro
  **seguendo le frecce**. Il percorso di ritorno può passare per membri diversi.
- **Componenti forti con soli legami reciproci**: si usano soltanto i legami
  per cui $a_{ij} = a_{ji} = 1$. Poiché ogni collegamento vale nei due versi,
  queste componenti sono gli insiemi connessi della rete che conserva
  soltanto le scelte reciproche.

### 2.1 Un esempio

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
entrata o in uscita: dipende dal criterio adottato. In questo esempio,
le componenti di un solo membro non vengono mostrate nel report.

### 2.2 Come si confrontano i criteri

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

## 3 Clique o componenti: che differenza c'è?

### 3.1 Legame diretto o percorso

- **La clique richiede una scelta diretta tra ogni coppia**, in almeno una
  direzione.
- **La componente richiede un percorso**, secondo il criterio adottato.
  Può quindi contenere lunghe catene di intermediari e poche scelte dirette.

### 3.2 Sovrapposizione

Prima di applicare la soglia dei tre nodi, le componenti **dividono**
l'insieme dei membri per ciascuno dei tre criteri:
ognuno appartiene a una sola componente. Le clique possono invece
**sovrapporsi**: lo stesso membro può appartenere a più clique, oppure a
nessuna clique di almeno tre membri.

### 3.3 Una clique non è necessariamente una componente forte

Considera le sole scelte $1 \rightarrow 2$, $1 \rightarrow 3$ e
$2 \rightarrow 3$. L'insieme $\{1, 2, 3\}$ è una clique, perché ogni coppia è
collegata. Non è una componente forte, perché dal membro $3$ non si raggiungono
gli altri. In questa rete di tre membri è invece una componente debole.

### 3.4 Una componente non è necessariamente una clique

Considera il ciclo:

$$
1 \rightarrow 2 \rightarrow 3 \rightarrow 4 \rightarrow 1
$$

Tutti raggiungono tutti seguendo le frecce: è una componente forte. Non è una
clique, perché mancano scelte dirette tra $1$ e $3$ e tra $2$ e $4$.

Ogni clique è contenuta in una componente debole, ma una componente debole
non è necessariamente una clique.
La clique non va quindi inserita nella scala reciproca → forte → debole:
descrive la presenza di collegamenti diretti, non soltanto la raggiungibilità.

## 4 Comunità di Louvain

L'algoritmo di **Louvain** cerca una suddivisione della rete con **modularità**
elevata: privilegia comunità nelle quali le scelte interne sono più numerose
di quanto previsto da un modello di riferimento che tiene conto dei gradi
dei nodi.

Non cerca gruppi necessariamente separati: tra comunità diverse possono
esistere scelte. Ogni membro viene assegnato a una sola comunità nella
suddivisione ottenuta.

### 4.1 La modularità Q

La **modularità** ($Q$) è un indice senza unità di misura che valuta una
suddivisione rispetto al modello di riferimento:

- $Q$ vicino a $0$: nel complesso, i legami interni sono circa quelli attesi
  secondo il modello di riferimento;
- $Q$ positivo: i legami interni sono più numerosi del previsto;
- $Q$ negativo: i legami interni sono meno numerosi del previsto.

$Q$ non misura il benessere del gruppo e non dimostra, da solo, che esistano
sottogruppi socialmente significativi. Un valore vicino a zero non prova che
le relazioni siano casuali; un valore elevato non equivale a un test di
significatività. I confronti tra reti diverse richiedono cautela.

### 4.2 Cosa cambia rispetto alle altre strutture

Clique e componenti seguono definizioni esatte, ma le clique possono
sovrapporsi e quindi non costituiscono necessariamente una partizione. Le comunità di Louvain
costituiscono invece una partizione ottenuta tramite ottimizzazione euristica.

La suddivisione può variare tra esecuzioni e al cambiare dei dati. È utile per
formulare ipotesi sull'organizzazione della rete, non per attribuire ai membri
appartenenze rigide o identità stabili.

## 5 Comunità di Leiden

Come Louvain, **Leiden** cerca una suddivisione con modularità elevata, ma
aggiunge un passaggio di affinamento per evitare comunità con parti scollegate.
I membri di una stessa comunità sono collegati da percorsi interni alla
comunità: non serve che ogni coppia abbia un legame diretto.

Nel report le comunità di Leiden vengono calcolate sulla **proiezione non
orientata** della rete delle scelte: due membri sono collegati quando almeno
uno dei due sceglie l'altro. Una scelta a senso unico e una scelta reciproca
producono quindi lo stesso collegamento. Louvain lavora invece sulla rete
orientata, in cui le due frecce di una scelta reciproca restano distinte.
Poiché i due algoritmi partono da rappresentazioni diverse della rete, un
$Q$ più alto non basta per dire quale suddivisione sia più informativa.

Come per Louvain, ogni membro viene assegnato a una sola comunità nella
suddivisione ottenuta, e tra comunità diverse possono esistere scelte.

## 6 In sintesi

Per leggere il report, parti dalla domanda che ti interessa: cerca le clique
per i legami diretti, le componenti per i
percorsi e le comunità per la concentrazione delle scelte. Poi confronta ciò
che emerge con la domanda del questionario e con le osservazioni sul gruppo.

| Struttura                                  | Criterio                                                  | Cautela di lettura                                          |
| ------------------------------------------ | --------------------------------------------------------- | ----------------------------------------------------------- |
| Clique                                     | Almeno una scelta diretta tra ogni coppia                 | Non richiede reciprocità; può sovrapporsi ad altre clique   |
| Componente forte con soli legami reciproci | Percorsi formati soltanto da scelte reciproche            | Può contenere lunghe catene, non solo legami diretti        |
| Componente forte                           | Percorsi in entrambi i versi seguendo le frecce           | Può avere collegamenti a senso unico con altre componenti   |
| Componente debole                          | Percorsi ignorando la direzione delle scelte              | La connessione riguarda i dati, non tutti i rapporti reali  |
| Comunità di Louvain                        | Partizione con modularità elevata                         | È un risultato euristico, non un'appartenenza sociale certa |
| Comunità di Leiden                         | Partizione con modularità elevata e comunità ben connesse | È un risultato euristico, non un'appartenenza sociale certa |
