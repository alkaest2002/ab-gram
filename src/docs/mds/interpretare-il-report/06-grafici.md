---
title: Grafici
order: 6
description: Come leggere i grafici prodotti dal report.
---

Il report contiene due tipi di grafico: il sociogramma di rete, che mostra il
gruppo nel suo insieme, e il grafico ego, che mostra le relazioni dal punto di
vista di un singolo membro.

## Il sociogramma di rete

Il sociogramma di rete compare nelle pagine "Rete delle scelte" e "Rete dei
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

La disposizione è calcolata con un algoritmo che avvicina i membri collegati
tra loro: i sottogruppi tendono ad apparire come gruppi di nodi vicini. La
posizione non esprime un ordine di importanza.

## Il grafico ego

Il grafico ego compare nella pagina individuale di ogni membro. Mette il membro
al centro e dispone tutti gli altri intorno a lui.

### Il centro e gli anelli

- Il membro analizzato sta al centro.
- Gli altri membri sono collocati su cinque anelli concentrici, in base a
  quanti passi di "scelta" servono per raggiungerli partendo dal membro
  centrale:

| Anello | Sigla | Significato |
| --- | --- | --- |
| 1 | `0MU` | Scelta reciproca |
| 2 | `0HP` | Scelto direttamente, senza ricambio |
| 3 | `1HP` | Raggiungibile tramite un solo intermediario |
| 4 | `2HP+` | Raggiungibile tramite due o più intermediari |
| 5 | `UNR` | Non raggiungibile |

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
