import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { brl, monthLabel } from "@/lib/format";
import type { Transaction } from "@/hooks/use-transactions";

export function MonthlyBarChart({ transactions }: { transactions: Transaction[] }) {
  const data = useMemo(() => {
    const now = new Date();
    const months: { key: string; label: string; receitas: number; despesas: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: monthLabel(d),
        receitas: 0,
        despesas: 0,
      });
    }
    transactions.forEach((t) => {
      const td = new Date(t.date);
      const key = `${td.getFullYear()}-${td.getMonth()}`;
      const bucket = months.find((m) => m.key === key);
      if (!bucket) return;
      if (t.type === "income") bucket.receitas += Number(t.amount);
      else bucket.despesas += Number(t.amount);
    });
    return months;
  }, [transactions]);

  return (
    <Card className="border-border/60 bg-card/80 shadow-card">
      <CardHeader>
        <CardTitle className="font-display">Receitas vs Despesas</CardTitle>
        <p className="text-xs text-muted-foreground">Evolução dos últimos 6 meses</p>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] w-full">
          <ResponsiveContainer>
            <BarChart data={data} barGap={6}>
              <CartesianGrid stroke="oklch(0.28 0.018 255)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="oklch(0.66 0.02 255)" fontSize={12} />
              <YAxis stroke="oklch(0.66 0.02 255)" fontSize={11} tickFormatter={(v) => `R$${v}`} />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.20 0.018 255)",
                  border: "1px solid oklch(0.28 0.018 255)",
                  borderRadius: 12,
                }}
                formatter={(v: number) => brl(v)}
                cursor={{ fill: "oklch(0.62 0.26 295 / 0.08)" }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="receitas" fill="oklch(0.82 0.22 145)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="despesas" fill="oklch(0.62 0.26 295)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
