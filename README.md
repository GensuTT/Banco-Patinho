# 🦆 Banco Patinho

**Acesse o repositório:** [https://github.com/GensuTT/Banco-Patinho](https://github.com/GensuTT/Banco-Patinho)

O **Banco Patinho** é um dashboard financeiro inteligente e simpático (muito fofo!), focado em ajudar o usuário a gerenciar suas finanças pessoais com o auxílio de Inteligência Artificial e dados em tempo real.

Criei o Banco Patinho para resolver um problema meu: ter um controle financeiro prático, inteligente e do meu jeito. Para além de uma ferramenta, o projeto se tornou o meu "laboratório de tecnologia".
Neste projeto, utilizei o auxílio de Inteligência Artificial para acelerar o desenvolvimento do frontend, o que me permitiu focar as minhas energias e estudos na construção do backend, na arquitetura de segurança e nas integrações de APIs.

---

## Funcionalidades

*   **Dashboard Financeiro:** Visão geral de receitas, despesas e saldo anonimizados.
*   **Oráculo Financeiro (IA):** Um assistente virtual integrado que analisa o contexto financeiro do usuário e dá conselhos utilizando o modelo Gemini 3.5 Flash.
*   **Widget de Câmbio:** Consulta de cotações de moedas em tempo real.

---

##  Tecnologias Utilizadas

*   **Frontend:** React, Vite, Tailwind CSS (TypeScript)
*   **Backend & Autenticação:** Supabase, Edge Functions **(TypeScript rodando no Deno)**
*   **Integrações (APIs):** 
    *   Google Gemini API (`gemini-3.5-flash`)
    *   AwesomeAPI (Cotação de Câmbio)
*   **Deploy & Hospedagem:** Cloudflare Pages

---

## 💻 Como Testar e Rodar o Projeto Localmente

**1ª Opção: Criar uma conta normalmente e testar as funcionalidades** 
1. Criar uma conta
2. Verificar a confirmação do email antes de tentar logar
3. Fazer login e testar as Funcionalidades
- Link : https://banco-patinho.gnducks.workers.dev/login

**2ª Opção: Clonar o repositório e rodar localmente**
1. Clone o repositório:
   ```bash
   git clone [https://github.com/GensuTT/Banco-Patinho.git](https://github.com/GensuTT/Banco-Patinho.git)
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd Banco-Patinho
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Configure as variáveis de ambiente locais baseadas no seu projeto Supabase.
5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   
---

## O Que Aprendi Desenvolvendo este Projeto

A construção do Banco Patinho foi um grande laboratório de estudos para arquitetura de software e DevOps. Abaixo estão os principais conceitos e práticas que consolidei:

*   **Segurança e Arquitetura BFF (Backend for Frontend):**
    A principal virada de chave do projeto foi entender como proteger chaves sensíveis. No início, as requisições para a IA saíam direto do navegador, o que expunha a API Key. Refatorei a arquitetura criando uma **Edge Function** no Supabase. Agora, o frontend faz a requisição para o meu servidor, o servidor acessa a chave de forma segura no cofre, consulta o Google Gemini e devolve apenas o texto pronto para a tela.
*   **Integração e Consumo de APIs:**
    *   Aprendi a buscar dados em tempo real consumindo a **AwesomeAPI** para alimentar o widget de câmbio.
    *   Integrei o **Google Gemini**, lidando com formatação de *prompts* de sistema, envio de contexto anonimizado para a IA e atualização da versão do modelo para o `gemini-3.5-flash`.
*   **Deploy e Variáveis de Ambiente em Produção:**
    Configurei o ambiente de produção na **Cloudflare**. Isso envolveu aprender a separar as variáveis de ambiente locais (`.env`) das variáveis públicas e secretas na nuvem, lidar com configurações do `wrangler` e resolver problemas clássicos de roteamento (erros 404) em *Single Page Applications* (SPAs).
*   **Resolução de Conflitos e Git:**
    Prática constante de versionamento, resolução de conflitos de *merge* e limpeza de arquivos desnecessários (como remover configurações antigas da Vercel ao migrar de plataforma).
---
*Desenvolvido por Matheus Santos.*
