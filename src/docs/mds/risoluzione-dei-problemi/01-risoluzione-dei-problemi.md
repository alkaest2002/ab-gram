---
title: Risoluzione dei problemi
order: 1
description: Soluzioni ai problemi più comuni nell'uso dell'applicazione.
---

Questa pagina raccoglie i problemi più frequenti e come risolverli, seguendo
l'ordine del flusso di lavoro: dal caricamento dei nominativi fino alla lettura
dei grafici del report.

## Il file dei nominativi non viene caricato

Quando carichi l'elenco dei nomi, l'applicazione può rifiutare il file o
segnalare un errore. Le cause più comuni sono il formato o i limiti.

### Soluzione

- Usa un **file di testo** con **un solo nominativo per riga**.
- Controlla i limiti: al massimo **35 nominativi** e al massimo **150
  caratteri** per ogni nome.
- Rimuovi righe vuote o intestazioni: ogni riga non vuota viene letta come un
  nome.
- Se hai esportato i nomi da un foglio di calcolo, salva come testo semplice e
  verifica che non siano rimasti separatori (virgole, punti e virgola) all'interno
  delle righe.

## Il pulsante «Avanti» resta disattivato

Ogni passaggio si sblocca solo quando i suoi dati sono completi, quindi
«Avanti» può restare grigio. Il motivo dipende dal passaggio in cui ti trovi.

### Soluzione

- **Caricamento dei nomi:** serve **almeno un nominativo** per proseguire.
- **Gestione dei membri:** non devono esserci **nomi vuoti** né **nomi
  duplicati** (vedi la sezione seguente).
- **Scelte e rifiuti:** ogni membro deve essere **completo**, cioè avere le
  scelte e i rifiuti indicati oppure la casella *«Non ha espresso preferenze»* /
  *«Non ha espresso rifiuti»* spuntata. La barra di avanzamento mostra quanti
  membri mancano.
- **Riepilogo:** il gruppo deve contenere **almeno 5 membri** e tutti i membri
  devono essere completi.

## Ci sono nomi duplicati o vuoti

Nel passaggio di gestione dei membri un riquadro conta le persone, i **nomi
duplicati** e i **nomi vuoti**. Finché restano duplicati o nomi vuoti, non puoi
proseguire.

### Soluzione

- Clicca su un nome per correggerlo; premi **Invio** per confermare o **Esc**
  per annullare.
- Due persone con lo stesso nome sono legittime, ma vanno **distinte** (ad
  esempio aggiungendo un'iniziale o un dettaglio), altrimenti risultano
  duplicate.
- Elimina le righe vuote con il pulsante a destra del nome, oppure assegna loro
  un nome.
- Controlla **maiuscole e spazi**: usa sempre la stessa grafia per la stessa
  persona, così scelte e rifiuti si riferiscono al membro giusto.

## Un membro è segnalato con un avviso di contraddizione

Se selezioni la stessa persona sia tra le **scelte** sia tra i **rifiuti** di un
membro, il nome viene contrassegnato con un avviso.

### Soluzione

Non è un errore bloccante: l'applicazione ti lascia registrare la contraddizione
(è il legame *ambivalente*, descritto in *Tipo di legami*). Se invece si tratta
di una svista, deseleziona la persona dall'elenco in cui non dovrebbe comparire.

## Il report non si genera

La generazione del report verifica che i dati siano completi. Se manca qualcosa,
l'applicazione segnala il problema invece di produrre un report parziale.

### Soluzione

Assicurati che:

- il gruppo contenga **almeno 5 membri**;
- **ogni membro** abbia scelte e rifiuti completi, oppure abbia dichiarato di
  non averne con le apposite caselle.

Dal riepilogo puoi cliccare sulla scheda di un membro per tornare subito alle
sue preferenze e completarle.

## La rete (o la pagina) dei rifiuti non compare

Nel report la **Rete dei rifiuti** e le relative componenti compaiono solo se
c'è qualcosa da mostrare.

### Soluzione

Le pagine dei rifiuti vengono generate **solo quando almeno un membro ha
espresso un rifiuto**. Se nessuno ne ha espressi, la loro assenza è corretta e
non indica un errore.

## Ho perso il lavoro dopo aver aggiornato la pagina

AB-Gram **non salva i dati nella cache del browser**: restano nella memoria
dell'applicazione solo finché la pagina è aperta. Aggiornare la pagina o usare i
tasti *indietro* / *avanti* del browser azzera il lavoro in corso.

### Soluzione

- Mentre lavori, **non aggiornare la pagina** e non usare i tasti *indietro* e
  *avanti* del browser.
- Usa **Scarica progetto** per salvare un archivio a ogni punto fermo; potrai
  riprenderlo in seguito con **Importa progetto**. Vedi *Archiviare e riprendere
  un progetto*.

## L'importazione dell'archivio fallisce

Quando importi un archivio, l'applicazione verifica che i dati siano **validi e
coerenti**. Se il controllo non passa, mostra un errore di validazione.

### Soluzione

- Seleziona il **file di testo prodotto dall'applicazione** con *Scarica
  progetto*, non un file creato o modificato a mano.
- **Non modificare** il contenuto dell'archivio: anche piccole modifiche possono
  renderlo incoerente.
- Verifica che l'archivio rispetti i vincoli (ad esempio non più di 35 nomi).
  Se l'avevi prodotto con una versione diversa dell'app, rigeneralo.

## Il grafico di rete è confuso o sovrapposto

Con molti membri o molti legami, le linee del grafo possono accavallarsi e la
disposizione dei nodi può risultare poco leggibile. La posizione dei nodi è
calcolata con un algoritmo a forze simulate (ForceAtlas2) che parte da una
configurazione casuale: non ha un significato preciso e può cambiare a ogni
generazione.

### Soluzione

- Usa il pulsante **Rigenera il grafico** (in basso a destra del grafo, visibile
  a schermo) per ricalcolare la disposizione e aprire i parametri di layout.
- Aumenta lo **Scaling ratio** per ottenere un grafo più **arioso**, con i
  gruppi più distanziati e leggibili; abbassalo per una disposizione più
  compatta. È il primo valore da ritoccare con i gruppi numerosi.
- Regola la **Gravity** per tenere i nodi più **vicini al centro**: valori alti
  compattano il grafo, valori troppo alti ne schiacciano la struttura.
- Rigenera più volte: a parità di dati possono emergere disposizioni più chiare.

Ricorda che **la disposizione è solo visiva**: la distanza dal centro o tra i
gruppi non misura l'importanza di un membro. Per valutazioni affidabili usa le
metriche numeriche (grado, centralità, componenti) descritte nelle altre pagine
del report.

## Nel report vedo sigle che non capisco

Le pagine del report usano sigle brevi (ad esempio `RP`, `MP`, `L-CLQ`, `T1`)
per risparmiare spazio.

### Soluzione

Consulta il **Glossario**, l'ultima pagina del report, che elenca ogni sigla con
il suo significato esteso. Le definizioni complete delle metriche si trovano
nelle pagine *Metriche individuali* e *Metriche di gruppo* di questa guida.
