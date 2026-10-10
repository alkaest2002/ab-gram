---
title: Tipo di legami
order: 2
description: Come classificare le relazioni tra i membri del gruppo.
---

Ogni relazione tra due membri può essere classificata in base ai sentimenti
espressi nelle due direzioni. Con $a_{ij} = 1$ quando il membro $i$ sceglie
il membro $j$ e $d_{ij} = 1$ quando lo rifiuta.

## Matrice di adiacenza

La matrice di adiacenza è una tabella quadrata in cui righe e colonne
rappresentano i membri del gruppo. L'elemento $a_{ij}$ vale $1$ se il membro $i$
sceglie il membro $j$, $0$ altrimenti; allo stesso modo $d_{ij}$ vale $1$ se il
membro $i$ rifiuta $j$. La diagonale è sempre $0$, perché un membro non può
scegliere né rifiutare se stesso. Ogni riga descrive le relazioni che un membro
esprime (in uscita), ogni colonna quelle che riceve (in entrata).

Per un gruppo di quattro membri, le due matrici si scrivono ad esempio:

$$
A =
\begin{pmatrix}
0 & 1 & 1 & 0 \\\\
1 & 0 & 0 & 1 \\\\
0 & 1 & 0 & 1 \\\\
1 & 0 & 0 & 0
\end{pmatrix}
\qquad
D =
\begin{pmatrix}
0 & 0 & 1 & 0 \\\\
1 & 0 & 0 & 0 \\\\
0 & 0 & 0 & 1 \\\\
0 & 1 & 0 & 0
\end{pmatrix}
$$

Qui, ad esempio, $a_{12} = 1$ significa che il membro $1$ sceglie il membro
$2$, mentre $d_{31} = 0$ indica che il membro $3$ non rifiuta il membro $1$.

## Legami non problematici

### Preferenza a senso unico

Solo uno dei due membri esprime una scelta, mentre l'altro non esprime né scelta
né rifiuto:

$$
a_{ij} \land \neg d_{ij} \land \neg a_{ji} \land \neg d_{ji}
$$

### Preferenza reciproca

Entrambi i membri si scelgono, senza che nessuno dei due esprima un rifiuto:

$$
a_{ij} \land \neg d_{ij} \land a_{ji} \land \neg d_{ji}
$$

## Legami problematici

I legami problematici coinvolgono rifiuti o sentimenti contrapposti.

### Rifiuto a senso unico

Solo uno dei due membri esprime un rifiuto, mentre l'altro non esprime né scelta
né rifiuto:

$$
d_{ij} \land \neg a_{ij} \land \neg a_{ji} \land \neg d_{ji}
$$

### Rifiuto reciproco

Entrambi i membri si rifiutano, senza che nessuno dei due esprima una scelta:

$$
d_{ij} \land \neg a_{ij} \land d_{ji} \land \neg a_{ji}
$$

### Sentimenti contrapposti

Un membro sceglie mentre l'altro rifiuta, in una delle due direzioni:

$$
(a_{ij} \land \neg d_{ij} \land \neg a_{ji} \land d_{ji}) \lor
(\neg a_{ij} \land d_{ij} \land a_{ji} \land \neg d_{ji})
$$

## Legami ambivalenti

Un legame è ambivalente quando un membro prova sia preferenza sia rifiuto verso
lo stesso membro: lo sceglie e al tempo stesso lo rifiuta.

$$
a_{ij} \land d_{ij}
$$

Questi legami richiedono un'attenzione particolare nella lettura del
sociogramma, perché indicano una relazione non risolta.
