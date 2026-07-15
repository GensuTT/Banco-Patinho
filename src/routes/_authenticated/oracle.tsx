import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState, useEffect } from "react";
import { Send, Sparkles, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTransactions } from "@/hooks/use-transactions";

export const Route = createFileRoute("/_authenticated/oracle")({
  component: OraclePage,
});

// Formato JSON mockado — pronto para conectar com Gemini/OpenAI no VSCode.
type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

const SUGGESTIONS = [
  "Onde posso investir R$ 100 este mês?",
  "Como montar minha reserva de emergência?",
  "Analise meus gastos atuais",
  "Dicas para reduzir gastos com assinaturas",
];

const INITIAL: ChatMessage[] = [
  {
    id: "intro",
    role: "assistant",
    content:
      "Olá! Eu sou o **Oráculo Financeiro**. Posso analisar seus gastos, sugerir investimentos e ajudar você a montar sua reserva. Por onde começamos?",
    createdAt: new Date().toISOString(),
  },
];

function OraclePage() {
  const { data: transactions = [] } = useTransactions();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Payload anonimizado para envio à IA: apenas categorias + valores agregados.
  const anonymizedContext = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const summary = new Map<string, number>();
    let income = 0;
    let expense = 0;
    transactions.forEach((t) => {
      const td = new Date(t.date);
      if (td < start) return;
      if (t.type === "income") income += Number(t.amount);
      else {
        expense += Number(t.amount);
        summary.set(t.category, (summary.get(t.category) ?? 0) + Number(t.amount));
      }
    });
    return {
      month: now.toISOString().slice(0, 7),
      income_total: income,
      expense_total: expense,
      balance: income - expense,
      by_category: Object.fromEntries(summary),
    };
  }, [transactions]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    try {
      //bloco do "prompt do sistema", passando os gastos de forma anônima para a IA ter contexto
      const systemPrompt = `Você é o Oráculo Financeiro, um assistente inteligente integrado a um dashboard de finanças pessoais.
      Aqui está o resumo financeiro atualizado do mês do usuário:
      - Total de Receitas: R$ ${anonymizedContext.income_total.toFixed(2)}
      - Total de Despesas: R$ ${anonymizedContext.expense_total.toFixed(2)}
      - Saldo: R$ ${anonymizedContext.balance.toFixed(2)}
      - Gastos por Categoria: ${JSON.stringify(anonymizedContext.by_category)}
      
      Responda à seguinte pergunta do usuário de forma direta, amigável e focada em educação financeira. 
      Pergunta: "${content}"`;

      //Fazemos a chamada real para a API do Google Gemini
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
          }),
        }
      );

      const data = await response.json();
      
      // NOVO: Vamos espiar a resposta real do Google no Console
      console.log("Resposta do Google:", data);

      // Se o Google enviou um erro, nós jogamos ele para o bloco 'catch' lá embaixo
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      // 3. Pegamos a resposta da IA e colocamos na tela
      const iaText = data.candidates[0].content.parts[0].text;

      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: iaText,
        createdAt: new Date().toISOString(),
      };
      
      setMessages((m) => [...m, reply]);
    } catch (error) {
      console.error("Erro na API do Gemini:", error);
      const errorReply: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Desculpe, tive um problema de conexão com a API do Gemini. Verifique se a chave VITE_GEMINI_API_KEY está correta no arquivo .env e se o servidor foi reiniciado!",
        createdAt: new Date().toISOString(),
      };
      setMessages((m) => [...m, errorReply]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Oráculo Financeiro</h1>
            <p className="text-xs text-muted-foreground">Assistente IA para suas finanças pessoais</p>
          </div>
        </div>
        <div className="hidden items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground sm:flex">
          <Shield className="h-3 w-3" /> Dados anonimizados
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden border-border/60 bg-card/60 shadow-card">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m) =>
            m.role === "assistant" ? (
              <div key={m.id} className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed text-foreground">
                  {m.content.split("\n").map((p, i) => (
                    <p key={i} className="m-0 mb-2 whitespace-pre-wrap">{p}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
                  {m.content}
                </div>
              </div>
            )
          )}
          {typing && (
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="h-2 w-2 animate-bounce rounded-full bg-current" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:240ms]" />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border/60 bg-background/40 p-4">
          <div className="mb-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Pergunte algo ao Oráculo..."
              rows={1}
              className="min-h-[44px] resize-none"
            />
            <Button
              onClick={() => send()}
              disabled={typing || !input.trim()}
              className="h-11 w-11 shrink-0 bg-gradient-primary p-0 text-primary-foreground hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
