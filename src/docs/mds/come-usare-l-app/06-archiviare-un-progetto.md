---
title: Archiviare un progetto
order: 3
description: Come salvare e recuperare i dati inseriti nell'applicazione.
---

I dati inseriti possono essere salvati per riprenderli in un secondo momento.
AB-Grid archivia tutto in un formato semplice e leggibile.

## Salvataggio

Il salvataggio produce un file JSON con nomi e relazioni:

```json
{
  "membri": ["Anna", "Bea", "Emma"],
  "relazioni": [
    { "da": "Anna", "a": "Bea", "tipo": "preferenza" }
  ]
}
```

### Formati supportati

- **JSON** — formato consigliato per riaprire il lavoro.
- **CSV** — utile per condividere i dati con altri strumenti.

## Recupero

Quando riapri un file archiviato, l'applicazione ricostruisce il grafo e puoi
ripartire esattamente da dove avevi lasciato.
