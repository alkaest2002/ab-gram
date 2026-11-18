---
title: Archiviare e riprendere un progetto
order: 6
---

L'archivio è il modo in cui AB-Gram salva il tuo lavoro. Per tutelare la tua
privacy, l'applicazione **non usa alcun meccanismo di memorizzazione** per conservare i dati e
recuperarli in seguito: nomi, scelte e rifiuti restano solo nella memoria
dell'applicazione, per la durata della sessione.

Di conseguenza, **scaricare l'archivio e ricaricarlo più tardi è l'unico modo
per mettere in pausa un progetto**. Se chiudi o ricarichi la pagina senza
aver scaricato l'archivio, il lavoro non salvato andrà perso.

## 1 Scaricare l'archivio

Il pulsante con l’icona di download, indicato come **Scarica progetto**,
è disponibile nella barra di navigazione quando il passaggio lo consente.
Se è disattivato mentre modifichi i nomi, correggi prima le voci vuote o duplicate. Cliccandolo, l'applicazione scarica un file di testo
contenente una fotografia completa del sociogramma: nomi, scelte e rifiuti.

Il file ha un nome del tipo:

```txt
sociogram-data-2026-10-10T14-30-00.txt
```

Il nome riporta la data e l’ora UTC del salvataggio, così puoi distinguere
facilmente le versioni successive dello stesso progetto.

### 1.1 Quando usarlo

- Prima di chiudere o ricaricare la pagina, per non perdere il lavoro.
- Per mettere in pausa un progetto lungo e riprenderlo in un secondo momento.
- Quando raggiungi un traguardo significativo, ad esempio dopo aver completato
  l'elenco dei membri o un gruppo di scelte: nei progetti lunghi è una buona
  abitudine, perché limita il lavoro da rifare in caso di imprevisti.
- Per condividere lo stato del lavoro con un collaboratore.

## 2 Riprendere un progetto

Per riaprire un archivio:

1. Nella schermata iniziale scegli **Importa progetto**.
2. Seleziona il file `.txt` scaricato con **Scarica progetto**, non il semplice
   elenco di nominativi usato per creare un nuovo progetto.
3. Attendi il riepilogo con il numero di membri importati e premi **Avanti**.
4. Rivedi l’elenco dei membri e prosegui verso le preferenze o il riepilogo.

L’archivio ripristina i nominativi, l’ordine delle preferenze e le indicazioni
di assenza di scelte o rifiuti, anche se la compilazione era parziale. Non
ripristina il passaggio o la persona visualizzata al momento del download. Prima di caricare i dati, l'applicazione verifica
che il file sia un archivio valido e coerente; se qualcosa non va, mostra un
messaggio che spiega il problema.

## 3 Cosa succede durante l'importazione di un progetto archiviato

L'applicazione:

1. Legge il file di testo.
2. Decodifica il contenuto.
3. Verifica che l'archivio sia valido e coerente.
4. Se tutto è corretto, carica i dati.

In caso di errore, viene mostrato un messaggio che spiega il problema (ad
esempio un file che non è un archivio valido).

## 4 Conservare gli archivi

Poiché il file archiviato contiene i dati del tuo sociogramma, trattalo con la
stessa cura che riserveresti a qualsiasi documento con informazioni sulle
persone: salvalo in un luogo sicuro e condividilo solo con chi è autorizzato a
vederlo.

## 5 Buone pratiche

1. Scarica l'archivio ogni volta che raggiungi un punto fermo, e sempre prima
   di chiudere la pagina.
2. Conserva i file di archivio con nomi riconoscibili: se lavori a più
   progetti, puoi rinominare il file aggiungendo, ad esempio, il nome del
   gruppo, mantenendo la data nel nome.
3. Nei progetti lunghi, tieni più copie successive invece di sovrascrivere
   sempre la stessa: potrai tornare a una versione precedente se necessario.
4. Non modificare il contenuto del file: l'import verifica che i dati siano
   validi e coerenti, e un archivio alterato potrebbe essere rifiutato.

## 4 Privacy e conservazione dei file

L'archivio contiene i nomi e le relazioni del gruppo. Poiché l'applicazione
non conserva nulla per conto tuo, la custodia del file è interamente nelle
tue mani: salvalo in un luogo sicuro, condividilo solo con chi è autorizzato a
vederlo ed eliminalo quando non ti serve più.

## 4 Proteggere l’archivio

Il contenuto è **codificato, non cifrato**: chi possiede il file può recuperare
nomi e relazioni. Conservalo in un luogo protetto e condividilo solo con chi è
autorizzato. La codifica non rende anonimi i dati.

Ogni download crea una nuova copia: non aggiorna automaticamente quelle già
scaricate. Verifica che il file sia presente prima di chiudere la pagina e
conserva la versione più recente. L’archivio contiene i dati del progetto,
non una copia del report generato.
