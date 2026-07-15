import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Wallet, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/dashboard" });
  }, [session, navigate]);

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else navigate({ to: "/dashboard" });
  };

  const signUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Conta criada com sucesso!");
      navigate({ to: "/dashboard" });
    }
  };

  const google = async () => {
    setLoading(true);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) {
      setLoading(false);
      toast.error("Falha no login Google");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Wallet className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight">
            <span className="text-gradient">Finova</span>
          </h1>
          <p className="text-sm text-muted-foreground">Seu dashboard financeiro inteligente</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-card backdrop-blur">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar conta</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-3 pt-4">
              <div className="space-y-1.5">
                <Label htmlFor="e">E-mail</Label>
                <Input id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p">Senha</Label>
                <Input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button
                onClick={signIn}
                disabled={loading}
                className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-3 pt-4">
              <div className="space-y-1.5">
                <Label htmlFor="n">Nome completo</Label>
                <Input id="n" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="e2">E-mail</Label>
                <Input id="e2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p2">Senha (mín. 6 caracteres)</Label>
                <Input id="p2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button
                onClick={signUp}
                disabled={loading}
                className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                {loading ? "Criando..." : "Criar conta"}
              </Button>
            </TabsContent>
          </Tabs>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-card px-2 text-xs text-muted-foreground">ou</span></div>
          </div>

          <Button variant="outline" className="w-full" onClick={google} disabled={loading}>
            <Sparkles className="mr-2 h-4 w-4" /> Continuar com Google
          </Button>
        </div>
      </div>
    </div>
  );
}
