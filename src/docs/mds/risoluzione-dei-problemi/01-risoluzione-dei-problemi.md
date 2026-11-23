---
title: Risoluzione dei problemi
order: 1
---

<script setup>
    import { useSociogramStore } from "@/stores/sociogram";
    const store = useSociogramStore()
</script>

Questa pagina raccoglie i problemi più frequenti, organizzati secondo i quattro
passaggi del sociogramma. Cerca il passaggio in cui ti trovi, individua il sintomo
e segui i controlli nell'ordine indicato. I problemi del report e quelli di
salvataggio e recupero del lavoro sono raccolti in due sezioni separate.

> **Prima di ricaricare o chiudere la pagina**, scarica il progetto con **Scarica
> progetto**, se il pulsante è disponibile. I dati restano solo nella memoria
> dell'applicazione: ricaricare la pagina non è un tentativo di riparazione sicuro.

## Come trovare la soluzione

- **Passaggio 1 — Caricamento o importazione:** sezione 1, per il file dei
  nominativi, il pulsante «Avanti» e l'archivio di un progetto precedente.
- **Passaggio 2 — Gestione dei membri:** sezione 2, per nomi duplicati o vuoti
  e passaggio bloccato.
- **Passaggio 3 — Scelte e rifiuti:** sezione 3, per compilazione incompleta
  e avvisi di contraddizione.
- **Passaggio 4 — Riepilogo e generazione:** sezione 4, per i controlli finali
  e il report che non si genera.
- **Report generato:** sezione 5, per rete dei rifiuti, grafici, sigle e PDF.
- **Salvataggio e recupero del lavoro:** sezione 6, per i dati non più visibili
  dopo aver chiuso o ricaricato la pagina.

## 1 Passaggio 1 — Caricamento o importazione

Nel primo passaggio puoi caricare l'elenco dei nominativi per un nuovo progetto
oppure importare l'archivio di un progetto precedente. Sono due file diversi,
anche se entrambi hanno estensione `.txt`.

### 1.1 Il file dei nominativi non viene caricato

Se il file viene rifiutato, controlla prima che sia un elenco di nomi in testo
semplice, non un documento Word, un foglio di calcolo o un archivio di progetto.
Se invece mancano persone o i nomi risultano tagliati, verifica i limiti di lettura.

**Soluzione**

- Salva un **file `.txt` in testo semplice**, preferibilmente con codifica
  **UTF-8**, con **un solo nominativo per riga**. Cambiare soltanto l'estensione
  di un documento non lo converte in testo.
- Per generare il report servono da **{{ store.minMembersCount }} a
  {{ store.maxMembersCount }} membri**. Durante il caricamento vengono letti al
  massimo **{{ store.maxMembersCount }} nominativi** e mantenuti al massimo
  **{{ store.maxMemberNameLength }} caratteri** per nome: ciò che supera questi
  limiti può essere escluso o troncato. Controlla sempre l'elenco risultante.
- Rimuovi righe vuote o intestazioni: ogni riga non vuota viene letta come un
  nome.
- Se hai esportato i nomi da un foglio di calcolo, salva come testo semplice e
  verifica che non siano rimasti separatori (virgole, punti e virgola) all'interno
  delle righe.
- Se compaiono caratteri anomali al posto delle lettere accentate, salva di nuovo
  il file in UTF-8 e ricaricalo prima di inserire le preferenze.

### 1.2 Il pulsante «Avanti» resta disattivato dopo il caricamento

**Soluzione**

Servono **almeno {{ store.minMembersCount }} nominativi** per proseguire.
Controlla il numero di membri effettivamente caricati: se è inferiore al minimo,
completa l'elenco nel file di testo e caricalo di nuovo.

### 1.3 L'importazione dell'archivio fallisce

Quando importi un archivio, l'applicazione verifica che i dati siano **validi e
coerenti**. Se il controllo non passa, mostra un errore di validazione.

**Soluzione**

- Seleziona il **file di testo prodotto dall'applicazione** con _Scarica
  progetto_, non un file creato o modificato a mano.
- **Non modificare** il contenuto dell'archivio: anche piccole modifiche possono
  renderlo incoerente.
- Non confondere i due file `.txt`: l'elenco dei soli nominativi va caricato
  creando un nuovo progetto; l'archivio va aperto con **Importa progetto**.
- Leggi il messaggio di validazione e prova, se disponibile, una copia precedente
  dell'archivio. Non è necessario che tutte le preferenze siano già complete:
  un archivio può contenere un lavoro ancora in corso.
- Se il file proviene da una versione diversa dell'app, conserva l'originale.
  Puoi esportarlo di nuovo solo se riesci ancora ad aprirlo nella versione che
  l'ha creato; altrimenti non è garantito che sia recuperabile.

## 2 Passaggio 2 — Gestione dei membri

### 2.1 Ci sono nomi duplicati o vuoti

Nel passaggio di gestione dei membri un riquadro conta le persone, i **nomi
duplicati** e i **nomi vuoti**. Finché restano duplicati o nomi vuoti, non puoi
proseguire.

**Soluzione**

- Clicca su un nome per correggerlo; premi **Invio** per confermare o **Esc**
  per annullare.
- Due persone con lo stesso nome sono legittime, ma vanno **distinte** (ad
  esempio aggiungendo un'iniziale o un dettaglio), altrimenti risultano
  duplicate.
- Elimina le righe vuote con il pulsante a destra del nome, oppure assegna loro
  un nome.
- Controlla **maiuscole e spazi**: usa sempre la stessa grafia per la stessa
  persona, così scelte e rifiuti si riferiscono al membro giusto.

### 2.2 Il pulsante «Avanti» resta disattivato

**Soluzione**

Non devono esserci **nomi vuoti** né **nomi duplicati**. Controlla i conteggi
nel riquadro di riepilogo e correggi le voci segnalate come descritto nella
sezione 2.1.

## 3 Passaggio 3 — Scelte e rifiuti

### 3.1 Il pulsante «Avanti» resta disattivato

Ogni membro deve avere **entrambe le parti** complete, anche quando non ha
espresso scelte o rifiuti.

**Soluzione**

- Per le **scelte**, inserisci almeno una scelta oppure spunta
  _«Non ha espresso preferenze»_.
- Per i **rifiuti**, inserisci almeno un rifiuto oppure spunta
  _«Non ha espresso rifiuti»_.
- Controlla la barra di avanzamento: indica quanti membri restano da completare.

Non spuntare le caselle solo per sbloccare il passaggio: usale quando
corrispondono alle risposte raccolte.

### 3.2 Un membro è segnalato con un avviso di contraddizione

Se selezioni la stessa persona sia tra le **scelte** sia tra i **rifiuti** di un
membro, il nome viene contrassegnato con un avviso.

**Soluzione**

Non è un errore bloccante: l'applicazione ti lascia registrare la contraddizione
(è il legame _ambivalente_, descritto in _Tipo di legami_). Se invece si tratta
di una svista, deseleziona la persona dall'elenco in cui non dovrebbe comparire.

## 4 Passaggio 4 — Riepilogo e generazione del report

### 4.1 Il pulsante «Avanti» resta disattivato o il report non si genera

La generazione del report verifica che i dati siano completi. Se manca qualcosa,
l'applicazione segnala il problema invece di produrre un report parziale.

**Soluzione**

Assicurati che:

- il gruppo contenga **almeno {{ store.minMembersCount }} membri e non più di {{ store.maxMembersCount }} membri**;
- i nomi siano compilati, distinti e non superino **{{ store.maxMemberNameLength }} caratteri**;
- **ogni membro** abbia scelte e rifiuti completi, oppure abbia dichiarato di
  non averne con le apposite caselle.

Dal riepilogo puoi cliccare sulla scheda di un membro per tornare subito alle
sue preferenze e completarle. Per correggere l'elenco dei nominativi, torna
al passaggio di gestione dei membri usando i comandi dell'applicazione.

## 5 Dopo la generazione — Lettura ed esportazione del report

### 5.1 La rete (o la pagina) dei rifiuti non compare

Nel report la **Rete dei rifiuti** compare solo se è stato registrato almeno
un rifiuto. La sua assenza, da sola, non indica un problema di generazione.

**Soluzione**

Controlla nel riepilogo se sono presenti rifiuti:

- Se nessuno ne ha espressi, è normale che questa pagina non compaia.
- Se i questionari contengono rifiuti ma il riepilogo no, torna alle preferenze,
  completa i dati mancanti e genera di nuovo il report.

### 5.2 Il grafico di rete è confuso o sovrapposto

Con molti membri o molti legami, le linee del grafico possono accavallarsi e la
disposizione dei nodi può risultare poco leggibile. La posizione dei nodi è
calcolata con un algoritmo a forze simulate (ForceAtlas2) che parte da una
configurazione casuale: non ha un significato preciso e può cambiare a ogni
generazione.

**Soluzione**

- Usa il pulsante **Rigenera il grafico** (in basso a destra del grafico, visibile
  a schermo) per ricalcolare la disposizione e aprire i parametri di layout.
- Aumenta lo **Scaling ratio** per ottenere un grafico più **arioso**, con i
  gruppi più distanziati e leggibili; abbassalo per una disposizione più
  compatta. È il primo valore da ritoccare con i gruppi numerosi.
- Regola la **Gravity** per tenere i nodi più **vicini al centro**: valori alti
  compattano il grafico, valori troppo alti ne schiacciano la struttura.
- Rigenera più volte: a parità di dati possono emergere disposizioni più chiare.

Ricorda che **la disposizione è solo visiva**: la distanza dal centro o tra i
gruppi non misura l'importanza di un membro. Per valutazioni affidabili usa le
metriche numeriche (grado, centralità, componenti) descritte nelle altre pagine
del report.

### 5.3 Nel report vedo sigle che non capisco

Le pagine del report usano sigle brevi (ad esempio `RP`, `MP`, `CLQ`, `T1`)
per risparmiare spazio.

**Soluzione**

Consulta il **Glossario**, l'ultima pagina del report, che elenca ogni sigla con
il suo significato esteso. Le definizioni complete delle metriche si trovano
nelle pagine _Metriche individuali_ e _Metriche di gruppo_ di questa guida.

### 5.4 Il lavoro scaricato non contiene il report

**Scarica progetto** salva i dati del sociogramma, non una copia delle pagine
del report. L'archivio serve a riprendere la compilazione e a generare nuovamente
il report nell'applicazione.

**Soluzione**

Per conservare anche il report, usa la funzione di stampa del report e scegli
il salvataggio in PDF nella finestra di stampa del browser. Conserva anche
l'archivio se vuoi poter modificare in seguito nomi, scelte e rifiuti.

### 5.5 Il report stampato o il PDF ha un'impaginazione anomala

Se nella stampa o nel PDF le pagine risultano disposte in modo strano, con
contenuti tagliati, sovrapposti o fuori posto, controlla il browser utilizzato.

**Soluzione**

Usa **Chrome, Edge, Firefox o Safari aggiornato all'ultima versione disponibile**
e riprova a stampare o salvare il report in PDF. Prima di aggiornare il browser
o passare a un altro, usa **Scarica progetto** per conservare i dati; potrai
riaprirli con **Importa progetto** e generare nuovamente il report.

## 6 In qualsiasi passaggio — Salvataggio e recupero del lavoro

### 6.1 Ho perso il lavoro dopo aver aggiornato la pagina

AB-Gram **non salva i dati nella cache del browser**: restano nella memoria
dell'applicazione durante la sessione. Chiudere o ricaricare la pagina fa perdere
i dati non esportati; anche uscire dall'app con la navigazione del browser può
interrompere il lavoro.

**Soluzione**

Se hai già ricaricato la pagina, scegli **Importa progetto** e apri l'ultimo
archivio scaricato. Recupererai i dati presenti al momento di quel download,
non le modifiche successive. **Senza un archivio, l'applicazione non può
recuperare il lavoro della sessione precedente.** Se l'importazione fallisce,
segui i controlli della sezione 1.3.

Per evitare che accada di nuovo:

- Mentre lavori, **non aggiornare la pagina** e non usare i tasti _indietro_ e
  _avanti_ del browser.
- Usa **Scarica progetto** per salvare un archivio a ogni punto fermo; potrai
  riprenderlo in seguito con **Importa progetto**. Vedi _Archiviare e riprendere
  un progetto_.
