---
title: Punteggi, ranghi e percentuali
order: 2
description: Come leggere i valori mostrati in ogni pagina del report.
---

Il report presenta i risultati con tre tipi di valori:

- **Punteggio grezzo** — il valore calcolato direttamente sui dati, senza
  trasformazioni. Può essere un conteggio (numero di membri, di scelte, di
  rifiuti) oppure un indice compreso tra 0 e 1 (come le centralità SNA).
- **Rango** — la posizione del membro nella classifica del gruppo per una certa
  metrica, scritta nella forma `rango / rango massimo`. Il valore più alto
  riceve il rango 1; a pari merito i membri condividono lo stesso rango.
- **Percentuale** — una proporzione espressa su 100, usata per gli indici che
  variano tra 0 e 1 (densità, centralizzazione, ecc.) e per le quote di
  relazioni o componenti.

Non tutte le pagine contengono tutti e tre i tipi di valori.

## Copertina

Non contiene punteggi. Riporta il titolo e le note di avviso: la nota di
riservatezza e la nota sui limiti interpretativi del report.

## Elenco dei membri

Elenca i membri con il rispettivo identificativo numerico e il nome. Gli
identificativi non sono punteggi: servono soltanto a riconoscere ogni membro
nelle pagine successive.

## Scelte e rifiuti

Per ogni membro mostra gli identificativi delle persone scelte (preceduti da
`+`) e di quelle rifiutate (preceduti da `-`). È l'elenco grezzo delle
preferenze espresse: qui non ci sono punteggi calcolati, ma è da questo elenco
che derivano tutte le metriche.

## Rete delle scelte e rete dei rifiuti

Ogni pagina mostra il grafo di rete e una tabella di **metriche di gruppo**. Le
prime righe sono punteggi grezzi espressi come conteggi (numeri interi):

- numero di membri nel gruppo;
- totale scelte (o rifiuti) effettuate;
- totale scelte (o rifiuti) reciproche.

Le righe successive sono **percentuali** (valori tra 0 e 1 moltiplicati per 100,
mostrati con una cifra decimale):

- densità della rete;
- centralizzazione della rete;
- reciprocità della rete;
- transitività della rete;
- indice di coesione (tipo I e tipo II) nella rete delle scelte, oppure indice
  di conflitto (tipo I e tipo II) nella rete dei rifiuti.

## Componenti della rete delle scelte e dei rifiuti

Per ogni categoria (diadi, clique, componenti debolmente connesse, fortemente
connesse e fortemente reciproche) mostra il **numero di componenti individuate**:
un punteggio grezzo espresso come conteggio.

## Tipi di relazione

Classifica le relazioni in sette tipi, raggruppati in tre fasce (relazioni sane,
potenzialmente problematiche e problematiche). Per ogni tipo e per ogni fascia
mostra un **conteggio grezzo**: quante coppie di membri ricadono in quella
categoria. Non ci sono ranghi né percentuali.

## Pagine individuali dei membri

È la pagina più ricca di informazioni: combina punteggi grezzi, ranghi e percentuali.
Si divide in quattro blocchi.

### Grafico ego

Mostra il grafo delle relazioni del membro, con lui al centro e gli altri membri
disposti intorno. Non contiene punteggi: la sua lettura è spiegata nella pagina della
documentazione dedicata ai grafici.

### Metriche

Mostra tre righe di sei riquadri: i primi dodici sono gli **indici di Moreno**
(GP, RP, MP, GR, RR, MR, IM, BL, EI, OR, AI, II), gli ultimi sei le
**centralità SNA** (DG, CL, BT, PK, HA, HU). Ogni riquadro contiene:

- il **punteggio grezzo**: un numero intero per gli indici di Moreno, un
  decimale tra 0 e 1 (arrotondato a due cifre) per le centralità SNA;
- il **rango**, nella forma `rango/rango massimo`.

Il rango indica la posizione del membro nella classifica del gruppo per quella
metrica: il valore più alto riceve il rango 1, e a pari merito due membri
condividono lo stesso rango. Il **rango massimo** è il rango più alto assegnato
per quella metrica, cioè il numero di valori distinti presenti nel gruppo (non
necessariamente il numero di membri, proprio perché i pari-merito vengono
contati una sola volta).

Per esempio, un riquadro che mostra `GP 10 (1/10)` significa che il membro ha
espresso 10 scelte (punteggio grezzo) e occupa il 1° posto su 10 posizioni
possibili (rango 1, rango massimo 10).

Attenzione: poiché il rango premia sempre il valore più alto, un rango basso non
significa automaticamente "meglio". Per una metrica come i rifiuti ricevuti
(RR), il rango 1 spetta a chi ne ha ricevuti di più: per capire se quel valore è
positivo o negativo bisogna guardare il significato della metrica.

### Relazioni

Mostra i tipi di legame T1–T6 (il tipo 7, "scelte e rifiuti insieme", non
compare in questa sezione). Per ogni tipo ci sono due numeri:

- il **conteggio grezzo**: quante relazioni di quel tipo coinvolgono il membro;
- la **percentuale**: la quota di quel tipo sul totale delle relazioni del
  membro, arrotondata a numero intero.

### Componenti

Mostra, per la rete delle scelte (prefisso `L-`) e per quella dei rifiuti
(prefisso `D-`), le cinque categorie DYD, CLQ, WCC, SCC e SCM. Per ogni
categoria ci sono due numeri:

- il **conteggio grezzo**: quante componenti di quel tipo contengono il membro;
- la **percentuale**: la quota sul totale delle componenti di quel tipo,
  arrotondata a numero intero.

### Status sociometrico

Traduce l'indice `ss` in un'etichetta (ad esempio "Popolare" o "Rifiutato") con
una breve descrizione. È una categoria, non un punteggio: non ha rango né
percentuale.

Accanto all'etichetta compaiono due **punteggi grezzi**, il **bonus** (`BNS`) e
il **malus** (`MLS`): sono numeri interi che pesano le scelte e i rifiuti
ricevuti in base **all'ordine** con cui il membro è stato indicato nelle
preferenze degli altri (essere indicati per primi "pesa" di più). Non hanno
rango né percentuale.

Il loro scopo è distinguere due membri che ricadono nella **stessa** categoria
di status: a parità di etichetta, un bonus più alto (o un malus più basso)
indica una posizione più favorevole nel gruppo. Il calcolo e il significato sono
spiegati nella pagina dedicata allo status sociometrico.

## Glossario

Non contiene punteggi. Riporta l'elenco delle sigle usate nelle pagine e il loro
significato esteso.

## In sintesi

| Pagina | Punteggi grezzi | Ranghi | Percentuali |
| --- | :---: | :---: | :---: |
| Copertina | – | – | – |
| Elenco dei membri | – | – | – |
| Scelte e rifiuti | identificativi (+/-) | – | – |
| Rete delle scelte / dei rifiuti | conteggi<br><span class="text-xs text-muted">membri, legami, reciproci</span> | – | sì <br><span class="text-xs text-muted">indici di rete e di gruppo</span> |
| Componenti della rete | conteggi <br><span class="text-xs text-muted">componenti per categoria</span> | – | – |
| Tipi di relazione | conteggi <br><span class="text-xs text-muted">per tipo e per fascia</span> | – | – |
| Pagine individuali | conteggi e decimali | sì | sì |
| Glossario | – | – | – |
