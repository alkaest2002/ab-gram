---
title: Metriche di gruppo
order: 5
description: Le misure che descrivono il gruppo nel suo insieme.
---

Le metriche di gruppo riassumono la struttura sociale con pochi numeri, utili
per confrontare gruppi o momenti diversi.

## Densità

La densità misura quanta parte delle relazioni possibili è effettivamente
presente. Con \(n\) membri ci sono \(n(n-1)\) relazioni dirette possibili; se
\(E\) è il numero di relazioni osservate:

$$
D = \frac{E}{n(n-1)}
$$

Una densità alta indica un gruppo coeso; una bassa, un gruppo frammentato.

## Reciprocità

La reciprocità indica quanta parte delle scelte è ricambiata: è il rapporto tra
le scelte reciproche e tutte le scelte espresse.

$$
R = \frac{\frac{1}{2}\sum_{i,j} a_{ij}\,a_{ji}}{\sum_{i,j} a_{ij}}
$$

- Valori alti: relazioni reciproche frequenti.
- Valori bassi: molte scelte a senso unico.

## Coesione e conflitto

La coesione confronta le coppie di scelta reciproca con tutte le coppie
possibili; il conflitto fa lo stesso con i rifiuti reciproci.

$$
Coh = \frac{\sum_{i,j} a_{ij}\,a_{ji}}{n(n-1)}, \qquad Con = \frac{\sum_{i,j} d_{ij}\,d_{ji}}{n(n-1)}
$$
