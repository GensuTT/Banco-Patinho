import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategory } from "@/lib/categories";
import { brl } from "@/lib/format";
import type { Transaction } from "@/hooks/use-transactions";

const PALETTE = [
  "oklch(0.82 0.22 145)",
  "oklch(0.62 0.26 295)",
  "oklch(0.75 0.18 220)",
  "oklch(0.80 0.17 75)",
  "oklch(0.70 0.22 25)",
  "oklch(0.72 0.18 330)",
  "oklch(0.75 0.15 180)",
];

export function CategoryPieChart({ transactions }: { transactions: Transaction[] }) {
  const data = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const map = new Map<string, number>();
    transactions
      .filter((t) => t.type === "expense" && new Date(t.date) >= start && new Date(t.date) < end)
      .forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + Number(t.amount)));
    return Array.from(map.entries())
      .map(([id, value]) => ({ id, name: getCategory(id).label, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = data.reduce((a, d) => a + d.value, 0);

  return (
    <Card className="border-border/60 bg-card/80 shadow-card">
      <CardHeader>
        <CardTitle className="font-display">Gastos por Categoria</CardTitle>
        <p className="text-xs text-muted-foreground">Distribuição no mês atual</p>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
            Sem despesas neste mês ainda.
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-[220px] w-full sm:w-1/2">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {data.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.20 0.018 255)",
                      border: "1px solid oklch(0.28 0.018 255)",
                      borderRadius: 12,
                      color: "oklch(0.97 0.005 250)",
                    }}
                    formatter={(v: number) => brl(v)}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="font-display text-xl font-bold">{brl(total)}</span>
              </div>
            </div>
            <ul className="flex-1 space-y-2">
              {data.slice(0, 6).map((d, i) => {
                const cat = getCategory(d.id);
                const pct = (d.value / total) * 100;
                return (
                  <li key={d.id} className="flex items-center gap-3 text-sm">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: PALETTE[i % PALETTE.length] }}
                    />
                    <cat.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate">{cat.label}</span>
                    <span className="font-mono text-xs text-muted-foreground">{pct.toFixed(0)}%</span>
                    <span className="font-mono text-xs font-medium">{brl(d.value)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
