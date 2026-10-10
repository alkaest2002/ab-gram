---
title: Sotto-componenti
order: 3
description: Come individuare i sottogruppi e le strutture interne del gruppo.
---

Oltre alle metriche, il sociogramma (la mappa del gruppo, in cui i membri sono
punti e le scelte sono frecce) può essere scomposto in parti più piccole. Queste
**sotto-strutture** rivelano come il gruppo è organizzato al suo interno: ci
sono coppie affiatate, sottogruppi molto compatti e, a volte, gruppi che non
hanno alcun contatto tra loro. Ne vediamo tre tipi: le diadi, le clique e le
componenti connesse.

Come nella sezione precedente, $a_{ij} = 1$ significa che il membro $i$
**sceglie** il membro $j$, e $a_{ij} = 0$ che non lo sceglie.

## Diadi

Una **diade** è una coppia di membri che si scelgono a vicenda:

$$
a_{ij} = a_{ji} = 1
$$

In parole: $i$ sceglie $j$ **e** $j$ sceglie $i$.

È l'unità più piccola possibile di reciprocità: un legame "confermato" da
entrambe le parti, e non solo dichiarato da una.

## Clique

Una **clique** è un sottogruppo in cui ognuno è collegato a tutti gli altri,
senza considerare chi ha scelto chi. Pensa a una cerchia di amici in cui
tutti si conoscono direttamente, e non solo tramite qualcuno in comune.

$$
\forall i, j \in C,\ i \neq j : a_{ij} \lor a_{ji}
$$

In parole: per **ogni** coppia di membri diversi $i$ e $j$ dell'insieme $C$
(il sottogruppo che stiamo esaminando), almeno uno dei due sceglie l'altro
($\lor$ si legge "oppure").

Il simbolo $\forall$ significa "per ogni". Qui basta che il legame esista in una
sola direzione: non serve che la scelta sia reciproca.

Le clique mettono in evidenza i sottogruppi **più compatti**, quelli in cui le
relazioni sono particolarmente fitte.

## Componenti connesse

Una **componente connessa** è un insieme di membri che sono *raggiungibili* tra
loro: da ciascuno si può arrivare a ciascun altro passando, se serve, per altri
membri intermedi. È come una rete stradale: due città appartengono allo stesso
"blocco" se c'è una strada che le collega, anche passando per altre città.

Esistono tre varianti, a seconda di quanto si tiene conto della direzione delle
scelte (cioè del verso delle frecce):

- **Componenti deboli**: ogni membro raggiunge ogni altro **ignorando la
  direzione** dei legami. Le frecce si possono percorrere in qualsiasi verso.
- **Componenti forti**: ogni membro raggiunge ogni altro **seguendo la
  direzione** dei legami. Le frecce si possono percorrere solo nel verso in cui
  sono disegnate.
- **Componenti forti con soli legami reciproci**: come le componenti forti, ma
  usando **solo le relazioni reciproche** ($a_{ij} = a_{ji} = 1$), cioè quelle
  in cui entrambi si scelgono. Una scelta a senso unico non conta come
  collegamento.

### Un esempio

Immagina tre membri in catena: il membro $1$ sceglie il $2$, e il $2$ sceglie
il $3$ (nessun'altra scelta).

- Come **componente debole** il gruppo è unito: ignorando le frecce, tutti sono
  collegati.
- Come **componente forte** non lo è: dal membro $1$ si arriva al $3$ seguendo le
  frecce, ma dal $3$ non si può tornare indietro.
- Come componente forte con **soli legami reciproci** non lo è nemmeno, perché
  non c'è nessuna scelta reciproca.

Le componenti aiutano a capire se il gruppo è **unito** oppure **diviso in
sottogruppi separati**, senza contatti tra loro. Più è severo il criterio
(debole → forte → forte con soli legami reciproci), più il legame tra i membri
deve essere solido perché li si consideri parte della stessa componente.

> **Nota sulla densità dei legami.** Le componenti (deboli, forti e forti con
> soli legami reciproci) sono definite dalla *raggiungibilità*, non dalla
> completezza: è sufficiente che esista un percorso tra due membri, non che
> siano collegati direttamente. Sono quindi strutture <u>meno compatte delle
> clique</u>, in cui invece ogni membro è legato a tutti gli altri. Una
> componente può contenere legami radi e catene di intermediari, mentre una
> clique impone un legame diretto tra ogni coppia.

## In sintesi

| Struttura | Cosa richiede | Quanto è compatta |
| --------- | ------------- | ----------------- |
| Diade | Due membri che si scelgono a vicenda | Massima (ma coinvolge solo due persone) |
| Clique | Ognuno collegato direttamente a tutti gli altri | Alta |
| Componente connessa | Un percorso tra ogni coppia di membri, anche passando per altri | Più bassa: può contenere catene di intermediari | Componente connessa | Un percorso tra ogni coppia di membri, anche passando per altri | Più bassa: può contenere catene di intermediari |
