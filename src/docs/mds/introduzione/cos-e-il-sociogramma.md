---
title: Cos'è AB-Grid
order: 1
description: Una panoramica sul sociogramma e sul ruolo dell'applicazione.
---

Un sociogramma è la rappresentazione grafica delle relazioni tra i membri di un
gruppo. AB-Grid trasforma un semplice elenco di nomi e di scelte in una mappa
visiva che mostra chi è legato a chi.

## Nodi e relazioni

Ogni persona del gruppo è un **nodo**; ogni scelta o rifiuto è una **relazione**
che collega due nodi.

### Scelte e rifiuti

- Una **preferenza** segnala un legame positivo.
- Un **rifiuto** segnala un legame negativo.
- La **direzione** indica chi ha espresso la scelta.

## Perché è utile

Il sociogramma rende visibili i rapporti che restano nascosti nelle tabelle:

1. Chi è al centro del gruppo.
2. Chi resta isolato.
3. Quali sottogruppi si formano.

## Un esempio minimo

Un gruppo di tre persone può essere descritto così:

```csv
da,a,tipo
Anna,Bea,preferenza
Anna,Emma,rifiuto
```

Da queste righe AB-Grid costruisce il grafo da leggere e interpretare.
