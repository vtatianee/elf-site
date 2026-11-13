# 05 — Relatório de QA (Especialista em QA)

- **Fase:** 5 — Testar + Assinar
- **Data:** 12/11/2026 (testes rodados entre a noite de 12/11 e o início de 13/11/2026, horário de Nova York)
- **Lido antes:** `PROMPT-CLAUDE-CODE-SITE-ELF.md` (critérios de aceitação, regras não negociáveis, monetização, papel 6), `src/data/ideas.json`, `src/data/approved-copy.json`, `docs/source/ideas-pdf-text.txt`, `docs/source/ideas-tags-verified.json`, `01-pm-scope.md`, `02-pm-data-and-tags.md`, `02a-solutions-architecture.md`, `02b-design-system.md`, `03-dev-build.md`, `03b-deploy-preview.md`, `04-marketing-assets.md`, `04b-dev-approved-copy.md`
- **Versão testada:** commit `4974f05` ("Wire the copy approved at Gate 4 into the site"), build local em `out/` e preview https://elf-site.pages.dev (o texto das 76 páginas no ar é idêntico ao do build local, exceto a "ideia do dia", que depende da data do build)
- **Status:** testes concluídos. **0 Crítico · 0 Alto · 3 Médio · 9 Baixo.** Os 7 critérios passam. Relatório entregue ao PM para o Portão 5. QA não aprova nada em nome do André.

---

## 1. Resumo em 1 minuto

- **Os 7 critérios de aceitação passam.** Build verde, 76 páginas, sitemap 1:1, todas 200 no ar, 404 correto; filtros nas 6 dimensões e os 8 hubs batem com o `ideas.json`; Tonight Mode sorteia 3 ideias certas em 1 toque; planner monta 1–24 de dezembro com uma lista de compras; as 60 páginas de ideia têm o template completo; nenhum erro de console, nenhum script de anúncio, nada de WordPress/PHP; Vanessa nomeada em `/privacy/`, `/about/`, `/contact/` e no rodapé de todas as páginas.
- **3 bugs Médios, todos de lógica, todos do Desenvolvedor:**
  1. **Tonight Mode** entra em "pingue-pongue" na noite seguinte a uma noite em que se viu metade do grupo: o botão "Show 3 different ideas" alterna entre os mesmos 2 trios para sempre (QA-01).
  2. **Planner:** a "interativa a cada ~3 dias" não acontece — buracos de 4 a 6 dias em 100% dos 400 planos testados (QA-02).
  3. **Planner:** ideias interativas de 10 min caem em dias úteis, contra a regra "2–5 min nos dias úteis" (QA-03).
- **9 Baixos:** pequenos defeitos de layout (rolagem lateral de 4 px em `/printables/` no celular; faixa de filtros rápidos colada na borda), avisos de console por pré-carregamento inútil, lista de compras com quase-duplicatas, e alguns pontos de conteúdo para o PM decidir.
- **Recomendação:** pode seguir para o Portão 5 depois que o Desenvolvedor corrigir os 3 Médios (são correções pequenas e localizadas) e o André resolver as pendências de lançamento que não são bugs (domínio, tag de afiliado, e-mail de contato — seção 7).

---

## 2. Resultado por critério de aceitação

| # | Critério | Resultado | Evidência |
|---|---|---|---|
| 1 | `npm run build` com export estático; 60 ideias + 8 hubs + home + planner + printables + shop + páginas de confiança renderizam; sitemap lista todas | **PASS** | `npm run lint` (0 avisos), `npm run typecheck` e `npm run build` com saída 0; checagem de exportação: 76 páginas, 76 no sitemap, orçamento OK (JS 138,5 kB gzip de 180; CSS 7,2 de 20; HTML mais pesado 20,0 de 40; fontes 67,2 de 110). Conferência própria: as 76 rotas esperadas existem em `out/` e são exatamente as do sitemap (local e no ar). No ar: as 76 respondem 200, sem redirecionamento; canonical = o próprio endereço em `elf-site.pages.dev`; nenhum `noindex`; `robots.txt` e `sitemap.xml` apontam para o preview. `/this-page-does-not-exist/`, `/ideas/not-a-real-idea/` e `/fridge/` respondem **404** com a página "Page not found" do site. |
| 2 | Filtros nas 6 dimensões; cada hub mostra só as ideias certas (geladeira = 2) | **PASS** | No ar, em `/ideas/`, cliquei em cada uma das 29 opções de filtro, uma por vez: todas as contagens batem com o cálculo feito do `ideas.json` (tempo 6/25/23/6; bagunça 35/17/5/3; idade 40/50/30 com "All ages" contando em Toddler e Kids; cômodo 14/5/17/6/**2**/4/9/3; material 25/22/22/20; tipo 16/19/14/5/3/6). Combinação das 6 dimensões (`time=2,5 & mess=zero & age=toddler & room=living-room-tree & material=home & type=cute`) → exatamente as fichas 1, 6, 10, 36, como esperado. "ou" dentro da dimensão e "e" entre dimensões conferidos. Busca: "marshmallow" 5, "fridge" 2, "candy cane" 4, "zzzz" 0 com estado vazio e botão "Clear filters". Endereço guarda o estado; abrir `/ideas/?room=kitchen&mess=zero` já filtra (5); clicar numa ideia e voltar mantém filtros e contagem; "Clear all" zera tudo e limpa o endereço; valores inválidos no endereço (`room=garage`) são ignorados e `q=<b>x</b>` não injeta HTML. **Hubs:** os 8 listam exatamente as ideias com aquele hub no campo `hubs` (easy 42, 5-minute 31, no-mess 35, toddlers 40, kids 50, funny 16, arrival 5, goodbye 3), sem repetição; em toddlers/kids as 10/20 ideias específicas vêm antes das 30 "all ages". Recalculei os hubs pelas regras do PDF (não pelo campo) e bateu 60/60. `/ideas/?room=fridge` → 2 (fichas 56 e 57; decisão C9). |
| 3 | Tonight Mode: 3 ideias em 1 toque, sem repetição imediata | **PASS** (com bug Médio QA-01) | No ar, com `localStorage` limpo: abre com os 3 critérios ligados, "12 ideas match all three", 3 ideias do grupo das 12. 12 sorteios seguidos: os 4 primeiros mostram as 12 ideias sem repetir; nenhum sorteio repetiu ideia do sorteio anterior (0 sobreposições em 11 trocas). Liga/desliga: 24 (5 min + no mess), 31 (5 min), 60 ("All 60 ideas are in the hat"), 35 (no mess), 15 (no mess + home), 15 (5 min + home), 12 (os três) — todas batem com os dados, e as 3 ideias de cada sorteio atendem aos critérios ligados (conferido por script). O link "See all" leva o filtro certo (ex.: `/ideas/?time=2%2C5&mess=zero&material=home` → 12). Memória na chave `elf-tonight-v1` (`{night, seen, last}`). **Virada da noite:** (a) prova ao vivo: às 00h06 de 13/11 a noite gravada ainda era `2026-11-12`; (b) simulação: troquei o `night` gravado para `2026-11-11` com `seen=[1,2,3,6,8,10]` e recarreguei → a memória virou `last=[1,2,3,6,8,10]` e nenhum sorteio da noite nova mostrou essas 6. Foi nesse teste que apareceu o **QA-01**. A frase de reserva (menos de 3 ideias) não pode acontecer com os dados atuais (menor grupo = 12): só li o código. |
| 4 | Planner monta calendário 1–24 de dezembro e uma lista de compras combinada | **PASS** (com bugs Médios QA-02 e QA-03) | No ar: "December 2026", 24 dias com dia da semana certo, 24 ideias diferentes, dia 1 = chegada (31), dia 22 = 59, dia 23 = 60, dia 24 = 30; bagunça alta 1 vez, no sábado 12 (meio do mês); os 6 dias de fim de semana com projeto de 15+ min ou a bagunça alta. Troca de dia por ideia não usada: troca e a lista de compras acompanha; troca por ideia já usada: as duas trocam de lugar (24 ideias únicas). "Make a new plan" gera outro plano válido. O plano sobrevive ao recarregar (`elf-planner-v1`). Lista de compras: uma só, cada texto de material uma vez, com os dias ("Dec 1, …"); 33 links "Search Amazon for …" com o aviso exato logo abaixo. Botão "Print the plan" presente. **Teste das regras em 600 planos** (anos 2026, 2027 e 2028 × 200 sementes, rodando o próprio `planner-rules.ts`): 0 falhas em 24 dias / sem repetição / chegada no dia 1 / 30 no dia 24 / 59 e 60 nos dias 22 e 23 / bagunça alta 1 vez em sexta ou sábado do meio do mês / projeto nunca em dia útil. **Falham:** "interativa a cada ~3 dias" (QA-02) e "2–5 min nos dias úteis" (QA-03). |
| 5 | Toda página de ideia com template fixo, HowTo, 3 relacionadas, 2 hubs, aviso de afiliado onde há link, aviso de ilustração | **PASS** | Script sobre as 60 páginas de `out/` comparando campo a campo com `ideas.json` + `approved-copy.json` — **0 falhas**: H1 = título; frase de efeito aprovada; barra de fatos (tempo, bagunça, idade, cômodo da ficha); ilustração vertical com alt "Illustration of…", botão Pin (Pinterest com o endereço da própria ideia e a imagem vertical) e a legenda exata "Illustrated guide — scenes are original illustrations, not photos."; materiais idênticos e na mesma ordem; passos idênticos (3 em cada); segurança = avisos da ficha + os 2 avisos novos do Portão 4 (21: hot drinks; 27: toothpicks e marshmallows para toddlers); elf note onde há texto (da ficha ou aprovada) e nenhuma onde não há; variação só em 6 e 26; exatamente 3 relacionadas (nunca a própria); exatamente 2 links de hub (nas 7 ideias de um hub só — 7, 9, 40, 43, 44, 45, 47 — o 2º é convite "Short on time? See 5-minute ideas", nunca "More …"); link do cômodo correto; JSON-LD HowTo válido com nome, materiais e passos idênticos, posições 1–3, `totalTime` = minutos da ficha, imagem horizontal existente; Open Graph, Twitter card e canonical presentes. **Amazon:** 78 links nas 55 ideias que têm `amazonItems`, termos idênticos aos da ficha, `rel="sponsored nofollow noopener"`, endereço completo `www.amazon.com` (nenhum encurtado), aviso exato "As an Amazon Associate I earn from qualifying purchases." logo abaixo; nenhum link nem bloco da Amazon nas fichas 12, 14, 23, 25 e 29. Nenhum `editorNotes`/`illustrationBrief` no HTML. **Links internos:** 100 endereços internos distintos em `out/`, 0 quebrados; no ar, 226 endereços internos (páginas, imagens, `/social/…`) + 14 arquivos `/_next/` → todos 200; as 10 âncoras `/printables/#…` existem; nenhuma ideia órfã. |
| 6 | Preview no Cloudflare carrega rápido, sem erro de console; nenhum script de anúncio, AdSense, Journey/Mediavine, WordPress/PHP | **PASS** | **Console** (aba nova, 11 carregamentos: home, `/ideas/`, 2 ideias, `/planner/`, `/printables/`, `/shop/`, `/toddlers/`, `/about/`, `/privacy/`, `/contact/`): **0 erros do site**. O único erro registrado é o próprio 404 do endereço inexistente que abri de propósito. 5 **avisos** de pré-carregamento não usado de `/mascot/elf-sleep.svg` (QA-07). **Velocidade:** tabela na seção 3 — TTFB 80–140 ms frio (curl), 20–30 ms no navegador; `load` 63–182 ms; CLS 0. **Anúncio/WordPress:** `out/` sem `adsbygoogle`, `adsense`, `googlesyndication`, `mediavine`, `journey`, `grow.me`, `wp-content`, `wp-includes`, `wordpress` nem `.php`. A única ocorrência de "DoubleClick" é o nome do evento `onDoubleClick` do React (falso positivo). Todos os `<script src>` são `/_next/…` do próprio site; hosts externos citados no HTML/JS: só amazon.com (links), pinterest.com (links), schema.org e URLs internas do React. No repositório (fora de `node_modules`, `out`, `.git`): as palavras só aparecem em documentação que diz "sem AdSense / sem WordPress" (`README.md`, handoffs 01/02/02a, texto do PDF em `docs/source/`) e nas regras de bloqueio de `scripts/check-export.ts`. Nenhum código de anúncio. CSP no ar só libera o próprio site (+ o slot opcional do Cloudflare Web Analytics, desligado). |
| 7 | `/privacy/` e o aviso de afiliado nomeiam Vanessa Tatiane Evangelista Assink como operadora/titular | **PASS** | `/privacy/`: "operated by Vanessa Tatiane Evangelista Assink, who is also the Amazon Associates account holder". `/about/` e `/contact/`: "run by Vanessa Tatiane Evangelista Assink". Rodapé das 76 páginas + 404: aviso exato da Amazon e "Site operator: Vanessa Tatiane Evangelista Assink." O nome do André não aparece em nenhum arquivo de `out/` (busca por "André", "Andre", "arassink"). |

---

## 3. Velocidade medida (critério 6)

**Servidor frio (curl desta máquina, HTTP/2, compressão ligada, 3 tentativas com parâmetro anti-cache):**

| Página | TTFB | Total | HTML transferido |
|---|---|---|---|
| `/` | 93–138 ms | 95–140 ms | ~17 kB |
| `/ideas/` | 82–96 ms | 87–100 ms | ~17 kB |
| `/ideas/marshmallow-bubble-bath/` | 90–98 ms | 93–100 ms | ~8 kB |
| `/planner/` | 90–99 ms | 92–103 ms | ~14 kB |

**No navegador embutido (Chrome, HTTP/3; arquivos `/_next/` e fontes já em cache — não consegui limpar o cache do painel):**

| Página | TTFB | DOMContentLoaded | load | CLS |
|---|---|---|---|---|
| `/` | 21–31 ms | 48–86 ms | 84–182 ms | 0 |
| `/ideas/` | 22 ms | 34 ms | 63 ms | 0 |
| página de ideia | 29 ms | 63 ms | 89 ms | 0 |
| `/planner/` | 27 ms | 69 ms | 114 ms | 0 |

FCP/LCP: só o primeiro carregamento da home registrou pintura (FCP = LCP = 172 ms, elemento LCP = o H1 do Tonight Mode). Nos outros carregamentos o painel não emitiu eventos de pintura; não invento número.

---

## 4. Regras travadas e checagens gerais

| Regra / checagem | Resultado | Evidência |
|---|---|---|
| "Elf on the Shelf" / "elfontheshelf" como nome ou marca | **PASS** | 0 ocorrências em `out/` (HTML, JS, txt, XML), em `public/`, `src/` (fora 1 comentário de código em `src/config/site.ts` que cita a regra), títulos, meta, alt e nomes de arquivo. O rodapé diz só "any elf brand or trademark owner". |
| Nenhum preço | **PASS** | Nenhum "$número", "USD", "price" em texto visível nem em atributos. Única ocorrência de "price" é "We never show prices." em `/about/`. |
| Nenhum português nas páginas públicas | **PASS** | 0 caracteres acentuados do português em `out/`; lista de palavras portuguesas: só falso positivo ("do" em inglês). `<html lang>` em inglês. |
| Sem fotos; aviso de ilustração | **PASS** | Todas as imagens das páginas são SVG (ilustrações e mascote); os JPEG de `/social/` são cópias geradas das ilustrações para Pin/compartilhamento. Nenhuma imagem da Amazon. Aviso sob a ilustração das 60 ideias e em `/about/`. Todo alt não vazio começa com "Illustration of"; mascotes decorativos têm `alt=""`. |
| E-mail: "coming soon", nunca sucesso falso | **PASS** | Em todas as páginas que têm o bloco: campo e botão desabilitados ("Not open yet"), texto "Sign-ups open soon… nothing you type is saved or sent." O campo não tem `name`, o formulário não tem `action`: forçando a habilitação pelo console e enviando, nenhuma requisição saiu e nenhuma mensagem de sucesso apareceu. |
| `/printables/` | **PASS** | 10 folhas: 9 com conteúdo e botão "Print the …"; só a 52 (folha de colorir) diz "will be added together with the final illustrations". As 10 âncoras batem com as 10 fichas que têm imprimível. O botão marca só a folha escolhida para impressão e limpa depois (testado com `window.print` substituído). Pack pago: "isn't available yet — there is nothing to buy". Impressão em papel não testada. |
| `/shop/` | **PASS** | 11 materiais, cada um com as ideias que o usam e 1 busca na Amazon; aviso exato no topo e no fim; sem preço, sem foto. |
| Uma `h1` por página | **PASS** | 76 páginas + 404: exatamente 1. |
| Alt text | **PASS** | Toda `<img>` tem `alt`. |
| Skip link | **PASS** | "Skip to content" em todas as páginas; aparece com anel de foco ao primeiro Tab. |
| Foco visível nos controles | **PASS com ressalva** | Regra global `:focus-visible` + regras para cartões, Pin e skip link. Anel conferido na tela no skip link e nos chips. Ressalva: o anel do 1º chip dos filtros rápidos da home fica cortado (QA-06). Navegação só por teclado do começo ao fim não testada. |
| Rótulos de formulário | **PASS** | Todo `input`/`select` tem `label` (busca, e-mail, checklist de materiais, 24 seletores do planner). Todo botão/link sem texto tem nome acessível. |
| Contraste | **PASS** | `node scripts/check-token-contrast.mjs`: 39 pares WCAG AA aprovados. Não medi contraste pixel a pixel nas ilustrações. |
| Celular 375 px sem rolagem lateral | **FAIL (leve)** | Home, `/ideas/` (com filtros abertos), página de ideia (título e fatos antes da ilustração), `/planner/`, `/shop/`, `/kids/`, `/privacy/`: largura = 375. **`/printables/`: 379 px** (QA-05). |
| Texto x dados | **PASS** | As 60 páginas batem campo a campo com o `ideas.json` (critério 5). O `ideas.json` bate com `docs/source/ideas-tags-verified.json` (tempo, bagunça, idade, cômodo, título) em 60/60; única diferença é o título da 49, renomeada no Portão 2. Os 60 títulos estão no texto do PDF (fora a 49). Além do script (que cobre as 60), li linha a linha o texto renderizado de 6, 21, 27, 30, 44 e 55, e abri no ar, no navegador, 8, 13, 15, 18 e 27 (carregaram completas). |

---

## 5. Lista de bugs

### Médio

**QA-01 · Médio · Tonight Mode (home) · Desenvolvedor**
"Show 3 different ideas" fica alternando entre os mesmos 2 trios na noite seguinte a uma noite em que se viu metade do grupo.
- **Passos:** em `https://elf-site.pages.dev/`, no console: `localStorage.setItem('elf-tonight-v1', JSON.stringify({night:'2026-11-11', seen:[1,2,3,6,8,10], last:[]}))` (= ontem a pessoa abriu a home e tocou 1 vez); recarregar; tocar 3 vezes em "Show 3 different ideas".
- **Obtido:** 25·56·15 → 41·36·38 → 25·56·15 → 41·36·38 → … para sempre (gravado ao vivo). As fichas 1, 2, 3, 6, 8 e 10 nunca voltam nessa noite.
- **Esperado (03-dev-build §4.1):** "não repete as da noite anterior **enquanto houver 3 novas**" — esgotadas as 6 novas, o sorteio deve passar a usar as da noite anterior, e não ficar trocando entre 2 trios.
- **Causa provável:** em `pickThree` (`src/components/TonightMode.tsx`), o passo 2 continua excluindo `memory.last`; e o ciclo nunca recomeça porque as ideias de `last` nunca entram em `seen`, então `found.every(seen)` nunca fica verdadeiro.

**QA-02 · Médio · `/planner/` · Desenvolvedor**
A regra "interativa a cada ~3 dias" (PDF: a cada 2–3 dias; 03-dev-build §4.3: a cada 3) não é cumprida.
- **Passos:** abrir `/planner/` com `localStorage` limpo (plano padrão de 2026).
- **Obtido:** interativas nos dias 3, 9, 10, 15, 17, 18, 21, 22 — 6 dias sem nenhuma entre 3 e 9, e 5 entre 10 e 15. Em 400 planos (2026 e 2027 × 200 sementes), o maior intervalo foi 4 a 6 dias em 100% deles (mediana 6).
- **Esperado:** uma interativa a cada 2–3 dias, sem buraco maior que 3.
- **Causa provável:** em `buildPlan`, as vagas `i = 2, 5, 8, …` são puladas quando caem num fim de semana já ocupado por projeto ou pela bagunça alta (ex.: dom 6 e sáb 12 em 2026), e nada recoloca a interativa no dia útil vizinho.

**QA-03 · Médio · `/planner/` · Desenvolvedor**
Ideias interativas de 10 min caem em dias úteis, contra "2–5 min nos dias úteis".
- **Passos:** mesmo plano padrão de 2026.
- **Obtido:** ter 15/12 = 51 "Guess How Many Jar" (10 min); sex 18/12 = 52 "Draw My Outfit Contest" (10 min). Fora as âncoras (dias 1, 22, 23, 24) e a bagunça alta de sexta, 188 de 200 planos de 2026 e 200 de 200 de 2027 têm ao menos 1 dia útil com ideia de 10 min — sempre uma interativa (26, 51 ou 52).
- **Esperado:** em dia útil, interativa de 2 ou 5 min (há 9: 25, 27, 28, 29, 37, 39, 48, 49, 50); as de 10 min ficam para o fim de semana.
- **Observação:** as âncoras (chegada 31/32 de 10 min no dia 1; 59, 60 e 30 de 10 min nos dias 22–24) também são de 10 min, mas são decisões aprovadas; não conto como bug.

### Baixo

**QA-04 · Baixo · `/planner/` · PM**
A ficha 59 "Memory Jar – Last Week Goodbye" diz "In the last week (from the 18th on)" e traz 7 cartões, mas o planner sempre a põe no dia 22 (decisão do 03-dev-build §7, ponto 7, mantida pelo PM). O plano contradiz o próprio passo 1 da ficha. **Proposta:** PM decide se a 59 vai para o dia 18 (e o 22 recebe outra ideia) ou se fica como está.

**QA-05 · Baixo · `/printables/` (celular 375 px) · Desenvolvedor (Designer revisa)**
A folha "Farewell letter template" é 5 px mais larga que o cartão: a página rola 4 px para o lado e a borda tracejada direita fica cortada. **Passos:** abrir `/printables/` a 375 px e rolar até a carta. **Esperado:** largura 375, sem rolagem. **Causa provável:** as linhas em branco "______" não quebram, e a grade do `.sheet` cresce até o tamanho mínimo do conteúdo (346 px num cartão de 341 px).

**QA-06 · Baixo · Home, "Quick filters" · Desenvolvedor**
A faixa de chips não tem o recuo lateral: o 1º chip ("2 min") encosta na borda da tela (a busca logo acima começa a 21 px) e o anel de foco dele fica cortado à esquerda. **Causa:** `ul[role='list'] { padding: 0 }` (`src/styles/globals.css`, linha 103) é mais específico que `.chips--scroll { padding: … var(--gutter) }` e zera o recuo.

**QA-07 · Baixo · todas as páginas · Desenvolvedor**
Toda página pré-carrega `/mascot/elf-sleep.svg` (imagem do 404 e do estado vazio de `/ideas/`) sem usá-la, e o Chrome registra 1 aviso por página: "preloaded using link preload but not used within a few seconds". Não é erro, mas é 1 requisição desperdiçada por página e polui o console.

**QA-08 · Baixo · `/planner/`, lista de compras · PM + Desenvolvedor**
"Cada material uma vez" vale para o texto exato do material, então a lista do plano padrão (80 itens) tem quase-duplicatas — "1 card", "1 small card", "card", "7 small blank cards", "instruction card"; "tape", "tape or glue", "tape or string for hanging"; "markers", "thick marker"; "pen", "pencil", "mini pencil" — e itens que não são de comprar ("bathroom mirror", "set breakfast table", "towel on the floor", "TV remote control"). **Proposta:** PM decide se vale normalizar (mapa de sinônimos) ou se fica assim no MVP.

**QA-09 · Baixo · `/planner/` · Desenvolvedor / Marketing**
O texto diz "Most of it is already in your home — tick off what you have", mas a lista não tem caixas de marcar (só texto). Ou se põe a caixa (como no checklist das ideias), ou se ajusta a frase.

**QA-10 · Baixo · ideias 6 e 26 · PM**
A variação aparece duas vezes: no passo 3 ("Variation: move to a different branch…" / "Toddler variation: 3 candy canes…") e de novo no bloco "Quick variation". Os passos são tradução fiel do PDF, então a decisão é do PM (tirar do passo ou não mostrar o bloco).

**QA-11 · Baixo · `/planner/` · Desenvolvedor**
O contador de "Make a new plan" volta a 1 a cada carregamento: o 1º "Make a new plan" depois de recarregar dá sempre o mesmo plano (semente 2), não um plano novo.

**QA-12 · Baixo · `/ideas/` · Desenvolvedor**
`/ideas/?time=15+` digitado à mão (o "+" sem codificar vira espaço) é ignorado e mostra as 60. O próprio site sempre gera `15%2B`, então só afeta endereços digitados ou colados.

### Observações (não são bugs)

- **HowTo da ficha 55** sai sem `totalTime` (a ficha diz "15+ min", sem número). Válido; se quiserem, `PT15M`.
- **Ciclo do Tonight Mode:** depois do 1º ciclo completo, o novo ciclo começa contando o trio que está na tela; os ciclos seguintes têm 3 toques + esse trio. Nunca há repetição imediata. Coerente com a especificação.
- **"Ideia do dia"** troca à meia-noite (data do calendário), enquanto o Tonight Mode troca às 4h. Não há regra que exija o mesmo horário.
- **Busca por "tree"** traz 19 ideias porque o rótulo do cômodo é "Living room / tree". Comportamento correto, só fica registrado.

---

## 6. O que NÃO foi testado (e por quê)

| Item | Motivo |
|---|---|
| Safari, iPhone e Android reais | Só há o Chrome do painel; o celular foi emulado (375×812) |
| Leitor de tela; navegação só por teclado do começo ao fim | Fora do alcance das ferramentas; conferi skip link, foco, rótulos, nomes acessíveis e `aria-pressed`/`aria-live` |
| Impressão em papel / "Salvar em PDF" | O diálogo de impressão não foi aberto; testei só a lógica do botão (qual folha fica marcada) |
| LCP/FCP com cache frio no navegador | O painel não deixou limpar o cache e só emitiu eventos de pintura no 1º carregamento; o tempo frio do servidor foi medido com curl |
| Lighthouse / Core Web Vitals de campo | Sem ferramenta no ambiente; site não tem tráfego real |
| Frase de reserva do Tonight Mode (menos de 3 ideias) | Inalcançável com os dados atuais (menor grupo = 12); só li o código |
| Virada às 4h com o relógio real | Simulei editando o `night` gravado e conferi ao vivo que às 00h06 a noite ainda era a anterior; não esperei até as 4h |
| Destino dos links da Amazon e do Pinterest | Por regra, conferi só o `href` (endereço, termo, `rel`); não abri nem cliquei até o fim |
| Contraste dentro das ilustrações | Medido só nos pares de tokens do sistema de design |
| Build no Cloudflare a partir de um commit novo | Testei o deploy que está no ar (mesmo conteúdo do `4974f05`); não fiz push |

**Efeito colateral dos testes:** os testes do Tonight Mode e do Planner gravaram e apagaram as chaves `elf-tonight-v1` e `elf-planner-v1` do `localStorage` de `elf-site.pages.dev` no navegador do painel. No começo, um `localStorage.clear()` apagou o que já existia ali (memória do Tonight Mode e plano salvo de testes anteriores, se havia). Terminei com as duas chaves removidas: quem abrir o preview nesse navegador vai ver o estado de primeira visita. Nenhum servidor local foi iniciado; nenhum arquivo do repositório foi alterado fora este relatório.

---

## 7. Recomendação para o Portão 5

- **QA não aprova o lançamento.** Quem decide é o André, com o PM.
- **Bloqueia?** Pela regra do papel ("pronto quando zero bugs críticos"), **nada bloqueia**: 0 Crítico, 0 Alto.
- **Antes do lançamento, recomendo:**
  1. **Desenvolvedor** corrige QA-01, QA-02 e QA-03 (lógica pequena e localizada) e, se der, QA-05, QA-06 e QA-07 (CSS/1 linha cada). QA reteste rápido depois do push.
  2. **PM** decide QA-04, QA-08 e QA-10.
  3. **Pendências do André/Vanessa que não são bugs, mas são pré-requisito de lançamento** (01-pm-scope §6, 02a): domínio final (`NEXT_PUBLIC_SITE_URL`; hoje o canonical é `elf-site.pages.dev`); **tag do Amazon Associates da Vanessa** (hoje os 78 + 11 + 33 links saem sem tag e não rendem comissão); e-mail de contato (hoje o provisório `arche.boost@gmail.com` em `/contact/` e `/privacy/`); Vanessa/André lerem `/privacy/` (não é parecer jurídico); Idea Lists da Amazon (botão "Get everything" só aparece com elas).
- Os Baixos restantes podem ir para depois do lançamento sem risco para o teste de dezembro.

---

## 8. Como os testes foram feitos

- **Estático:** script Python (fora do repositório) que lê as 76 páginas de `out/` e compara com `ideas.json` + `approved-copy.json`: inventário × sitemap, H1, skip link, rodapé, alt, links internos e imagens, idioma, preço, marca, `noindex`, rótulos de formulário, template das 60 ideias, JSON-LD, hubs.
- **No ar:** o mesmo tipo de script baixou o sitemap do preview, as 76 páginas e todos os endereços internos (226 + 14 de `/_next/`), conferiu status, canonical, 404 e cabeçalhos; outro comparou o texto das 76 páginas no ar com o build local (iguais, fora a "ideia do dia").
- **Navegador:** abas novas no painel, apontando para https://elf-site.pages.dev — filtros, busca, endereço e botão voltar; Tonight Mode (sorteios, liga/desliga, memória, virada de noite); planner (troca, novo plano, recarregar, lista, Amazon); printables; e-mail; console; tempos; 375 px; foco por teclado. Viewport voltou ao tamanho desktop e as abas de teste foram fechadas.
- **Planner em lote:** o próprio `src/lib/planner-rules.ts` (cópia fora do repositório) rodado no Node para 600 planos.
