# 02b — Sistema de design (Designer Visual/UX) · Fase 2

- **Data:** 11/11/2026
- **Autor:** Designer Visual/UX
- **Status:** PRONTO PARA O PORTÃO 2. Direção visual, tons derivados e UX do Tonight Mode **aguardam aprovação do André**.
- **Li antes de começar:** `PROMPT-CLAUDE-CODE-SITE-ELF.md`, `01-pm-scope.md`, `02-pm-data-and-tags.md`, `02a-solutions-architecture.md` (seções 5 e 6), páginas 7 e 8 do PDF das fichas, `src/data/ideas.json` (só leitura).
- **Não toquei em:** `package.json`, lockfile, `next.config.*`, `tsconfig.json`, `src/app/`, `src/lib/`, `src/config/`, `src/components/`, `src/styles/globals.css`, `.github/`, `.gitignore`, `README.md`, handoffs dos outros papéis, `src/data/ideas.json`. Nenhum comando git. Nenhum pacote instalado.

---

## 1. Resumo em 1 minuto

- O site tem cara de noite de Natal: painel **azul-noite** com pontinhos dourados para o Tonight Mode, páginas em **creme**, botões **vermelhos** com "sombra de papel recortado", e o elfo **espiando por cima** dos painéis.
- Existe **um elfo só**, definido em um arquivo. A folha-mestre, os mascotes da interface e os 180 placeholders saem dessa mesma definição — por isso ele é idêntico em tudo.
- Os **180 placeholders** (60 ideias × 3 formatos) estão em `public/illustrations/<slug>/`, gerados por script, e cada um mostra a cena da **sua** ideia com 1 a 6 props tirados dos materiais da ficha.
- O conferidor automático passou: 180 arquivos, zero texto dentro de imagem, só cores aprovadas, todos bem formados.
- Para aprovar a direção visual, abra `design/preview/home.html` e `design/preview/idea.html` (ver seção 10 para como abrir).

---

## 2. O que foi entregue e onde

| # | Entrega | Arquivo(s) |
|---|---|---|
| 1 | Design tokens | `src/styles/tokens.css` |
| 2 | Bíblia do personagem | `design/character-bible.md` (inglês) + `design/elf-master.svg` |
| 3 | Gerador de placeholders | `scripts/generate-placeholders.mjs` + kit em `scripts/placeholder-kit/` (`core.mjs`, `elf.mjs`, `props.mjs`, `scenes.mjs`, `master.mjs`) |
| 3 | Conferidor | `scripts/check-placeholders.mjs` |
| 3 | 180 placeholders | `public/illustrations/<slug>/vertical.svg`, `horizontal.svg`, `square.svg` |
| 3 | Imagem padrão do site (pedido do Eng. de Soluções) | `public/illustrations/_site/horizontal.svg` (1200×628, só o mascote, sem texto) |
| 4 | Template de pin | `design/pin-template/pin.html`, `pin.css`, `index.html` (variantes + regras), `pin-data.js` (gerado) |
| 5 | Previews do Portão 2 | `design/preview/home.html`, `design/preview/idea.html`, `design/preview/preview.css` |
| extra | Folha de contato das 180 | `design/preview/placeholders.html` (gerada) |
| extra | Mascotes da interface | `design/mascot/elf-{head,peek,sit,sleep,stand,wave}.svg` (gerados) |
| extra | Alt text das 60 cenas | `design/illustration-alt.json` (gerado; toda linha começa com "Illustration of") |
| extra | Conferidor de contraste | `scripts/check-token-contrast.mjs` |
| 8 | Este handoff | `docs/handoffs/02b-design-system.md` |

**Sobre `design/mascot/`.** São o mesmo elfo, com fundo transparente, para a interface: marca no cabeçalho (`elf-head`), elfo espiando por cima do Tonight Mode, do cartão de e-mail e da elf note (`elf-peek`), estados vazios e página 404 (`elf-sit`, `elf-sleep`), boas-vindas (`elf-wave`, `elf-stand`), e fonte do favicon (`elf-head`). Na primeira rodada eu tinha gravado em `public/mascot/`, que não estava no acordo de pastas; **movi para `design/mascot/`** e apaguei a pasta antiga. O Desenvolvedor decide com o Eng. de Soluções onde eles entram no site (copiar para uma pasta pública ou embutir no componente). Ver ponto em aberto 11.

**Arquivo de ferramenta criado fora das minhas pastas:** `.claude/launch.json` (uma entrada, `design-preview`, que sobe um servidor local de arquivos na porta 4319 para eu conseguir ver os previews). Não faz parte do site. Pode ser apagado ou mantido — ponto em aberto 15.

### Como regenerar e conferir

```
node scripts/generate-placeholders.mjs     # reescreve os 180 SVGs + folha-mestre + mascotes + alt + dados do pin
node scripts/check-placeholders.mjs        # prova: 180 arquivos, sem texto, só cores aprovadas, bem formados
node scripts/check-token-contrast.mjs      # prova: pares de texto/fundo em WCAG AA
npx eslint scripts --max-warnings 0        # passou limpo
```

### Saída do conferidor (11/11/2026)

```
Placeholder illustration check
  ideas in ideas.json ............ 60
  placeholder files found ........ 180 of 180 expected
  extra kit files checked ........ 8 of 8 (_site image, character sheet, mascots)
  files containing <text> ........ 0
  colour tokens in tokens.css .... 28
  distinct colours used .......... 27 (all approved: yes)
  total size of the 180 files ..... 1277 KB (average 7.1 KB)

PASS — 180 placeholder files + 8 extras: present, well-formed, text-free, flat, self-contained, approved colours only.
```

O conferidor também barra, dentro de qualquer SVG: `<text>`, `<tspan>`, `<title>`, `<image>`, `href`, `url()`, `style`, variável CSS, script, opacidade, gradiente, filtro e qualquer cor que não esteja no `tokens.css`. Os SVGs usam **hex literal**, como o Eng. de Soluções pediu. Conferência cruzada: os 188 arquivos também abrem sem erro no leitor de XML do Python, e o `scripts/prebuild.ts` do Eng. de Soluções converteu os 121 SVGs (60 horizontais + 60 verticais + `_site`) em JPEG sem erro.

---

## 3. Paleta — tons derivados PARA APROVAÇÃO

**As 6 cores-base (travadas):** vermelho `#B42318` · verde-pinho `#14532D` · creme `#FDF6E3` · dourado `#D9A441` · azul-noite `#22304A` · marrom madeira `#8A5A3B`.

**Regra usada (condição do Portão 1):** todo tom derivado é **uma** cor-base misturada em direção ao creme/branco (tint) ou em direção ao azul-noite/preto (shade). Nenhum matiz novo. A mistura é linear por canal em sRGB, então a receita reproduz o hex exato.

São **22 tons derivados**. O site e os placeholders usam 27 das 28 cores (o `night-500` só aparece em texto, nunca em ilustração).

| Token | Hex | Receita | Onde é usado |
|---|---|---|---|
| `red-700` | `#902625` | 75% vermelho + 25% azul-noite | botão pressionado/hover, dobra do gorro, sola das botas |
| `red-300` | `#E3AC9C` | 35% vermelho + 65% creme | bochechas do elfo |
| `red-200` | `#EECCBA` | 20% vermelho + 80% creme | piso/cama do quarto |
| `red-100` | `#F6E3D1` | 9% vermelho + 91% creme | parede do quarto ("creme rosado"), fundo do aviso de segurança |
| `pine-800` | `#0E3A20` | 70% verde + 30% preto | sombra da árvore, botão verde pressionado |
| `pine-400` | `#7D9C7F` | 55% verde + 45% creme | árvore (para aparecer sobre o azul-noite), piso de "casa toda" |
| `pine-100` | `#DADEC8` | 15% verde + 85% creme | parede da entrada, chip selecionado |
| `gold-700` | `#A37B31` | 75% dourado + 25% preto | fenda do sino, borda de biscoito |
| `gold-300` | `#EBCD92` | 50% dourado + 50% creme | luzes suaves, biscoitos, panquecas |
| `gold-100` | `#F6E6C3` | 20% dourado + 80% creme | parede da "mesa", cartão da elf note |
| `night-900` | `#0F1621` | 45% azul-noite + 55% preto | olhos "pretos" do elfo |
| `night-800` | `#1A2438` | 75% azul-noite + 25% preto | piso da sala, rodapé do site |
| `night-600` | `#434E61` | 85% azul-noite + 15% creme | bordas e grão de papel sobre azul-noite |
| `night-500` | `#646B78` | 70% azul-noite + 30% creme | texto secundário (só sobre creme/branco-papel) |
| `night-300` | `#9CA2AE` | 45% azul-noite + 55% branco | vidro, metal, linhas d'água |
| `night-200` | `#C8CBD2` | 25% azul-noite + 75% branco | parede do banheiro ("azul-claro") |
| `night-100` | `#E9EAED` | 10% azul-noite + 90% branco | bancada do banheiro, interior da geladeira |
| `wood-800` | `#613F29` | 70% marrom + 30% preto | frente da bancada, borda da mesa |
| `wood-400` | `#C4A88F` | 50% marrom + 50% creme | papel kraft, papelão, contorno suave |
| `wood-200` | `#DFCDB7` | 26% marrom + 74% creme | **pele do elfo** |
| `wood-100` | `#F2E6D2` | 10% marrom + 90% creme | fios finos, grão de papel, borda de cartão |
| `snow` | `#FEFCF7` | 30% creme + 70% branco | papel, cartões, marshmallows, farinha, algodão |

**Como o conflito C4 foi resolvido na prática**
- "Azul-claro" do banheiro = `night-200`. É um azul-acinzentado, porque o azul-noite da paleta é pouco saturado. Não dá para chegar a um azul-bebê sem criar matiz novo.
- "Creme rosado" do quarto = `red-100`.
- Patinho de borracha (13 e 54) = **dourado**, não amarelo.
- "Cores primárias" da ficha 37 = vermelho, dourado e azul-noite (copinhos e pompons).
- Nenhum branco puro (`#FFFFFF`) e nenhum preto puro em lugar nenhum.

**Os dois tons que mais merecem o seu olhar:** a **pele** (`wood-200`, um bege puxado do marrom) e o **azul do banheiro** (`night-200`). São os que a regra "sem matiz novo" mais limita.

**Contraste (WCAG AA).** `node scripts/check-token-contrast.mjs` confere 39 pares de texto/fundo e de borda/fundo; todos passam. Os mais apertados: texto secundário sobre creme 4,97:1 (mínimo 4,5); texto dourado sobre azul-noite 5,87:1; vermelho sobre creme 6,09:1. **Dourado nunca é usado como texto sobre creme nem sobre vermelho** (não passaria).

---

## 4. Tipografia

**Confirmo a escolha que já está no `src/app/fonts.ts`: Fredoka (títulos) + Nunito (texto).** Não precisa trocar nada.

| Papel | Família | Licença | Por quê |
|---|---|---|---|
| Títulos, botões, números dos passos, pins | **Fredoka** | SIL OFL 1.1 | arredondada, alegre, lê bem em corpo gigante no pin |
| Texto, chips, legendas | **Nunito** | SIL OFL 1.1 | arredondada e muito legível em 16–18 px no celular |

- As duas são auto-hospedadas pelo `next/font` (nenhum pedido a servidor de terceiros). O `tokens.css` **não** tem `@import` nem URL de fonte.
- Pilha de reserva no `tokens.css`: `ui-rounded` (fonte arredondada do sistema nos aparelhos Apple), depois `Arial Rounded MT Bold` / `Avenir Next` / `Segoe UI` / `system-ui`.
- **Os previews não baixam fonte nenhuma**, então mostram a pilha de reserva. No site real os títulos ficam com a Fredoka, um pouco mais redonda do que aparece no preview.
- Respeitei o orçamento de 2 famílias. Uma terceira fonte "manuscrita" para a elf note ficaria bonita, mas estoura o orçamento; a nota usa a Fredoka num cartão inclinado com "fita adesiva".
- Escala: 13 / 15 / 17 (corpo) / 19 / 21–24 / 25–32 / 31–44 / 36–56 px, fluida entre celular e desktop. Nunca abaixo de 13 px.

---

## 5. Bíblia do personagem (resumo; o documento completo é `design/character-bible.md`)

- Elfo-criança **genérico**: cabeça grande, rosto redondo, olhos pretos redondos olhando para a frente, bochechas rosadas, cabelo castanho curto com franja, orelhas pontudas pequenas, sorriso simples, corpo pequeno, mãos de luva (círculos), sem dedos.
- Roupa, sempre igual: gorro vermelho caído **para um lado** com faixa verde e **um** sino dourado; túnica vermelha lisa; lenço verde amarrado no pescoço; calça verde; botas vermelhas.
- **Proibido acrescentar:** emblema, logo, cinto, botões, colarinho (em especial colarinho branco pontudo), barra branca no gorro, pompom, listras. Foi desenhado de propósito sem nenhum desses traços para não lembrar o boneco de marca registrada.
- Folha-mestre (`design/elf-master.svg`): frontal em pé, sentado, espiando (cabeça + mãos), acenando, deitado dormindo + as 6 cores-base. **Sem nenhum texto** — as legendas estão no `.md`.
- **Faltam perfil e costas** (o PDF pede frontal, perfil e costas). Os placeholders não precisam, porque todas as cenas são vistas de frente. Ponto em aberto 10.

---

## 6. Sistema de placeholders

### 6.1 Como funciona

- **Um elfo, uma definição** (`scripts/placeholder-kit/elf.mjs`): poses em pé, sentado, deitado, só a cabeça espiando, mãos na borda, botas para cima.
- **Biblioteca de props** (`props.mjs`): cerca de 75 peças simples e reaproveitáveis — pote, tigela, árvore, meia, sapato, bandeja, cartão, envelope, candy cane, biscoito, caneca, marshmallow, ursinho, pato, livro, almofada e assim por diante.
- **Mapa de cenas** (`scenes.mjs`): uma cena por slug, montada a partir do `illustrationBrief` e dos `materials` de cada ficha, mais o alt text da cena.
- **Fundo pelo cômodo** (campo `room` do `ideas.json`), sempre em 2–3 áreas lisas:

| Cômodo | Parede | Superfície | Faixa |
|---|---|---|---|
| Cozinha | creme | bancada marrom | `wood-400` |
| Sala / árvore | azul-noite + pontos de luz dourados | piso `night-800` | `night-600` |
| Banheiro | `night-200` | bancada `night-100` | `snow` |
| Quarto | `red-100` | `red-200` | `red-300` |
| Mesa | `gold-100` | mesa marrom | `wood-800` |
| Entrada | `pine-100` | piso marrom | rodapé `snow` |
| Geladeira | `night-100` | prateleira `snow` | `night-300` |
| Casa toda | creme | tapete `pine-400` | `wood-400` |

- **Textura de papel:** tracinhos curtos e esparsos, um tom acima ou abaixo da área. Sem filtro e sem transparência, para não gerar cor fora da paleta.
- **Formato vertical:** o terço de cima fica limpo (nem os pontos de luz da sala entram ali) — é a faixa do título do pin.
- **Determinístico:** rodar de novo gera exatamente os mesmos arquivos.

### 6.2 Como trocar uma ilustração (para o André)

1. Abra a pasta da ideia: `public/illustrations/<slug>/` (o slug é o fim do endereço da página).
2. Solte ali o arquivo final com o **mesmo nome**: `vertical.png` (1000×1500), `horizontal.png` (1200×628), `square.png` (1080×1080). Pode ser `.webp`, `.png` ou `.jpg`.
3. Pronto. A imagem final ganha do `.svg` sozinha; não precisa apagar o placeholder, nem mexer em código ou em dados.

O gerador **só escreve arquivos `.svg`**. Rodá-lo de novo nunca apaga nem sobrescreve uma imagem final. Ninguém deve referenciar esses arquivos por outro caminho que não `public/illustrations/<slug>/<formato>.*`.

Ao trocar uma ilustração, **releia o alt text** daquela ideia em `design/illustration-alt.json`: ele descreve a cena do placeholder.

### 6.3 Onde o placeholder é mais simples que o brief (dito com honestidade)

Regra que segui: placeholder pode ser simples, não pode ser enganoso. As diferenças abaixo são simplificações ou aplicações das regras travadas — nenhuma muda a ideia.

| Ficha(s) | O brief pede | O placeholder mostra | Motivo |
|---|---|---|---|
| 7, 11, 13, 23, 35, 37, 42, 52 | vista de cima | cena de frente, com o objeto "deitado" em perspectiva | um único enquadramento para as 60 |
| 9 | elos da corrente "contados para bater com os dias" | 8 elos, sem significado | número depende do dia; e nenhuma tesoura (D14) |
| 12 | elfo no topo da árvore | elfo sentado ao lado, segurando o rolo | mantém o terço de cima limpo |
| 14, 21, 24, 25, 29, 31, 33, 49, 57, 60 | texto no espelho/placa/cartão/etiqueta/ímãs | tudo **em branco**; ímãs de letra viram peças coloridas lisas | nenhum texto, letra ou número dentro da imagem |
| 23 | biscoitos "numerados" | 3 biscoitos diferentes, sem número | idem |
| 43, 54, 58 | capacete de papel, touca de banho, chapéu gigante | elfo com a roupa de sempre | bíblia: a roupa nunca muda (ponto em aberto 3) |
| 53 | bolinhas "no ar em arco" | bolinhas pousadas na bandeja | regra "nada flutuando" |
| 20 | fundo azul-claro | fundo de sala (azul-noite) | o fundo segue o campo `room` (ponto em aberto 2) |
| 25 | fundo de quarto | fundo de "casa toda" | idem |
| 6 | segunda ilustração em close | não foi feita | fora do MVP (D13) |
| 44 | 10 flocos | 9 flocos; nenhuma tesoura | simplificação; tesoura nunca aparece |
| 56 | elfo de "cachecol grande" | cachecol extra de papel por cima do lenço verde | é material da ficha, desenhado como prop |

---

## 7. Template de pin (para o Marketing, Fase 4)

- `design/pin-template/pin.html?slug=<slug>&variant=a|b|c` monta um pin de **1000×1500**: a ilustração `vertical` da ideia + título grande em **camada de texto HTML** na faixa limpa do topo + marca pequena do site. O título **nunca** entra no arquivo da imagem.
- Título, cômodo, tempo e bagunça vêm do `pin-data.js`, gerado do `ideas.json` — ninguém redigita título.
- `design/pin-template/index.html` mostra as variantes lado a lado e traz as regras em inglês.

| Variante | Como é | Quando usar |
|---|---|---|
| **A — Clean band** | texto direto sobre a cor da parede; em ideias de sala/árvore troca sozinho para texto creme | padrão |
| **B — Ribbon** | faixa vermelha com borda ondulada, texto branco-papel | quando a parede é clara e o pin precisa de mais força |
| **C — Note card** | cartão de papel "colado com fita" | chegada, despedida, ideias com bilhete |

**Regras**
- **Título:** no máximo 40 caracteres e 3 linhas. O tamanho da letra é escolhido pelo comprimento (até 16 / 17–24 / 25–32 / 33–40). Os 60 títulos cabem (o maior tem 32). Sem CAIXA ALTA, sem emoji.
- **Kicker** (linha pequena): até 22 caracteres, só fatos da ficha ("5 min · Low mess"). Sem preço, sem "#1", sem contagem, sem "as seen on".
- **Áreas seguras:** margem de 60 px; faixa do título de y 60 a 480; área da cena de y 560 a 1440 — nenhum texto por cima.
- **Marca:** pequena, uma vez, no topo: rosto do mascote + nome do site ("Daily Elf Magic" é provisório). Nunca logo ou nome de marca de terceiros.
- **Pares de cor:** azul-noite sobre parede clara; creme sobre azul-noite (12,25:1); branco-papel sobre vermelho (6,41:1); kicker dourado com texto azul-noite (5,87:1). Nunca texto dourado sobre creme ou sobre vermelho.
- **Exportar:** janela do navegador (ou ferramenta de captura) em exatamente 1000×1500. A máquina que exporta precisa ter Fredoka e Nunito instaladas; sem elas sai a fonte de reserva.
- **D12 continua valendo:** com placeholder, o pin é só prévia. A imagem final de cada pin só é exportada quando a ilustração final existir.

---

## 8. Spec de UX do Tonight Mode

O protótipo em `design/preview/home.html` **funciona** (JavaScript puro, sem rede) e implementa esta spec com os dados reais. Sem JavaScript, a página mostra o estado "três critérios ligados" já com 3 ideias.

> **Atenção:** o botão `Only stuff I have` depende das `materialTags`, ainda **pendentes** de aprovação. O Desenvolvedor não liga esse critério antes de o PM confirmar. Os números abaixo (31 / 24 / 12) são os atuais e mudam se as etiquetas mudarem; a tela sempre mostra a contagem calculada, nunca um número fixo.

### 8.1 Comportamento

1. Três botões grandes, lado a lado: `5 minutes` · `No mess` · `Only stuff I have`. Cada um é um **liga/desliga** (`aria-pressed`). Altura mínima 72 px.
2. **Um toque sorteia 3 ideias**: qualquer toque em um botão refaz o sorteio na hora com os critérios ligados naquele momento. Não existe botão "buscar".
3. A linha de status diz **quantas ideias batem** e é anunciada por leitor de tela (`role="status"`).
4. `Show 3 different ideas` sorteia outras 3 do mesmo grupo. O sorteio **percorre o grupo inteiro antes de repetir** (com 12 ideias: 4 sorteios sem repetição).
5. **Nunca repete em noites seguidas havendo alternativa:** o que foi mostrado na noite anterior fica de fora enquanto sobrarem 3 ideias novas no grupo.
6. **Nunca resultado vazio.** Se os critérios ligados derem menos de 3 ideias, o sistema solta primeiro `Only stuff I have`; se ainda faltar, `No mess`; por último `5 minutes`. E **diz isso na tela**.
7. Com nenhum critério ligado, sorteia entre as 60.
8. Cada resultado é um cartão clicável (ilustração quadrada, título, tempo, bagunça, idade). O link `See all N matches` leva a `/ideas/` já filtrado.

### 8.2 Estados e microcopy exata (en-US)

| Estado | Texto |
|---|---|
| Rótulo acima do título | `Tonight Mode` |
| Título | `What’s the elf doing tonight?` |
| Apoio | `A new elf idea every night — in under 5 minutes, with stuff you already have. Tap what’s true right now.` (a primeira frase é a promessa do PDF) |
| Botões | `5 minutes` · `No mess` · `Only stuff I have` |
| Nome do grupo (leitor de tela) | `What’s true tonight` |
| Antes do primeiro toque (se o site abrir sem nada ligado) | `Tap one, two or all three. You’ll get 3 ideas right away.` |
| Três critérios, sem perda | `**12 ideas** match all three. Here are 3 for tonight.` |
| Um ou dois critérios | `**24 ideas** match “5 minutes” + “No mess”. Here are 3 for tonight.` |
| Nenhum critério | `**All 60 ideas** are in the hat. Here are 3 for tonight.` |
| Reserva (soltou `Only stuff I have`) | `**No exact match tonight** — here are 5 minutes, no mess ideas. We left out “Only stuff I have” to find you 3.` |
| Reserva (soltou dois) | `**No exact match tonight** — here are 5 minutes ideas. We left out “Only stuff I have” and “No mess” to find you 3.` |
| Botão de novo sorteio | `Show 3 different ideas` |
| Link para a grade | `See all 12 matches` (ou `See all 60 ideas` sem critério ou em reserva) |

A frase de reserva aprovada no Portão 1 era "No exact match tonight — here are quick, no-mess ideas". O protótipo monta a frase com o nome dos critérios que sobraram, para ser sempre verdadeira; o Marketing pode lapidar a redação, desde que continue dizendo **qual critério foi solto**. Ponto em aberto 5.

O estado de reserva tem destaque próprio: caixa com contorno dourado em volta da frase.

### 8.3 Regras para o Desenvolvedor

- **Memória:** `localStorage`, uma chave só, com: a "noite" atual, os ids já mostrados nesta noite e os ids da noite anterior. Nada sai do aparelho. Se o armazenamento estiver bloqueado, o sorteio funciona igual, só sem memória. A política de privacidade precisa citar esse dado guardado no navegador (já previsto no checklist do PM).
- **"Noite":** vira às 4 da manhã, hora local. Quem sorteia às 22h e de novo à 0h30 está na mesma noite.
- **Ordem do sorteio:** (1) ideias do grupo não vistas ontem nem hoje; (2) se sobrarem menos de 3, recomeça o ciclo, ainda sem as de ontem e sem as 3 que estão na tela; (3) grupo pequeno: libera as de ontem, menos as 3 da tela; (4) grupo minúsculo: qualquer uma — nunca vazio.
- **Contagens** sempre calculadas dos dados; nunca escritas à mão.
- **Movimento:** os 3 cartões "caem" em sequência (420 ms, 70 ms entre eles); com `prefers-reduced-motion` aparecem direto.
- **Foco:** depois de um sorteio o foco **fica no botão tocado**; não pular para os resultados.
- A política de segurança do `public/_headers` pode barrar script embutido: o protótipo é referência de comportamento, **não é para copiar e colar** — vira componente.

### 8.4 Decisões de UX que proponho (o André aprova)

- **Botões como liga/desliga, com sorteio imediato.** O prompt diz "três botões, um toque sorteia 3 que batem os três critérios"; o handoff 01 (D4) propôs cada botão ligar um critério. Segui o D4.
- **Estado inicial:** proponho abrir com **os três ligados e 3 ideias já na tela** (é o que o preview mostra). O pai cansado vê uma resposta sem tocar em nada, e um toque afrouxa o critério. A alternativa é abrir com nada ligado e uma frase convidando ao toque.

---

## 9. Inventário de componentes e micro-interações

Todos estão desenhados em `design/preview/preview.css` com os mesmos nomes de classe. **Tudo vem de token**; nenhuma cor, medida ou tempo está solto no CSS. Alvos de toque ≥ 44 px em todos os controles; foco visível em todos.

**Foco (`:focus-visible`):** contorno de 3 px, afastado 3 px — azul-noite sobre superfícies claras (12,25:1), **dourado** dentro de painéis azul-noite (classe `.on-night`, 5,87:1).

| Componente | Classe | Repouso | Hover | Foco | Ativo | Outros estados |
|---|---|---|---|---|---|---|
| Botão primário | `.btn` | vermelho, texto branco-papel, "sombra de papel" sólida de 4 px | `red-700` | contorno | desce 3 px, sombra some | **desabilitado:** fundo `wood-100`, borda, texto azul-noite, cursor proibido |
| Botão secundário | `.btn--secondary` | verde-pinho | `pine-800` | contorno | desce 3 px | — (é o "Get everything for this idea") |
| Botão dourado | `.btn--gold` | dourado, texto azul-noite | `gold-300` | contorno dourado | desce 3 px | só dentro de painel azul-noite |
| Botão fantasma | `.btn--ghost` | borda de 2 px | fundo `wood-100` | contorno | desce 3 px | versão para painel azul-noite |
| Botão do Tonight Mode | `.crit` | fundo `night-800`, borda `night-300`, ícone + rótulo, 72 px | borda dourada | contorno dourado | desce 3 px | **ligado:** fundo dourado, texto azul-noite **e** selo de ✓ no canto (não depende só de cor) |
| Chip / filtro | `.chip` | pílula branca, borda `night-500`, 44 px | fundo `wood-100` | contorno | — | **selecionado:** fundo `pine-100`, borda e texto verde-pinho |
| Fatos pequenos do cartão | `.meta` | texto secundário 15 px | — | — | — | não clicável |
| Selo | `.badge` | pílula dourada, texto azul-noite | — | — | — | "Coming soon" |
| Cartão de ideia | `.card` | branco-papel, borda fina, ilustração quadrada, título, fatos | sobe 3 px, sombra maior | contorno no cartão inteiro | — | o cartão todo é o link (o título carrega o link) |
| Cartão em linha | `.card--row` | miniatura à esquerda | idem | idem | — | no celular (resultados do Tonight, ideias relacionadas); vira coluna a partir de 640 px |
| Ideia do dia | `.feature` | ilustração horizontal + rótulo, título, fatos, citação, botão | — | — | — | — |
| Bloco de hub | `.hub` | caixa com seta | fundo `pine-100`, sobe 3 px | contorno | — | usado na home e nos "2 links de hub" |
| Busca | `.search` + `.field` | campo-pílula com borda de 2 px + botão de lupa | borda escurece | contorno | — | **desabilitado:** fundo `wood-100` |
| Barra de fatos | `.facts` / `.fact` | 4 células (tempo, bagunça, idade, cômodo): ícone vermelho, rótulo pequeno, valor em destaque | — | — | — | 2×2 no celular, 4×1 a partir de 640 px |
| Checklist de materiais | `.checklist` / `.check` | linha com caixa de 28 px, toda a linha clicável (44 px) | — | contorno | — | **marcado:** fundo `pine-100`, borda verde, ✓ com quique, texto riscado. Link da Amazon abaixo do item, com cara de link |
| Passos | `.steps` | número em círculo azul-noite com algarismo dourado + texto 19 px | — | — | — | o número é texto HTML |
| Aviso de segurança | `.callout--safety` | fundo `red-100`, borda vermelha, ícone de alerta, rótulo "SAFETY", texto em negrito | — | — | — | sempre visível, nunca recolhido; texto exato da ficha |
| Variação rápida | `.callout--variation` | fundo `pine-100`, borda verde, rótulo "QUICK VARIATION" | — | — | — | só nas ideias 6 e 26 |
| Elf note | `.note` | cartão dourado-claro inclinado 1,2°, "fita" no topo, elfo espiando | — | — | — | não aparece quando `elfNote` é nulo |
| Botão Pin | `.pin-btn` | pílula vermelha sobre a ilustração, canto de cima à direita | `red-700` | anel duplo (visível sobre qualquer imagem) | desce 3 px | ícone de alfinete genérico — **não** o logo do Pinterest |
| Aviso de ilustração | `.art__note` | 13 px, centralizado, sob a ilustração | — | — | — | texto exato: "Illustrated guide — scenes are original illustrations, not photos." |
| Aviso de afiliado | `.disclosure` | 15 px, logo abaixo dos links/botão do kit | — | — | — | texto exato; repete no rodapé |
| Captura de e-mail | `.signup` | **estado "coming soon":** selo, título, campo e botão **desabilitados**, e a frase "Sign-ups aren’t open yet. This form is switched off: nothing you type is saved or sent." | — | — | — | nunca mostra sucesso; nada é enviado nem guardado |
| Cabeçalho | `.site-header` | fixo no topo, marca (rosto do elfo + nome) e 4 links | fundo no link | contorno | — | no celular os links ficam numa segunda linha, a 1 toque |
| Rodapé | `.site-footer` | `night-800`; links, aviso de afiliado, aviso de ilustração, aviso de não-filiação, operadora | dourado | contorno dourado | — | — |
| Estado vazio | (padrão) | `elf-sleep.svg` + uma frase + um botão para limpar filtros | — | — | — | para a grade `/ideas/` sem resultado. O Tonight Mode **nunca** fica vazio |

**Micro-interações** (durações e curvas nos tokens; tudo vira instantâneo com `prefers-reduced-motion`)

| Onde | O que acontece | Token |
|---|---|---|
| Botões | afundam 3 px e perdem a sombra ao toque — sensação de botão físico | `--duration-instant`, `--press` |
| Cartões e hubs | sobem 3 px no hover/foco | `--duration-fast`, `--lift` |
| Marca do cabeçalho | o rosto do elfo inclina 6° no hover (o sino "balança") | `--duration-base`, `--ease-bounce`, `--wiggle` |
| Tonight Mode | os 3 cartões caem em sequência, com um leve quique | `--duration-slow`, `--stagger` |
| Checklist | o ✓ cresce com quique | `--duration-base`, `--ease-bounce` |
| Chips | troca de cor suave ao selecionar | `--duration-fast` |

**Para o Desenvolvedor:** os previews usam alguns `style=""` embutidos só para espaçamento e um `<script>` embutido para o protótipo. No site, isso vira CSS Module e componente.

---

## 10. O que eu verifiquei com os olhos (e o que não)

Abri tudo no navegador embutido, servido por um servidor local de arquivos (abrir o `.html` direto como arquivo mostrava a página sem as imagens, nessa ferramenta).

**Vi renderizado:**
- As **60 cenas no formato quadrado**, uma a uma em tamanho de miniatura, e as 60 no horizontal; as 30 primeiras no vertical, em miniatura bem pequena. Depois dos ajustes, revi as 60 horizontais de novo.
- A folha-mestre e os 6 mascotes, sobre fundo claro e escuro.
- `home.html` e `idea.html` em **375 px** (celular) e em **1280 px** (desktop), página inteira. Sem rolagem horizontal (largura do conteúdo = largura da tela), nenhuma imagem quebrada.
- O Tonight Mode funcionando: contagens 31 / 24 / 12 / 60 e 25 (só "Only stuff I have") batem com os dados; 5 sorteios seguidos com os três critérios mostraram as 12 ideias sem repetir nenhuma.
- As 3 variantes do pin, e uma delas em 1000×1500 real.
- Um JPEG gerado pelo `prebuild.ts` a partir de um placeholder (ficou igual ao SVG).

**Corrigi depois de ver:** cenas pequenas demais no quadro (aumentei o palco nos 3 formatos); objetos cortados na base do formato horizontal; elfo "flutuando" ao lado da árvore na ficha 34 (agora está no chão, meio escondido atrás dela); pote da ficha 51 que não parecia cheio; casinhas cortadas na 47; grão de papel forte demais (parecia neve); botas pouco visíveis na 13; sobreposição na folha-mestre; rótulo "Quick filters" em cima dos chips no celular; estrelinhas em cima do título; ideias relacionadas desalinhadas no celular.

**Não verifiquei:**
- As 30 últimas no **vertical** em miniatura (vi essas ideias só no quadrado e no horizontal; o enquadramento é o mesmo palco, mas não olhei arquivo por arquivo).
- Cada cena em **tamanho cheio**: olhei em miniatura e abri poucas em tamanho real. Pode haver sobreposição pequena de props que não notei.
- **Fontes finais:** o preview usa a fonte de reserva; não vi Fredoka/Nunito aplicadas.
- **Navegadores e aparelhos reais:** só o navegador embutido (motor Chromium). Não testei Safari no iPhone, nem leitor de tela, nem navegação só por teclado na prática (os estilos de foco existem; não percorri as páginas com Tab).
- **Larguras intermediárias** (tablet, ~768 px).
- **`npm run build` completo:** rodei só o `scripts/prebuild.ts` (conversão para JPEG passou) e o `eslint` do repositório inteiro (passou). Não rodei o build do Next.

### Como abrir os previews

- Com o servidor local: na pasta do projeto, `python3 -m http.server 4319` e abrir `http://localhost:4319/design/preview/home.html` (e `idea.html`, `placeholders.html`, `../pin-template/index.html`).
- Dando dois cliques no arquivo também deve funcionar num navegador comum (os caminhos são relativos e não há pedido de rede); não foi assim que eu testei.

---

## 11. Pontos em aberto para o PM

| # | Ponto | Minha proposta | Decide |
|---|---|---|---|
| 1 | **22 tons derivados** (seção 3). Os dois mais sensíveis: pele (`wood-200`) e azul do banheiro (`night-200`). | Aprovar como estão. Trocar um tom é mudar um hex no `tokens.css` e rodar o gerador. | **André** (Portão 2) |
| 2 | **Fundo × cômodo.** Ficha 20 pede fundo azul-claro mas o cômodo é sala; ficha 25 pede fundo de quarto mas o cômodo é "casa toda". | Nos placeholders o fundo segue o campo `room`. Na arte final, seguir o brief da ficha. | PM |
| 3 | **Fantasias sobre a roupa fixa.** Fichas 43 (capacete de papel), 54 (touca de banho), 58 (chapéu gigante e lenço arrastando), 56 (cachecol grande). A bíblia diz "roupa sempre igual". | Permitir como **prop solto por cima** da roupa fixa, nunca no lugar dela. Nos placeholders só a 56 tem (é material da ficha). | **André** |
| 4 | **Cenas que o brief descreve com texto ou número dentro da imagem** (9 elos contados, 14 "BRUSH!", 23 biscoitos numerados, 57 ímãs de letra, e as placas/cartões). | Tudo em branco na imagem; o texto entra na página. Para a 57, peças coloridas sem letra. Para a 9, número de elos sem significado. | PM (aplicação de regra travada; só registrar) |
| 5 | **Tonight Mode:** (a) botões liga/desliga com sorteio imediato; (b) abrir com os três ligados e 3 ideias na tela; (c) "noite" vira às 4h; (d) redação da frase de reserva montada com o nome dos critérios. | Aprovar (a)–(c). (d) vai para o Marketing lapidar, mantendo a informação de qual critério foi solto. | **André** |
| 6 | **Ordem no celular da página de ideia.** O template lista a ilustração antes do H1. No preview, no celular, vêm **título e barra de fatos primeiro**, depois a ilustração (ela tem 2:3 e empurraria o título para fora da primeira tela). No desktop ficam lado a lado. | Aprovar a ordem do preview. | **André** |
| 7 | **Rótulo do critério.** O botão diz `Only stuff I have` (prompt); o filtro da grade diz `Only stuff you have` (rótulo dos dados). | Manter os dois: um é a fala do pai, o outro é o nome do filtro. | PM |
| 8 | **Botão do kit** aparece no preview para mostrar o desenho; no site ele só existe quando houver Idea List (D10). O aviso de afiliado fica logo abaixo dos links. | Só registrar. | — |
| 9 | **Textos do rodapé.** Usei: aviso exato da Amazon; aviso de ilustração; "This site is independent. It is not affiliated with, endorsed by or sponsored by any elf brand or trademark owner."; "Site operator: Vanessa Tatiane Evangelista Assink." | O PM confere a redação do aviso de não-filiação e da linha da operadora. | PM |
| 10 | **Perfil e costas do elfo** não entregues (o PDF pede frontal, perfil e costas). | Fazer junto com o primeiro lote de arte final, a partir da folha-mestre. | PM |
| 11 | **Mascotes da interface** estão em `design/mascot/` (fonte). O site precisa deles numa pasta pública ou embutidos. | Eng. de Soluções define o caminho; o Desenvolvedor copia. Se for pasta pública, sugiro acrescentar ao gerador uma linha para gravar lá também. | Eng. de Soluções |
| 12 | **Alt text.** `design/illustration-alt.json` tem o alt das 60 cenas e da imagem do site. Hoje o resolver monta um alt genérico pelo título. | O Desenvolvedor passa essas frases como `description` para `illustrationAlt()`. O Marketing revisa a redação na Fase 4. | PM |
| 13 | **Nome do site.** "Daily Elf Magic" aparece em um lugar por preview (cabeçalho) e na marca do pin. | Trocar em um lugar quando o nome final existir. | André |
| 14 | **Etiquetas pendentes nos previews.** A home mostra chips "Only stuff you have" e "Funny" e o hub "Funny" só para mostrar a **aparência** dos filtros; há um aviso no topo de cada preview. | Não é aprovação das etiquetas. | — |
| 15 | **`.claude/launch.json`** criado por mim para ver os previews. | Manter (útil para o QA) ou apagar. | PM |
| 16 | **"Parent favorites" e "Idea of the day" no preview** usam ideias de exemplo (13, 6, 11, 26 e a 21). | A seleção editorial é do Marketing/PM; a regra da ideia do dia é do Desenvolvedor. Nenhum número ou ranking aparece. | PM |
| 17 | **Título da ficha 49** ("Mad Libs", ponto 4.4 do handoff 02). Meu alt text não usa o termo, mas o slug e o título do pin usam. | Se o André trocar o título, basta rodar o gerador de novo (o pin lê do `ideas.json`). A pasta da ilustração acompanha o slug. | André |
| 18 | **O que não verifiquei** (seção 10): verticais 31–60 em miniatura, cenas em tamanho cheio, fontes finais, Safari/iPhone, teclado e leitor de tela, build completo do Next. | QA cobre na Fase 5; eu reviso o visual na Fase 3, como previsto. | PM |
