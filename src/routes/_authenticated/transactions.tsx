import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NewTransactionDialog } from "@/components/new-transaction-dialog";
import { useDeleteTransaction, useTransactions } from "@/hooks/use-transactions";
import { getCategory } from "@/lib/categories";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/transactions")({
  component: TransactionsPage,
});

function TransactionsPage() {
  const { data = [], isLoading } = useTransactions();
  const del = useDeleteTransaction();
  const [filter, setFilter] = useState("");
  const [type, setType] = useState<"all" | "income" | "expense">("all");

  const filtered = data.filter((t) => {
    if (type !== "all" && t.type !== type) return false;
    if (filter && !t.description.toLowerCase().includes(filter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-sm text-muted-foreground">Histórico completo de movimentações.</p>
        </div>
        <NewTransactionDialog />
      </div>

      <Card className="border-border/60 bg-card/80 shadow-card">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="font-display">Histórico</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Buscar..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-9 w-44"
            />
            {(["all", "income", "expense"] as const).map((t) => (
              <Button
                key={t}
                size="sm"
                variant={type === t ? "default" : "outline"}
                onClick={() => setType(t)}
                className={type === t ? "bg-primary text-primary-foreground" : ""}
              >
                {t === "all" ? "Todas" : t === "income" ? "Receitas" : "Despesas"}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Nenhuma transação encontrada.</div>
          ) : (
            <ul className="divide-y divide-border/60">
              {filtered.map((t) => {
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
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">{t.description}</span>
                        {t.is_recurring && (
                          <Badge variant="outline" className="border-accent/40 text-accent text-[10px]">
                            recorrente
                          </Badge>
                        )}
                      </div>
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
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={async () => {
                        await del.mutateAsync(t.id);
                        toast.success("Removida");
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
