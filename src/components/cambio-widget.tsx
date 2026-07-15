import { TrendingUp, TrendingDown } from "lucide-react";

// Componente isolado: substitua os valores estáticos abaixo pelo consumo
// real da AwesomeAPI (https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL).
type Quote = { code: string; label: string; value: number; change: number };

const QUOTES: Quote[] = [
  { code: "USD", label: "Dólar", value: 5.42, change: 0.32 },
  { code: "EUR", label: "Euro", value: 5.89, change: -0.18 },
];

export function CambioWidget() {
  return (
    <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Câmbio Hoje
        </span>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
      </div>
      <div className="space-y-2">
        {QUOTES.map((q) => {
          const up = q.change >= 0;
          return (
            <div key={q.code} className="flex items-center justify-between text-sm">
              <div>
                <div className="font-semibold">{q.code}</div>
                <div className="text-[10px] text-muted-foreground">{q.label}</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-medium">R$ {q.value.toFixed(2)}</div>
                <div
                  className={`flex items-center justify-end gap-0.5 text-[10px] ${
                    up ? "text-primary" : "text-destructive"
                  }`}
                >
                  {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(q.change).toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
