# 05b — Correções dos bugs do QA (Desenvolvedor + PM)

- **Fase:** 5 — Testar + Assinar
- **Data:** 13/11/2026
- **Lido antes:** `05-qa-report.md`
- **Status:** os 3 bugs médios e 6 dos 9 baixos corrigidos; os outros 3 decididos pelo PM (ficam como estão). Build verde, conferido no navegador. Pronto para o Portão 5.

---

## 1. Corrigidos

| Bug | Correção | Onde |
|---|---|---|
| **QA-01** (Médio) Tonight Mode alternava entre 2 trios | O sorteio enche os 3 lugares nesta ordem: ideias novas (nem hoje, nem ontem) → as de ontem ainda não vistas hoje → recomeço do ciclo → o que está na tela (grupo minúsculo). Recomeçar o ciclo agora zera a memória da noite. Teste no navegador com o caso do QA (ontem = 1, 2, 3, 6, 8, 10): 6 novas, depois as 6 de ontem, depois ciclo novo; nunca o mesmo trio duas vezes seguidas. | `src/components/TonightMode.tsx` (`pickThree`) |
| **QA-02** (Médio) interativa a cada ~3 dias falhava | Nova regra: nunca 3 dias seguidos sem interativa. Quando o 3º dia está ocupado, ela vai para o dia livre mais próximo antes dele. As interativas são escolhidas **antes** dos projetos de fim de semana, para que um sábado ou domingo possa receber uma interativa de 10 min. | `src/lib/planner-rules.ts` |
| **QA-03** (Médio) interativa de 10 min em dia útil | Dia útil só recebe interativa de 2 ou 5 min; as de 10 min ficam para o fim de semana. | `src/lib/planner-rules.ts` |
| **QA-11** (Baixo) 1º "Make a new plan" depois de recarregar repetia | Cada toque usa uma semente aleatória nova. | `src/components/Planner.tsx` |
| **QA-05** (Baixo) `/printables/` 4 px mais largo no celular | As linhas "____" da carta quebram; a folha não cresce além do cartão. Agora 375 px. | `src/styles/components.css` |
| **QA-06** (Baixo) filtros rápidos da home sem recuo | O recuo lateral volta a valer (a regra de lista zerava). 1º chip a 17 px da borda; anel de foco inteiro. | `src/styles/components.css` |
| **QA-07** (Baixo) `elf-sleep.svg` pré-carregado em toda página | A imagem da página 404 e do estado vazio passa a `loading="lazy"`; o React deixa de pré-carregá-la. 0 ocorrências no HTML. | `src/app/not-found.tsx`, `src/components/IdeasExplorer.tsx` |
| **QA-09** (Baixo) "tick off" sem caixas | A lista de compras ganhou caixas de marcar (mesmo visual do checklist das ideias). As marcas não são salvas, e a frase diz isso. A política de privacidade foi atualizada na mesma hora (data: 13/11/2026). | `src/components/Planner.tsx`, `src/app/privacy/page.tsx` |
| **QA-12** (Baixo) `?time=15+` digitado era ignorado | O "+" que chega como espaço é lido de volta como "+". Mostra as 6 ideias de 15+ min. | `src/components/IdeasExplorer.tsx` |

## 2. Decisões do PM

| Bug | Decisão | Por quê |
|---|---|---|
| **QA-04** ficha 59 no dia 22, mas a ficha diz "from the 18th on" | **Corrigido:** a 59 vai para o **dia 18**. O dia 22 recebe uma ideia comum; 60 continua no 23 e 30 no 24. | Regra do projeto: quando há conflito, o PDF vence. O planner lê o "from the Nth on" da própria ficha (só a 59 tem). Isso muda o ponto 7 do `03-dev-build.md`. |
| **QA-08** lista de compras com quase-duplicatas | **Fica como está no MVP.** | Juntar "1 card" e "1 small card" exige reescrever materiais, e o texto dos materiais é o da ficha. Revisar depois do teste de dezembro, se os pais reclamarem. |
| **QA-10** variação aparece no passo 3 e no bloco "Quick variation" (6 e 26) | **Fica como está.** | Os passos são o texto fiel da ficha e o bloco foi aprovado no Portão 1 (C6c). Tirar o passo deixaria a ficha 6 com 2 passos (o mínimo é 3). |

## 3. Verificação

- `npm run lint`, `npm run typecheck`, `npm run build` verdes; checagem de exportação passou.
- **Planner:** 900 planos (2026, 2027, 2028 × 300 sementes) com as regras reais: **todos passam**. Nenhuma cena repetida, chegada no dia 1, 59 no 18, 60 no 23, 30 no 24, bagunça alta 1 vez numa sexta ou sábado, projeto só no fim de semana, nenhuma ideia de 10 min em dia útil fora das âncoras, nunca mais de 2 dias seguidos sem interativa.
- **No navegador (build local, 375 px):** Tonight Mode no caso do QA-01; `/printables/` e home com 375 px; filtros rápidos com recuo; `?time=15+` → 6 ideias; planner com 59 no dia 18, "Make a new plan" muda o plano, lista com caixas.
- O `localStorage` que usei no teste foi apagado.
- **Atenção:** quem já tem um plano salvo continua vendo o plano antigo (por exemplo, a 59 no dia 22) até tocar em "Make a new plan". É o comportamento esperado de um plano salvo.
- Não verificado: reteste completo do QA no preview depois do deploy (conferi as mudanças acima no ar depois do push; ver a mensagem de fechamento da fase).
