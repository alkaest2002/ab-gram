---
title: Cos'è la sociometria?
order: 1
---

La **sociometria** è la disciplina che studia in modo **quantitativo** le
relazioni tra i membri di un gruppo. Il suo scopo è misurare e rappresentare i
legami — di scelta, di rifiuto — che si creano tra le
persone, per capire come il gruppo è organizzato al suo interno.

## 1 Le origini

La sociometria nasce negli anni Trenta del '900 grazie allo psichiatra e sociologo
**Jacob L. Moreno**. L'intuizione di Moreno fu semplice ma decisiva: i legami di un
gruppo non emergono con certezza dall'osservazione esterna, ma si possono
**misurare** chiedendo ai membri con chi preferiscono interagire e con chi no. Da
queste risposte si ricava una "fotografia" delle preferenze del gruppo e dunque delle sue dinamiche.

## 2 L'idea di base

Il punto di partenza è il **questionario sociometrico**: a ogni membro si chiede di
indicare, per una situazione concreta, le persone che sceglierebbe e quelle che
rifiuterebbe. Questa situazione si chiama **criterio sociometrico** (per esempio:
«Con chi vorresti lavorare al progetto di gruppo?»). Cambiando il criterio
possono cambiare anche le risposte, perché si può avere affinità con una persona
in un contesto e non in un altro.

Le risposte vengono raccolte e trasformate in dati che descrivono la
struttura del gruppo. Due strumenti riassumono questi dati:

- la **matrice sociometrica**, una tabella in cui righe e colonne sono i membri
  del gruppo e ogni cella indica una scelta o un rifiuto;
- il **sociogramma**, la rappresentazione grafica della stessa informazione, in
  cui le persone sono punti e le relazioni sono linee.

### 2.1 Un esempio

Nella matrice qui sotto le righe indicano **chi esprime** una scelta o un rifiuto e le
colonne **chi la riceve**. Il segno `+` indica una scelta, il segno `−` un
rifiuto.

|            | Anna | Bea  |  Carlo |
| ---------- | :--: | :--: |  :--:  |
| **Anna**   |      |  +   |       |
| **Bea**    |      |      |   -  |
| **Carlo**  |  +   |      |      |

Anna sceglie Bea, Bea rifiuta Carlo e Carlo sceglie Anna.

La tabella si può separare in due **matrici di adiacenza**: una per le scelte
($A$) e una per i rifiuti ($B$). Righe e colonne sono sempre i membri nello
stesso ordine (Anna, Bea, Carlo); ogni elemento vale $1$ se la relazione esiste
e $0$ se non esiste. La diagonale vale sempre $0$, perché nessuno sceglie o
rifiuta se stesso.

$$
A =
\begin{pmatrix}
0 & 1 & 0 \\\\
0 & 0 & 0 \\\\
1 & 0 & 0
\end{pmatrix}
\qquad
B =
\begin{pmatrix}
0 & 0 & 0 \\\\
0 & 0 & 1 \\\\
0 & 0 & 0
\end{pmatrix}
$$

## 3 Gli indici sociometrici

Dalla matrice sociometrica si ricavano degli **indici** che sintetizzano la
posizione di ciascun membro e le caratteristiche del gruppo. Si dividono in due
famiglie:

- gli indici **individuali**, che descrivono ogni membro a partire dalle scelte e
  dai rifiuti che riceve e che esprime: per esempio quanto è scelto, quanto è
  rifiutato, quanto le sue relazioni sono ricambiate. Tra questi c'è anche lo
  **status sociometrico**, che colloca il membro in una categoria che ne riassume
  la posizione nel gruppo;
- gli indici **di gruppo**, che misurano — ad esempio — quanto il gruppo è coeso o quanto è
  conflittuale.

La definizione di ciascuna metrica calcolata da AB-Gram (ideata da Moreno o da
autori successivi) si trova in un'apposita sezione della documentazione.

Molti di questi indici mettono in relazione scelte e rifiuti, per esempio
confrontando le preferenze ricevute da un membro con i rifiuti che riceve. È una
differenza rispetto alle misure della Social Network Analysis, che AB-Gram
calcola separatamente sulla rete delle scelte e su quella dei rifiuti (vedi
*Cos'è la Social Network Analysis*).

## 4 In sintesi

La sociometria permette di rispondere a domande che difficilmente emergono dalla
semplice osservazione esterna: chi è isolato, chi è popolare, chi fa da ponte tra i
sottogruppi, quali alleanze si formano. Per questo è usata in ambiti come la
scuola, il lavoro e lo sport, ovunque serva comprendere le dinamiche di un gruppo.

*Attenzione*: I risultati di un'analisi sociometrica descrivono il gruppo in un preciso momento e rispetto a un preciso
criterio: vanno letti come un punto di partenza per capire e per intervenire, non
come un giudizio definitivo sulle persone.
