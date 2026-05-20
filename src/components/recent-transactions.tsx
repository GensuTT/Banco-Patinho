import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategory } from "@/lib/categories";
import { brl } from "@/lib/format";
import type { Transaction } from "@/hooks/use-transactions";

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  const recent = transactions.slice(0, 8);
  return (
    <Card className="border-border/60 bg-card/80 shadow-card">
      <CardHeader>
        <CardTitle className="font-display">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma transação ainda. Clique em <span className="text-primary">Nova Transação</span> para começar.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {recent.map((t) => {
              const cat = getCategory(t.category);
              const isIncome = t.type === "income";
              return (
                <li key={t.id} className="flex items-center gap-3 py-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isIncome ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
                    }`}
                  >
                    <cat.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{t.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {cat.label} · {new Date(t.date).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <div
                    className={`font-mono text-sm font-semibold ${
                      isIncome ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {isIncome ? "+" : "−"} {brl(Number(t.amount))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
