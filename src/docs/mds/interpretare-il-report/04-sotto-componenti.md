---
title: Sotto-componenti
order: 4
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

> **Scelte, non rifiuti.** In questa sezione analizziamo le **scelte**, cioè i
> legami positivi descritti dalla matrice $A$. Le stesse definizioni valgono
> anche per i rifiuti (matrice $B$), ma il loro significato è molto meno
> intuitivo: un insieme di persone che si rifiutano a vicenda non forma un
> "sottogruppo affiatato". Per questo ti consigliamo di concentrare l'analisi
> sulle scelte.

## Diadi

Una **diade** è una coppia di membri che si scelgono a vicenda:

$$
a_{ij} = a_{ji} = 1
$$

In parole: $i$ sceglie $j$ **e** $j$ sceglie $i$.

È l'unità più piccola possibile di reciprocità: un legame "confermato" da
entrambe le parti, e non solo dichiarato da una.

## Clique

Una **clique** è un sottogruppo in cui ognuno è collegato direttamente a tutti
gli altri, senza considerare chi ha scelto chi. Pensa a una cerchia di amici in
cui tutti si conoscono personalmente, e non solo tramite qualcuno in comune.

$$
\forall\, i, j \in C,\ i \neq j : \quad a_{ij} = 1 \ \lor\ a_{ji} = 1
$$

Per leggere la formula:

- $C$ è l'insieme di membri che stiamo esaminando;
- $\forall$ significa "per ogni" e $\lor$ significa "oppure";
- quindi: per **ogni** coppia di membri diversi $i$ e $j$ di $C$, almeno uno dei
  due sceglie l'altro.

Basta che il legame esista in **una sola direzione**: non serve che la scelta
sia reciproca.

Due precisazioni utili:

- di solito si cercano le clique **massimali**, cioè quelle a cui non si può
  aggiungere nessun altro membro senza perdere la proprietà (altrimenti ogni
  sottoinsieme di una clique sarebbe a sua volta una clique);
- una coppia collegata è tecnicamente una clique di due membri, ma è un caso
  banale. In pratica l'attenzione va alle clique di **almeno tre** membri.

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
  collegamento. Poiché un legame reciproco va in entrambe le direzioni, qui la
  direzione non pesa più: si tratta semplicemente dei "blocchi" che si formano
  unendo le diadi.

### Un esempio

Immagina tre membri in catena: il membro $1$ sceglie il $2$, e il $2$ sceglie
il $3$ (nessun'altra scelta).

$$
1 \rightarrow 2 \rightarrow 3
$$

- Come **componente debole** il gruppo è unito: ignorando le frecce, tutti sono
  collegati.
- Come **componente forte** non lo è: dal membro $1$ si arriva al $3$ seguendo le
  frecce, ma dal $3$ non si può tornare indietro. Le componenti forti sono tre,
  una per ciascun membro: $\{1\}$, $\{2\}$, $\{3\}$.
- Come componente forte con **soli legami reciproci** non lo è nemmeno, perché
  non c'è nessuna scelta reciproca.

### Quanto è severo il criterio

Le tre varianti sono annidate: ogni legame reciproco è anche un legame
orientato, e ogni legame orientato è anche un legame se ignoriamo la direzione.
Di conseguenza:

$$
\text{comp. forte reciproca} \ \subseteq\ \text{comp. forte} \ \subseteq\ \text{comp. debole}
$$

Cioè ogni componente forte con soli legami reciproci sta dentro una componente
forte, e ogni componente forte sta dentro una componente debole. Più il criterio
è severo, più il legame tra i membri deve essere solido perché li si consideri
parte della stessa componente, e più il gruppo tende a spezzarsi in pezzi
piccoli.

Le componenti aiutano così a capire se il gruppo è **unito** oppure **diviso in
sottogruppi separati**, senza contatti tra loro.

## Clique o componenti: che differenza c'è?

Clique e componenti connesse descrivono due idee diverse di "stare insieme", e
vanno tenute distinte.

### Cosa richiedono

- **La clique chiede un legame diretto tra ogni coppia.** Se $i$ e $j$ fanno
  parte della stessa clique, tra loro c'è per forza una scelta, in almeno una
  delle due direzioni. Non basta conoscersi "tramite qualcuno".
- **La componente chiede solo che esista un percorso.** Due membri possono
  appartenere alla stessa componente senza essersi mai scelti direttamente,
  purché li colleghi una catena di intermediari.

Per questo le componenti sono strutture **meno compatte** delle clique: possono
contenere legami radi e lunghe catene di intermediari, mentre una clique impone
un legame diretto tra ogni coppia.

### Sovrapposizione

Le componenti **dividono** il gruppo: ogni membro appartiene a una sola
componente (un membro isolato forma una componente da solo). Le clique invece
possono **sovrapporsi**: lo stesso membro può far parte di più clique, e molti
membri possono non far parte di nessuna clique di dimensione apprezzabile.

### Una clique non è per forza una componente forte

Qui conta la direzione. Nella nostra definizione di clique basta una scelta in
un solo verso, mentre le componenti forti richiedono di poter percorrere le
frecce nel loro verso.

Esempio: il membro $1$ sceglie il $2$ e il $3$, e il $2$ sceglie il $3$.

- Ogni coppia è collegata ($1$-$2$, $1$-$3$, $2$-$3$), quindi $\{1, 2, 3\}$ è una
  **clique**.
- Ma dal $3$ non si raggiunge nessuno, quindi **non** è una componente forte.
  È invece una componente debole.

### Una componente non è per forza una clique

Esempio: quattro membri in cerchio, con $1$ che sceglie il $2$, il $2$ il $3$,
il $3$ il $4$ e il $4$ l'$1$.

$$
1 \rightarrow 2 \rightarrow 3 \rightarrow 4 \rightarrow 1
$$

- Seguendo le frecce ognuno raggiunge tutti gli altri, quindi è una
  **componente forte**.
- Ma $1$ e $3$ non si sono scelti direttamente (e lo stesso vale per $2$ e $4$),
  quindi **non** è una clique.

### Il legame tra le due nozioni

Una sola implicazione vale sempre: **ogni clique sta dentro una componente
debole**, perché i suoi membri sono già collegati direttamente tra loro. Non
vale il contrario: una componente debole può essere molto più grande, e molto
più rada, di qualunque clique al suo interno.

Attenzione: per questo motivo la clique **non** va inserita nella scala di
severità vista sopra (reciproca → forte → debole). È una struttura di tipo
diverso, che misura la compattezza e non la raggiungibilità.

| | Clique | Componente debole | Componente forte |
| --- | --- | --- | --- |
| Cosa richiede | Legame diretto tra ogni coppia | Percorso tra ogni coppia, ignorando le frecce | Percorso tra ogni coppia, seguendo le frecce |
| Direzione delle scelte | Non conta | Non conta | Conta |
| Sovrapposizione | Possibile | No, dividono il gruppo | No, dividono il gruppo |
| Risponde alla domanda | "Chi è molto legato a tutti gli altri?" | "Il gruppo è in un pezzo solo?" | "Si può arrivare a tutti seguendo le scelte?" |

## In sintesi

| Struttura | Cosa richiede | Quanto è compatta |
| --------- | ------------- | ----------------- |
| Diade | Due membri che si scelgono a vicenda | Massima (ma coinvolge solo due persone) |
| Clique | Ognuno collegato direttamente a tutti gli altri | Alta |
| Componente forte con soli legami reciproci | Percorso tra ogni coppia usando solo legami reciproci | Media: catene di diadi |
| Componente forte | Percorso tra ogni coppia seguendo le frecce | Più bassa |
| Componente debole | Percorso tra ogni coppia ignorando le frecce | La più bassa: può contenere lunghe catene di intermediari |
