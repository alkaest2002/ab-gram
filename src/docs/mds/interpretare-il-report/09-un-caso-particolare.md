---
title: Un caso particolare
order: 9
---

Le pagine precedenti presentano due famiglie di misure: gli **indici della
sociometria classica**, usati anche per definire lo status sociometrico, e le
**centralità dell'analisi delle reti sociali (SNA)**. Sono prospettive
complementari: descrivono aspetti diversi della posizione di un membro, non
il suo valore personale né un ruolo stabile nel gruppo.

## 1 Due domande diverse

- Gli **indici sociometrici** descrivono le scelte e i rifiuti diretti, dati e
  ricevuti. L'impatto considera le nomine ricevute, positive e negative; lo
  status sociometrico combina più informazioni secondo i criteri illustrati
  nella pagina dedicata.
- Le **centralità SNA** descrivono proprietà della rete. Alcune, come il grado,
  riguardano i legami diretti; altre considerano anche i percorsi indiretti.
  L'intermediazione, per esempio, misura quanto spesso un nodo si trova sui
  percorsi più brevi tra altri nodi.

Il numero di scelte ricevute e l'intermediazione **non sono la stessa cosa**.
Un membro può ricevere poche scelte e trovarsi su molti percorsi tra due
sottogruppi. Questo non dimostra che nella vita quotidiana svolga un ruolo di
mediazione o controlli la comunicazione.

## 2 Un esempio

Consideriamo una rete teorica di 9 membri, senza rifiuti. Nei due sottogruppi
$A = \{1, 2, 3, 4\}$ e $B = \{5, 6, 7, 8\}$ tutti si scelgono a vicenda.
Il membro $9$ collega i due sottogruppi:

- dentro $A$ e dentro $B$, ogni coppia ha scelte reciproche;
- gli unici collegamenti aggiuntivi sono $4 \leftrightarrow 9$ e
  $9 \leftrightarrow 5$, dove $\leftrightarrow$ indica due scelte, una per verso.

I membri $4$ e $5$ sono i punti di collegamento tra il proprio sottogruppo e
il membro $9$. È un esempio illustrativo: un questionario con un limite alle
nomine potrebbe non consentire questa configurazione.

**Scelte ricevute.** Il membro $9$ riceve due scelte, da $4$ e da $5$.
Gli altri ne ricevono tre, tranne $4$ e $5$, che ne ricevono quattro. Il membro
$9$ è dunque **il meno scelto in questa rete**. In assenza di rifiuti ha anche
l'impatto più basso, ma da questo solo confronto non si può dedurre una
categoria di status sociometrico.

**Intermediazione.** Ogni percorso più breve tra un membro di $A$ e uno di
$B$, in entrambi i versi, passa per $9$. Le coppie ordinate $(s, t)$, con
$s, t \neq 9$, interessate sono $4 \times 4 + 4 \times 4 = 32$.
Usando la normalizzazione per una rete orientata, il denominatore è
$(n-1)(n-2) = 8 \cdot 7 = 56$:

$$
C_B(9) = \frac{32}{56} \approx 0{,}57
$$

È il valore più alto della rete. I membri $4$ e $5$ hanno ciascuno un valore
di $30/56 \approx 0{,}54$: si trovano sui percorsi tra i tre altri membri del
proprio sottogruppo e i cinque nodi esterni, in entrambi i versi. Gli altri
sei membri hanno intermediazione pari a $0$.

| Membro  | Posizione nell'esempio                           | Scelte ricevute | Intermediazione ($C_B$) |
| :-----: | ------------------------------------------------ | :-------------: | :---------------------: |
| 1, 2, 3 | Membri di $A$ senza collegamenti esterni diretti |        3        |           $0$           |
|    4    | Collegamento tra $A$ e $9$                       |        4        |        $0{,}54$         |
|    5    | Collegamento tra $B$ e $9$                       |        4        |        $0{,}54$         |
| 6, 7, 8 | Membri di $B$ senza collegamenti esterni diretti |        3        |           $0$           |
|    9    | Collegamento tra i due sottogruppi               |      **2**      |      **$0{,}57$**       |

Anche la rimozione dei nodi chiarisce la struttura: togliendo $9$ restano due
componenti di quattro membri; togliendo $4$ o $5$ restano invece due componenti
di tre e cinque membri. Tutti e tre sono quindi punti di articolazione della
rete considerata senza direzione, pur con effetti diversi sulla separazione.
Questa è una proprietà matematica, non un invito a escludere persone.

Il membro $9$ ha meno scelte ricevute, ma maggiore intermediazione. Nessuno dei
due risultati smentisce l'altro: rispondono a domande diverse. Analogamente,
un'intermediazione nulla non rende irrilevanti i legami degli altri membri.

## 3 Come leggere le misure insieme

- **Affianca lo status sociometrico alle centralità**, senza trasformare
  nessuna misura in una graduatoria del valore delle persone.
- **Poche scelte e alta intermediazione** suggeriscono una posizione di
  collegamento nei percorsi della rete. Verifica con l'osservazione se questa
  posizione corrisponde anche a una funzione di mediazione nella pratica.
- **Molte scelte e bassa intermediazione** non dimostrano che la visibilità sia
  solo locale: possono dipendere, per esempio, dalla presenza di molti percorsi
  alternativi. Occorre guardare alla configurazione complessiva.
- **Confronta le altre centralità secondo il loro significato**: grado,
  PageRank, vicinanza e intermediazione descrivono proprietà differenti, non
  conferme intercambiabili di un'unica "importanza".

In breve: conta sia **quali nomine riceve un membro**, sia **come i suoi legami
si inseriscono nella rete**. Le interpretazioni restano riferite al criterio
e al momento della rilevazione, da integrare con la conoscenza del contesto.
