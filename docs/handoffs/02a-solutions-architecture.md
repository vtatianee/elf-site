# 02a — Arquitetura e deploy (Engenheiro de Soluções) · Fase 2

- **Data:** 11/11/2026
- **Autor:** Engenheiro de Soluções
- **Lido antes:** `PROMPT-CLAUDE-CODE-SITE-ELF.md`, `01-pm-scope.md`, `02-pm-data-and-tags.md`, `src/data/ideas.json`
- **Status:** esqueleto pronto. `npm run build`, `npm run lint` e `npm run typecheck` passam. **O preview no Cloudflare Pages NÃO foi publicado por mim** — depende da conta do André (ver seção 7 e ponto em aberto 1).
- **O que este papel entregou:** o esqueleto, a config, os contratos e o deploy. Nenhuma página final — as páginas são do Desenvolvedor (Fase 3).

---

## 1. Resumo em 1 minuto

- O site é **100% estático**: o build gera HTML/CSS/JS na pasta `out/` e o Cloudflare Pages só serve esses arquivos. Não existe servidor, banco de dados, rota de API, middleware, login, WordPress nem script de anúncio.
- Tudo o que o André vai mudar está em **um arquivo**: `src/config/site.ts` (domínio, nome, operadora, e-mail, tag da Amazon, Idea Lists, provedor de e-mail, analytics).
- Trocar uma ilustração = **soltar arquivos em uma pasta** (`public/illustrations/<slug>/`). Zero código, zero edição de dados.
- O build **se confere sozinho**: se faltar página no sitemap, aparecer `noindex`, entrar script de anúncio, vazar campo interno ou estourar o orçamento de performance, o build falha — no computador, no GitHub e no Cloudflare. Nada quebrado vai ao ar.
- Hoje o esqueleto exporta **61 páginas**: as 60 páginas de ideia (stub, só dados crus) + uma home provisória. Mais `sitemap.xml`, `robots.txt` e `404.html`.

---

## 2. Decisões e por quê

| # | Decisão | Por quê |
|---|---|---|
| 1 | **Next.js 16.4.6** (App Router) + React 19.3 + TypeScript, `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true` | É a stack travada. `trailingSlash` faz cada página ser uma pasta com `index.html` (`/ideas/x/`), que é como o Cloudflare Pages serve sem redirecionamento. |
| 2 | Projeto montado à mão, sem `create-next-app` | A pasta não estava vazia; um gerador poderia sobrescrever arquivos de outros papéis. |
| 3 | **TypeScript 6.0.3 e ESLint 9.39**, não as versões 7 e 10 | A config oficial de lint do Next ainda depende do `typescript-eslint`, que só aceita TypeScript abaixo de 6.1 e não declara suporte ao ESLint 10 em todos os plugins. Escolhi o que funciona hoje; subir de versão depois é trocar dois números. |
| 4 | **Uma config só** (`src/config/site.ts`), comentada em inglês, com `TODO-OWNER` em tudo o que falta | Pedido do escopo: o André opera sem programar. |
| 5 | Domínio vem da variável `NEXT_PUBLIC_SITE_URL`; o placeholder `https://dailyelfmagic.com` só aparece na config | O domínio final não foi escolhido. Testei com outro endereço: sitemap, robots, canonical e Open Graph mudaram juntos e o placeholder sumiu de toda a saída. |
| 6 | **Verificações automáticas no build** (`scripts/prebuild.ts` antes, `scripts/check-export.ts` depois) | "Build verde a cada commit" só vale alguma coisa se o build provar as regras. Ver seção 9. |
| 7 | Dados das ideias só entram por `src/lib/ideas.ts`, que **remove `editorNotes` e `illustrationBrief`** antes de entregar | Esses campos são internos. Removendo na origem, não há como irem parar no HTML ou no JavaScript. O ESLint proíbe importar o JSON de qualquer outro lugar, e o build procura esses textos na saída. |
| 8 | Ilustração escolhida **pelo nome do arquivo na pasta**, em tempo de build | É o que permite a troca sem código. Ver seção 5. |
| 9 | Cópia JPEG das ilustrações gerada no build (`sharp`) | Open Graph, Twitter e Pinterest não aceitam SVG, e os placeholders são SVG. Ver seção 5.3. |
| 10 | CSS puro: `globals.css` (reset) + CSS Modules + custom properties | Pedido do escopo. Sem framework de UI, sem CSS-in-JS em tempo de execução. |
| 11 | Fontes pelo `next/font`: baixadas **no build** e servidas pelo próprio site | O navegador do visitante nunca fala com servidor de fontes de terceiros. O build falha se aparecer `fonts.googleapis.com` na saída. |
| 12 | `<img>` simples (componente `IllustrationImage`), não `next/image` | Sem servidor não há otimização de imagem; o `next/image` só somaria JavaScript. Largura e altura fixas evitam salto de layout. |
| 13 | Cabeçalhos de segurança e cache em `public/_headers` | Formato nativo do Cloudflare Pages. Testei a política de segurança (CSP) num servidor local com esses mesmos cabeçalhos: a página carrega, hidrata, usa as fontes e não gera erro de console. |
| 14 | `"type": "module"` no `package.json` | Os scripts de build são TypeScript lidos direto pelo Node 24. Os scripts do Designer são `.mjs`, então não são afetados. |

**Não fiz, de propósito:** nenhuma página final, nenhum componente visual, nenhuma cor, nenhum filtro, nada em cima de `typeTags`/`materialTags`, nenhuma reserva de espaço para anúncio, nenhum preço.

---

## 3. Mapa de pastas

```
.
├── src/
│   ├── config/site.ts            ← A ÚNICA config (André edita aqui)
│   ├── data/ideas.json           ← as 60 ideias (do PM; somente leitura)
│   ├── lib/
│   │   ├── ideas.ts              ← tipos + getters + regra dos 2 links de hub
│   │   ├── illustration-files.ts ← regras de arquivo das ilustrações (compartilhado com os scripts)
│   │   ├── illustrations.ts      ← resolver de ilustração + alt text + imagem social
│   │   ├── amazon.ts             ← todo link da Amazon nasce aqui
│   │   ├── routes.ts             ← todo endereço interno nasce aqui + lista do sitemap
│   │   └── seo.ts                ← metadata, canonical, Open Graph/Twitter, link de Pin
│   ├── components/
│   │   ├── Analytics.tsx         ← slot opcional do Cloudflare Web Analytics (desligado)
│   │   └── IllustrationImage.tsx ← o único jeito de pôr uma ilustração na página
│   ├── styles/
│   │   ├── globals.css           ← reset mínimo (meu)
│   │   └── tokens.css            ← tokens de design (do Designer; eu não criei nem importei)
│   └── app/
│       ├── layout.tsx            ← <html lang="en-US">, fontes, metadata base
│       ├── fonts.ts              ← as 2 fontes (trocar a fonte = só este arquivo)
│       ├── page.tsx              ← STUB: home provisória
│       ├── not-found.tsx         ← página 404
│       ├── sitemap.ts, robots.ts ← ligados à config
│       ├── stub.module.css       ← STUB: estilo das páginas provisórias
│       └── ideas/[slug]/page.tsx ← STUB: as 60 páginas de ideia, dados crus
├── public/
│   ├── _headers                  ← cache + segurança (Cloudflare Pages)
│   ├── illustrations/<slug>/     ← ilustrações (do Designer / do André)
│   └── social/                   ← GERADO no build; não editar, não vai para o Git
├── scripts/
│   ├── prebuild.ts               ← confere a config + gera os JPEG sociais
│   └── check-export.ts           ← confere a pasta out/ depois do build
├── .github/workflows/ci.yml      ← lint + typecheck + build em todo push e PR
├── next.config.ts, tsconfig.json, eslint.config.mjs
├── .nvmrc, .node-version         ← Node 24
├── .gitignore, .env.example
└── README.md                     ← em inglês, para quem opera o site
```

Tudo marcado **STUB** é provisório e será substituído pelo Desenvolvedor.

---

## 4. Contrato da config (`src/config/site.ts`)

| Campo | Valor hoje | Regra |
|---|---|---|
| `siteConfig.url` | `NEXT_PUBLIC_SITE_URL`, senão `https://dailyelfmagic.com` | Sem barra no fim. **Nenhum outro arquivo escreve o domínio.** |
| `siteConfig.urlIsPlaceholder` | `true` | Fica `false` quando a variável de ambiente é definida. |
| `siteConfig.name` | `Daily Elf Magic` | Placeholder derivado do domínio placeholder. O build para se o nome usar a marca registrada. |
| `siteConfig.description` | A promessa do PDF | Placeholder de copy; o Marketing pode trocar. |
| `siteConfig.locale` | `en-US` | Não mudar. |
| `siteConfig.operator.name` | `Vanessa Tatiane Evangelista Assink` | Operadora do site e titular da conta Amazon Associates. Só o nome — nenhum outro dado pessoal. |
| `siteConfig.contactEmail` | `arche.boost@gmail.com` | Placeholder; pode mudar antes do Portão 5. |
| `siteConfig.amazon.associateTag` | `''` (vazio, `TODO-OWNER`) | Vazio = links de busca simples, **sem tag**, e o build imprime `WARNING  affiliate tag not set`. Nunca inventar valor. |
| `siteConfig.amazon.marketplaceHost` | `www.amazon.com` | O Canadá entra pelo OneLink, dentro da conta Amazon — não há script nosso para isso. |
| `siteConfig.amazon.ideaListUrls` | `{}` (vazio) | Mapa `slug → endereço completo da Idea List`. Ideia fora do mapa = **sem botão do kit**. Link encurtado ou mascarado (`amzn.to`, redirecionador) **para o build**. Slug inexistente também. |
| `siteConfig.email.provider` | `null` | Nenhum provedor foi escolhido. Nada de nome, chave ou ID inventado. Ver contrato 6.3. |
| `siteConfig.analytics.cloudflareWebAnalyticsToken` | `null` | Desligado. Com `null`, nenhum script de analytics é carregado. |
| `AMAZON_DISCLOSURE` | `As an Amazon Associate I earn from qualifying purchases.` | Texto exato. Não reescrever. |
| `ILLUSTRATION_DISCLOSURE` | `Illustrated guide — scenes are original illustrations, not photos.` | Texto exato. Não reescrever. |

A cada build, o início do log mostra o estado da config. Exemplo real de hoje:

```
SITE CONFIG — Daily Elf Magic — https://dailyelfmagic.com
  ok       Idea Lists: 0 of 60 ideas have a "Buy the kit" button (the others show search links only).
  ok       Email provider: none — email forms show the "coming soon" state.
  ok       Analytics: OFF.
  WARNING  domain not set — using the placeholder https://dailyelfmagic.com. Set NEXT_PUBLIC_SITE_URL before launch.
  WARNING  affiliate tag not set — every Amazon link is a plain search link without a tag (no commission).
```

**Restrição técnica do arquivo:** ele também é lido direto pelo Node nos scripts. Por isso não pode ter `import` nem sintaxe que só existe em TypeScript (enum, alias `@/`).

---

## 5. Contrato de ilustração

### 5.1 Onde ficam os arquivos (o Designer e o André escrevem; eu só leio)

```
public/illustrations/<slug>/vertical.*     1000 × 1500   página da ideia + Pinterest
public/illustrations/<slug>/horizontal.*   1200 × 628    Google + compartilhamento
public/illustrations/<slug>/square.*       1080 × 1080   grade + Instagram (opcional)
```

`<slug>` é exatamente o `slug` da ideia no `ideas.json`.

### 5.2 Como o arquivo é escolhido

O resolver (`src/lib/illustrations.ts` → `getIllustration(idea, 'vertical')`) lê a pasta **no build** e pega o arquivo pelo nome (`vertical`, `horizontal`, `square`), com qualquer destas extensões, nesta ordem de preferência:

`webp` → `avif` → `png` → `jpg` → `jpeg` → `svg`

Ou seja: **imagem final sempre ganha do placeholder `.svg`** quando os dois estão na pasta. O André não precisa apagar o SVG, nem editar código, nem editar dados. Maiúsculas no nome (`Vertical.PNG`) também funcionam. Testado com SVG sozinho, SVG + PNG e SVG + PNG + WebP.

O resolver devolve `{ src, width, height, alt, isPlaceholder }`. Se o arquivo não existe, devolve `null` — e a página **não mostra nada** (nunca imagem quebrada).

- `width`/`height` são sempre os do contrato (1000×1500 etc.), para a página reservar o espaço.
- `alt` sempre começa com **"Illustration of"** (`illustrationAlt()` garante, mesmo que o texto recebido não comece assim).
- A página usa o componente `IllustrationImage`; a ilustração principal recebe `priority`.

### 5.3 Imagens para Open Graph, Twitter e Pinterest (o problema do SVG)

**Problema:** prévia de link e Pinterest só aceitam imagem raster (JPEG/PNG). Os placeholders são SVG.

**Solução implementada:** a cada build, `scripts/prebuild.ts` converte o arquivo escolhido de cada ideia em JPEG:

```
public/illustrations/<slug>/horizontal.*  →  /social/<slug>/horizontal.jpg   (1200 × 628, Open Graph/Twitter)
public/illustrations/<slug>/vertical.*    →  /social/<slug>/vertical.jpg     (1000 × 1500, Pinterest)
```

- O endereço do JPEG **não muda** quando o André troca a ilustração: links e pins antigos continuam valendo.
- Funciona igual para placeholder SVG e para imagem final; se a imagem final vier em outro tamanho, é ajustada para o tamanho do contrato.
- A pasta `public/social/` é gerada, está no `.gitignore` e nunca deve ser editada.
- `getSocialImage(idea, 'horizontal')` devolve o endereço completo para o `og:image`; `getSocialImage(idea, 'vertical')` é a imagem do Pin.
- O build falha se uma página apontar `og:image` para um arquivo que não existe ou que não seja JPEG/PNG.

**O que ainda falta (não é meu):**
1. As ilustrações em si. Enquanto a pasta de uma ideia não tem `horizontal.*`, a página sai **sem** `og:image` e com `twitter:card=summary` (cartão pequeno). Hoje as 60 estão assim, e o build avisa: `121 illustration file(s) not found`. A conversão foi testada com um SVG de teste fora do projeto, não com os placeholders reais, que ainda não existiam quando terminei.
2. Uma imagem padrão do site, para as páginas que não são de ideia (home, hubs, planner...). Convenção já suportada: `public/illustrations/_site/horizontal.*` (1200×628). Sem ela, essas páginas ficam sem imagem de compartilhamento. Ver ponto em aberto 6.

---

## 6. Contratos que o Desenvolvedor deve seguir

### 6.1 Dados das ideias
- Importar **sempre** de `@/lib/ideas` (`getAllIdeas`, `getIdeaBySlug`, `getIdeasByHub`, `getAllSlugs`, `ideaLabels`, `getHubLinks`, `toIdeaSummary`). Importar o JSON direto é erro de lint.
- `@/lib/ideas` é só para código de build (Server Components, `generateStaticParams`, `sitemap.ts`). Componentes de navegador (`'use client'`: filtros, Tonight Mode, planner) recebem os dados **por props**, já reduzidos com `toIdeaSummary()`, para o JavaScript ficar leve.
- **`typeTags` e `materialTags` estão PENDENTES** (Portão 2). Estão tipados, mas ficaram de fora do `IdeaSummary` de propósito. Não construir filtro de tipo/material, `/funny/` nem "Only stuff I have" antes de o PM confirmar a aprovação.
- O hub `funny` está em `HUBS_PENDING_APPROVAL`. Quando for aprovado, o PM pede a remoção dessa linha (uma linha em `src/lib/ideas.ts`).
- `editorNotes` e `illustrationBrief` não existem no tipo `Idea`. Não há como renderizá-los por engano, e o build confere.
- `safety` é sempre renderizado, com o texto exato. `elfNote: null` = bloco não aparece. `amazonItems` vazio = nenhum link da Amazon.
- O arquivo é validado no build: 60 ideias, slugs únicos, valores de filtro válidos, 3 a 5 passos, pelo menos 1 hub.

### 6.2 Botão do kit e links da Amazon (resolve D10)
- Todo link da Amazon vem de `@/lib/amazon`: `amazonSearchUrl(termo)` e `amazonKitUrl(slug)`.
- `amazonKitUrl(slug)` devolve `null` quando a ideia não tem Idea List na config → **não renderizar o botão**. Os links de busca por material continuam.
- Sem tag na config, os links saem sem tag. Com tag, ela é acrescentada sozinha — inclusive na Idea List.
- Todo link leva `rel={AMAZON_LINK_REL}` (`sponsored nofollow noopener`).
- Página com pelo menos um link da Amazon mostra `AMAZON_DISCLOSURE` **perto dos links**, não só no rodapé — mesmo enquanto a tag está vazia, para não ser esquecido no dia em que ela for preenchida.
- Nunca preço. Nunca foto de produto. Nunca link encurtado. A página stub de ideia mostra o uso correto.

### 6.3 Formulário de e-mail
- Um componente só, usado em todos os lugares (home, página de ideia, printables), que lê `siteConfig.email.provider`.
- Com `provider === null` (situação do MVP): mostrar o estado **"coming soon"** de forma clara. O campo e o botão ficam desabilitados ou nem aparecem. **Nenhum envio pela rede, nenhum e-mail guardado no navegador, nenhuma mensagem de sucesso.**
- Printables: download livre no MVP, com o formulário "coming soon" ao lado (decisão do Portão 1).
- Ligar um provedor depois é tarefa fora do MVP e exige acrescentar o endereço do provedor em `form-action` no `public/_headers`.

### 6.4 Regra dos "2 links de hub" (resolve D11 e a seção 5.4 do handoff 02)
- Usar `getHubLinks(idea)`: devolve **sempre exatamente 2** links, sempre os mesmos para a mesma ideia.
- Cada link vem com `isMember`:
  - `true` → a ideia pertence ao hub. Texto do tipo "More no-mess ideas".
  - `false` → a ideia **não** pertence; o link é um **convite** ("Short on time? See 5-minute ideas"). O texto não pode afirmar que a ideia faz parte do hub.
- Ordem de escolha: `arrival`/`goodbye` primeiro; depois o hub de idade quando a ideia é de uma faixa só (`toddlers` ou `kids`); depois `5-minute`, `no-mess`, `easy`, `toddlers`, `kids`.
- As 7 ideias de um hub só (7, 9, 40, 43, 44, 45, 47) recebem o convite para `/5-minute/`.
- **Enquanto `funny` estiver pendente**, as ideias 12, 19, 53 e 55 (cujo segundo hub seria `funny`) também recebem o convite. Depois da aprovação passam a apontar para `kids` + `funny`, sem mudança de código nas páginas.
- Link extra de cômodo ("more ideas in the kitchen"): `routes.ideasWith({ room: idea.room })` → `/ideas/?room=kitchen`. Cômodo não é hub; é a grade já filtrada.
- O texto dos links é copy (Marketing/PM), não é meu.

### 6.5 Endereços, sitemap e canonical
- Todo endereço interno vem de `routes` (`src/lib/routes.ts`), sempre com barra no fim.
- Toda página exporta metadata com `buildMetadata({ title, description, path, image })` de `src/lib/seo.ts`. Isso gera título, descrição, canonical, Open Graph e Twitter.
- Ao criar uma página nova, **acrescentar o caminho em `staticPaths`** (`src/lib/routes.ts`). As 60 páginas de ideia entram sozinhas.
- Não dá para esquecer: o build falha se uma página exportada não está no sitemap, se o sitemap lista página que não existe, se falta canonical ou se o canonical não bate com o endereço.
- Filtros da grade ficam na query string (`/ideas/?room=kitchen&mess=zero`). O canonical de qualquer visão filtrada é `/ideas/`. Nomes dos parâmetros: `time`, `mess`, `age`, `room`, `material`, `type`; valores = os do `ideas.json`.
- **Nenhum `noindex`.** O build falha se aparecer em alguma página ou no `_headers` (única exceção: a página 404, ver ponto em aberto 2).
- Schema HowTo (JSON-LD) é do Desenvolvedor. A política de segurança do `_headers` não bloqueia `<script type="application/ld+json">`.

### 6.6 Pinterest
- Botão "Pin" = **link simples** montado por `pinterestPinUrl(path, imagemVertical, descricao)`. Não carregar o script do Pinterest (`pinit.js`): seria rastreamento de terceiros e o build barra recurso de outro domínio.
- O título do pin vai no texto, nunca dentro da imagem.

### 6.7 Estilo e fontes
- CSS Modules + custom properties do `tokens.css`. Nada de framework de UI nem CSS-in-JS.
- As fontes chegam como `--font-face-display` e `--font-face-body` (definidas em `src/app/fonts.ts`). O `tokens.css` do Designer já usa esses dois nomes.
- No máximo 2 famílias, só o subconjunto `latin`.

### 6.8 O que é proibido acrescentar
Rota de API, middleware, `'use server'`, banco, qualquer script de anúncio ou espaço reservado para anúncio, qualquer rastreador além do slot opcional, qualquer recurso carregado de outro domínio, preço, foto.

---

## 7. Cloudflare Pages — passo a passo para o André

**Importante:** eu não tenho acesso à conta Cloudflare e não tentei entrar. Está tudo preparado para a conexão levar poucos minutos. Os nomes dos botões podem variar um pouco, porque o painel muda com frequência.

### 7.1 Valores (para conferir na tela)

| Campo | Valor |
|---|---|
| Framework preset | **None** |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | (deixar vazio) |
| Production branch | `main` |
| Variável `NEXT_PUBLIC_SITE_URL` | endereço do site, sem barra no fim (ver passo 8) |
| Variável `NODE_VERSION` | `24` |

Não escolher o preset "Next.js" nem "Next.js (Static HTML Export)": eles trocam o comando de build e pulam as verificações automáticas. O comando tem que ser `npm run build`.

### 7.2 Conectar o repositório (uma vez só)

Pré-requisito: o repositório `elf-site` já existe no GitHub (o PM cria e faz o primeiro push).

1. Abrir `https://dash.cloudflare.com` e entrar (login com Apple ID; pode pedir o código de 2 fatores).
2. No menu da esquerda, clicar em **Workers & Pages**.
3. Clicar em **Create** (ou **Create application**).
4. Escolher a aba **Pages** e clicar em **Import an existing Git repository** (ou **Connect to Git**).
5. Clicar em **Connect GitHub**. Na janela do GitHub, escolher **Only select repositories**, marcar `elf-site` e clicar em **Install & Authorize**.
6. De volta ao Cloudflare, selecionar o repositório `elf-site` e clicar em **Begin setup**.
7. Preencher:
   - **Project name:** um nome genérico (ex.: `elf-site`). Ele vira o endereço `nome.pages.dev`, que é público. Não usar a marca registrada.
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
8. Abrir **Environment variables (advanced)** e criar duas variáveis:
   - `NEXT_PUBLIC_SITE_URL` = `https://NOME-DO-PROJETO.pages.dev` (o endereço que o Cloudflare mostrar para o projeto). É provisório, até o domínio existir.
   - `NODE_VERSION` = `24`
9. Clicar em **Save and Deploy**. O primeiro build leva de 2 a 4 minutos.
10. Quando terminar, clicar no endereço `...pages.dev` para ver o site.

Se o build falhar, clicar no deploy e abrir o log: a última parte diz, em inglês simples, o que está errado.

### 7.3 Preview a cada push (já vem ligado)

- Push no branch `main` → publica o site de **produção**.
- Push em qualquer outro branch, ou pull request → publica um **preview** em `nome-do-branch.NOME-DO-PROJETO.pages.dev`. O Cloudflare comenta o link no pull request.
- Para conferir: projeto → **Settings** → **Builds & deployments** → **Preview deployments** deve estar em **All non-production branches**.
- Na mesma tela, as variáveis de ambiente têm duas colunas (Production e Preview). Deixar `NEXT_PUBLIC_SITE_URL` e `NODE_VERSION` nas duas.
- O Cloudflare marca sozinho os endereços de preview como não indexáveis. Isso é comportamento dele; não há `noindex` no nosso código.

### 7.4 Domínio próprio (depois de escolher e registrar)

1. Registrar o domínio no Cloudflare Registrar (mesma conta).
2. Projeto → **Custom domains** → **Set up a custom domain**.
3. Digitar o domínio (ex.: `dailyelfmagic.com`) → **Continue** → **Activate domain**. Como o domínio está na mesma conta, o registro de DNS é criado sozinho.
4. Repetir para `www.` + domínio, se quiser que o `www` também funcione.
5. Projeto → **Settings** → **Variables and Secrets** → editar `NEXT_PUBLIC_SITE_URL` (coluna **Production**) para o domínio final, com `https://` e sem barra no fim.
6. **Deployments** → no último deploy de produção, **Retry deployment**. Sitemap, canonical e prévias de link passam a usar o domínio novo.

### 7.5 Voltar atrás

Projeto → **Deployments** → escolher um deploy anterior → **Rollback to this deployment**. O site volta na hora, sem mexer no código.

---

## 8. GitHub

- Branch principal: `main`. Repositório `elf-site`, público (decisão do Portão 1).
- CI em `.github/workflows/ci.yml`: a cada push e pull request roda `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build`, com o Node do `.nvmrc`.
- **Não criei o repositório no GitHub e não fiz push.** O PM faz depois da revisão.
- O `.gitignore` deixa fora do repositório público: `PROMPT-CLAUDE-CODE-SITE-ELF.*`, `elf-site-estrutura-30-ideias/`, `docs/source/`, `.claude/`, `.DS_Store`, `node_modules/`, `.next/`, `out/`, `public/social/`, `next-env.d.ts`, arquivos `.env`.
- Commitei só os meus arquivos, por caminho explícito.

---

## 9. Orçamento de performance

### 9.1 Peso (conferido automaticamente em todo build)

Tamanhos de transferência em gzip, por página.

| Item | Orçamento | Esqueleto hoje | Se estourar |
|---|---|---|---|
| JavaScript no primeiro acesso — páginas de ideia | ≤ 155 kB | 135,4 kB | build falha |
| JavaScript no primeiro acesso — demais páginas | ≤ 180 kB | 135,4 kB | build falha |
| CSS | ≤ 20 kB | 1,5 kB | build falha |
| HTML | ≤ 40 kB | 4,9 kB | build falha |
| Fontes pré-carregadas (woff2) | ≤ 110 kB, no máx. 2 famílias | 67,2 kB | build falha |
| Recursos de outro domínio | 0 (única exceção: o script opcional do Cloudflare Web Analytics) | 0 | build falha |
| Placeholder SVG | ≤ 80 kB cada | — | aviso |
| Ilustração final vertical | ≤ 200 kB | — | aviso |
| Ilustração final horizontal / quadrada | ≤ 150 kB | — | aviso |
| JPEG social (gerado) | ≤ 300 kB | — | aviso |

Leitura honesta do número de JavaScript: **cerca de 135 kB são do próprio Next.js + React** e existem em qualquer página, mesmo vazia. Sobram ~20 kB de código nosso nas páginas de ideia e ~45 kB nas páginas interativas (home, grade, planner). É apertado de propósito.

Imagens pesadas geram **aviso**, não erro: o André precisa conseguir publicar uma ilustração nova mesmo que ela venha grande do Canva. O aviso lista o arquivo e o tamanho.

Meta de peso total de uma página de ideia no primeiro acesso (HTML + CSS + JS + fontes + ilustração vertical): **≤ 550 kB**.

### 9.2 Core Web Vitals (metas)

Medidas em celular, no preview do Cloudflare.

| Métrica | Meta | Limite aceitável |
|---|---|---|
| LCP (maior elemento visível) | ≤ 2,0 s | 2,5 s |
| CLS (salto de layout) | ≤ 0,05 | 0,10 |
| INP (resposta ao toque) | ≤ 200 ms | 200 ms |
| TBT em laboratório | ≤ 200 ms | 300 ms |
| Nota de Performance do Lighthouse (mobile) | ≥ 90 | 85 |

### 9.3 Como será conferido

1. **Todo build** (local, GitHub Actions, Cloudflare): `scripts/check-export.ts` mede os pesos da tabela 9.1 e falha se estourar. O resumo aparece no fim do log.
2. **Fase 5 (QA):** Lighthouse em modo mobile no preview do Cloudflare, em 4 páginas — home, `/ideas/`, uma página de ideia e `/planner/` — 3 rodadas cada, usando a mediana, contra a tabela 9.2. Também console sem erros.
3. **Depois do lançamento (opcional):** se o André ligar o Cloudflare Web Analytics, ele mostra os Core Web Vitals dos visitantes reais.

Os números do orçamento ficam no topo de `scripts/check-export.ts` (constante `BUDGET`). Mudar um limite é decisão do PM.

---

## 10. O que o build prova sozinho

Além do orçamento, `npm run build` falha se:

- não houver exatamente 60 páginas de ideia;
- `sitemap.xml` ou `robots.txt` não forem exportados, ou o sitemap e as páginas exportadas não baterem 1 para 1;
- alguma página estiver sem `<title>`, sem meta description, sem canonical correto ou sem `lang="en-US"`;
- alguma página tiver `noindex`;
- aparecer na saída: código de AdSense, Mediavine, Journey ou Grow; Google Analytics ou Tag Manager; servidor de fontes de terceiros; link encurtado (`amzn.to`); rastro de WordPress;
- a marca registrada aparecer em título, H1 ou nome do site (menção dentro do texto continua permitida);
- um trecho de `editorNotes` ou `illustrationBrief` aparecer em qualquer arquivo publicado;
- a config tiver erro: URL inválida, tag com formato estranho, Idea List com slug inexistente ou link mascarado.

### Resultado verificado em 11/11/2026

```
EXPORT CHECK — out/
  pages exported     61  (idea pages: 60, other: 1)
  sitemap entries    61
  JS, heaviest page  135.4 kB gzip of 180.0 kB  /
  CSS, heaviest page 1.5 kB gzip of 20.0 kB  /
  HTML, heaviest     4.9 kB gzip of 40.0 kB  /
  fonts, heaviest    67.2 kB of 110.0 kB  /
Export check passed.
```

Também conferido à mão, num servidor local com os cabeçalhos do `_headers`: home e página de ideia carregam, sem erro de console, com as duas fontes servidas pelo próprio site e nenhum pedido a outro domínio; endereço inexistente devolve a página 404.

---

## 11. Pontos em aberto para o PM

| # | Ponto | Proposta | Decide |
|---|---|---|---|
| **1** | **Preview no Cloudflare Pages não foi publicado.** O "pronto quando" do meu papel no prompt inclui "deploys a preview on Cloudflare Pages". Não tenho (e não devo ter) acesso à conta. Também **não pude confirmar** que a imagem de build do Cloudflare aceita Node 24. | O André segue a seção 7 depois do push. Se o build reclamar da versão do Node, trocar `NODE_VERSION` para `22` (os scripts exigem 22.18 ou mais novo). Só depois disso o item fica cumprido. | André + PM |
| **2** | **Existe um `noindex`, colocado pelo próprio Next.js, na página 404** (`404.html`, `/404/` e `/_not-found/`). Nenhuma página real tem. O prompt pede para sinalizar qualquer `noindex`. | Manter: página de erro não deve ser indexada, e não há opção simples para desligar. O build barra `noindex` em qualquer outra página. | PM (informar o André) |
| **3** | **Publicar em `main` = site no ar.** Isso esbarra no "draft-first": o endereço `pages.dev` de produção é público no momento em que o projeto é conectado. | Até o Portão 5: não ligar o domínio próprio e trabalhar por branch/pull request (preview), fazendo merge em `main` só com a aprovação do André. Se quiser trancar de verdade, o Cloudflare Access (grátis) protege os previews com login. | André |
| **4** | **Endereço `pages.dev` duplicado.** Depois que o domínio próprio for ligado, o site continua acessível também em `nome.pages.dev`. O canonical já aponta para o domínio certo, então não é conteúdo duplicado para o Google. | Aceitar como está. Alternativa: uma regra de redirecionamento no Cloudflare de `pages.dev` para o domínio. Não coloquei nenhum `noindex` para resolver isso. | André |
| **5** | **`funny` e as etiquetas pendentes.** `getIdeasByHub('funny')` funciona (o dado está no arquivo), mas o hub está marcado como pendente e fica fora dos 2 links de hub. | Depois do Portão 2: tirar `funny` de `HUBS_PENDING_APPROVAL` e acrescentar `typeTags`/`materialTags` ao `IdeaSummary`. São duas edições pequenas em `src/lib/ideas.ts`, para o Desenvolvedor. | PM (após aprovação do André) |
| **6** | **Falta a imagem padrão de compartilhamento do site** (home, hubs, planner etc.). | Designer entrega `public/illustrations/_site/horizontal.svg` (1200×628, sem texto). O código já procura esse arquivo. | Designer |
| **7** | **A conversão para JPEG não foi testada com os placeholders reais**, só com um SVG de teste. Se o SVG do Designer usar algum recurso que o conversor não desenha igual ao navegador (certos filtros de textura, fontes), o JPEG pode sair diferente. | Assim que os placeholders existirem: rodar `npm run build`, abrir 3 ou 4 arquivos de `public/social/` e comparar com o SVG. | PM + Designer |
| **8** | **Alt text.** Hoje é uma frase neutra feita com o título: `Illustration of the Christmas elf scene “<título>”`. O brief de ilustração descreveria melhor a cena, mas é campo interno e não pode ser usado. | Se quiser alt text melhor, o Marketing escreve uma descrição curta por ideia na Fase 4 e o PM cria um campo público no `ideas.json`. O helper já aceita esse texto. | PM |
| **9** | **Texto do aviso de não-filiação** (item C7 do handoff 01) e do rodapé ainda não existe. Deixei só o lugar marcado no layout. | PM/Marketing redigem; Desenvolvedor aplica. | PM |
| **10** | **Fontes.** `Fredoka` (títulos) e `Nunito` (texto) entraram como placeholder; o `tokens.css` do Designer já usa os mesmos nomes. O `next/font` baixa os arquivos do Google **durante o build** (o visitante nunca fala com o Google). Se o Google Fonts estiver fora do ar na hora do build, o build falha e o site fica na versão anterior. | Aceitar. Alternativa de dependência zero: guardar os arquivos `.woff2` no repositório (as duas fontes têm licença aberta, OFL) e trocar para `next/font/local`. | Designer confirma as fontes; PM decide a alternativa |
| **11** | **OneLink (amazon.ca).** Não coloquei nenhum script da Amazon. Parti do princípio de que o OneLink é ligado dentro da conta Associates e funciona com links normais da amazon.com. | Confirmar ao abrir a conta. Se a Amazon exigir um script no site, é uma decisão nova (script de terceiros + ajuste no `_headers`). | André / titular da conta |
| **12** | **Ilustrações grandes do Canva.** O build avisa quando passa do orçamento, mas não comprime sozinho. | Barato de acrescentar (a ferramenta de conversão já está no projeto): gerar no build uma versão WebP otimizada de cada imagem final. Não fiz por estar fora do que foi pedido. | PM |
| **13** | **Autor dos commits.** Os commits saíram com a identidade Git configurada nesta máquina (nome de usuário e e-mail pessoal). Num repositório público isso fica visível. | Antes do primeiro push, decidir se troca pelo e-mail `noreply` do GitHub. Como ainda não houve push, dá para reescrever o autor dos commits sem prejuízo. | André |
| **14** | **O CI vai falhar no GitHub se faltarem arquivos de outros papéis.** O build precisa de `src/data/ideas.json`. Eu não commitei arquivo de ninguém. | Antes do push, o PM commita `src/data/ideas.json`, os handoffs e os arquivos do Designer. Vale reler os handoffs antes de torná-los públicos. | PM |
| **15** | **Import do `tokens.css`.** O arquivo já existe, mas não o importei, conforme combinado. | Acrescentar em `src/app/layout.tsx`, logo **acima** de `import '@/styles/globals.css'`, a linha: `import '@/styles/tokens.css'` | PM |
| **16** | **7 alertas "moderate" do `npm audit`**, todos numa dependência da ferramenta de lint. Não fazem parte do site publicado. `npm audit fix` não resolve sem trocar de versão principal. | Aceitar por ora; reavaliar quando a config de lint do Next atualizar. | PM (informativo) |
| **17** | **Menções à marca registrada no repositório.** Aparece só como regra: em um comentário de `src/config/site.ts` e nas duas expressões de verificação dos scripts (que precisam do termo para barrá-lo). Não é nome, marca, identificador nem nome de arquivo. | Manter. Se o PM preferir zero ocorrência, tiro o comentário; as verificações precisam continuar. | PM |
| **18** | **O lint cobre os scripts do Designer** (`scripts/placeholder-kit/*.mjs`), porque estão na pasta `scripts/`. A pasta `design/` fica de fora. | Se um script do Designer quebrar o lint, o CI fica vermelho. Opções: o Designer corrige, ou eu excluo a pasta do lint. | PM |
