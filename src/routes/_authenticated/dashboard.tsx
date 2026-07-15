import { createFileRoute } from "@tanstack/react-router";
import { SummaryCards } from "@/components/summary-cards";
import { CategoryPieChart } from "@/components/category-pie-chart";
import { MonthlyBarChart } from "@/components/monthly-bar-chart";
import { RecentTransactions } from "@/components/recent-transactions";
import { NewTransactionDialog } from "@/components/new-transaction-dialog";
import { useTransactions } from "@/hooks/use-transactions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { data: transactions = [], isLoading } = useTransactions();
  const { user } = useAuth();
  const name = (user?.user_metadata?.full_name as string | undefined) || user?.email?.split("@")[0];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Olá, <span className="text-gradient">{name}</span>
          </h1>
          <p className="text-sm text-muted-foreground">Visão geral das suas finanças hoje.</p>
        </div>
        <NewTransactionDialog />
      </div>

      {isLoading ? (
        <div className="grid h-40 place-items-center text-sm text-muted-foreground">Carregando...</div>
      ) : (
        <>
          <SummaryCards transactions={transactions} />
          <div className="grid gap-6 lg:grid-cols-2">
            <CategoryPieChart transactions={transactions} />
            <MonthlyBarChart transactions={transactions} />
          </div>
          <RecentTransactions transactions={transactions} />
        </>
      )}
    </div>
  );
}
