import {
  GraduationCap,
  Dumbbell,
  Tv,
  Gamepad2,
  Beer,
  Bus,
  Wallet,
  Pizza,
  ShoppingBag,
  Heart,
  Home,
  Briefcase,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type CategoryDef = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string; // tailwind text-/bg- token-friendly hex (via chart palette)
  type?: "income" | "expense" | "both";
};

export const EXPENSE_CATEGORIES: CategoryDef[] = [
  { id: "educacao", label: "Educação / Faculdade", icon: GraduationCap, color: "var(--chart-3)" },
  { id: "academia", label: "Academia & Suplementação", icon: Dumbbell, color: "var(--chart-1)" },
  { id: "assinaturas", label: "Assinaturas", icon: Tv, color: "var(--chart-2)" },
  { id: "lazer", label: "Lazer & Jogos", icon: Gamepad2, color: "var(--chart-6)" },
  { id: "saidas", label: "Saídas & Encontros", icon: Beer, color: "var(--chart-5)" },
  { id: "transporte", label: "Transporte", icon: Bus, color: "var(--chart-4)" },
  { id: "alimentacao", label: "Alimentação", icon: Pizza, color: "var(--chart-5)" },
  { id: "compras", label: "Compras", icon: ShoppingBag, color: "var(--chart-6)" },
  { id: "saude", label: "Saúde", icon: Heart, color: "var(--chart-3)" },
  { id: "moradia", label: "Moradia", icon: Home, color: "var(--chart-4)" },
];

export const INCOME_CATEGORIES: CategoryDef[] = [
  { id: "bolsa", label: "Bolsa / Estágio", icon: Briefcase, color: "var(--chart-1)" },
  { id: "renda", label: "Renda Extra", icon: Sparkles, color: "var(--chart-2)" },
  { id: "salario", label: "Salário", icon: Wallet, color: "var(--chart-1)" },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategory(id: string): CategoryDef {
  return (
    ALL_CATEGORIES.find((c) => c.id === id) ?? {
      id,
      label: id,
      icon: Wallet,
      color: "var(--chart-1)",
    }
  );
}
