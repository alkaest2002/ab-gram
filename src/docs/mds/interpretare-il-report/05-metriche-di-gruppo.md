---
title: Metriche di gruppo
order: 5
description: Le misure che descrivono il gruppo nel suo insieme.
---

Le metriche di gruppo riassumono la struttura sociale con pochi numeri, utili
per confrontare gruppi o momenti diversi. Si dividono in due famiglie: gli
indici di Moreno e le metriche di social network analysis (SNA).

## Indici di Moreno

Gli indici di Moreno si calcolano sulle matrici di adiacenza delle preferenze
($a_{ij} = 1$ se il membro $i$ sceglie $j$) e dei rifiuti ($d_{ij} = 1$ se il
membro $i$ rifiuta $j$).

### Coesione

Rapporto tra le coppie di scelta reciproca e tutte le coppie possibili. Indica
quanto il gruppo è unito.

$$
Coh = \frac{\sum_{i,j} a_{ij} a_{ji}}{n(n-1)}
$$

### Conflitto

Rapporto tra le coppie di rifiuto reciproco e tutte le coppie possibili. Indica
quanto il gruppo è attraversato da tensioni.

$$
Con = \frac{\sum_{i,j} d_{ij} d_{ji}}{n(n-1)}
$$

### Reciprocità positiva

Rapporto tra le scelte reciproche e tutte le scelte espresse.

$$
R^{+} = \frac{\frac{1}{2}\sum_{i,j} a_{ij} a_{ji}}{\sum_{i,j} a_{ij}}
$$

### Reciprocità negativa

Rapporto tra i rifiuti reciproci e tutti i rifiuti espressi.

$$
R^{-} = \frac{\frac{1}{2}\sum_{i,j} d_{ij} d_{ji}}{\sum_{i,j} d_{ij}}
$$

## Metriche SNA

Le metriche SNA sono calcolate sul grafo diretto delle preferenze (o dei
rifiuti), dove ogni membro è un nodo e ogni scelta è un legame diretto.

### Numero di nodi

Il numero di membri del gruppo:

$$
N = |V|
$$

### Numero di legami

Il numero di legami diretti presenti nel grafo:

$$
E = |\mathcal{E}|
$$

### Legami reciproci

Un legame è reciproco quando esiste anche il legame nella direzione opposta:

$$
E_{\leftrightarrow} = \sum_{(u,v)\in E} \mathbf{1}[(v,u)\in E]
$$

### Densità

Rapporto tra i legami presenti e quelli possibili. Vale $1$ in un grafo completo
e $0$ in un grafo senza legami.

$$
D = \frac{E}{N(N-1)}
$$

### Centralizzazione

Quanto le centralità dei nodi sono concentrate attorno al nodo più centrale.
Vale $0$ se tutti i nodi sono ugualmente centrali, $1$ se tutto è concentrato in
un unico nodo.

$$
C = \frac{\sum_{i=1}^{n} (C_{\max} - C_i)}{(n - 1)^2}
$$

### Reciprocità

Rapporto tra i legami ricambiati e tutti i legami presenti.

$$
R = \frac{\sum_{i,j} a_{ij} a_{ji}}{\sum_{i,j} a_{ij}}
$$

### Transitività

Tendenza dei vicini di un nodo a essere collegati tra loro (coefficiente di
clustering globale). Vale $1$ quando ogni terna di nodi collegati forma un
triangolo.

$$
T = \frac{3 t_{\triangle}}{\sum_{v \in V} \binom{d_v}{2}}
$$
