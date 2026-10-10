---
title: Generare il report
order: 4
description: Come produrre il report finale dal gruppo caricato.
---

Una volta completati nomi e relazioni, puoi generare il report. Il calcolo è
automatico e il risultato è subito disponibile.

## Avvio del calcolo

La generazione avvia l'analisi del grafo:

```js
const report = generaReport(grafo);
console.log(report.metricheDiGruppo);
```

### Cosa viene calcolato

- Le metriche di gruppo.
- Le metriche individuali.
- I grafici del sociogramma.

## Esportazione

Il report può essere esportato in più formati:

1. Immagine del sociogramma.
2. Tabella delle metriche.
3. File dei dati grezzi.
