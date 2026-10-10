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

## Cricche

Una cricca è un insieme di membri in cui ognuno è collegato a tutti gli altri,
ignorando la direzione dei legami:

$$
\forall i, j \in C,\ i \neq j : a_{ij} \lor a_{ji}
$$

Le cricche evidenziano i sottogruppi più compatti, in cui le relazioni sono
particolarmente dense.

## Componenti connesse

Una componente connessa è un insieme di membri raggiungibili tra loro:

- **Componenti forti** — ogni membro raggiunge ogni altro seguendo la direzione
  dei legami.
- **Componenti deboli** — ogni membro raggiunge ogni altro ignorando la
  direzione dei legami.
- **Componenti forti con soli legami reciproci** — come le componenti forti, ma
  costruite usando solo le relazioni reciproche (\(a_{ij} = a_{ji} = 1\)).

Le componenti deboli e le cricche aiutano a capire se il gruppo è unito oppure
diviso in sottogruppi separati.
