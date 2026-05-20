export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const monthLabel = (date: Date) =>
  date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
