# 01 — Escopo e plano (PM) · Fase 1

- **Data:** 10/11/2026
- **Autor:** Gerente de Projeto (PM)
- **Status:** APROVADO no Portão 1 em 10/11/2026, com condições (ver `02-pm-data-and-tags.md`)
- **Fontes lidas:** `PROMPT-CLAUDE-CODE-SITE-ELF.pdf` (13 páginas) e `elf-site-estrutura-30-ideias/elf-site-estrutura-30-ideias.pdf` (28 páginas, todas).
- **Regra de precedência usada:** nas fichas e na estrutura do conteúdo, vale o PDF. Nas **decisões travadas** (datadas de 10/11/2026, posteriores ao PDF), vale o prompt. Todo conflito está listado na seção 4.

---

## 1. Resultado da conferência do PDF

| Verificação | Resultado |
|---|---|
| Número de fichas no PDF | **60** (1–60, nenhuma faltando) |
| Títulos das fichas × lista do prompt | **60 de 60 idênticos** |
| Títulos das fichas × tabelas de visão geral do PDF (seção 12) | 60 de 60 idênticos |
| Tempo e bagunça das fichas × tabelas de visão geral | 60 de 60 iguais |
| Distribuição de tempo, bagunça, idade e cômodo × matriz da seção 11 | Todas as contagens batem (tabela abaixo) |
| Contagens de hub calculáveis (`/5-minute/`, `/easy/`, `/no-mess/`, `/arrival/`, `/goodbye/`) | Batem: 31, 42, 35, 5, 3 |

A conferência foi feita por script sobre o texto extraído, não à mão. Arquivos gerados:

- `docs/source/ideas-pdf-text.txt` — texto completo do PDF das fichas, página por página.
- `docs/source/ideas-tags-verified.json` — as 60 fichas com tempo, bagunça, idade e cômodo conferidos.
- `PROMPT-CLAUDE-CODE-SITE-ELF.md` — texto do prompt extraído do PDF, para os papéis lerem.

**Observações sobre os arquivos recebidos**
- O `.src/index.html` citado no prompt não veio na pasta. Não fez falta: o PDF tem texto selecionável.
- O prompt veio como PDF, não `.md`. A cópia em `.md` é extração automática; o PDF continua sendo o original.
- Esta máquina não tem leitor de PDF de linha de comando (poppler). A extração usou o PDFKit do macOS. Os papéis seguintes devem ler os arquivos de texto acima.

### Distribuição conferida

| Dimensão | Contagem |
|---|---|
| Tempo | 2 min: 6 · 5 min: 25 · 10 min: 23 · 15+ min: 6 |
| Bagunça | Zero: 35 · Baixa: 17 · Média: 5 · Alta: 3 |
| Idade | Toddler (2–4): 10 · Kids (5–9): 20 · Todas: 30 |
| Cômodo | Cozinha: 14 · Sala/Árvore: 17 · Banheiro: 5 · Mesa: 9 · Quarto: 6 · Entrada: 4 · Geladeira: 2 · Casa toda: 3 |

**Mapeamento de cômodo.** Seis fichas usam um rótulo fora dos 8 valores do filtro. O mapeamento abaixo é o único que reproduz as contagens da matriz do PDF:

| Ficha | Rótulo na ficha | Valor do filtro |
|---|---|---|
| 6, 12, 30 | Árvore | Sala/Árvore |
| 10 | Lareira / Parede | Sala/Árvore |
| 17 | Porta do quarto | Quarto |
| 25 | Qualquer cômodo | Casa toda |
| 29 | Mesa do café | Mesa |

**Tempo das fichas de projeto.** Etiqueta do filtro = `15+ min`. Tempo exibido na página = o da ficha: 43, 44, 46 e 47 = 20 min; 45 = 25 min; 55 = "15+ min" (a ficha não dá número).

---

## 2. Escopo travado do MVP

### 2.1 Produto
Site estático em inglês (en-US) para pais de crianças de 2 a 9 anos, nos EUA e no Canadá: um "tonight planner" de ideias de elfo de Natal. Não é catálogo, não é app. Promessa do PDF: "A new elf idea every night - in under 5 minutes, with stuff you already have."

### 2.2 Páginas

| Rota | Conteúdo |
|---|---|
| `/` | Busca + filtros, Tonight Mode, ideia do dia, bloco de destaques (ver D3), captura de e-mail |
| `/ideas/` | Grade filtrável das 60 ideias, 6 dimensões |
| `/ideas/<slug>/` × 60 | Template fixo (seção 2.4) |
| 8 hubs | `/easy/` `/5-minute/` `/no-mess/` `/toddlers/` `/kids/` `/funny/` `/arrival/` `/goodbye/` |
| `/planner/` | Calendário 1–24 de dezembro + UMA lista de compras combinada |
| `/printables/` | Imprimíveis grátis; pack pago = página placeholder, sem checkout |
| `/shop/` | Materiais que se repetem entre as ideias, com links de afiliado |
| `/about/` `/contact/` `/privacy/` | Páginas de confiança |

Total mínimo no sitemap: **75 páginas** (60 + 8 + `/ideas/` + home + planner + printables + shop + 3).

### 2.3 Regras de hub (definidas pelo PDF, seção 11)

| Hub | Ideias | Regra |
|---|---|---|
| `/5-minute/` | 31 | Tempo = 2 ou 5 min |
| `/easy/` | 42 | 2 ou 5 min, mais as de 10 min com bagunça zero |
| `/no-mess/` | 35 | Bagunça = zero |
| `/toddlers/` | 10 específicas + 30 de "todas" | Específicas primeiro |
| `/kids/` | 20 específicas + 30 de "todas" | Específicas primeiro |
| `/funny/` | 16 | Tipo = engraçada. **O PDF não diz quais** — ver D5 |
| `/arrival/` | 5 | Fichas 31–35 |
| `/goodbye/` | 3 | Fichas 30, 59, 60 |

Filtros com contagem definida pelo PDF: interativas 14 · projetos 15+ min 6 (43–47 e 55) · bagunça alta 3 (53–55) · **geladeira 2 (56–57)**.

### 2.4 Template da página de ideia
Do prompt: ilustração vertical, H1, barra de fatos (tempo, bagunça, idade, cômodo), checklist de materiais, 3–5 passos, botão do kit Amazon, elf note, 3 ideias relacionadas, 2 links de hub, schema HowTo, aviso de afiliado, aviso de ilustração.

O PDF (seção 4) pede mais quatro elementos que o prompt não lista. Proposta do PM para cada um na seção 4, item C6.

### 2.5 Funcionalidades
- **Tonight Mode:** 3 botões (`5 minutes` / `No mess` / `Only stuff I have`); 1 toque sorteia 3 ideias; sem repetição imediata.
- **Filtros** nas 6 dimensões: tempo, bagunça, idade, cômodo, material, tipo.
- **Planner.** O PDF define as regras de montagem: projeto de 15+ min no fim de semana; 2–5 min nos dias úteis; interativa a cada 2–3 dias; bagunça alta no máximo 1 vez na temporada, sempre sexta ou sábado; sem repetir cena.
- **Links internos:** cada ideia → 3 irmãs + 2 hubs; cada hub → suas ideias. Nenhuma órfã.
- **SEO técnico básico:** slugs, H1 único, meta, sitemap XML, robots.txt, canonical, HowTo, Open Graph + Twitter (horizontal). Nenhum `noindex`. Pinterest Rich Pins previstos pelo PDF.

### 2.6 Visual
- Zero foto. Placeholders SVG/CSS no MVP, 1 por ideia, troca em 1 arquivo.
- Bíblia do personagem (PDF seção 9): elfo-criança genérico, cabeça grande, rosto redondo, olhos pretos redondos, bochechas rosadas, cabelo castanho curto, orelhas pontudas pequenas, sorriso simples, mãos sem dedos detalhados. Gorro vermelho caído com faixa verde e sino dourado, túnica vermelha, lenço verde, calça verde, botas vermelhas. Nunca o boneco oficial; nunca ao lado de embalagem ou produto da marca.
- Paleta: `#B42318` `#14532D` `#FDF6E3` `#D9A441` `#22304A` `#8A5A3B` (ver conflito C4).
- Formatos: vertical 1000×1500, horizontal 1200×628, quadrado 1080×1080 (opcional).
- Cada ficha do PDF traz um **brief de ilustração** próprio. O Designer usa esses briefs para os placeholders.
- Nunca texto dentro da imagem. Alt text começa com "Illustration of...".

### 2.7 Stack
Next.js `output: 'export'`, TypeScript, Cloudflare Pages, GitHub com deploy no push. URL do site e tag de afiliado em um só lugar; placeholder `https://dailyelfmagic.com`.

### 2.8 Fora do MVP
Checkout do pack pago, app, fotos, AdSense, Journey/Mediavine, integração com provedor de e-mail, preço, contas de usuário, comentários, artigos de apoio para SEO.

---

## 3. Decisões travadas (nenhum papel reabre)

1. Site, não app.
2. Só Amazon Associates. Sem anúncios, sem slots de anúncio.
3. Titular e operadora: Vanessa Tatiane Evangelista Assink. André só apoio técnico.
4. 60 ideias do PDF. Não inventar ideia, título, tempo nem material.
5. Ilustração própria, sem foto.
6. Next.js static export no Cloudflare Pages. Sem WordPress.
7. Texto visível do site em en-US.
8. "Elf on the Shelf" nunca como nome, domínio, logo ou marca.
9. Draft-first: nada publica sem aprovação do André.

**Correções conhecidas — situação após a leitura do PDF**
- Geladeira = 2 ideias (56 e 57). **Confirmado pelo PDF**, que já diz que a 58 cobre quarto/armário.
- Ficha 44: tesoura só do adulto. **Confirmado nos passos.** O item de afiliado da ficha é "tesoura infantil sem ponta": fica como busca na Amazon, sem nenhum texto sugerindo que a criança corte.

---

## 4. Conflitos e lacunas encontrados

### 4.1 PDF × decisões travadas (vale a decisão travada; registrado, sem ação)

| # | O PDF diz | Vale |
|---|---|---|
| C1 | Monetização em camadas com AdSense e Journey/Mediavine; páginas de confiança "exigidas por AdSense" | Só Amazon Associates |
| C2 | Fase 1 em WordPress; custos com hospedagem WordPress | Next.js estático no Cloudflare Pages |
| C3 | Artigos de apoio para SEO, 2 a 4 por mês | Sem investimento em conteúdo de SEO |

### 4.2 Conflitos que precisam de decisão

| # | Conflito | Proposta do PM | Decide |
|---|---|---|---|
| **C4** | **Paleta.** O prompt manda usar SÓ as 6 cores. O próprio PDF usa cores fora dela: fundo de banheiro "azul-claro", fundo de quarto "creme rosado", patinho amarelo (13, 54), "cores primárias bem distintas" (37). | As 6 cores são a base; tons claros obtidos por mistura das 6 (azul-noite sobre creme, vermelho sobre creme) são permitidos; amarelo vira dourado. O Designer formaliza. | Designer propõe, **André** aprova no Portão 2 |
| **C5** | **Grafia do aviso.** O PDF escreve "Ilustrated guide - scenes are original ilustrations" e "Ilustration of..." (um L). O prompt escreve "Illustrated" / "Illustration". | Erro de digitação do PDF. Usar a grafia correta do inglês, como no prompt. | PM (resolvido, salvo objeção) |
| **C6** | **Template da página.** O PDF pede 4 itens que o prompt não lista: (a) botão "Pin" sobre a ilustração; (b) frase de efeito de 1 linha sob o título; (c) "variação rápida"; (d) captura de e-mail no fim da página. | (a) incluir — é o caminho do Pinterest. (d) incluir, no estado "coming soon". (b) nenhuma ficha traz essa frase: não entra no build; o Marketing redige na Fase 4 para aprovação. (c) só 2 fichas trazem variação (6 e 26): mostrar o bloco só nelas. | **André** |
| **C7** | **Aviso de não-filiação no rodapé.** O PDF exige; o prompt não menciona. | Incluir em todas as páginas. Entrou no checklist de conformidade. | PM (resolvido) |
| **C8** | **Item de afiliado: tabela geral × ficha.** Em algumas ideias a tabela da seção 12 e a ficha citam itens diferentes. O caso mais claro é a 18: tabela = "kit mini tirolesa/clipes"; ficha = "candy canes". | A ficha vence a tabela, por ser a versão detalhada. | PM (resolvido, salvo objeção) |
| **C9** | **"Fridge hub".** O prompt lista 8 hubs sem geladeira, mas o critério de aceitação 2 fala em "fridge hub = 2 ideas". | **Resolvido pelo PDF:** geladeira é filtro de cômodo, não página. Ficam 8 hubs. O critério 2 é testado no filtro cômodo = geladeira (2 resultados). | PDF |

### 4.3 Lacunas — o PDF não traz o dado

| # | Lacuna | Proposta do PM | Decide |
|---|---|---|---|
| **D1** | **O PDF está em português.** Só títulos e textos de cartão estão em inglês. Materiais, passos, avisos de segurança e briefs precisam ser traduzidos. | Tradução fiel, sem acrescentar nem cortar, feita uma única vez no arquivo de dados, logo no início da Fase 2, para Designer e Desenvolvedor usarem a mesma base. Textos de cartão em inglês entram exatamente como no PDF. O PM confere contra o texto-fonte. | **André** (autorizar a tarefa no início da Fase 2) |
| **D2** | **Etiquetas de Tipo e Material não estão nas fichas.** O PDF define os valores e algumas contagens, mas não diz ficha por ficha. Sem elas não existem `/funny/`, o filtro de tipo, o filtro de material nem o botão "Only stuff I have". | O que o PDF fixa é usado como está: chegada 31–35; despedida 30, 59, 60; projeto 43–47 e 55; interativas 25–29, 48–52, 34, 37, 39, 59 (= 14). O resto é classificação derivada: lista completa entregue junto com o arquivo de dados, para aprovação antes da Fase 3. Proposta para as 16 de `/funny/` na seção 4.4. | **André** |
| **D3** | **"Most-saved" (prompt) / "ideias em alta" (PDF) na home.** Site estático não mede salvamentos nem tendência. Ranking inventado seria afirmação falsa. | Seleção editorial com rótulo honesto ("Parent favorites"), ou os salvos do próprio visitante. | **André** |
| **D4** | **Tonight Mode: tamanho do sorteio.** Prompt e PDF dizem que 1 toque sorteia 3 ideias que batem os TRÊS critérios. Só 24 ideias são de até 5 min E bagunça zero; com "só o que tem em casa" o grupo fica menor. O PDF afirma que "roda muitas noites sem repetir"; com os três critérios juntos são, no máximo, 8 noites. | Cada botão liga ou desliga um critério; o sorteio percorre o grupo inteiro antes de repetir; a tela mostra quantas ideias batem. O Designer fecha a UX com esses números. | Designer, **André** aprova no Portão 2 |
| **D5** | **Elf note ausente.** O template tem "elf note" fixo, mas 7 fichas não trazem texto pronto: 6 (a ficha diz "nenhum cartão"), 7, 16, 17, 20, 23 e 30. Outras trazem o texto num objeto da cena, não num cartão: 14 (espelho), 21 (plaquinha), 24 (checklist), 25 (envelope e missão), 60 (cupom). | Mostrar o bloco só quando o PDF tem texto, usando o texto do objeto quando for o caso. Notas novas para as 7 fichas: o Marketing redige na Fase 4, para aprovação. | **André** |
| **D6** | **Conteúdo dos imprimíveis.** Várias ideias dependem de um imprimível "do site" (23, 25, 28, 29, 30, 31, 34, 49, 50, 52, 60). O PDF traz só um exemplo de cada: 1 pergunta de "would you rather" (a série prevista é de 24), 1 missão em inglês, o início da história de Mad Libs, nenhuma carta de despedida. | No build, os imprimíveis usam só o texto que o PDF traz, com espaços em branco. Textos novos (24 perguntas, carta de despedida, missões, pistas): o Marketing redige na Fase 4, para aprovação. | **André** |
| **D7** | **Printables "grátis com e-mail" sem provedor.** Não dá para condicionar o download a um cadastro que não funciona. | Download livre no MVP, com o formulário em "coming soon" ao lado. Passa a exigir e-mail quando houver provedor. | **André** |
| **D8** | **E-mail de contato** para `/contact/` e `/privacy/` não foi informado. | Placeholder na config. Informar antes do Portão 5. | **André** |
| **D9** | **Ideias sem item da Amazon:** 12, 14, 25 e 29 (a ficha diz "nenhum"); a 23 aponta para produto digital próprio. | Sem botão de kit nessas páginas. O aviso de afiliado só aparece onde houver link. | PM (resolvido) |
| **D10** | **Botão do kit sem Idea List.** As 60 Idea Lists ainda não existem. | Sem URL de Idea List na config, o botão não aparece e ficam os links de busca por material. Sem tag, os links saem sem tag e o build avisa. | Eng. de Soluções |
| **D11** | **Links "2 hubs".** O PDF pede, no fim de cada ideia, "3 ideias de 5 minutos" + "mais ideias na cozinha". Cômodo não é hub. | Os 2 links obrigatórios apontam para 2 dos 8 hubs em que a ideia está. Um link extra de cômodo leva a `/ideas/` já filtrado. | Eng. de Soluções + Dev |
| **D12** | **Pins com placeholder.** As ilustrações finais chegam em lotes de 10/semana. | A Fase 4 entrega copy, template e deep link dos 60. A imagem final de cada pin só é exportada quando a ilustração real existir. | Marketing + Designer |
| **D13** | **Ficha 6** pede uma segunda ilustração em close "para o carrossel". O template tem 1 ilustração. | Fora do MVP. | PM (resolvido) |
| **D14** | **Ficha 9:** o elfo segura uma tesoura "fechada, decorativa" que não está na lista de materiais. | Manter o texto do PDF. O Designer não desenha tesoura em uso; a regra da ficha 44 vale como princípio. | Designer |
| **D15** | **Prazo.** Hoje é 10/11/2026. O PDF põe a chegada (31–35) como pico do fim de novembro. | Sem mudança de escopo. Risco registrado: cada portão parado custa dias do teste de dezembro. | Informativo |

### 4.4 Proposta para as 16 ideias de `/funny/` (para aprovação — D2)

O PDF fixa a contagem (16) e o critério ("travessura com piada visual"), e só nomeia a ficha 12. Proposta do PM:

5 Tangled in Christmas Lights · 8 Trapped in a Jar · 11 Flour Snow Angel · 12 Toilet Paper Tree Makeover · 13 Marshmallow Bubble Bath · 14 Toothpaste Mirror Message · 15 Silly Banana Bunch · 16 Sink Fishing Trip · 18 Elf Zipline Adventure · 19 Sweet Spaghetti Breakfast · 22 Cookie Baking Disaster · 53 Flour Snowball Fight · 54 Bubble Bath Foam Mountain · 55 Wrapping Paper Mayhem · 56 Elf in the Fridge Surprise · 58 Closet Fashion Show Elf

**Regra proposta para a etiqueta Material** (lista ficha por ficha vem com o arquivo de dados):
- *Only stuff you have:* todos os materiais são itens comuns de casa; nada a comprar nem a imprimir.
- *Food:* o material principal é comida.
- *Stationery:* papel, cartões, canetas, imprimíveis.
- *Need to buy:* depende de um item que a maioria das casas não tem.

---

## 5. Avisos de segurança das fichas (a tradução preserva todos)

| Ficha | Aviso |
|---|---|
| 5 | Luzes LED só a pilha; nunca na tomada com criança por perto |
| 9 | Grampeador/cola: só o adulto |
| 14 | Avisar a limpeza: água morna e papel no dia seguinte |
| 18 | Fio firme e fora da passagem das pessoas |
| 20 | Cola quente: só o adulto |
| 26 | Nada escondido no alto nem dentro de móveis |
| 36 | Nada pesado na estrutura da cabaninha |
| 37 | Pompons grandes, com supervisão; sem peças pequenas para menores de 3 anos |
| 38 | Sempre com supervisão |
| 40 | Água só com adulto junto, o tempo todo |
| 42 | Frutas redondas sempre cortadas ao meio |
| 44 | Tesoura só do adulto |
| 53 | Bagunça alta, só dentro da bandeja; limpeza de 5 min declarada |
| 54 | Toalha no chão antes de tudo; escoar e enxaguar na mesma manhã |
| 56 | Higiene: elfo em pratinho limpo e seco, nunca no alimento; retirar na mesma manhã |
| 57 | Ímã não é para toddler |

---

## 6. Plano de fases e portões

| Fase | Papel | Entrega | Portão (André aprova) |
|---|---|---|---|
| 1 Planejar | PM | Este arquivo + fontes em `docs/source/` | **Portão 1:** escopo + plano |
| 2 Arquitetar + Desenhar | Eng. de Soluções ‖ Designer | Arquivo de dados em inglês (D1) com etiquetas derivadas (D2); `02a` + esqueleto do repo; `02b` + tokens, bíblia, placeholders, templates de pin | **Portão 2:** arquitetura + direção visual + etiquetas derivadas |
| 3 Construir | Desenvolvedor (Designer revisa) | Site completo; `03-dev-build.md` | **Portão 3:** preview de deploy |
| 4 Distribuir | Marketing | 60 pins (copy + template), roteiros de vídeo, mapa de Idea Lists, copy de e-mail, textos novos de C6/D5/D6; `04` | **Portão 4:** pins + copy. Nada é postado. |
| 5 Testar + Assinar | QA, depois Dev e PM | `05-qa-report.md`; correções | **Portão 5:** lançamento |

**Regras:** cada papel lê os handoffs anteriores; trabalha só na sua função; conflito é sinalizado ao PM; o PM para e espera em cada portão.

### Checklist de portão

- [ ] Handoff da fase existe em `docs/handoffs/`.
- [ ] Nenhuma decisão travada alterada.
- [ ] Nenhuma ideia, título, tempo ou material fora do PDF.
- [ ] Checklist de conformidade (seção 7) sem item reprovado.
- [ ] `npm run build` verde (a partir da Fase 2).
- [ ] Pontos em aberto listados com proposta.
- [ ] Aprovação do André registrada na seção 8.

### Pré-requisitos que só o André pode dar

| Quando | O quê |
|---|---|
| Fase 2 | Autorizar a criação do repositório no GitHub (nome; público ou privado) e o primeiro push |
| Fase 2–3 | Conectar o repositório ao Cloudflare Pages na conta dele |
| Antes do Portão 5 | Domínio registrado; tag do Amazon Associates da Vanessa; e-mail de contato; provedor de e-mail (ou manter "coming soon") |

---

## 7. Checklist de conformidade (dono: PM)

### Marca
- [ ] "Elf on the Shelf" / "elfontheshelf" ausente de nome, domínio, logo, títulos, meta titles, nomes de arquivo e pins.
- [ ] Menções no texto só descrevem a tradição, sem sugerir filiação.
- [ ] Aviso de não-filiação à marca no rodapé de todas as páginas (exigência do PDF).
- [ ] Personagem sem semelhança com o boneco oficial; nunca ao lado de embalagem ou produto da marca.

### Afiliado / FTC
- [ ] Frase exata em toda página com link de afiliado: "As an Amazon Associate I earn from qualifying purchases."
- [ ] Aviso visível perto dos links, não só no rodapé.
- [ ] Nenhum preço. Nenhuma foto de produto da Amazon. Nenhum link encurtado ou mascarado.
- [ ] Tag só na config, com placeholder marcado; nenhum valor inventado.
- [ ] Titular nomeada: Vanessa Tatiane Evangelista Assink.

### Privacidade
- [ ] `/privacy/` e `/about/` nomeiam a Vanessa como operadora (o PDF pede as duas).
- [ ] Nenhum rastreamento além do slot opcional de analytics, desligado por padrão.
- [ ] Nenhum script de anúncio, AdSense, Mediavine, Journey ou Grow.
- [ ] Formulário de e-mail sem provedor mostra "coming soon"; nunca sucesso falso; nada é enviado.
- [ ] A política descreve só o que o site faz, inclusive dados guardados no navegador.

### Conteúdo e imagem
- [ ] Texto visível em en-US; nenhum português.
- [ ] Tradução fiel ao PDF; textos de cartão em inglês idênticos ao PDF.
- [ ] Os 16 avisos de segurança da seção 5 presentes nas páginas.
- [ ] Nenhuma foto; nenhuma ilustração legendada como foto; nenhum rosto de criança real (ficha 30: silhueta).
- [ ] Aviso de ilustração em `/about/` e sob a ilustração principal: "Illustrated guide — scenes are original illustrations, not photos."
- [ ] Alt text começa com "Illustration of...".
- [ ] Nenhum texto dentro de imagem.
- [ ] Cenas fisicamente possíveis; props batem com os materiais da ficha.

O PM não dá parecer jurídico. Caso de borda vai para o advogado do André.

---

## 8. Registro de aprovações

| Portão | Data | Decisão do André | Observações |
|---|---|---|---|
| 1 — Escopo + plano | 10/11/2026 | **APROVADO, com condições** | Condições registradas em `02-pm-data-and-tags.md`, seção 1. Correção posterior: são 8 fichas sem elf note (a 28 também), não 7. |
| 2 — Arquitetura + visual | 11/11/2026 | **APROVADO** ("Approve Gate 2") | Aprovadas as 6 recomendações do PM: paleta com 22 tons derivados; Tonight Mode com botões liga/desliga, abrindo com os 3 critérios ligados e 3 ideias; ordem mobile da página de ideia (título e fatos antes da ilustração); etiquetas de Tipo (16 funny) e Material; ficha 49 renomeada para "Elf Story Fill-in-the-Blanks Card" (slug `elf-story-fill-in-the-blanks-card`); a frase "Copy it onto a small card…" vai para revisão do Marketing na Fase 4. Conta GitHub e e-mail dos commits ainda sem resposta: push segurado. **12/11/2026:** André confirmou ("Yes, push it"): repositório público `vtatianee/elf-site` criado; e-mail de todos os commits reescrito para o noreply do GitHub (`284499397+vtatianee@users.noreply.github.com`) antes do primeiro push; push do `main` feito. |
| 3 — Preview de deploy | — | — | |
| 4 — Pins + copy | — | — | |
| 5 — Lançamento | — | — | |

---

## Anexo — Etiquetas conferidas das 60 fichas

Tempo, bagunça, idade e cômodo vêm direto das fichas. Fonte para máquina: `docs/source/ideas-tags-verified.json`.

| # | Título | Tempo | Bagunça | Idade | Cômodo |
|---|---|---|---|---|---|
| 1 | Movie Night Popcorn Patrol | 5 | Zero | Todas | Sala/Árvore |
| 2 | Storytime Reading Corner | 2 | Zero | Toddler | Quarto |
| 3 | Shoe-Shoe Train | 5 | Zero | Todas | Entrada |
| 4 | Toothbrush Delivery Elf | 2 | Zero | Todas | Banheiro |
| 5 | Tangled in Christmas Lights | 5 | Zero | Todas | Sala/Árvore |
| 6 | Hiding in the Christmas Tree | 2 | Zero | Todas | Sala/Árvore |
| 7 | Letter to Santa Station | 10 | Baixa | Kids | Mesa |
| 8 | Trapped in a Jar | 2 | Zero | Todas | Cozinha |
| 9 | Christmas Countdown Chain | 10 | Baixa | Kids | Sala/Árvore |
| 10 | Sleeping in a Stocking | 2 | Zero | Toddler | Sala/Árvore |
| 11 | Flour Snow Angel | 5 | Média | Todas | Cozinha |
| 12 | Toilet Paper Tree Makeover | 10 | Média | Kids | Sala/Árvore |
| 13 | Marshmallow Bubble Bath | 5 | Baixa | Todas | Banheiro |
| 14 | Toothpaste Mirror Message | 5 | Baixa | Kids | Banheiro |
| 15 | Silly Banana Bunch | 5 | Zero | Toddler | Cozinha |
| 16 | Sink Fishing Trip | 5 | Baixa | Todas | Cozinha |
| 17 | Sticky Note Surprise Wall | 10 | Zero | Kids | Quarto |
| 18 | Elf Zipline Adventure | 10 | Zero | Kids | Sala/Árvore |
| 19 | Sweet Spaghetti Breakfast | 10 | Média | Kids | Cozinha |
| 20 | Candy Cane Sled | 10 | Baixa | Todas | Sala/Árvore |
| 21 | Hot Cocoa Stand Helper | 10 | Baixa | Todas | Cozinha |
| 22 | Cookie Baking Disaster | 10 | Média | Todas | Cozinha |
| 23 | Milk and Cookies Taste Test | 5 | Baixa | Kids | Cozinha |
| 24 | Gingerbread House Inspector | 5 | Zero | Todas | Mesa |
| 25 | Kindness Mission Card | 5 | Zero | Todas | Casa toda |
| 26 | Candy Cane Scavenger Hunt | 10 | Zero | Kids | Casa toda |
| 27 | Build-a-Snowman Challenge | 5 | Baixa | Todas | Mesa |
| 28 | Nice List Certificate | 5 | Zero | Todas | Quarto |
| 29 | Would You Rather Card | 2 | Zero | Kids | Mesa |
| 30 | Farewell Letter and Photo | 10 | Zero | Todas | Sala/Árvore |
| 31 | I'm Back! Arrival Banner | 10 | Zero | Todas | Sala/Árvore |
| 32 | North Pole Arrival Breakfast | 10 | Baixa | Todas | Cozinha |
| 33 | Special Delivery Arrival Box | 5 | Zero | Todas | Entrada |
| 34 | Arrival Hide-and-Seek Clue Trail | 10 | Zero | Kids | Casa toda |
| 35 | Snowy Footprints Arrival | 5 | Baixa | Todas | Entrada |
| 36 | Toddler Peekaboo Blanket Fort | 5 | Zero | Toddler | Sala/Árvore |
| 37 | Pom-Pom Color Sorting Game | 5 | Zero | Toddler | Mesa |
| 38 | Breakfast Cereal Garland | 5 | Zero | Toddler | Cozinha |
| 39 | My First Sticker Scene | 5 | Zero | Toddler | Quarto |
| 40 | Toy Car Wash Station | 10 | Baixa | Toddler | Banheiro |
| 41 | Plush Friends Campout | 5 | Zero | Toddler | Quarto |
| 42 | Fruit Face Breakfast Plate | 5 | Zero | Toddler | Cozinha |
| 43 | Elf Workshop Build Station | 15+ (20) | Baixa | Kids | Mesa |
| 44 | Paper Snowflake Window Invasion | 15+ (20) | Baixa | Kids | Sala/Árvore |
| 45 | Mini Elf Door and Welcome Mat | 15+ (25) | Baixa | Kids | Entrada |
| 46 | Cardboard Sleigh Build | 15+ (20) | Baixa | Todas | Sala/Árvore |
| 47 | Gingerbread Village Street | 15+ (20) | Média | Kids | Mesa |
| 48 | Elf Photo Booth Props | 10 | Zero | Todas | Sala/Árvore |
| 49 | Elf Story Mad Libs Card | 5 | Zero | Kids | Mesa |
| 50 | Elf Workout Challenge Cards | 5 | Zero | Todas | Sala/Árvore |
| 51 | Guess How Many Jar | 10 | Zero | Todas | Cozinha |
| 52 | Draw My Outfit Contest | 10 | Zero | Kids | Mesa |
| 53 | Flour Snowball Fight | 10 | Alta | Kids | Cozinha |
| 54 | Bubble Bath Foam Mountain | 10 | Alta | Todas | Banheiro |
| 55 | Wrapping Paper Mayhem | 15+ | Alta | Kids | Sala/Árvore |
| 56 | Elf in the Fridge Surprise | 5 | Zero | Todas | Geladeira |
| 57 | Fridge Magnet Message | 5 | Zero | Kids | Geladeira |
| 58 | Closet Fashion Show Elf | 10 | Zero | Todas | Quarto |
| 59 | Memory Jar - Last Week Goodbye | 10 | Zero | Todas | Sala/Árvore |
| 60 | Goodbye Breakfast and Hug Coupon | 10 | Baixa | Todas | Cozinha |
