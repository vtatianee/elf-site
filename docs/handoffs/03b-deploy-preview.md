# 03b — Preview de deploy (Portão 3)

- **Fase:** 3 — Construir (fechamento)
- **Data:** 12/11/2026
- **Lido antes:** `03-dev-build.md`, `02a-solutions-architecture.md` §7
- **Preview:** https://elf-site.pages.dev (Cloudflare Pages, projeto `elf-site`, branch `main`)
- **Repositório:** https://github.com/vtatianee/elf-site (público)
- **Status:** preview no ar e conferido. **Aguardando o André aprovar o Portão 3.**

---

## 1. Como chegou ao ar

1. Commits reescritos com o e-mail noreply do GitHub (`284499397+vtatianee@users.noreply.github.com`), com autorização do André; só o e-mail mudou, os arquivos de cada commit ficaram idênticos.
2. Repositório público `vtatianee/elf-site` criado e `main` enviado. O primeiro push foi recusado porque o login do `gh` não tinha a permissão "workflow" (o projeto tem `.github/workflows/ci.yml`). O André deu a permissão e o push passou. CI do GitHub verde.
3. O André conectou o repositório no Cloudflare. O painel novo abre no fluxo de **Workers** ("Create an app"); o caminho certo é o link "Continue to Pages" no pé da primeira tela. O Cloudflare chama o Pages de "legacy", mas ele segue funcionando para site estático. Configuração usada: preset None, `npm run build`, saída `out`, `NODE_VERSION=24`, `NEXT_PUBLIC_SITE_URL=https://elf-site.pages.dev`.
4. Commit no ar: `806ecc3` (favicon) e posteriores.

## 2. O que conferi no preview

**Todas as páginas** (script fora do repositório, lendo o sitemap do próprio preview):
- 76 páginas no sitemap, 76 respondem 200; endereço inexistente responde 404 com a página de erro do site.
- Em todas: canonical = o próprio endereço em `elf-site.pages.dev`; exatamente 1 H1; aviso de não-filiação e nome da operadora no rodapé; nenhum `noindex`; nenhum preço; nenhuma palavra em português; nenhum "Elf on the Shelf"; nenhum script de anúncio; nenhum campo interno (`editorNotes`, `illustrationBrief`).
- 60 páginas de ideia com HowTo; onde há link da Amazon, há o aviso de afiliado.
- `robots.txt` e `sitemap.xml` apontam para `elf-site.pages.dev`.
- Cabeçalhos de segurança do `_headers` chegam (CSP, HSTS, X-Frame-Options etc.). `favicon.ico` e `icon.svg` respondem 200.

**No navegador** (desktop e celular 375 px):
- **Critério 6 — console sem erro:** aba limpa, home, `/ideas/`, página de ideia, `/planner/`, `/printables/`: **nenhum erro**. Ficam apenas *avisos* (não erros) do Chrome dizendo que algumas ilustrações foram pré-carregadas e não usadas em poucos segundos: é o Next.js adiantando as páginas que o visitante provavelmente abre em seguida. Não afeta o visitante.
- `/ideas/?room=fridge` → 2 ideias (critério 2).
- Tonight Mode abre com os três critérios ligados, "12 ideas match all three" e 3 ideias.
- Página de ideia no celular: título e quadro de fatos antes da ilustração (decisão do Portão 2); sem rolagem lateral.
- Planner monta dezembro de 2026, dia 1 = chegada; sem rolagem lateral no celular.

**Observação:** o primeiro deploy saiu antes de a variável `NEXT_PUBLIC_SITE_URL` valer, e por alguns minutos os canônicos apontaram para o domínio provisório `dailyelfmagic.com`. O deploy seguinte corrigiu; tudo conferido depois disso.

## 3. Não verificado

- Safari e iPhone reais; leitor de tela; navegação só por teclado do começo ao fim.
- Impressão em papel.
- A virada de "noite" às 4h.
- Revisão visual formal do Designer (segue o ponto do `03-dev-build.md`).

## 4. Pontos para o André

| # | Ponto | Proposta | Decide |
|---|---|---|---|
| 1 | **O preview é público e indexável.** `elf-site.pages.dev` não tem `noindex` (por decisão de arquitetura) e o canonical aponta para ele mesmo. O Google pode indexá-lo antes do lançamento, com textos ainda em revisão e folhas "em preparação". Quando o domínio final entrar (Portão 5), basta trocar `NEXT_PUBLIC_SITE_URL`: os canônicos passam para o domínio e o Google migra. | Manter como está: nada aponta para esse endereço, e o conteúdo é o mesmo que vai ao ar. Alternativa: ligar "Cloudflare Access" no projeto para fechar o preview com login até o lançamento. | **André** |
| 2 | **Ficha 44 — termo da Amazon** (ponto 1 do `03-dev-build.md`). Continua aberto. | Trocar para "blunt-tip scissors" | **André** |
| 3 | **Portão 3.** | Aprovar o preview e liberar a Fase 4 (Marketing). | **André** |
