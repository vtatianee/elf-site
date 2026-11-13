# 04b — Textos aprovados no Portão 4, ligados no site (Desenvolvedor)

- **Fase:** 4 — fechamento técnico
- **Data:** 12/11/2026
- **Lido antes:** `04-marketing-assets.md` (§5 aprovado por inteiro: "Aprovo tudo"), `marketing/site-copy.json`, `marketing/copy-review.md`, `marketing/idea-60-letter.json`
- **Status:** feito, build verde, conferido no navegador. No ar depois do push (Cloudflare Pages).

---

## 1. Onde fica o texto novo

- **`src/data/approved-copy.json`** guarda tudo o que o Marketing escreveu e o André aprovou: 8 elf notes, 60 frases de efeito, os textos dos imprimíveis, a carta curta da ficha 60 e 2 avisos de segurança novos.
- **`src/data/ideas.json` continua sendo o registro fiel do PDF.** Não recebeu nenhum texto novo. Separar os dois deixa claro, para qualquer pessoa, o que veio da fonte e o que foi escrito depois.
- `src/lib/ideas.ts` junta os dois arquivos: a frase de efeito vira `idea.hook`; a nota aprovada entra só onde a ficha não tem nota (o build para se uma nota aprovada tentar substituir a da ficha); os avisos novos entram **depois** dos avisos da ficha.
- `src/lib/approved-copy.ts` entrega os textos dos imprimíveis para `/printables/`. O build para se a 1ª missão, a 1ª pergunta ou a 1ª pista deixarem de bater com o texto da ficha.

## 2. O que mudou no site

| Onde | Mudança |
|---|---|
| Página de ideia | Frase de efeito sob o título (60). Elf note nova nas fichas 6 ("night 2, with the variation"), 7, 16, 17, 20, 23, 28 (no certificado) e 30 (na carta). Dica do bilhete: "Write it on a small {kind} and leave it with the elf." Aviso de imprimível sem erro de gramática. "More ideas for the table / the whole house". |
| Segurança | Ficha 21: "Hot drinks: a grown-up makes and pours the hot chocolate." Ficha 27: "A grown-up handles the toothpicks and takes them all out before anyone eats the snowman." e "For toddlers, cut the marshmallows into small pieces." |
| `/printables/` | 24 perguntas (29), carta de despedida (30), história completa com as 5 lacunas (49), 12 missões (25), 4 pistas com "First stop" (34), linha de topo do certificado (28), instrução da folha de notas (23), carta "See you soon!" junto do cupom (60). Os avisos "being written" saíram; fica só o da folha de colorir (52). |
| Home | "Editor’s picks · Four easy ones to start with." com as fichas 13, 6, **8**, 26 (a 8 entrou no lugar da 11). |
| Tonight Mode | Frase de reserva nova (diz qual critério foi solto). Hoje não aparece: o menor grupo tem 12 ideias. |
| Meta description | "Trapped in a Jar: a 2-minute elf idea with zero mess, for all ages. You need: …" |
| E-mail (formulário desligado) | "every day, December 1 to 24 — in time for tonight" e "Sign-ups open soon…". |
| About, Contact, Planner, hubs | Linhas 14–17, 19, 26, 29, 30 e 32 da revisão de copy. A frase "most use things you already have" virou "many use only things you already have at home…" (são 25 de 60). |

**Não aplicado (era opcional e ninguém pediu):** usar a frase de efeito também no início da meta description (opção B da linha 5).

## 3. Verificação

- `npm run lint`, `npm run typecheck`, `npm run build` verdes; checagem de exportação passou (JS 138,5 kB, CSS 7,2 kB, HTML 20,0 kB).
- No navegador: `/printables/` com 40 cartões de recortar, história com as lacunas no lugar e só o aviso pendente da ficha 52; página da ficha 27 com frase de efeito e os avisos novos; home com "Editor’s picks"; nenhum erro no console.
- Não verificado: impressão em papel das folhas novas.

## 4. Pendências

| # | Ponto | Decide |
|---|---|---|
| 1 | Endereço postal para o rodapé do e-mail (antes de ligar um provedor) | **Vanessa** |
| 2 | Folha de colorir da ficha 52 | Designer, com a arte final |
| 3 | Lote 1 de ilustração final: chegada (31–35) + 5 das "5-Minute" | Designer |
