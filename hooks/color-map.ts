// utils/color-map.ts
export const COLOR_MAP: Record<string, string> = {
  // basic
  weiß: "#ffffff",
  weiss: "#ffffff",
  white: "#ffffff",
  cremeweiß: "#fffdd0",
  cremeweiss: "#fffdd0",
  elfenbein: "#fffff0",

  grau: "#9ca3af",
  gray: "#9ca3af",
  grey: "#9ca3af",
  hellgrau: "#d1d5db",
  dunkelgrau: "#4b5563",
  graphit: "#374151",
  steingrau: "#6b7280",

  anthrazit: "#2f2f2f",
  schwarz: "#000000",
  black: "#000000",

  blau: "#2563eb",
  hellblau: "#60a5fa",
  dunkelblau: "#1e3a8a",
  himmelblau: "#87ceeb",
  marineblau: "#1d3557",
  navy: "#1d3557",
  königsblau: "#1d4ed8",
  koenigsblau: "#1d4ed8",
  petrol: "#0f766e",
  türkis: "#14b8a6",
  tuerkis: "#14b8a6",
  rot: "#dc2626",
  dunkelrot: "#991b1b",
  weinrot: "#7f1d1d",
  bordeaux: "#7b1e3a",
  braun: "#92400e",
  dunkelbraun: "#5c4033",
  hellbraun: "#b08968",
  cognac: "#b45309",
  taupe: "#8b7d6b",
  sand: "#c2b280",
  beige: "#f5f5dc",
  silber: "#d1d5db",
  gold: "#d4af37",
  kupfer: "#b87333",
  chrom: "#e5e7eb",
  grün: "#16a34a",
  gruen: "#16a34a",
  hellgrün: "#84cc16",
  olivgrün: "#6b8e23",
  oliv: "#6b8e23",
  dunkelgrün: "#064e3b",
  mint: "#98ff98",

  gelb: "#facc15",
  senfgelb: "#d4a017",
  orange: "#f97316",
  apricot: "#fb923c",
  koralle: "#ff7f50",
  rosa: "#f472b6",
  pink: "#ec4899",
  magenta: "#d946ef",
  lila: "#8b5cf6",
  violett: "#7c3aed",
  lavendel: "#c4b5fd",

  apfelgrün: "#7cb342",
  camouflage:
    "repeating-linear-gradient(45deg,#556b2f,#556b2f 10px,#6b8e23 10px,#6b8e23 20px)",
};

// normalize helper
export function getColorStyle(label: string): string {
  const key = label.toLowerCase().trim();

  // nếu là màu ghép → lấy màu đầu
  const parts = key
    .replace("and", "und")
    .split("und")
    .map((p) => p.trim());

  return COLOR_MAP[parts[0]] ?? "#e5e7eb"; // fallback gray
}
