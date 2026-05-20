import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/categories";
import { useCreateTransaction } from "@/hooks/use-transactions";
import { Switch } from "@/components/ui/switch";

export function NewTransactionDialog() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [recurring, setRecurring] = useState(false);
  const create = useCreateTransaction();

  const cats = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const reset = () => {
    setType("expense");
    setAmount("");
    setDate(new Date().toISOString().slice(0, 10));
    setDescription("");
    setCategory("");
    setRecurring(false);
  };

  const submit = async () => {
    const val = parseFloat(amount.replace(",", "."));
    if (!val || val <= 0) return toast.error("Informe um valor válido");
    if (!description.trim()) return toast.error("Adicione uma descrição");
    if (!category) return toast.error("Selecione uma categoria");
    try {
      await create.mutateAsync({
        type,
        amount: val,
        date,
        description: description.trim().slice(0, 200),
        category,
        is_recurring: recurring,
      });
      toast.success("Transação cadastrada");
      setOpen(false);
      reset();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
          <Plus className="mr-1 h-4 w-4" /> Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Nova Transação</DialogTitle>
          <DialogDescription>
            Registre uma receita ou despesa com os detalhes abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={type === "expense" ? "default" : "outline"}
              className={type === "expense" ? "bg-destructive hover:bg-destructive/90" : ""}
              onClick={() => {
                setType("expense");
                setCategory("");
              }}
            >
              Despesa
            </Button>
            <Button
              type="button"
              variant={type === "income" ? "default" : "outline"}
              className={type === "income" ? "bg-primary text-primary-foreground hover:opacity-90" : ""}
              onClick={() => {
                setType("income");
                setCategory("");
              }}
            >
              Receita
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                inputMode="decimal"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="cat">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {cats.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <div className="flex items-center gap-2">
                      <c.icon className="h-4 w-4" />
                      {c.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="desc">Descrição</Label>
            <Textarea
              id="desc"
              placeholder="Ex: Mensalidade academia"
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
            <div>
              <Label htmlFor="rec" className="cursor-pointer">Despesa/receita recorrente</Label>
              <p className="text-xs text-muted-foreground">Usado na previsão de saldo final</p>
            </div>
            <Switch id="rec" checked={recurring} onCheckedChange={setRecurring} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button
            onClick={submit}
            disabled={create.isPending}
            className="bg-gradient-primary text-primary-foreground hover:opacity-90"
          >
            {create.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
