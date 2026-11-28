// The metric chips are listed in a fixed reading order (not the dataframe column
// order). Moreno indices come first, followed by SNA metrics. Each entry maps a short label to the real metric
// key so a chip can read "gp 10 (1/10)" while the data is keyed "gp"/"PageRank".
export const MEMBER_METRICS = [
  { label: "GP", key: "gp", source: "moreno" },
  { label: "GR", key: "gr", source: "moreno" },
  { label: "RP", key: "rp", source: "moreno" },
  { label: "RR", key: "rr", source: "moreno" },
  { label: "MP", key: "mp", source: "moreno" },
  { label: "MR", key: "mr", source: "moreno" },
  { label: "IM", key: "im", source: "moreno" },
  { label: "BL", key: "bl", source: "moreno" },
  { label: "EI", key: "ei", source: "moreno" },
  { label: "OR", key: "or", source: "moreno" },
  { label: "AI", key: "ai", source: "moreno" },
  { label: "II", key: "ii", source: "moreno" },
  { label: "DG", key: "inDegreeCentrality", source: "sna" },
  { label: "PK", key: "PageRank", source: "sna" },
  { label: "HA", key: "hitsAuthority", source: "sna" },
  { label: "HU", key: "hitsHub", source: "sna" },
  { label: "BT", key: "betweennessCentrality", source: "sna" },
  { label: "CL", key: "closenessCentrality", source: "sna" },
  { label: "BD", key: "closenessBroadcastCentrality", source: "sna" },
  { label: "CN", key: "coreNumber", source: "sna" },
  { label: "LC", key: "localClustering", source: "sna" },
];
