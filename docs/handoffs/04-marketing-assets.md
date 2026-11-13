# 04 — Ativos de marketing (Especialista em Marketing) · Fase 4

- **Fase:** 4 — Distribuir
- **Data:** 12/11/2026
- **Autor:** Especialista em Marketing
- **Lido antes de começar:** `PROMPT-CLAUDE-CODE-SITE-ELF.md` (papel 5, MONETIZATION, NON-NEGOTIABLE RULES, SEO/Pinterest), `01-pm-scope.md` (C6, D5, D6, D12, §8), `02b-design-system.md` (§7 template de pin, §8 Tonight Mode, ponto 5d), `03-dev-build.md` (§7), `03b-deploy-preview.md`, `src/data/ideas.json`, `docs/source/ideas-pdf-text.txt` (§4 e §5 do PDF: frase de efeito, Pinterest, vídeo curto, e-mail), `design/pin-template/`, `design/character-bible.md`, `design/illustration-alt.json` e os arquivos de texto do Desenvolvedor listados no §7 do 03.
- **Não toquei em:** nada dentro de `src/`, `public/`, `design/` ou `scripts/`. Nenhum commit, nenhum push. Nada foi postado, agendado ou publicado em lugar nenhum.
- **Status:** **APROVADO NO PORTÃO 4 (12/11/2026, "Aprovo tudo")**, com as recomendações da §5. Os textos marcados DRAFT nos arquivos deste pacote valem como aprovados; o Desenvolvedor os liga no site. Pendente: endereço postal da Vanessa (ponto 10).

---

## 1. Resumo em 1 minuto

- **60 pins** com título do pin, descrição, alt text, board, variante do template e deep link para a página da ideia. O título na imagem é o título da ficha, idêntico.
- **60 roteiros de vídeo curto** (TikTok/Reels/Shorts) com exatamente 3 cortes de texto, 1 linha de narração/legenda e 3 notas de cena. O vídeo nasce da ilustração (zoom lento), como o PDF manda — ninguém filma montagem. Onde a ficha tem aviso de segurança, ele fica na tela.
- **Mapa das Idea Lists da Amazon:** 55 listas (a 44 já com o termo novo "blunt-tip scissors", aprovado hoje) (uma por ideia que tem item da Amazon) + 5 ideias sem lista, com o motivo + **6 listas "básicas"** compartilhadas. Só termos que já estão no `amazonItems` de cada ficha. Quem cria as listas é a Vanessa, na conta dela.
- **Copy de e-mail** "1 idea a day in December": formulário, estado "coming soon", estados futuros, e-mail de confirmação, de boas-vindas e o molde do e-mail diário. Nenhum provedor citado.
- **Textos novos do site** (C6b, D5, D6, 5d): 60 frases de efeito, 8 elf notes, 23 perguntas "would you rather", carta de despedida, história completa da 49, 11 missões de gentileza, pistas 2–4 da 34, frase de reserva do Tonight Mode.
- **Revisão do texto do Desenvolvedor:** 34 linhas, com veredito sobre "Copy it onto a small card…" (**trocar**) e 2 erros reais encontrados (gramática do aviso de imprimível; "most" falso no About).
- **Conferidor automático** `marketing/check.mjs`: **PASSOU**, 0 falhas. Página de revisão `marketing/review.html` abre tudo de uma vez.

---

## 2. O que foi produzido

| # | Entrega | Arquivo | Conteúdo |
|---|---|---|---|
| 1 | Pins | `marketing/pins.json` | 60 entradas por slug, na ordem das fichas: `id`, `slug`, `link`, `textLayerTitle`, `kicker`, `templateVariant`, `previewPath`, `pinTitle`, `description`, `hashtags` (separadas), `altText`, `board`, `alsoSaveTo`, `status`. No `_meta`: plano de boards e regras. |
| 2 | Vídeos curtos | `marketing/videos.json` | 60 roteiros: 3 `cuts`, `voiceover`, 3 `shots`, `safetyOnScreen` (texto exato da ficha ou `null`). |
| 3 | Idea Lists | `marketing/idea-lists.json` | 60 entradas (55 com lista, 5 `null` com motivo), nome, descrição, itens, `heldBack`, `url: ""`; 6 listas básicas. |
| 4 | E-mail | `marketing/email.md` | Formulário, "coming soon", sucesso/erro para depois, confirmação, boas-vindas, molde diário com exemplo (ideia 8), rodapé. |
| 5 | Textos novos do site | `marketing/site-copy.json` | `elfNotes` (D5), `printables` (D6), `hooks` (C6b), `tonightFallback` (5d). Tudo `"status": "DRAFT"`. |
| 6 | Revisão de texto | `marketing/copy-review.md` | Tabela arquivo → texto atual → proposta → motivo (34 linhas) + veredito do "Copy it onto…". |
| 7 | Página de revisão | `marketing/review.html` | Um cartão por ideia: prévia do pin (iframe do template, 1000×1500 reduzido), pin, frase de efeito, 3 cortes, Idea List, elf note; seções de boards, D5, D6, Tonight Mode, listas básicas, e-mail e revisão. Filtro por board e busca. |
| 8 | Conferidor | `marketing/check.mjs` | Só lê; não muda nada. `node marketing/check.mjs` na raiz do repositório. |

### 2.1 Plano de boards (Pinterest)

Cada board espelha um hub do site (palavra-chave igual ao H1 do hub). Cada pin tem **um board principal** e até 2 boards para salvar depois (`alsoSaveTo`).

| Board | Pins (principal) | Regra | Variante |
|---|---|---|---|
| Elf Arrival Ideas | 5 | Chegada (31–35) | C |
| Elf Goodbye Ideas | 3 | Despedida (30, 59, 60) | C |
| Funny Elf Ideas | 16 | Tipo engraçada | B |
| Elf Ideas for Toddlers | 9 | Feitas para toddler, fora das acima | A |
| 5-Minute Elf Ideas | 13 | Demais de 2 e 5 min | A |
| No-Mess Elf Ideas | 5 | Demais de bagunça zero (todas de 10 min, puxadas por cartão) | C |
| Elf Ideas for Kids | 9 | O resto: 10 min com alguma bagunça + projetos 15+ | B |
| Easy Elf Ideas | 0 | Só board secundário (repins) | — |

Os 4 boards que o PDF cita ("5-Minute", "No-Mess", "Funny", "Arrival") estão todos lá. **Variante por board**, como pede a regra do 02b §7 ("uma variante por fileira do board"): C para chegada, despedida e as de bilhete; B para as que precisam de mais força; A é o padrão.

### 2.2 Como os textos foram escritos

- **Título do pin** (≤100): palavra-chave + fato da ficha ("Trapped in a Jar – Funny 2-Minute Elf Idea for the Kitchen"). Nada que a ficha não diga.
- **Descrição** (≤500): 2–3 frases com materiais, tempo, bagunça, idade e, quando houver, o aviso de segurança; termina com chamada para o site. As hashtags (no máximo 3, nunca a marca) ficam num campo separado.
- **Kicker:** tempo · bagunça, tirado dos dados (máx. 20 de 22 caracteres).
- **Alt text:** reaproveitei o `design/illustration-alt.json` do Designer (ponto 12 do 02b): os 60 começam com "Illustration of" e descrevem o desenho. Descrevem os **placeholders** — revisar cada um quando a arte final entrar.
- **Frase de efeito (C6b):** o PDF (§4) pede "1 linha dizendo a reação da criança". Escrevi assim, sem prometer o que a cena não entrega (máx. 84 de 90 caracteres).
- **Vídeo:** o PDF (§5) diz que o curto nasce da ilustração — zoom lento, narração da piada em 15–30 s, passo a passo em 3 cortes de texto. Os cortes só usam materiais e passos da ficha; o texto entra como camada, nunca dentro da imagem.

---

## 3. Como verifiquei

**Conferidor `node marketing/check.mjs` — PASSOU (0 falhas).** Saída:

```
pins 60 · videos 60 · idea lists 55 (+5 null) · staples 6
hooks 60 · new elf notes 8 (6, 7, 16, 17, 20, 23, 28, 30) · WYR 24 · missions 12 · clues 4
max lengths — kicker 20/22 · pinTitle 71/100 · description 389/500 · hook 84/90
boards: 5-Minute 13 · Toddlers 9 · Funny 16 · Kids 9 · No-Mess 5 · Goodbye 3 · Arrival 5
PASS — all marketing checks passed.
```

O que ele confere:
- 60 entradas em pins, vídeos, Idea Lists e frases de efeito, **na ordem das fichas**; todo slug existe no `ideas.json`.
- `textLayerTitle` = título da ficha; link = `https://elf-site.pages.dev/ideas/<slug>/`; kicker = tempo · bagunça dos dados e ≤22; título do pin ≤100; descrição ≤500 (também somada às hashtags), ≥2 frases, termina com chamada; ≤3 hashtags; alt começa com "Illustration of"; boards válidos (7 + 1 secundário).
- Vídeos: exatamente 3 cortes e 3 cenas; `safetyOnScreen` = texto **exato** de segurança da ficha.
- Idea Lists: todo item vem do `amazonItems` daquela ideia; todo `amazonItem` está na lista ou retido com motivo; ideias sem item têm `null` + motivo; `url` vazia; listas básicas só com itens das ideias listadas; nenhum valor de tag.
- Textos novos: elf notes exatamente para as fichas com `elfNote` nulo; 24 perguntas (a 1ª idêntica à ficha, todas no formato "Would you rather … or …?"); 12 missões (a 1ª idêntica); história com a abertura da fonte e as 5 lacunas na ordem; 4 pistas (a 1ª idêntica, 2–4 com lacuna); carta explica que só o Papai Noel toca o elfo; tudo `DRAFT`.
- Em todo texto público: sem "Elf on the Shelf"/"elfontheshelf", sem "$", "best ", "#1", "as seen on", "price"; "photo" só dentro dos títulos das fichas 30 e 48, de "photo booth" e do aviso obrigatório "not photos"; sem palavras ou acentos de português.
- E-mail: sem nome de provedor, sem link da Amazon. `review.html` carrega os 7 arquivos; as 60 ilustrações verticais existem.

**Teste do próprio conferidor:** numa cópia temporária, injetei a marca, "$", "best", "#1", "photo", português, título errado, kicker longo e um item inventado — ele pegou os 12 problemas.

**No navegador:** abri `review.html` pelo servidor local (`python3 -m http.server` na raiz): 60 cartões, 60 prévias de pin carregando o template com a variante certa, e-mail e revisão renderizados, **nenhum erro de console**.

**Não verificado:** exportação real dos pins em 1000×1500 com as fontes Fredoka/Nunito instaladas (D12 — só com arte final); renderização em Pinterest/TikTok; o texto lido em voz alta com tempo cronometrado.

---

## 4. Desvios e decisões tomadas por mim

| # | O quê | Por quê |
|---|---|---|
| 1 | **Hashtags em campo separado**, não dentro da descrição | A descrição tem que terminar na chamada para o site; o André decide se usa hashtag (o Pinterest dá pouco peso hoje). |
| 2 | **Board principal + `alsoSaveTo`** em vez de um board só | Os 4 boards do PDF ficariam desequilibrados com um board por pin; assim cada pin entra em até 3 boards sem spam. |
| 3 | **Ficha 44: termo da tesoura atualizado** — a Idea List usa "white paper" + "blunt-tip scissors", com "Safety: Scissors are for the adult only." na descrição | O André aprovou em 12/11/2026 a troca de "blunt-tip kids' scissors" por "blunt-tip scissors" no `ideas.json` (aviso do PM durante esta fase). Regerei a lista e rodei o conferidor de novo contra o arquivo atual: passou. |
| 4 | **Título do pin da ficha 30 sem a palavra "Photo"** ("Elf Goodbye Letter for December 24 – Farewell Letter and Keepsake Frame") | Evita qualquer leitura de "foto" no pin; usa a palavra-chave do PDF "elf goodbye letter". O título na imagem continua o da ficha. |
| 5 | **Ficha 27 (toothpicks):** a descrição diz "with you at the table" | A ficha é para todas as idades, tem palitos e marshmallows grandes e nenhum aviso de segurança. Não inventei aviso; só não sugeri a criança sozinha. Ver ponto aberto 13. |
| 6 | **Pista 1 da ficha 34:** texto da ficha intacto + linha nova "First stop: ____" | A ficha diz que cada pista aponta para o cômodo seguinte; a 1ª hoje não aponta para lugar nenhum. |
| 7 | **E-mail diário à tarde, não de manhã** | O elfo é montado à noite; ideia que chega de manhã chega um dia atrasada. Afeta a frase atual do site ("every morning"). |
| 8 | **Sem link da Amazon dentro de e-mail** | As regras do programa de afiliados restringem links em e-mail e material offline; o e-mail leva para a página da ideia, onde estão os links e o aviso. A Vanessa confirma na conta dela. |
| 9 | Alt text dos pins = `design/illustration-alt.json`, sem mudança | Está bom e é a mesma frase da página; descreve os placeholders. |

---

## 5. Pontos em aberto — para o Portão 4

| # | Ponto | Minha proposta | Decide |
|---|---|---|---|
| 1 | **60 pins** (título, descrição, board, variante, alt) | Aprovar como estão. | **André** |
| 2 | **Plano de boards** (7 principais + "Easy Elf Ideas" secundário, cada um = um hub) | Aprovar. Criar os boards na conta do Pinterest só depois do Portão 5 (perfil com o nome final do site). | **André** |
| 3 | **Hashtags** | Usar no máximo 2 por pin, ou nenhuma. | **André** |
| 4 | **D12 × teste de dezembro de 2026.** Pin final só sai com ilustração final, e as ilustrações chegam 10 por semana. Sem arte final, não há pin publicável em dezembro. | Ordem dos lotes de ilustração pelo calendário de marketing: **lote 1 = chegada (31–35) + 5 das "5-Minute"**, porque o pico da chegada é o fim de novembro; depois Funny e Toddlers. Nada é postado com placeholder. | **André** (com o Designer) |
| 5 | **Links dos pins** apontam para `elf-site.pages.dev` | O André decidiu manter o preview público, então os deep links valem por enquanto. No Portão 5 a base troca para o domínio final (só a base muda; `/ideas/<slug>/` fica). | **André** (Portão 5) — resolvido para agora |
| 6 | **60 roteiros de vídeo** | Aprovar. Produção = animar a ilustração final (zoom/pan + texto em camada), 15–20 s. | **André** |
| 7 | **Idea Lists** (55 + 6 básicas): nomes "<título> – Elf Idea Kit" e itens | Aprovar. A **Vanessa** cria as listas na conta Amazon Associates dela e cola a URL completa; o Desenvolvedor liga no `siteConfig.amazon.ideaListUrls`. | **André** aprova; **Vanessa** cria |
| 8 | **Ficha 44 — termo da tesoura** | **Resolvido em 12/11/2026** ("blunt-tip scissors", aprovado pelo André). Já aplicado na Idea List. | — |
| 9 | **E-mail:** horário de envio (proposta: ~15h do leitor) e a troca da frase do site "every morning" → "every day … in time for tonight" | Aprovar a tarde. | **André** |
| 10 | **E-mail: endereço postal no rodapé** (CAN-SPAM nos EUA e CASL no Canadá pedem identificação, descadastro e endereço postal; o CASL pede consentimento ativo) | Definir um endereço de correspondência da Vanessa antes de ligar qualquer provedor. Não é parecer jurídico. | **André / Vanessa** |
| 11 | **D5 — 8 elf notes novas** (6, 7, 16, 17, 20, 23, 28, 30) | Aprovar. **6:** a ficha diz "sem cartão" — proposta: noite 1 sem cartão (como a ficha), a nota só na noite 2 com a variação. **28:** a frase vai impressa no certificado. **30:** versão curta da carta. | **André** |
| 12 | **D6 — imprimíveis**: 23 perguntas (29), carta de despedida (30), história completa (49, sem lacuna extra), 11 missões (25; 3 delas vêm do passo 3 da ficha), pistas 2–4 (34) + linha "First stop" na pista 1 | Aprovar; o Desenvolvedor tira os avisos "being written" do `/printables/`. | **André** |
| 13 | **Segurança fora da ficha (informativo):** a 27 (palitos + marshmallows grandes, "todas as idades") não tem aviso; a 21 termina com a família fazendo chocolate quente, sem aviso | Considerar um aviso curto no `ideas.json` (ex.: "Toothpicks and hot drinks: a grown-up handles them"). É mudança de dado: PM + André. | **PM / André** |
| 14 | **C6b — 60 frases de efeito** | Aprovar e mostrar sob o H1 da página da ideia. Opcional: usar também no início da meta description (`copy-review.md` linha 5, opção B). | **André** |
| 15 | **Frase de reserva do Tonight Mode** (5d) | Aprovar "No exact match tonight. We let go of “…” — here are 3 that still …". Hoje ela nunca aparece (menor grupo = 12). | **André** |
| 16 | **"Copy it onto a small card…"** | **Trocar** por "Write it on a small {kind} and leave it with the elf." (não é verdade que o cartão fica sempre "ao lado da cena"). | **André** |
| 17 | **"Parent favorites"** (aprovado no Portão 1) | Trocar por "Editor’s picks" (nada mede o que os pais preferem) e, opcional, a 11 (bagunça média) pela 8 (2 min, zero). | **André** |
| 18 | **Revisão do texto do Desenvolvedor** (34 linhas) — inclui 2 correções de fato: aviso de imprimível com gramática quebrada (29, 34, 50, 52) e "most use things you already have" no About (são 25 de 60) | Aprovar em bloco; o Desenvolvedor aplica depois do Portão 4. `/privacy/` sem mudança. | **André** |
| 19 | **Carta curta "see-you-soon" da ficha 60** não foi pedida ao Marketing; a ficha diz que ela explica o abraço como exceção à regra de não tocar, e a carta da 30 diz que só o Papai Noel toca o elfo | Se quiser, redijo na próxima rodada, coerente com a 30. | **André** |
| 20 | **Nome do site** "Daily Elf Magic" aparece na marca do pin e no `{siteName}` do e-mail | Trocar num lugar só quando o nome final existir. | **André** |
| 21 | **Alt text** reaproveitado dos placeholders | Revisar cada frase no `design/illustration-alt.json` quando a arte final entrar (Designer). | Designer |

---

## 6. Mapa dos arquivos

- `marketing/pins.json` — 60 pins + plano de boards e regras (`_meta`)
- `marketing/videos.json` — 60 roteiros de vídeo curto
- `marketing/idea-lists.json` — 60 entradas de Idea List + 6 listas básicas
- `marketing/email.md` — copy de e-mail (formulário, estados, confirmação, boas-vindas, diário, rodapé)
- `marketing/site-copy.json` — D5, D6, C6b, frase de reserva do Tonight Mode (todos DRAFT)
- `marketing/copy-review.md` — revisão do texto do Desenvolvedor + veredito
- `marketing/review.html` — página de revisão. Abrir: na raiz do repositório, `python3 -m http.server 8000` e depois `http://localhost:8000/marketing/review.html` (ou a configuração `design-preview` do `.claude/launch.json`, porta 4319)
- `marketing/check.mjs` — conferidor (`node marketing/check.mjs`)
- `docs/handoffs/04-marketing-assets.md` — este arquivo

Nada foi commitado. Depois do Portão 4: o Desenvolvedor aplica o texto aprovado no site; o PM registra a decisão no §8 do `01-pm-scope.md`.
