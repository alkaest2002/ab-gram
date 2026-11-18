---
title: Grafici di rete e grafici ego
order: 8
---

Il report contiene due tipi di grafico: il grafico di rete, che mostra il
gruppo nel suo insieme, e il grafico ego, che mostra le relazioni dal punto di
vista di un singolo membro.

## 1 Il grafico di rete

Il grafico di rete compare nelle pagine "Rete delle scelte" e "Rete dei
rifiuti". Ogni pagina mostra una sola rete: le scelte sono disegnate in blu, i
rifiuti in rosso.

### 1.1 Nodi e linee

- Ogni nodo è un membro, rappresentato da un cerchio colorato con il suo
  identificativo.
- Ogni linea rappresenta una scelta o un rifiuto rilevato dal questionario,
  non l'insieme delle relazioni reali tra due persone.

### 1.2 Freccia e spessore

La direzione e il tipo di legame sono codificati dalla linea:

- Una linea con freccia indica una relazione non reciproca; la freccia punta
  verso il membro scelto (o rifiutato).
- Una linea più spessa e senza freccia indica una relazione reciproca.

### 1.3 Membri isolati

I membri senza legami in entrata né in uscita **nella rete visualizzata** sono
disegnati separatamente, in nero, sotto il grafico principale. Non avere legami
nella rete dei rifiuti non significa non avere scelte, e viceversa. La
separazione nel disegno non dimostra un isolamento nella vita del gruppo.

### 1.4 Posizione dei nodi

La disposizione è calcolata da un algoritmo _force-directed_ (a forze
simulate): i nodi si respingono e i collegamenti tendono ad avvicinare i nodi
connessi. È un metodo per rendere leggibile la rete, non una misura delle
distanze sociali o affettive.

**Essere al centro del disegno non significa essere più importanti nel
gruppo; essere ai bordi non significa essere esclusi.** Anche nella rete dei
rifiuti, due nodi collegati possono apparire vicini per effetto dell'algoritmo.

La disposizione iniziale è casuale: orientamento, forma e posizione dei nodi
possono cambiare tra generazioni basate sugli stessi dati. Per confrontare le
reti, considera i legami e le misure pertinenti, non le distanze sul foglio.
Anche le metriche descrivono proprietà dei dati, non dimostrano da sole la
qualità delle relazioni: vanno lette insieme al criterio della rilevazione e
alla conoscenza del contesto.

### 1.5 Personalizzare il grafico

Un pulsante **+** in basso a destra del grafico (visibile a schermo, non in
stampa) apre il pannello di personalizzazione, diviso in due sezioni.

#### Evidenziare parti della rete

Nelle reti affollate è utile attenuare i nodi non coinvolti nell'analisi per mettere in
risalto quelli su cui ci si vuole concentrare. I nodi attenuati diventano
bianchi con contorno e identificativo grigi; anche le loro linee in uscita si
attenuano.

I comandi disponibili sono:

- **Tutti visibili** — ripristina tutti i nodi al colore originale.
- **Tutti nascosti** — attenua tutti i nodi.
- **Archi entranti ≥ N** — mette in evidenza solo i nodi che ricevono almeno
  N scelte (o rifiuti).

È inoltre possibile fare clic sui cerchietti dei singoli nodi per attivarne o
disattivarne l'evidenziazione in modo indipendente.

#### Rigenerare la disposizione

Se il grafico risulta troppo affollato o poco leggibile è possibile
ricalcolare la disposizione dei nodi regolando due parametri:

- lo **Scaling ratio** governa quanto il grafico è disteso: valori più alti
  distanziano i gruppi e li rendono più leggibili, valori più bassi li
  compattano. È il primo valore da aumentare con i gruppi numerosi.
- la **Gravity** attira i nodi verso il centro: valori alti mantengono il grafico
  raccolto, valori troppo alti ne schiacciano la struttura nascondendo i
  sottogruppi.

Premendo **Rigenera** l'algoritmo viene rieseguito con i nuovi parametri.
Poiché la disposizione iniziale è casuale, rigenerare il grafico anche con gli
stessi parametri può produrre un layout diverso: prova più volte finché non
ottieni una disposizione leggibile. La rigenerazione cambia il disegno, non
le risposte o le metriche: non scegliere una disposizione perché sembra
confermare un'ipotesi sul gruppo.

## 2 Il grafico ego

Il grafico ego compare nella pagina individuale di ogni membro. Mette il membro
al centro e dispone tutti gli altri intorno a lui.

### 2.1 Il centro e gli anelli

- Il membro analizzato sta al centro.
- Gli altri membri sono collocati su cinque anelli concentrici, in base a
  ai percorsi di scelta che partono dal membro centrale, con un trattamento
  specifico per i membri da lui rifiutati:

| Anello | Sigla  | Significato                                  |
| ------ | ------ | -------------------------------------------- |
| 1      | `0MU`  | Scelta reciproca                             |
| 2      | `0HP`  | Scelto direttamente, senza ricambio          |
| 3      | `1HP`  | Raggiungibile tramite un solo intermediario  |
| 4      | `2HP+` | Raggiungibile tramite due o più intermediari |
| 5      | `DTR`  | Categoria «difficile da raggiungere»         |

I cerchi tratteggiati separano gli anelli e le sigle sono riportate lungo la
linea verticale superiore, dal centro verso l'esterno.

La categoria `DTR` comprende anche i membri rifiutati direttamente dal membro
centrale. Non è quindi una semplice distanza più lunga delle altre, né un
giudizio sull'accessibilità o sulla disponibilità della persona. I percorsi
seguono la direzione delle scelte: ricevere una scelta non equivale a poter
raggiungere chi l'ha espressa.

Gli anelli rappresentano categorie, non distanze affettive. La posizione
angolare dei nodi sullo stesso anello non ha un significato relazionale.

### 2.2 Colori dei nodi

Il colore del bordo di un nodo indica il tipo di legame con il membro centrale:

- Rosso: rifiuto, in una delle due direzioni.
- Blu: scelta, in una delle due direzioni.
- Nero: nessuna scelta né rifiuto diretti.

### 2.3 I triangoli di direzione

I piccoli triangoli accanto a un nodo indicano la direzione del legame:

- Un triangolo rivolto verso il centro: quel membro sceglie (blu) o rifiuta
  (rosso) il membro centrale.
- Un triangolo rivolto verso l'esterno: il membro centrale sceglie (blu) o
  rifiuta (rosso) quel membro.

## 3 Come leggere i due grafici

Usa il grafico di rete (scelte o rifiuti) per avere il quadro d'insieme del gruppo, poi passa
ai grafici ego per approfondire la posizione di ciascun membro rispetto a tutti
gli altri, limitatamente alle risposte raccolte.

I grafici possono rendere riconoscibili le persone anche quando usano codici.
Non mostrarli al gruppo né diffonderli senza valutare finalità, destinatari e
rischi per la riservatezza; per la restituzione, segui le cautele della pagina
«Comunicare i risultati».
