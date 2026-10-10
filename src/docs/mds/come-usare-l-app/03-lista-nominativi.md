---
title: Caricare la lista dei nominativi
order: 3
description: Come inserire e ordinare i membri del gruppo.
---

Il primo passaggio consiste nel caricare i nomi delle persone che compongono il
gruppo.

## Formato del file

L'applicazione accetta un file di testo con **un nominativo per riga**:

```txt
Rossi Mario
Bianchi Anna
Verdi Luca
```

### Limiti

- Al massimo **35 nominativi**.
- Ogni nominativo può contenere al massimo **150 caratteri**.

## Ordinare i nominativi

Prima di caricare il file puoi scegliere come ordinare i nomi:

- **Mantieni l'ordine del file** — usa l'ordine in cui compaiono.
- **Ordina alfabeticamente** — riordina i nomi dalla A alla Z.
- **Mescola in modo casuale** — dispone i nomi in ordine casuale.

## Controllare e modificare l'elenco

Dopo il caricamento puoi rivedere l'elenco:

- **Clicca** su un nome per modificarlo; premi **Invio** per confermare o **Esc**
  per annullare.
- **Aggiungi** una persona con il pulsante in fondo all'elenco.
- **Elimina** una persona con il pulsante a destra del nome.

Un riquadro di riepilogo mostra il numero di persone, di nomi duplicati e di
nomi vuoti.

## Controlli automatici

Per poter proseguire l'elenco deve rispettare due condizioni:

- Nessun nome vuoto.
- Nessun nome duplicato.

Due persone con lo stesso nome sono ammesse solo se rinominate o distinte: finché
resta un nome vuoto o duplicato, il pulsante **Avanti** resta disattivato.
