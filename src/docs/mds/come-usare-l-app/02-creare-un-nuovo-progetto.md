---
title: Creare un nuovo progetto
order: 2
---

Quando apri AB-Gram ti trovi davanti alla schermata iniziale, che propone due
percorsi:

- **Crea progetto** — avvia un nuovo progetto a partire da una lista di nomi.
- **Importa progetto** — riprende un progetto archiviato in precedenza.

Entrambi i pulsanti azzerano i dati in memoria, così ogni nuovo
lavoro parte sempre da zero.

## 1 Avviare un nuovo progetto

Scegli **Crea progetto** per iniziare un nuovo progetto. Verrai portato al primo
passaggio, dove caricherai l'elenco dei nominativi.

### 1.1 Formato del file

L'applicazione accetta un file di testo (.txt) con **un nominativo per riga**:

```txt
Rossi Mario
Bianchi Anna
Verdi Luca
```

#### 1.1.1 Limiti

- Al massimo **35 nominativi**.
- Ogni nominativo può contenere al massimo **150 caratteri**.

### 1.2 Ordinare i nominativi

Prima di caricare il file puoi scegliere come ordinare i nomi:

- **Mantieni l'ordine del file** — usa l'ordine in cui compaiono.
- **Ordina alfabeticamente** — riordina i nomi dalla A alla Z.
- **Mescola in modo casuale** — dispone i nomi in ordine casuale.

Dopo il caricamento, l'applicazione mostra un riepilogo con il numero di nomi
caricati, oppure un messaggio che spiega l'eventuale errore nel caricamento del file.

## 2 Una nota sul genere

Nelle versioni classiche del sociogramma il genere delle persone viene preso in
considerazione, per esempio distinguendo i nominativi con simboli o colori
diversi. **AB-Gram non registra questa differenza**: nel file caricato c'è solo
il nominativo, e nessuna informazione sul genere viene richiesta o salvata.

Si tratta di una scelta teorica. Il genere è un'esperienza fluida, che
difficilmente si presta a essere ridotta a una classificazione binaria:
imporre una distinzione di questo tipo rischierebbe di escludere o di
rappresentare in modo scorretto una parte delle persone coinvolte.

## 3 Un avviso importante sui dati

AB-Gram **non salva nulla nella cache del browser**: i dati restano nella memoria
dell'applicazione finché la pagina è aperta. Per questo motivo:

- Non aggiornare la pagina mentre stai lavorando.
- Non usare i tasti *indietro* e *avanti* del browser.

Puoi comunque mettere in pausa e riprendere un lavoro in qualsiasi momento.
