---
title: Metriche individuali
order: 4
description: Le misure che descrivono il ruolo di ogni singolo membro.
---

Le metriche individuali descrivono la posizione di ciascun membro nel gruppo:
chi è centrale, chi è isolato, chi fa da ponte. Si dividono in due famiglie: gli
indici di Moreno e le centralità della social network analysis (SNA).

## Indici di Moreno

Gli indici di Moreno si ricavano dalle somme di riga e di colonna delle matrici
di adiacenza. Con $a_{ij} = 1$ quando il membro $i$ sceglie il membro $j$ e
$d_{ij} = 1$ quando lo rifiuta:

### Scelte ricevute e date

- **Scelte ricevute positive** ($rp_i$) — quante preferenze ha ricevuto il membro $i$:

$$
rp_i = \sum_{j} a_{ji}
$$

- **Scelte ricevute negative** ($rr_i$) — quanti rifiuti ha ricevuto:

$$
rr_i = \sum_{j} d_{ji}
$$

- **Scelte date positive** ($gp_i$) — quante preferenze ha espresso:

$$
gp_i = \sum_{j} a_{ij}
$$

- **Scelte date negative** ($gr_i$) — quanti rifiuti ha espresso:

$$
gr_i = \sum_{j} d_{ij}
$$

### Scelte reciproche

- **Reciprocità positiva** ($mp_i$) — quante preferenze del membro sono ricambiate:

$$
mp_i = \sum_{j} a_{ij} a_{ji}
$$

- **Reciprocità negativa** ($mr_i$) — quanti rifiuti del membro sono ricambiati:

$$
mr_i = \sum_{j} d_{ij} d_{ji}
$$

### Indici derivati

- **Impatto** ($im_i$) — quante opinioni ha ricevuto in totale, positive e negative:

$$
im_i = rp_i + rr_i
$$

- **Bilancio** ($bl_i$) — la differenza tra preferenze e rifiuti ricevuti:

$$
bl_i = rp_i - rr_i
$$

- **Espressività** ($ei_i$) — quante opinioni ha espresso in totale:

$$
ei_i = gp_i + gr_i
$$

- **Orientamento** ($or_i$) — la differenza tra preferenze e rifiuti espressi:

$$
or_i = gp_i - gr_i
$$

- **Affiliazione** ($ai_i$) — somma di bilancio e orientamento:

$$
ai_i = bl_i + or_i
$$

- **Influenza** ($ii_i$) — preferenze ricevute più preferenze reciproche:

$$
ii_i = rp_i + mp_i
$$

### Stato sociometrico

Lo stato sociometrico ($ss_i$) classifica ogni membro in nove categorie
combinando l'impatto ricevuto (quanto è visibile) con il bilancio tra
preferenze e rifiuti: isolato (0), ignorato (1), marginale (2), apprezzato (3),
popolare (4), rifiutato (5), respinto (6), ambivalente (7), controverso (8).

## Centralità SNA

Le centralità misurano quanto un nodo è importante nella rete del gruppo.

### Grado

La centralità di grado è il numero di legami del membro, normalizzato sul numero
massimo possibile:

$$
C_D(i) = \frac{d(i)}{n - 1}
$$

Si divide nelle due componenti dirette, entrante e uscente:

$$
C_D^{\text{in}}(i) = \frac{d_{\text{in}}(i)}{n - 1}, \qquad C_D^{\text{out}}(i) = \frac{d_{\text{out}}(i)}{n - 1}
$$

### Vicinanza

La centralità di vicinanza misura quanto il membro è vicino a tutti gli altri
membri che può raggiungere:

$$
C_C(i) = \frac{|R_i|}{\sum_{j \in R_i} d(i,j)}
$$

### Intermediazione

La centralità di intermediazione misura quanto il membro sta sui cammini più
brevi tra gli altri membri:

$$
C_B(i) = \frac{\sum_{s \neq i \neq t} \frac{\sigma_{st}(i)}{\sigma_{st}}}{(n-1)(n-2)}
$$

### PageRank

Il PageRank pesa i legami ricevuti in base all'importanza di chi li esprime:

$$
PR(i) = \frac{1 - \alpha}{n} + \alpha \sum_{j \in \text{In}(i)} \frac{PR(j)}{d_{\text{out}}(j)}, \qquad \alpha = 0.85
$$

### HITS

HITS distingue due ruoli complementari: l'autorità (riceve legami da buoni hub)
e l'hub (indica buone autorità):

$$
a(i) = \sum_{j \in \text{In}(i)} h(j), \qquad h(i) = \sum_{j \in \text{Out}(i)} a(j)
$$
