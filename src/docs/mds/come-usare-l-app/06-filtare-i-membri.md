---
title: Filtrare i membri con la ricerca fuzzy
order: 6
description: Come trovare un nome in fretta con la ricerca tollerante alle imprecisioni.
---

Nelle liste delle **scelte** e dei **rifiuti** c'è un campo *Cerca un nome…* per
trovare subito una persona. La ricerca non richiede di scrivere il nome completo
né di rispettarne la grafia: è una **ricerca fuzzy**, pensata per trovare un nome
anche quando digiti poche lettere o le scrivi in un ordine diverso.

## La regola d'oro

Perché un nome compaia tra i risultati, deve contenere **tutte le lettere** che
digiti, ognuna per il numero di volte in cui la scrivi. È una logica "AND":

- scrivendo `rss`, il nome deve contenere una `r` e due `s`: *Rossi* va bene;
- scrivendo `rrr`, il nome dovrebbe contenere tre `r`: *Rossi* **non** compare.

Da questa regola discendono due conseguenze molto utili:

- **Puoi omettere lettere** (di solito le vocali): `rss` trova *Rossi*.
- **Puoi cambiare l'ordine** delle lettere: `rso` trova comunque *Rossi*.

Non puoi invece digitare una lettera che nel nome non c'è: `rossa` non trova
*Rossi*, perché la `a` non esiste.

## Come sono ordinati i risultati

I nomi corrispondenti sono elencati dal più pertinente al meno pertinente:

1. **Parte esatta del nome** — il testo digitato è una porzione contigua del
   nome. Esempio: `rossi` mette *Rossi* in cima.
2. **Lettere in ordine** — le lettere compaiono nell'ordine giusto, con altre
   lettere in mezzo. Esempio: `rss` trova *Rossi*.
3. **Lettere in qualsiasi ordine** — ci sono tutte, ma non nell'ordine digitato.
   Esempio: `rso` trova *Rossi*.

A parità di pertinenza contano anche, in misura minore, la lunghezza del nome e
l'ordine alfabetico. In pratica: il nome che cerchi finisce in alto, così anche
in un gruppo numeroso lo trovi a colpo d'occhio.

## Cosa viene ignorato

La ricerca ignora:

- le **maiuscole e minuscole** (`rossi` = *Rossi*);
- gli **accenti** (`jose` trova *José*);
- la **punteggiatura** (apostrofi e trattini valgono come spazi).

## Consigli per restringere i risultati

### Punta sulle consonanti

Le vocali sono comuni e distinguono poco; le consonanti sono più informative.
`rss` basta per *Rossi*, `cln` per *Calanna*: risparmi battute e arrivi allo
stesso nome.

### Usa le iniziali dei nomi composti

Per un nome come *Pierpaolo Calanna* bastano le iniziali: `pc`. Se le iniziali
sono condivise da più persone, aggiungi una lettera della seconda parola, ad
esempio `pca`.

### Aggiungi lettere per separare i nomi simili

Se due nomi si somigliano (*Rossi* e *Rosso*), `ross` non basta a distinguerli:
aggiungi la vocale finale (`rossi` oppure `rosso`). In generale, quando la lista
è ancora troppo lunga, **scrivi una lettera in più** per escludere i nomi che non
ti servono.

### Attenzione agli errori di battitura

Uno scambio di lettere non rovina la ricerca: `maroi` trova ancora *Mario*,
perché le lettere ci sono tutte. Una lettera sbagliata invece sì: `marlo` non
trova *Mario*, perché la `l` non fa parte del nome. Se la ricerca non dà
risultati, controlla di non aver digitato una lettera estranea al nome.

### Svuota il campo per rivedere tutti i nomi

Cancellando il testo, l'elenco torna a mostrare tutti i membri del gruppo.
In alternativa, premi **Esc** per azzerare la ricerca attiva: il campo viene
svuotato e la lista torna a mostrare tutti i nomi.

## Selezionare in blocco

Con una ricerca attiva, premi **Invio** per selezionare (o deselezionare) in una
volta sola tutti i nomi che corrispondono. È il modo più rapido per gestire
insieme più persone dal nome simile.

## Esempi rapidi

- `rss` → *Rossi*
- `cln` → *Calanna*
- `pc` → *Pierpaolo Calanna*
- `jose` → *José*
- `mrt` → *Mario Conti* (iniziali e consonanti)
