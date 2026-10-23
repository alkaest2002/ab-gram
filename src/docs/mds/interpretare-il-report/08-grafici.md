---
title: Grafici
order: 8
description: Come leggere i grafici prodotti dal report.
---

Il report contiene due tipi di grafico: il grafo di rete, che mostra il
gruppo nel suo insieme, e il grafico ego, che mostra le relazioni dal punto di
vista di un singolo membro.

## Il grafo di rete

Il grafo di rete compare nelle pagine "Rete delle scelte" e "Rete dei
rifiuti". Ogni pagina mostra una sola rete: le scelte sono disegnate in blu, i
rifiuti in rosso.

### Nodi e linee

- Ogni nodo è un membro, rappresentato da un cerchio colorato con il suo
  identificativo.
- Ogni linea è una relazione tra due membri.

### Freccia e spessore

La direzione e il tipo di legame sono codificati dalla linea:

- Una linea con freccia indica una relazione non reciproca; la freccia punta
  verso il membro scelto (o rifiutato).
- Una linea più spessa e senza freccia indica una relazione reciproca.

### Membri isolati

I membri che non hanno alcuna relazione sono disegnati separatamente, in nero,
sotto il grafo principale.

### Posizione dei nodi

La disposizione è calcolata con un algoritmo di posizionamento force-directed (a forze simulate), che tratta la rete come un sistema fisico: i nodi si comportano come particelle che si respingono a vicenda, mentre i collegamenti agiscono come molle che attirano i nodi connessi. A partire da una configurazione iniziale casuale, il sistema si evolve iterativamente fino a raggiungere uno stato di equilibrio, in cui le forze di attrazione e repulsione si bilanciano. Il risultato è che i membri collegati tra loro tendono ad avvicinarsi e i sottogruppi molto connessi appaiono come gruppi di nodi vicini.

È importante notare che la posizione dei nodi non esprime un ordine di importanza: la distanza dal centro o dai bordi del grafico non indica un ruolo più o meno rilevante all’interno della rete.

Inoltre, poiché l’inizializzazione è casuale, l’algoritmo può convergere verso configurazioni di equilibrio diverse a ogni esecuzione, anche a partire dagli stessi dati: il layout finale, e quindi l’orientamento, la forma complessiva e la collocazione relativa dei gruppi, può variare da una generazione all’altra. Per questi motivi non bisogna attribuire eccessiva importanza alle caratteristiche topologiche apparenti del grafo, come la centralità visiva di un nodo o la distanza tra due gruppi; per valutarle in modo affidabile è preferibile ricorrere a misure quantitative calcolate sulla rete (ad esempio grado, centralità e modularità).

### Rigenerare la disposizione

Se il grafo risulta troppo affollato o poco leggibile, un pulsante **Rigenera
il grafico** in basso a destra del grafo (visibile a schermo, non in stampa)
permette di ricalcolare la disposizione dei nodi. Aprendolo puoi regolare due
parametri:

- lo **Scaling ratio** governa quanto il grafo è disteso: valori più alti
  distanziano i gruppi e li rendono più leggibili, valori più bassi li
  compattano. È il primo valore da aumentare con i gruppi numerosi.
- la **Gravity** attira i nodi verso il centro: valori alti mantengono il grafo
  raccolto, valori troppo alti ne schiacciano la struttura nascondendo i
  sottogruppi.

Poiché la disposizione iniziale è casuale, rigenerare il grafo anche con gli
stessi parametri può produrre un layout diverso: prova più volte finché non
ottieni una disposizione chiara.

## Il grafico ego

Il grafico ego compare nella pagina individuale di ogni membro. Mette il membro
al centro e dispone tutti gli altri intorno a lui.

### Il centro e gli anelli

- Il membro analizzato sta al centro.
- Gli altri membri sono collocati su cinque anelli concentrici, in base a
  quanti passi di "scelta" servono per raggiungerli partendo dal membro
  centrale:

| Anello | Sigla  | Significato                                  |
| ------ | ------ | -------------------------------------------- |
| 1      | `0MU`  | Scelta reciproca                             |
| 2      | `0HP`  | Scelto direttamente, senza ricambio          |
| 3      | `1HP`  | Raggiungibile tramite un solo intermediario  |
| 4      | `2HP+` | Raggiungibile tramite due o più intermediari |
| 5      | `UNR`  | Non raggiungibile                            |

I cerchi tratteggiati separano gli anelli e le sigle sono riportate lungo la
linea verticale superiore, dal centro verso l'esterno.

### Colori dei nodi

Il colore del bordo di un nodo indica il tipo di legame con il membro centrale:

- Rosso: rifiuto, in una delle due direzioni.
- Blu: scelta, in una delle due direzioni.
- Nero: nessuna scelta né rifiuto diretti.

### I triangoli di direzione

I piccoli triangoli accanto a un nodo indicano la direzione del legame:

- Un triangolo rivolto verso il centro: quel membro sceglie (blu) o rifiuta
  (rosso) il membro centrale.
- Un triangolo rivolto verso l'esterno: il membro centrale sceglie (blu) o
  rifiuta (rosso) quel membro.

## Come leggere i due grafici

Usa il sociogramma di rete per avere il quadro d'insieme del gruppo, poi passa
ai grafici ego per approfondire la posizione di ciascun membro rispetto a tutti
gli altri.
