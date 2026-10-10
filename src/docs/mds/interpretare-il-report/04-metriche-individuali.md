---
title: Metriche individuali
order: 4
description: Le misure che descrivono il ruolo di ogni singolo membro.
---

Le metriche individuali descrivono la posizione di ciascun membro nel gruppo.
Sono utili per individuare leader, isolati e mediatori.

## Centralità

La centralità misura quanto un membro è importante nella rete. La forma più
semplice è la centralità di grado: il numero di legami del membro, rapportato al
numero massimo di legami possibili.

$$
C_D(i) = \frac{d(i)}{n - 1}
$$

dove \(d(i)\) è il numero di legami del membro \(i\) e \(n\) il numero di
membri del gruppo.

### Tipi di centralità

- **Grado** — quante scelte ha ricevuto: \(d_{\text{in}}(i) = \sum_{j} a_{ji}\).
- **Intermediazione** — quanto sta sui percorsi tra gli altri.
- **Vicinanza** — quanto è vicino a tutti gli altri.

## Gli indici di Moreno

Per ogni membro si calcolano gli indici sociometrici classici, ricavati dalle
somme di riga e di colonna delle matrici di adiacenza. Con \(a_{ij} = 1\) quando
il membro \(i\) sceglie il membro \(j\) e \(d_{ij} = 1\) quando lo rifiuta,
le scelte ricevute e date sono:

$$
rp_i = \sum_{j} a_{ji}, \quad rr_i = \sum_{j} d_{ji}, \qquad gp_i = \sum_{j} a_{ij}, \quad gr_i = \sum_{j} d_{ij}
$$

Dai valori ricevuti derivano l'impatto (quanta attenzione riceve il membro) e il
bilancio (la differenza tra apprezzamenti e rifiuti):

$$
im_i = rp_i + rr_i, \qquad bl_i = rp_i - rr_i
$$

## Lettura dei risultati

1. Confronta i membri tra loro.
2. Individua i valori estremi.
3. Non confrontare gruppi di dimensioni diverse.
