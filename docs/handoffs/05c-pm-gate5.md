# 05c — Portão 5: lançamento (PM)

- **Fase:** 5 — Testar + Assinar (fechamento)
- **Data:** 13/11/2026
- **Lido antes:** `05-qa-report.md`, `05b-dev-qa-fixes.md`, `01-pm-scope.md` §6 ("Antes do Portão 5"), `02a-solutions-architecture.md` §7–8
- **Status:** o site está pronto do lado técnico. O lançamento depende de itens que só o André e a Vanessa podem fazer.

---

## 1. Onde estamos

- Os 7 critérios de aceitação passam (`05-qa-report.md`). Os 3 bugs médios e 6 dos 9 baixos estão corrigidos; os outros 3 foram decididos pelo PM (`05b`).
- No ar em https://elf-site.pages.dev, com o último commit, CI verde e console limpo.
- Nada foi comprado, cadastrado ou postado em nome de ninguém.

## 2. O que o André e a Vanessa decidem ou fazem

| # | Item | Quem | Recomendação | Depois, eu faço |
|---|---|---|---|---|
| 1 | **Domínio** | André | Registrar `dailyelfmagic.com` no Cloudflare Registrar (~US$ 11,17/ano), na conta dele. Eu não compro nada. | Passo a passo para ligar o domínio ao projeto `elf-site`; trocar `NEXT_PUBLIC_SITE_URL`; conferir canônicos, sitemap e os links dos 60 pins. |
| 2 | **Nome do site** "Daily Elf Magic" | André | Manter, se o domínio for `dailyelfmagic.com`. | Trocar num lugar só (`site.ts`) se mudar. |
| 3 | **Tag de afiliado da Amazon** | **Vanessa** | Ela se inscreve no Amazon Associates (amazon.com) com o endereço final do site e me passa o *tracking ID* (algo como `nome-20`). Hoje os links da Amazon saem **sem tag** (não geram comissão). | Colocar a tag na config e conferir todos os links. As Idea Lists (Fase 4) ela cria depois, na conta dela. |
| 4 | **E-mail de contato** público | André | Confirmar se `arche.boost@gmail.com` é o endereço certo (está em `/contact/`, `/privacy/` e `/about/`). Ele foi posto como provisório no Portão 1 (D8). | Trocar se for outro. |
| 5 | **Provedor de e-mail** | André | **Ficar com "coming soon" no lançamento.** Ligar um provedor está fora do MVP; quando for escolher, a Vanessa precisa de um endereço postal para o rodapé. | — |
| 6 | **Ler `/privacy/` e `/about/`** | Vanessa (e André) | Ler antes de lançar; os textos descrevem só o que o site faz. Não é parecer jurídico. | Ajustar o que ela pedir. |
| 7 | **Ilustrações provisórias** | André | **Lançar com as ilustrações provisórias** (desenhos originais, com o aviso de ilustração) e trocar em lotes de 10 por semana, começando pelo lote 1 aprovado no Portão 4. O Google leva meses para posicionar um domínio novo, então quanto antes o domínio estiver no ar, melhor. **Pins** só depois da arte final de cada ideia (D12). | Trocar cada ilustração quando o arquivo final chegar. |

## 3. O que "lançar" significa aqui

1. O domínio aponta para o projeto `elf-site` no Cloudflare Pages.
2. `NEXT_PUBLIC_SITE_URL` passa a ser o domínio; o build seguinte troca canônicos, sitemap e `robots.txt`.
3. (Opcional) Redirecionar `elf-site.pages.dev` para o domínio.
4. Enviar o sitemap no Google Search Console (conta do André ou da Vanessa).

Nada disso acontece sem o "aprovo o lançamento" do André registrado no `01-pm-scope.md` §8.
