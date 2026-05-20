import { ArrowDownRight, ArrowUpRight, Wallet, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { brl } from "@/lib/format";
import type { Transaction } from "@/hooks/use-transactions";

function getMonthRange(d = new Date()) {
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return { start, end };
}

function inMonth(t: Transaction, start: Date, end: Date) {
  const td = new Date(t.date);
  return td >= start && td < end;
}

export function SummaryCards({ transactions }: { transactions: Transaction[] }) {
  const { start, end } = getMonthRange();

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((a, t) => a + Number(t.amount), 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const monthTx = transactions.filter((t) => inMonth(t, start, end));
  const monthIncome = monthTx.filter((t) => t.type === "income").reduce((a, t) => a + Number(t.amount), 0);
  const monthExpense = monthTx.filter((t) => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0);

  // Previsão: saldo atual + (receitas recorrentes - despesas recorrentes) projetadas até fim do mês
  const recurringIncome = transactions
    .filter((t) => t.is_recurring && t.type === "income")
    .reduce((a, t) => a + Number(t.amount), 0);
  const recurringExpense = transactions
    .filter((t) => t.is_recurring && t.type === "expense")
    .reduce((a, t) => a + Number(t.amount), 0);
  // Estimativa simples: saldo atual + (recorrentes que ainda não entraram este mês)
  const monthHasRecurringIncome = monthTx.some((t) => t.is_recurring && t.type === "income");
  const monthHasRecurringExpense = monthTx.some((t) => t.is_recurring && t.type === "expense");
  const projected =
    balance +
    (monthHasRecurringIncome ? 0 : recurringIncome) -
    (monthHasRecurringExpense ? 0 : recurringExpense);

  const cards = [
    {
      label: "Saldo Atual",
      value: balance,
      icon: Wallet,
      tone: balance >= 0 ? "primary" : "destructive",
      hint: "Receitas − Despesas acumuladas",
    },
    {
      label: "Receitas do Mês",
      value: monthIncome,
      icon: ArrowUpRight,
      tone: "primary",
      hint: "Entradas no mês atual",
    },
    {
      label: "Despesas do Mês",
      value: monthExpense,
      icon: ArrowDownRight,
      tone: "destructive",
      hint: "Saídas no mês atual",
    },
    {
      label: "Previsão Final",
      value: projected,
      icon: TrendingUp,
      tone: "accent",
      hint: "Estimativa com recorrentes",
    },
  ] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label} className="border-border/60 bg-card/80 shadow-card backdrop-blur">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {c.label}
                </div>
                <div
                  className={`mt-2 font-display text-3xl font-bold tracking-tight ${
                    c.tone === "primary"
                      ? "text-primary"
                      : c.tone === "destructive"
                      ? "text-destructive"
                      : c.tone === "accent"
                      ? "text-accent"
                      : "text-foreground"
                  }`}
                >
                  {brl(c.value)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{c.hint}</div>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  c.tone === "primary"
                    ? "bg-primary/15 text-primary"
                    : c.tone === "destructive"
                    ? "bg-destructive/15 text-destructive"
                    : "bg-accent/15 text-accent"
                }`}
              >
                <c.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
