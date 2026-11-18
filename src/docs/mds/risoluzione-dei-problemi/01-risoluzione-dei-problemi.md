---
title: Risoluzione dei problemi
order: 1
---

<script setup>
    import { useSociogramStore } from "@/stores/sociogram";
    const store = useSociogramStore()
</script>

Questa pagina raccoglie i problemi più frequenti, dal caricamento dei nominativi
alla lettura del report. Individua il sintomo e segui i controlli nell'ordine indicato.

> **Prima di ricaricare o chiudere la pagina**, scarica il progetto con **Scarica
> progetto**, se il pulsante è disponibile. I dati restano solo nella memoria
> dell'applicazione: ricaricare la pagina non è un tentativo di riparazione sicuro.

## Come trovare la soluzione

- **Caricamento:** sezioni 1 e 8, per distinguere l'elenco dei nomi dall'archivio.
- **Compilazione:** sezioni 2–4, per passaggi bloccati, nomi e contraddizioni.
- **Report:** sezioni 5–6 e 9–11, per generazione, rifiuti, grafici, sigle e PDF.
- **Lavoro non più visibile:** sezione 7, per capire cosa puoi recuperare.

## 1 Il file dei nominativi non viene caricato

Se il file viene rifiutato, controlla prima che sia un elenco di nomi in testo
semplice, non un documento Word, un foglio di calcolo o un archivio di progetto.
Se invece mancano persone o i nomi risultano tagliati, verifica i limiti di lettura.

### 1.1 Soluzione

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

## 2 Il pulsante «Avanti» resta disattivato

Ogni passaggio si sblocca solo quando i suoi dati sono completi, quindi
«Avanti» può restare grigio. Il motivo dipende dal passaggio in cui ti trovi.

### 2.1 Soluzione

- **Caricamento dei nomi:** serve **almeno un nominativo** per proseguire.
- **Gestione dei membri:** non devono esserci **nomi vuoti** né **nomi
  duplicati** (vedi la sezione seguente).
- **Scelte e rifiuti:** per ogni membro devi completare **entrambe le parti**:
  inserire almeno una scelta oppure spuntare _«Non ha espresso preferenze»_;
  inserire almeno un rifiuto oppure spuntare _«Non ha espresso rifiuti»_. La barra
  di avanzamento indica quanti membri restano da completare. Non spuntare le
  caselle solo per sbloccare il passaggio: usale quando corrispondono alle
  risposte raccolte.
- **Riepilogo:** il gruppo deve contenere **almeno {{ store.minMembersCount }} membri e non più di {{ store.maxMembersCount }} membri**; tutti i membri devono essere completi.

## 3 Ci sono nomi duplicati o vuoti

Nel passaggio di gestione dei membri un riquadro conta le persone, i **nomi
duplicati** e i **nomi vuoti**. Finché restano duplicati o nomi vuoti, non puoi
proseguire.

### 3.1 Soluzione

- Clicca su un nome per correggerlo; premi **Invio** per confermare o **Esc**
  per annullare.
- Due persone con lo stesso nome sono legittime, ma vanno **distinte** (ad
  esempio aggiungendo un'iniziale o un dettaglio), altrimenti risultano
  duplicate.
- Elimina le righe vuote con il pulsante a destra del nome, oppure assegna loro
  un nome.
- Controlla **maiuscole e spazi**: usa sempre la stessa grafia per la stessa
  persona, così scelte e rifiuti si riferiscono al membro giusto.

## 4 Un membro è segnalato con un avviso di contraddizione

Se selezioni la stessa persona sia tra le **scelte** sia tra i **rifiuti** di un
membro, il nome viene contrassegnato con un avviso.

### 4.1 Soluzione

Non è un errore bloccante: l'applicazione ti lascia registrare la contraddizione
(è il legame _ambivalente_, descritto in _Tipo di legami_). Se invece si tratta
di una svista, deseleziona la persona dall'elenco in cui non dovrebbe comparire.

## 5 Il report non si genera

La generazione del report verifica che i dati siano completi. Se manca qualcosa,
l'applicazione segnala il problema invece di produrre un report parziale.

### 5.1 Soluzione

Assicurati che:

- il gruppo contenga **almeno {{ store.minMembersCount }} membri e non più di {{ store.maxMembersCount }} membri**;
- i nomi siano compilati, distinti e non superino **{{ store.maxMemberNameLength }} caratteri**;
- **ogni membro** abbia scelte e rifiuti completi, oppure abbia dichiarato di
  non averne con le apposite caselle.

Dal riepilogo puoi cliccare sulla scheda di un membro per tornare subito alle
sue preferenze e completarle.

## 6 La rete (o la pagina) dei rifiuti non compare

Nel report la **Rete dei rifiuti** e le relative strutture compaiono solo se
è stato registrato almeno un rifiuto. La loro assenza, da sola, non indica un
problema di generazione.

### 6.1 Soluzione

Controlla nel riepilogo se sono presenti rifiuti:

- Se nessuno ne ha espressi, è normale che queste pagine non compaiano.
- Se i questionari contengono rifiuti ma il riepilogo no, torna alle preferenze,
  completa i dati mancanti e genera di nuovo il report.

## 7 Ho perso il lavoro dopo aver aggiornato la pagina

AB-Gram **non salva i dati nella cache del browser**: restano nella memoria
dell'applicazione durante la sessione. Chiudere o ricaricare la pagina fa perdere
i dati non esportati; anche uscire dall'app con la navigazione del browser può
interrompere il lavoro.

### 7.1 Soluzione

Se hai già ricaricato la pagina, scegli **Importa progetto** e apri l'ultimo
archivio scaricato. Recupererai i dati presenti al momento di quel download,
non le modifiche successive. **Senza un archivio, l'applicazione non può
recuperare il lavoro della sessione precedente.**

Per evitare che accada di nuovo:

- Mentre lavori, **non aggiornare la pagina** e non usare i tasti _indietro_ e
  _avanti_ del browser.
- Usa **Scarica progetto** per salvare un archivio a ogni punto fermo; potrai
  riprenderlo in seguito con **Importa progetto**. Vedi _Archiviare e riprendere
  un progetto_.

## 8 L'importazione dell'archivio fallisce

Quando importi un archivio, l'applicazione verifica che i dati siano **validi e
coerenti**. Se il controllo non passa, mostra un errore di validazione.

### 8.1 Soluzione

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

## 9 Il grafico di rete è confuso o sovrapposto

Con molti membri o molti legami, le linee del grafico possono accavallarsi e la
disposizione dei nodi può risultare poco leggibile. La posizione dei nodi è
calcolata con un algoritmo a forze simulate (ForceAtlas2) che parte da una
configurazione casuale: non ha un significato preciso e può cambiare a ogni
generazione.

### 9.1 Soluzione

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

## 10 Nel report vedo sigle che non capisco

Le pagine del report usano sigle brevi (ad esempio `RP`, `MP`, `L-CLQ`, `T1`)
per risparmiare spazio.

### 10.1 Soluzione

Consulta il **Glossario**, l'ultima pagina del report, che elenca ogni sigla con
il suo significato esteso. Le definizioni complete delle metriche si trovano
nelle pagine _Metriche individuali_ e _Metriche di gruppo_ di questa guida.

## 11 Il lavoro scaricato non contiene il report

**Scarica progetto** salva i dati del sociogramma, non una copia delle pagine
del report. L'archivio serve a riprendere la compilazione e a generare nuovamente
il report nell'applicazione.

### 11.1 Soluzione

Per conservare anche il report, usa la funzione di stampa del report e scegli
il salvataggio in PDF nella finestra di stampa del browser. Conserva anche
l'archivio se vuoi poter modificare in seguito nomi, scelte e rifiuti.
