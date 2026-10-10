---
title: Sotto-componenti
order: 3
description: Come individuare i sottogruppi e le strutture interne del gruppo.
---

Oltre alle metriche, il sociogramma può essere scomposto in sotto-strutture che
rivelano come il gruppo è organizzato al suo interno: coppie, gruppi compatti e
componenti connesse.

## Diadi

Una diade è una coppia di membri legati da una relazione reciproca:

$$
a_{ij} = a_{ji} = 1
$$

Sono le unità più piccole di reciprocità e indicano un legame confermato da
entrambe le parti.

## Clique

Una clique è un insieme di membri in cui ognuno è collegato a tutti gli altri,
ignorando la direzione dei legami:

$$
\forall i, j \in C,\ i \neq j : a_{ij} \lor a_{ji}
$$

Le clique evidenziano i sottogruppi più compatti, in cui le relazioni sono
particolarmente dense.

## Componenti connesse

Una componente connessa è un insieme di membri raggiungibili tra loro:

- **Componenti deboli** — ogni membro raggiunge ogni altro ignorando la
  direzione dei legami.
- **Componenti forti** — ogni membro raggiunge ogni altro seguendo la direzione
  dei legami.
- **Componenti forti con soli legami reciproci** — come le componenti forti, ma
  costruite usando solo le relazioni reciproche ($a_{ij} = a_{ji} = 1$).

Le sotto-componenti aiutano a capire se il gruppo è unito oppure
diviso in sottogruppi separati.

> **Nota sulla densità dei legami.** Le componenti (deboli, forti e forti con
> soli legami reciproci) sono definite dalla *raggiungibilità*, non dalla
> completezza: è sufficiente che esista un percorso tra due membri, non che
> siano collegati direttamente. Sono quindi strutture <u>meno compatte
  > delle clique</u>, in cui invece ogni membro è legato a tutti gli altri. Una
> componente può contenere legami radi e catene di intermediari, mentre una
> clique impone un legame diretto tra ogni coppia.
