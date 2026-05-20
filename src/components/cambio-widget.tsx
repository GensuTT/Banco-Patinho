import { TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react"; // 1. Importamos os Hooks do React

// Mantemos o tipo para garantir a consistência dos dados (TypeScript)
type Quote = { code: string; label: string; value: number; change: number };

export function CambioWidget() {
  // 2. Criamos o Estado (a memória) para guardar as cotações. Começa vazio.
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Efeito Colateral: roda assim que o componente aparece na tela
  useEffect(() => {
    async function fetchQuotes() {
      try {
        // Faz a requisição na API real
        const response = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL");
        const data = await response.json();

        // 4. Transformamos os dados da API (que vêm em texto) para o formato numérico que a tela precisa
        const formattedQuotes: Quote[] = [
          {
            code: "USD",
            label: "Dólar",
            value: parseFloat(data.USDBRL.bid),
            change: parseFloat(data.USDBRL.pctChange),
          },
          {
            code: "EUR",
            label: "Euro",
            value: parseFloat(data.EURBRL.bid),
            change: parseFloat(data.EURBRL.pctChange),
          },
        ];

        // Salvamos na memória e tiramos o status de carregamento
        setQuotes(formattedQuotes);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar as cotações:", error);
        setIsLoading(false);
      }
    }

    fetchQuotes();
  }, []); // A array vazia [] garante que isso só rode uma vez quando a tela abrir

  return (
    <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Câmbio Hoje
        </span>
        {/* A bolinha verde pisca para mostrar que está ativo. Se estiver carregando, podemos mudar a cor depois */}
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
      </div>
      
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-xs text-muted-foreground text-center py-2">Buscando cotações...</div>
        ) : (
          quotes.map((q) => {
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
          })
        )}
      </div>
    </div>
  );
}