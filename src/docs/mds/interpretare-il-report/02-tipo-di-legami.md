---
title: Tipo di legami
order: 2
description: Come classificare le relazioni tra i membri del gruppo.
---

Ogni relazione tra due membri può essere classificata in base ai sentimenti
espressi nelle due direzioni. Con \(a_{ij} = 1\) quando il membro \(i\) sceglie
il membro \(j\) e \(d_{ij} = 1\) quando lo rifiuta, il legame da \(i\) a \(j\)
dipende dalla coppia di sentimenti in avanti e all'indietro:

$$
\text{avanti } (i \to j) = (a_{ij}, d_{ij}), \qquad
\text{indietro } (j \to i) = (a_{ji}, d_{ji})
$$

## Legami non problematici

La preferenza a senso unico si ha quando solo uno dei due esprime una scelta:

$$
a_{ij} \land \neg d_{ij} \land \neg a_{ji} \land \neg d_{ji}
$$

La preferenza reciproca si ha quando la scelta è ricambiata:

$$
a_{ij} \land \neg d_{ij} \land a_{ji}
$$

## Legami problematici

I legami problematici coinvolgono rifiuti o sentimenti contrapposti:

- **Rifiuto a senso unico**: \(d_{ij} \land \neg a_{ij} \land \neg a_{ji} \land \neg d_{ji}\).
- **Rifiuto reciproco**: \(d_{ij} \land \neg a_{ij} \land d_{ji}\).
- **Sentimenti contrapposti**: \(a_{ij} \land \neg d_{ij} \land d_{ji}\) oppure \(d_{ij} \land \neg a_{ij} \land a_{ji}\).

## Legami ambivalenti

Quando un membro prova sia preferenza sia rifiuto verso lo stesso membro:

$$
a_{ij} \land d_{ij}
$$

Questi legami richiedono un'attenzione particolare nella lettura del
sociogramma, perché indicano una relazione non risolta.
