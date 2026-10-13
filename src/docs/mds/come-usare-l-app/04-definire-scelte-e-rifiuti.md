---
title: Filtrare e selezionare i membri
order: 5
description: Come trovare un nome in fretta con la ricerca tollerante alle imprecisioni.
---

Nelle liste delle **scelte** e dei **rifiuti** trovi il campo *Cerca un nome…*,
che ti porta subito alla persona che cerchi. Non serve scrivere il nome per
intero né rispettarne la grafia: la **ricerca fuzzy** funziona anche con poche
lettere, o con le lettere in un ordine diverso.

## La regola d'oro

Perché un nome compaia tra i risultati, deve contenere **tutte le lettere** che
digiti, ciascuna almeno tante volte quante la scrivi. È una logica "AND":

- `rss` richiede una `r` e due `s`: *Rossi* compare;
- `rrr` richiede tre `r`: *Rossi*, che ne ha una sola, **non** compare.

Ne derivano due vantaggi pratici:

- **puoi omettere delle lettere**, di solito le vocali: `rss` trova *Rossi*;
- **puoi cambiare l'ordine** delle lettere: `rso` trova comunque *Rossi*.

Non puoi invece digitare una lettera che nel nome non esiste: `rossa` non trova
*Rossi*, perché manca la `a`.

## Come sono ordinati i risultati

I nomi trovati sono elencati dal più pertinente al meno pertinente:

1. **Parte esatta del nome**: il testo digitato è una porzione continua del
   nome. Esempio: `rossi` mette *Rossi* in cima.
2. **Lettere in ordine**: le lettere compaiono nella sequenza digitata, con
   altre lettere in mezzo. Esempio: `rss` trova *Rossi*.
3. **Lettere in qualsiasi ordine**: ci sono tutte, ma in sequenza diversa.
   Esempio: `rso` trova *Rossi*.

A parità di pertinenza contano anche, in misura minore, la lunghezza del nome e
l'ordine alfabetico. Il risultato è che il nome cercato sale in alto, e lo
individui a colpo d'occhio anche in un gruppo numeroso.

## Cosa viene ignorato

La ricerca non fa differenza tra:

- **maiuscole e minuscole**: `rossi` trova *Rossi*;
- **lettere accentate e non**: `jose` trova *José*;
- **punteggiatura**: apostrofi e trattini sono trattati come spazi.

## Consigli per trovare più in fretta

### Punta sulle consonanti

Le vocali sono frequenti e distinguono poco; le consonanti dicono molto di più.
`rss` basta per *Rossi* e `cln` per *Calanna*: scrivi meno e arrivi allo stesso
nome.

### Usa le iniziali dei nomi composti

Per *Luca Ferrari* bastano le iniziali: `lf`. Se più persone hanno le
stesse iniziali, aggiungi una lettera della seconda parola, ad esempio `lfe`.

### Aggiungi una lettera per separare i nomi simili

Se due nomi si somigliano (*Rossi* e *Rosso*), `ross` li trova entrambi.
Aggiungi la vocale finale (`rossi` oppure `rosso`) per distinguerli. In
generale, se la lista è ancora troppo lunga, **scrivi una lettera in più**: i
nomi che non ti servono scompariranno.

### Attenzione agli errori di battitura

Uno scambio di lettere non compromette la ricerca: `maroi` trova ancora *Mario*,
perché le lettere ci sono tutte. Una lettera sbagliata invece sì: `marlo` non
trova *Mario*, perché la `l` non fa parte del nome. Se non ottieni risultati,
controlla di non aver digitato una lettera estranea al nome.

### Svuota il campo per rivedere tutti i nomi

Cancellando il testo, l'elenco torna a mostrare tutti i membri del gruppo.

## Selezionare in blocco

Con una ricerca attiva, premi **Invio** per selezionare (o deselezionare) in un
colpo solo tutti i nomi trovati. È il modo più rapido per gestire insieme più
persone con nomi simili.

## Esempi rapidi

| Digiti | Trovi |
| ------ | ----- |
| `rss`  | *Rossi* |
| `cln`  | *Calanna* |
| `lf`   | *Luca Ferrari* |
| `jose` | *José* |
| `mrt`  | *Mario Conti* (iniziali e consonanti) |
