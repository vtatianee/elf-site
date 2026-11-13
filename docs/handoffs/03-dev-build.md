# 03 — Construção do site (Desenvolvedor Web Sênior)

- **Fase:** 3 — Construir
- **Data:** 11/11/2026
- **Lido antes de começar:** `PROMPT-CLAUDE-CODE-SITE-ELF.md`, `01-pm-scope.md`, `02-pm-data-and-tags.md`, `02a-solutions-architecture.md`, `02b-design-system.md`, previews do Portão 2
- **Status:** site completo no repositório local, build verde. **Falta o preview de deploy no Cloudflare Pages**, que depende do push para o GitHub (conta e e-mail dos commits ainda sem resposta do André) e da conexão do Pages na conta dele.

---

## 1. Resumo em 1 minuto

- **76 páginas estáticas:** home, `/ideas/`, 60 páginas de ideia, 8 hubs, `/planner/`, `/printables/`, `/shop/`, `/about/`, `/contact/`, `/privacy/` (+ 404). O handoff 01 dizia "mínimo 75"; a soma certa da própria lista é 76.
- **Sitemap = páginas exportadas, 1 para 1** (o build falha se divergir).
- **Orçamento:** JS 138,4 kB (limite 180), CSS 7,0 kB (20), HTML mais pesado 19,4 kB (`/ideas/`, limite 40), fontes 67,2 kB (110). Tudo gzip.
- **Os 7 critérios de aceitação:** 1–5 e 7 conferidos localmente (seção 5). O 6 (preview no Cloudflare sem erro de console) só dá para provar depois do deploy.

---

## 2. O que foi construído

| Rota | O que tem |
|---|---|
| `/` | Busca (vai para `/ideas/?q=`), 6 filtros rápidos, **Tonight Mode**, ideia do dia, "Parent favorites" (seleção editorial, sem contagem), 8 hubs, e-mail "coming soon" |
| `/ideas/` | Grade das 60 com filtros nas **6 dimensões** (tempo, bagunça, idade, cômodo, material, tipo) + busca. O filtro fica no endereço (`/ideas/?room=kitchen&mess=zero`) e sobrevive ao voltar |
| `/ideas/<slug>/` × 60 | Template fixo (seção 3) |
| 8 hubs | `/easy/` 42 · `/5-minute/` 31 · `/no-mess/` 35 · `/toddlers/` 40 · `/kids/` 50 · `/funny/` 16 · `/arrival/` 5 · `/goodbye/` 3. Toddlers e kids: ideias específicas da idade primeiro |
| `/planner/` | Calendário de 1 a 24 de dezembro montado pelas regras do PDF + **uma** lista de compras combinada; cada dia pode ser trocado; botão de imprimir |
| `/printables/` | 8 folhas imprimíveis grátis + 2 marcadas "em preparação"; pack pago como placeholder sem checkout; e-mail "coming soon" ao lado |
| `/shop/` | Materiais que se repetem (≥ 2 ideias), cada um com as ideias que o usam e um link de busca na Amazon |
| `/about/` `/contact/` `/privacy/` | Páginas de confiança; Vanessa como operadora; aviso de ilustração no About |

**Em toda página:** cabeçalho com 4 links, rodapé com aviso da Amazon, aviso de ilustração, aviso de não-filiação, "Site operator: Vanessa Tatiane Evangelista Assink." e link para os 8 hubs (nenhum hub fica a mais de 1 toque).

---

## 3. Página de ideia — o template

Ordem (aprovada no Portão 2): título + barra de fatos → ilustração vertical com botão **Pin** e aviso de ilustração → "What you need" (checklist de materiais, aviso de imprimível quando houver, links da Amazon + aviso de afiliado logo abaixo) → passos → **Safety** (texto exato, sempre aberto) → elf note → variação rápida (só 6 e 26) → 3 ideias relacionadas → 2 hubs + link do cômodo → e-mail "coming soon". Schema **HowTo** em JSON-LD com materiais, passos, tempo e imagem.

Detalhes de implementação que o PM deve conhecer:

- **Ideias relacionadas:** pontuação fixa (mesmo cômodo +4, cada tipo em comum +2, idade compatível +1, mesma bagunça +1, mesmo tempo +1; empate → número de ficha mais próximo). A mesma ideia sempre tem as mesmas 3.
- **2 links de hub:** regra do Eng. de Soluções (`getHubLinks`). Nas 7 ideias de um hub só, o 2º link é convite ("Short on time? See 5-minute ideas") e não afirma que a ideia é do hub.
- **Link do cômodo:** "More bathroom ideas" → `/ideas/?room=bathroom` (D11).
- **Links da Amazon:** os termos de busca da ficha (`amazonItems`) aparecem em lista própria ("Search Amazon for …"), não debaixo de cada material — o PDF não liga um termo a um material específico. O botão "Get everything for this idea" **só aparece** quando houver Idea List na config (hoje: nenhum).
- **Elf note:** o rótulo é "Elf note" para cartão; para outros suportes vira "Elf note — on the sign / mirror message / checklist…". A dica "Copy it onto a small {card/sign/tag/coupon…} and leave it next to the scene." só aparece nos suportes de papel (não no espelho nem no checklist).
- **Alt text:** vem de `design/illustration-alt.json` (Designer). Quando a arte final entrar, o alt de cada cena deve ser revisto nesse arquivo.
- **Imagem de compartilhamento e do Pin:** as cópias JPEG geradas no build (`/social/<slug>/…`).

---

## 4. Funcionalidades

### 4.1 Tonight Mode (spec 02b §8, aprovada no Portão 2)
Três botões liga/desliga, sorteio imediato, abre com os três ligados e 3 ideias. Percorre o grupo inteiro antes de repetir; não repete as da noite anterior enquanto houver 3 novas; "noite" vira às 4h; nunca vazio — solta "Only stuff I have", depois "No mess", depois "5 minutes", e diz na tela qual soltou. Memória: uma chave no `localStorage` (`elf-tonight-v1`). O HTML estático mostra as 3 primeiras do grupo; o navegador sorteia ao abrir.

### 4.2 Filtros de `/ideas/`
Dentro de uma dimensão é "ou"; entre dimensões é "e". **Decisão minha:** no filtro de idade, uma ideia "All ages" conta também como Toddler e como Kids — a mesma regra dos hubs `/toddlers/` (40) e `/kids/` (50). Sem isso, "Toddler (2-4)" mostrava só 10 ideias e contradizia o hub. Cômodo = Fridge dá **2** (critério 2).

### 4.3 Planner
Regras do PDF: projetos de 15+ min no fim de semana; 2–5 min nos dias úteis; interativa a cada 3 dias; bagunça alta **uma vez**, numa sexta ou sábado no meio do mês; nenhuma cena repetida. Âncoras que tirei das próprias fichas: chegada no dia 1; a ficha 30 ("Night of December 24") no dia 24; goodbye 59 no dia 22 e 60 no dia 23. Testei 10 planos (2026 e 2027, 5 sementes): todos passaram em todas as regras. "Make a new plan" sorteia outro; trocar um dia por uma ideia já usada troca as duas de lugar (nunca repete). Lista de compras: cada material uma vez, com os dias que precisam dele; termos da Amazon do plano com o aviso de afiliado. O plano fica no `localStorage` (`elf-planner-v1`).

### 4.4 Imprimíveis
Só texto que existe no `ideas.json`. Prontos: rating sheet (23), kindness mission card (25), Nice List certificate (28), 1 cartão "would you rather" (29), clue cards (34 — a 1ª pista do PDF + 3 em branco), story card (49 — frase de abertura + 5 lacunas), workout cards (50), hug coupon (60). **Em preparação**, dito com honestidade na página: carta de despedida (30) e as outras 23 perguntas (29) → Marketing, Fase 4; folha de colorir com o contorno do elfo (52) → Designer, com a arte final. Imprimir usa o diálogo do navegador (que também salva em PDF) e imprime só a folha escolhida.

### 4.5 Shop
Lista fixa de 12 candidatos; aparece só o que é usado em ≥ 2 ideias, contado pelos materiais das próprias fichas (hoje 11 aparecem; luzes LED ficam de fora por estarem em 1 ideia). Cada termo de busca é um que o PDF já nomeia. Sem preço, sem foto.

### 4.6 E-mail
Componente único `SignupComingSoon`: campo e botão desabilitados, "Sign-ups aren’t open yet…", nada é enviado nem guardado. Fica desabilitado mesmo se alguém digitar um provedor na config — ligar um provedor é tarefa própria, fora do MVP.

---

## 5. Verificação

**Automática (build):** lint, typecheck e `npm run build` verdes; checagem de exportação passou (76 páginas = 76 no sitemap, canonical, nenhum `noindex`, nenhum script de anúncio, nenhum campo interno, orçamento).

**Script de aceitação** (rodado sobre `out/`, fora do repositório) — **0 falhas**:
- 60 páginas de ideia: 1 H1; JSON-LD HowTo com o mesmo número de passos e materiais da ficha; exatamente 3 relacionadas; exatamente 2 links de hub; aviso de ilustração; aviso de afiliado onde há link da Amazon e link da Amazon só onde a ficha tem item; todos os avisos de segurança; elf note só onde há texto; variação só em 6 e 26; nenhum `editorNotes`/`illustrationBrief`; alt "Illustration of…"; link do Pin.
- 8 hubs listam exatamente as ideias da regra (contagens acima).
- `/privacy/` e `/about/` nomeiam a Vanessa; aviso de não-filiação e operadora em todas as páginas; nenhum preço; nenhuma palavra em português.

**No navegador embutido** (servidor local de `out/`, celular 375 px e 800 px):
- `/ideas/?room=fridge` → 2 ideias; 6 dimensões combinadas atualizam a contagem (31 → 24 → …) e o endereço.
- Tonight Mode: 4 sorteios seguidos com os três critérios mostraram as 12 ideias sem repetir; contagens 12 / 15 / 35 / 25 / 60 batem com os dados; o link "See all" leva o filtro certo; a memória fica gravada.
- Planner: 24 dias, todos diferentes, dia 1 = chegada, dia 24 = ficha 30; troca de dia funciona; lista com 78 itens; aviso de afiliado presente.
- Home, página de ideia, printables, shop: renderizam sem imagem quebrada. Os 404 no console vieram de prefetch de páginas que ainda não existiam num build anterior; depois do build final, todas as requisições voltaram 200.

**Não verificado:**
- Preview no **Cloudflare Pages** (critério 6) — precisa do push e da conexão.
- Safari e iPhone reais; leitor de tela; navegação só por teclado do começo ao fim.
- Impressão em papel (só o comando de imprimir; não abri o diálogo até o fim).
- A virada de "noite" às 4h na prática (a lógica é a do protótipo aprovado; não simulei o relógio).
- **Revisão visual formal do Designer:** comparei com os previews do Portão 2 e segui as classes 1:1, mas o papel do Designer não rodou separadamente nesta fase.

---

## 6. Desvios e decisões técnicas

| # | O quê | Por quê |
|---|---|---|
| 1 | CSS dos componentes num arquivo global (`src/styles/components.css`), não em CSS Modules | Mantém os nomes de classe 1:1 com o inventário do Designer (02b §9), facilita a revisão visual; total 7 kB gzip |
| 2 | Mascotes servidos de `public/mascot/` | O gerador do Designer agora grava uma cópia lá também (ponto 11 do 02b) |
| 3 | Filtro de idade inclui "All ages" | Coerência com os hubs (4.2) |
| 4 | Ideia do dia | Gira pelas 60 em ordem, 1 por dia, pela data local do visitante; o HTML estático mostra a do dia do build |
| 5 | "Parent favorites" | Fichas 13, 6, 11, 26 (as do preview), num arquivo editável `src/data/editorial.ts`. Subtítulo: "Hand-picked by the editor." (o preview dizia também "No counters, no rankings.", tirei por ser frase interna) |
| 6 | Margem acima do Tonight Mode aumentada | O elfo espiando cobria o chip "Funny" em telas médias |

---

## 7. Pontos em aberto para o PM

| # | Ponto | Proposta | Decide |
|---|---|---|---|
| 1 | **Ficha 44 — termo da Amazon "blunt-tip kids' scissors".** O link mostra o termo como está na ficha; a palavra "kids'" pode ser lida como sugestão de tesoura para a criança, o que a correção conhecida proíbe. O aviso "Scissors are for the adult only." está na página. | Trocar o termo por "blunt-tip scissors" no `ideas.json` (mudança de dado: precisa do OK) | **André** — **aprovado em 12/11/2026**; termo trocado e a troca anotada nas `editorNotes` da ficha |
| 2 | **Texto novo que não vem do PDF** (todo em en-US, escrito por mim): títulos, intros e descrições dos 8 hubs (`src/lib/hubs.ts`); leads das páginas; About, Contact, Privacy; rótulos das folhas imprimíveis ("Name", "This year you showed", "Clue 2", "Cookie 1"); frases de "em preparação"; molde das meta descriptions das ideias. | Marketing revisa na Fase 4 | Marketing / PM |
| 3 | **Política de privacidade** descreve só o que o site faz hoje (sem cookies, 2 chaves de `localStorage`, analytics desligado — o parágrafo muda sozinho se o token for preenchido, Amazon, Pin). Não é parecer jurídico. | Vanessa/André leem antes do Portão 5 | **André** |
| 4 | **HowTo schema:** entregue como o prompt pede. Informativo: o Google deixou de mostrar o resultado enriquecido de HowTo; o schema não atrapalha e outros leitores ainda o usam. | Manter | — |
| 5 | **Preview de deploy (Portão 3)** depende de: (a) conta do GitHub (`vtatianee`?) e e-mail dos commits (trocar o pessoal pelo noreply antes do push?); (b) André conectar o repositório ao Cloudflare Pages (passo a passo no 02a §7). | Responder (a); depois eu faço o push e o André conecta | **André** — **resolvido em 12/11/2026:** preview em https://elf-site.pages.dev, conferido no `03b-deploy-preview.md` |
| 6 | **Folha de colorir (52)** precisa do contorno do elfo | Designer, junto com o 1º lote de arte final | Designer |
| 7 | **Planner:** as fichas 59 e 60 ficam nos dias 22 e 23; a 30 no 24 (a ficha 60 fala "manhã do dia 24 ou 25") | Manter | PM — **revisto em 13/11/2026 (QA-04):** a 59 vai para o dia 18, como diz a ficha; ver `05b-dev-qa-fixes.md` |

---

## 8. Mapa dos arquivos novos

- Páginas: `src/app/page.tsx`, `src/app/ideas/page.tsx`, `src/app/ideas/[slug]/page.tsx`, `src/app/[hub]/page.tsx`, `src/app/{planner,printables,shop,about,contact,privacy}/page.tsx`, `src/app/not-found.tsx`
- Componentes: `src/components/{SiteHeader,NavLinks,SiteFooter,Icon,IdeaCard,SignupComingSoon,TonightMode,IdeaOfTheDay,IdeasExplorer,Planner,PrintButton}.tsx`
- Lógica: `src/lib/{cards,hubs,related,schema,descriptions,daily,planner-rules}.ts`; `src/data/editorial.ts`
- Estilo: `src/styles/components.css` (+ `globals.css` reescrito com os tokens)
- `.claude/launch.json`: nova configuração `site` (serve `out/` na porta 4320)

Para ver localmente: `npm run build`, depois a configuração `site` (ou `python3 -m http.server 4320 --directory out`) e abrir `http://localhost:4320/`.
