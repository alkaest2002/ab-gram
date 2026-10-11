---
title: Creare un nuovo progetto
order: 1
description: Come avviare un nuovo sociogramma partendo da una lista di nomi.
---

Quando apri AB-Grid ti trovi davanti alla schermata iniziale, che propone due
percorsi:

- **Crea progetto** — avvia un nuovo sociogramma da una lista di nomi.
- **Importa progetto** — riprende un sociogramma archiviato in precedenza.

Entrambi i pulsanti azzerano i dati attualmente in memoria, così ogni nuovo
lavoro parte sempre pulito.

## Avviare un nuovo progetto

Scegli **Crea progetto** per iniziare da zero. Verrai portato al primo
passaggio, dove carichi l'elenco dei nominativi.

### Formato del file

L'applicazione accetta un file di testo con **un nominativo per riga**:

```txt
Rossi Mario
Bianchi Anna
Verdi Luca
```

#### Limiti

- Al massimo **35 nominativi**.
- Ogni nominativo può contenere al massimo **150 caratteri**.

### Ordinare i nominativi

Prima di caricare il file puoi scegliere come ordinare i nomi:

- **Mantieni l'ordine del file** — usa l'ordine in cui compaiono.
- **Ordina alfabeticamente** — riordina i nomi dalla A alla Z.
- **Mescola in modo casuale** — dispone i nomi in ordine casuale.

Dopo il caricamento, l'applicazione mostra un riepilogo con il numero di nomi
caricati, oppure un messaggio che spiega l'eventuale errore.

## Riprendere un progetto

Se hai già salvato un lavoro, scegli **Importa progetto**. L'applicazione ti
chiederà il file archiviato e ricostruirà il sociogramma esattamente da dove lo
avevi lasciato. Vedi [Importare un progetto archiviato](/docs/come-usare-l-app/02-importare-un-progetto-archiviato).

## Un avviso importante sui dati

AB-Grid **non salva nulla nella cache del browser**: i dati restano nella memoria
dell'applicazione finché la pagina è aperta. Per questo motivo:

- Non aggiornare la pagina mentre stai lavorando.
- Non usare i tasti *indietro* e *avanti* del browser.

Puoi comunque mettere in pausa e riprendere un lavoro in qualsiasi momento
usando l'archivio, descritto in [Archiviare e riprendere un
progetto](/docs/come-usare-l-app/06-archiviare-un-progetto).
