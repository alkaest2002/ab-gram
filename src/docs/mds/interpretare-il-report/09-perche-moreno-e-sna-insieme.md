---
title: Perché Moreno e SNA insieme
order: 9
description: Perché gli indici di Moreno e le centralità SNA vanno letti insieme per non fraintendere il ruolo di un membro.
---

Le pagine precedenti presentano due famiglie di misure che descrivono la stessa
persona da due punti di vista diversi: gli **indici di Moreno**, da cui deriva lo
status sociometrico e le **centralità SNA**.
Sono complementari, non alternative: lette separatamente possono restituire
un'immagine incompleta, e a volte fuorviante, della posizione di un membro nel
gruppo.

## Due domande diverse

- **Moreno** conta le scelte e i rifiuti **diretti**, dati e ricevuti. L'impatto
  (quante opinioni si ricevono) dice **quanto un membro è visibile** agli occhi
  degli altri; lo status sociometrico riassume tutto in una categoria, dal
  "marginale" al "popolare".
- **SNA** guarda alla **struttura** della rete, quindi anche ai legami
  **indiretti**. La centralità di intermediazione, per esempio, misura **quanto
  un membro fa da ponte** tra gli altri, anche quando riceve poche scelte.

Il punto è semplice: **visibilità (Moreno) e importanza strutturale (SNA) non
sono la stessa cosa**. L'impatto conta *quante* opinioni arrivano a un membro,
ma non *da dove* arrivano: poche scelte possono essere proprio le uniche che
tengono collegati due sottogruppi, e in quel caso il membro, pur poco visibile,
è strutturalmente centrale.

## Un esempio: il ponte poco scelto

Consideriamo un gruppo di nove membri. Due sottogruppi di quattro persone,
$A = \{1, 2, 3, 4\}$ e $B = \{5, 6, 7, 8\}$, sono molto coesi: dentro ciascuno
tutti si scelgono a vicenda. Il membro $9$ è l'unico anello di congiunzione:

- dentro $A$ e dentro $B$: ogni coppia è reciproca ($\leftrightarrow$ indica le
  due frecce, una per verso);
- tra i due sottogruppi, soltanto $4 \leftrightarrow 9$ e $9 \leftrightarrow 5$.

I membri $4$ e $5$ sono i due *gatekeeper*: i soli che, dentro il proprio
sottogruppo, hanno un legame con il ponte.

**Con gli occhi di Moreno.** Il membro $9$ riceve due sole scelte (da $4$ e da
$5$). Tutti gli altri ne ricevono almeno tre, e i due gatekeeper quattro: $9$ è
quindi **il membro meno scelto del gruppo**, in fondo alla scala dell'impatto e
dello status sociometrico. È il tipico caso che, leggendo solo Moreno,
verrebbe archiviato come periferico.

**Con gli occhi della SNA.** Ogni percorso più breve tra un membro di $A$ e uno
di $B$, in entrambi i versi, deve passare per $9$. Le coppie ordinate $(s, t)$,
con $s, t \neq 9$, per cui $9$ sta sul percorso più breve sono
$4 \times 4 + 4 \times 4 = 32$. Normalizzando per un grafo orientato, cioè
dividendo per $(n-1)(n-2) = 8 \cdot 7 = 56$:

$$
C_B(9) = \frac{32}{56} \approx 0{,}57
$$

È il valore più alto del gruppo. I due gatekeeper $4$ e $5$ valgono circa
$0{,}54$ ($30/56$): sono anch'essi punti di passaggio, ma solo per i percorsi
che escono dal proprio sottogruppo. Gli altri sei membri valgono $0$.

C'è un secondo segnale: togliendo $9$ il gruppo si spezza in **due metà di pari
dimensione**, mentre togliendo $4$ o $5$ si perderebbe soltanto un nodo
periferico in più, insieme al ponte.

| Membro | Ruolo                | Scelte ricevute | Intermediazione ($C_B$) |
| :----: | -------------------- | :-------------: | :---------------------: |
| 1, 2, 3 | periferici di $A$   | 3               | $0$                     |
| 4      | gatekeeper di $A$    | 4               | $0{,}54$                |
| 5      | gatekeeper di $B$    | 4               | $0{,}54$                |
| 6, 7, 8 | periferici di $B$   | 3               | $0$                     |
| 9      | ponte                | **2**           | **$0{,}57$**            |

Il membro $9$ ha il valore più basso della colonna delle scelte e il più alto
di quella dell'intermediazione. Per Moreno è il meno visibile, per la SNA è il
**nodo più centrale**: le sue poche scelte in arrivo non lo rendono visibile, ma
sono proprio quelle a tenere unito il gruppo.

## Come leggere le due cose insieme

- Non fermarti allo status sociometrico: abbinalo sempre alle centralità della
  pagina sulle metriche individuali.
- Un membro **poco scelto con intermediazione alta** è probabilmente un ponte:
  la sua importanza non sta nelle scelte che riceve, ma nel collegare persone
  che altrimenti non comunicherebbero.
- Al contrario, un membro **molto scelto con intermediazione bassa** è
  visibile ma solo localmente: è al centro dell'attenzione del proprio
  sottogruppo, non necessariamente di tutto il gruppo. Nell'esempio sopra non
  compare, perché i membri più scelti ($4$ e $5$) sono anche gatekeeper; lo
  vedrai nei gruppi in cui il sottogruppo più popolare non ha legami esterni.
- Incrocia anche le altre centralità: grado e PageRank confermano la visibilità,
  la vicinanza dice quanto il membro è "a portata di mano", l'intermediazione
  rivela i ponti.

In breve: Moreno risponde a "quanto è scelto e visibile?", la SNA a "dove si
trova nella struttura?". Solo incrociando le due risposte si evita di scambiare
un ponte per un marginale, o un membro soltanto visibile per uno davvero
centrale.
