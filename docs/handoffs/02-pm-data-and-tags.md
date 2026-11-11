# 02 — Arquivo de dados e etiquetas (PM) · início da Fase 2

- **Data:** 10/11/2026
- **Autor:** Gerente de Projeto (PM)
- **Arquivo entregue:** `src/data/ideas.json` — fonte única da verdade para Designer e Desenvolvedor.
- **Status:** tradução pronta. **Etiquetas de Tipo e Material: PENDENTES de aprovação do André (Portão 2).** Ninguém constrói filtro, `/funny/` ou Tonight Mode em cima delas antes disso.

---

## 1. Portão 1 — aprovado em 10/11/2026, com condições

| Ponto | Decisão do André |
|---|---|
| Tradução | Uma tradução fiel de materiais, passos e avisos de segurança. Avisos exatos, sem paráfrase que enfraqueça. `ideas.json` é a fonte única. Não inventar conteúdo. |
| Etiquetas | Classificação completa entregue com os dados, para aprovação antes da Fase 3. Não construir sobre etiqueta não aprovada. |
| "Most-saved" | Seleção editorial com rótulo "Parent favorites". Nenhuma contagem falsa. |
| Elf notes ausentes | Bloco só onde o PDF tem texto. Marketing redige as que faltam na Fase 4, para aprovação. |
| Imprimíveis | Construir com o texto que existe. Marketing redige as 23 perguntas restantes de "would you rather" e a carta de despedida na Fase 4, para aprovação. |
| Imprimíveis sem provedor | Download livre no MVP, formulário em "coming soon" ao lado. Nunca sucesso falso. |
| Extras do template | Botão Pin e captura de e-mail na página da ideia. Frase de efeito vai para o Marketing. "Quick variation" só nas ideias 6 e 26. |
| Tonight Mode | Se os três critérios juntos derem menos de 3 ideias, tirar primeiro "Only stuff I have" e dizer isso na página (ex.: "No exact match tonight — here are quick, no-mess ideas"). Nunca resultado vazio. Nunca repetir a mesma ideia em noites seguidas havendo alternativa. |
| Paleta | Tons derivados só como tints/shades das 6 cores. Nenhum matiz novo. Tons finais aprovados no Portão 2. |
| PDF × decisões travadas | Ignorar AdSense, Mediavine e WordPress do PDF. Grafia "Illustrated" confirmada. |
| E-mail de contato | `arche.boost@gmail.com` como placeholder em `/contact/` e `/privacy/`. Pode mudar antes do Portão 5. |
| Repositório | GitHub, nome `elf-site`, público. |

---

## 2. O que o arquivo contém

60 ideias. Tempo, bagunça, idade e cômodo vêm do texto do PDF lido por script (não redigitados). O resto é tradução.

| Campo | Conteúdo | Aparece no site? |
|---|---|---|
| `id`, `slug`, `title`, `lot` | Número da ficha, slug em inglês, título do PDF, lote 1 ou 2 | Sim |
| `time` | `tag` (2, 5, 10, 15+), `minutes` (número exato ou nulo), `label` | Sim |
| `mess`, `age`, `room`, `roomLabel` | Valores do filtro; `roomLabel` é o rótulo da ficha ("Bedroom door") | Sim |
| `materials`, `steps` | Tradução fiel. 3 passos por ficha, como no PDF | Sim |
| `safety` | Avisos exatos das 16 fichas que têm aviso | Sim, sempre |
| `elfNote` | Texto em inglês do PDF, literal. `null` em 8 fichas | Sim, quando existe |
| `variation` | Só nas fichas 6 e 26 | Sim |
| `printable` | Imprimível do site de que a ideia depende (10 fichas) | Sim |
| `amazonItems` | Termos de busca na Amazon. Vazio = sem item e sem botão de kit | Sim, como link |
| `hubs` | Hubs em que a ideia entra, calculados pelas regras do PDF | Sim |
| `typeTags`, `materialTags` | **Propostos pelo PM — pendentes** | Só depois de aprovados |
| `illustrationBrief` | Brief de ilustração da ficha, traduzido | Não. Interno |
| `editorNotes` | Observações internas do PDF e do PM | Não. Interno |

### Verificações automáticas (todas passaram)

- 60 ideias, 60 slugs únicos, 3 passos em cada uma.
- Hubs: `/5-minute/` 31 · `/easy/` 42 · `/no-mess/` 35 · `/toddlers/` 40 (10 + 30) · `/kids/` 50 (20 + 30) · `/funny/` 16 · `/arrival/` 5 · `/goodbye/` 3. Batem com a matriz do PDF.
- Interativas 14 · projetos 6 (43–47, 55) · chegada 31–35 · despedida 30, 59, 60.
- Avisos de segurança presentes nas 16 fichas listadas no handoff 01.
- Variação só em 6 e 26.
- Nenhuma palavra em português e nenhuma menção à marca registrada no conteúdo das ideias.

---

## 3. Correção ao handoff 01

**São 8 fichas sem elf note, não 7.** Faltou a **28 (Nice List Certificate)**: ela não tem cartão; o certificado é a mensagem. Lista correta: 6, 7, 16, 17, 20, 23, **28**, 30. O bloco não aparece nessas 8. Para a 28, o PM propõe não redigir nota nova. Decisão do André.

---

## 4. Decisões de tradução que precisam do seu ok

**4.1 Apartes editoriais tirados do texto exibido.** O PDF mistura, dentro de alguns passos, recados para a equipe do site. Foram tirados do passo e guardados em `editorNotes` (nada se perdeu):

| Ficha | Trecho tirado do passo |
|---|---|
| 14 | "avise isso na página, os pais agradecem" (o aviso de limpeza em si ficou) |
| 29 | o imprimível de 24 perguntas "alimenta o e-mail diário" |
| 31 | o espaço do nome fica em branco "para a camada de texto do site" |
| 33 | o texto da etiqueta entra "na camada de texto do site" |
| 42 | cortar fruta redonda ao meio é "regra da página" (o aviso ficou) |
| 53 | a limpeza de 5 minutos é "declarada na página" (o aviso ficou) |
| 55 | é também "a de maior potencial viral" (o aviso de 15+ minutos ficou) |

**4.2 Uma conversão de unidade acrescentada.** Ficha 45: o PDF diz "15 cm"; o site diz "about 15 cm / 6 in", por causa do público dos EUA.

**4.3 Sem marca de terceiros nos materiais.** "Biscoito de peixinho" virou "fish-shaped crackers"; "notas adesivas" virou "sticky notes".

**4.4 Marca registrada num título — precisa de decisão.** O título da ficha 49, "Elf Story **Mad Libs** Card", usa "Mad Libs", que é marca registrada de terceiros. O título foi mantido como está no PDF (títulos são travados), mas o risco é do mesmo tipo do "Elf on the Shelf" e iria para o H1, o slug, o meta title e o pin. Proposta do PM: trocar por "Elf Story Fill-in-the-Blanks Card". Só o André pode mudar um título.

**4.5 Divergências dentro do PDF.** Onde a tabela geral e a ficha citam itens de afiliado diferentes (18 e 27), vale a ficha.

---

## 5. Etiquetas propostas — PARA APROVAÇÃO

### 5.1 Tipo
- **Fixado pelo PDF:** chegada (31–35), despedida (30, 59, 60), projeto (43–47, 55), interativa (14 fichas).
- **Interativas — uma inferência:** o PDF diz 14 no total e nomeia as 9 do Lote 2 (48–52, 34, 37, 39, 59). As 5 do Lote 1 não são nomeadas; o PM usou 25–29, pelo título da página "Fichas 25-28 - Interativas" mais a 29.
- **Proposto pelo PM:** engraçada (16) e fofa (as 19 restantes).

**As 16 de `/funny/`:** 5, 8, 11, 12, 13, 14, 15, 16, 18, 19, 22, 53, 54, 55, 56, 58.

### 5.2 Material
O PDF só dá os 4 valores. Regra proposta (uma ideia pode ter mais de um valor; "Only stuff you have" e "Need to buy" nunca juntos):

- **Only stuff you have:** todos os materiais são itens comuns de casa ou de despensa; nada a comprar nem a imprimir.
- **Food:** a ideia usa comida.
- **Stationery:** papel, cartões, canetas, adesivos, imprimíveis.
- **Need to buy:** depende de um item específico que a maioria das casas não tem à mão (ex.: mini marshmallows, candy canes, pompons, ímãs de letras).

Contagem: Only stuff you have 25 · Food 22 · Stationery 22 · Need to buy 20.

Casos em que a decisão poderia ser outra: 1 (pipoca contada como item de despensa), 40 e 58 (carrinhos e roupinhas de boneca contados como coisa de casa com criança), 54 (espuma de banho e patinho contados como compra), 55 (papel de presente contado como coisa de casa em dezembro).

### 5.3 Efeito no Tonight Mode

| Critérios | Ideias |
|---|---|
| `5 minutes` | 31 |
| `5 minutes` + `No mess` | 24 |
| Os três juntos | **12** — fichas 1, 2, 3, 6, 8, 10, 15, 25, 36, 38, 41, 56 |

Com 12 ideias, o sorteio de 3 roda **4 noites** sem repetir nada; depois recomeça o ciclo, sem repetir em noites seguidas. A regra de reserva aprovada cobre o caso de sobrar menos de 3.

### 5.4 Ideias com um hub só
As fichas 7, 9, 40, 43, 44, 45, 47 entram em apenas 1 dos 8 hubs, e o template exige 2 links de hub. Proposta: o segundo link é um convite a outro hub, como no exemplo do próprio PDF ("Sem tempo? Veja 3 ideias de 5 minutos"), sem afirmar que a ideia pertence a ele.

### 5.5 Tabela completa

| # | Title | Type (proposed) | Material (proposed) | Materials |
|---|---|---|---|---|
| 1 | Movie Night Popcorn Patrol | Cute | Only stuff you have, Food | TV remote control; small bowl of popcorn; 1 small card |
| 2 | Storytime Reading Corner | Cute | Only stuff you have | a children's Christmas book; 2 stuffed animals; pillow |
| 3 | Shoe-Shoe Train | Cute | Only stuff you have | 3 to 4 family shoes in a row; small stuffed animals; jingle bells (optional) |
| 4 | Toothbrush Delivery Elf | Cute | Need to buy | new kids' toothbrush (ideally a themed one); small ribbon bow |
| 5 | Tangled in Christmas Lights | Funny | Need to buy | short string of battery-powered LED lights (never plugged into a wall outlet with the child nearby); card |
| 6 | Hiding in the Christmas Tree | Cute | Only stuff you have | just the elf and a sturdy tree branch |
| 7 | Letter to Santa Station | Cute | Only stuff you have, Stationery | paper; envelope; colored pencils; stickers; a small box as the “mailbox” |
| 8 | Trapped in a Jar | Funny | Only stuff you have | large clear glass or plastic jar, with the lid left open |
| 9 | Christmas Countdown Chain | Cute | Stationery | strips of red and green paper; glue or stapler (adult use only); marker |
| 10 | Sleeping in a Stocking | Cute | Only stuff you have | hanging Christmas stocking; cotton or a small handkerchief as a blanket |
| 11 | Flour Snow Angel | Funny | Only stuff you have, Food | 1 cup of flour (or powdered sugar); large shallow tray |
| 12 | Toilet Paper Tree Makeover | Funny | Only stuff you have | 1 roll of toilet paper; small bows (optional) |
| 13 | Marshmallow Bubble Bath | Funny | Food, Need to buy | 1 bag of mini marshmallows; a bowl or the clean sink; rubber duck (optional) |
| 14 | Toothpaste Mirror Message | Funny | Only stuff you have | toothpaste; bathroom mirror |
| 15 | Silly Banana Bunch | Funny | Only stuff you have, Food | bunch of bananas; regular pen or food-safe pen |
| 16 | Sink Fishing Trip | Funny | Food, Need to buy | small stick or pencil (the rod); string; paper clip (the hook); fish-shaped crackers; bowl with a little water or blue paper |
| 17 | Sticky Note Surprise Wall | Cute | Stationery | pad of colored sticky notes; marker |
| 18 | Elf Zipline Adventure | Funny | Food, Need to buy | long string or dental floss; 2 anchor points (doorknob and bookshelf); a candy cane as the hook |
| 19 | Sweet Spaghetti Breakfast | Funny | Food, Need to buy | a small plate of cooked spaghetti (leftovers are fine); syrup; colored sprinkles; marshmallows |
| 20 | Candy Cane Sled | Cute | Food, Need to buy | 4 candy canes; popsicle sticks or cardboard (base); hot glue (adult only) or tape; mini paper presents |
| 21 | Hot Cocoa Stand Helper | Cute | Food, Need to buy | small mug; hot chocolate mix; mini marshmallows; small paper sign |
| 22 | Cookie Baking Disaster | Funny | Only stuff you have, Food | a pinch of flour on the counter; rolling pin (a mini one or your own); cookie cutters; 2 ready-made cookies |
| 23 | Milk and Cookies Taste Test | Cute | Food, Stationery | 3 kinds of cookie; small cups of milk; paper score sheet with stars to color in |
| 24 | Gingerbread House Inspector | Cute | Food | the family's gingerbread house (or a large cookie); paper clipboard; mini pencil; toy magnifying glass |
| 25 | Kindness Mission Card | Interactive | Only stuff you have, Stationery | a card (printable from the site or handmade); envelope |
| 26 | Candy Cane Scavenger Hunt | Interactive | Food, Need to buy | 5 candy canes; card with the count |
| 27 | Build-a-Snowman Challenge | Interactive | Food, Need to buy | 3 large marshmallows; toothpicks; tiny sprinkles; a finished mini snowman as the “example” |
| 28 | Nice List Certificate | Interactive | Stationery | printable certificate (download from the site); gold ribbon; pen |
| 29 | Would You Rather Card | Interactive | Stationery | a card with a “would you rather?” question (printable from the site) |
| 30 | Farewell Letter and Photo | Goodbye | Stationery, Need to buy | farewell letter (template from the site); small picture frame; the favorite photo of the season |
| 31 | I'm Back! Arrival Banner | Arrival | Only stuff you have, Stationery | blank paper banner; markers; string; tape; 1 card |
| 32 | North Pole Arrival Breakfast | Arrival | Food, Need to buy | mini pancakes (ready-made or from a mix); strawberries; whipped cream; small plate; small paper sign |
| 33 | Special Delivery Arrival Box | Arrival | Stationery | small paper box; kraft paper; string; blank paper tag; cotton |
| 34 | Arrival Hide-and-Seek Clue Trail | Arrival, Interactive | Stationery | 4 handwritten clue cards; tape; 1 jingle bell at the final hiding spot |
| 35 | Snowy Footprints Arrival | Arrival | Only stuff you have, Food | 1 spoonful of flour or powdered sugar; a paper footprint stencil (or the sole of the elf's own foot); doormat |
| 36 | Toddler Peekaboo Blanket Fort | Cute | Only stuff you have | 1 light blanket; 2 low chairs or the sofa; 2 large stuffed animals |
| 37 | Pom-Pom Color Sorting Game | Interactive | Need to buy | large pom-poms (a size that is safe for the child's age, always with supervision); 3 small colored cups; tray |
| 38 | Breakfast Cereal Garland | Cute | Only stuff you have, Food | large ring-shaped cereal; cotton thread or short string; small bowl |
| 39 | My First Sticker Scene | Interactive | Stationery, Need to buy | large sheet of paper or poster board; large Christmas stickers (tree, star, present); thick marker |
| 40 | Toy Car Wash Station | Cute | Only stuff you have | basin with a little water; towel under everything; soft little brush; 2 large toy cars; dry cloth |
| 41 | Plush Friends Campout | Cute | Only stuff you have | a small cloth or mini blanket for each stuffed animal; 2-3 stuffed animals; a small flashlight, switched off, or a toy one |
| 42 | Fruit Face Breakfast Plate | Cute | Food | large plate; banana slices; strawberries; large blueberries cut in half (toddler safety); one small pancake |
| 43 | Elf Workshop Build Station | Project | Need to buy | wooden blocks or large building pieces; little toy tools; small paper sign; a half-built toy |
| 44 | Paper Snowflake Window Invasion | Project | Only stuff you have, Stationery | white sheets of paper; scissors (adult step); tape or string for hanging; 8-12 finished snowflakes |
| 45 | Mini Elf Door and Welcome Mat | Project | Stationery, Need to buy | cardboard or thin wood for the little door; paint or colored paper; glue; a little paper doormat; jingle bell |
| 46 | Cardboard Sleigh Build | Project | Stationery, Need to buy | medium cardboard box; red paper; tape or glue; 2 large decorative candy canes; cotton |
| 47 | Gingerbread Village Street | Project | Food, Need to buy | 3-4 mini gingerbread houses (kit or large cookies); icing; sprinkles; a cardboard base covered in white |
| 48 | Elf Photo Booth Props | Interactive | Stationery | sticks with a paper mustache, hat and antlers; cardboard frame; card |
| 49 | Elf Story Mad Libs Card | Interactive | Stationery | card with a mini story with 5 blanks; pencil; envelope |
| 50 | Elf Workout Challenge Cards | Interactive | Stationery | 3 challenge cards (jump 10 times, spin 3 times, balance on one foot); small mat or cushion |
| 51 | Guess How Many Jar | Interactive | Food | clear jar with a tightly closed lid; candies or marshmallows, counted (write down the number); guess slips; pencil |
| 52 | Draw My Outfit Contest | Interactive | Stationery | sheet with the elf outline to color (printable from the site); colored pencils; a half-finished example drawing |
| 53 | Flour Snowball Fight | Funny | Only stuff you have, Food | large high-rimmed tray; flour; cotton balls; 2 stuffed animals; a little spoon catapult |
| 54 | Bubble Bath Foam Mountain | Funny | Need to buy | sink or baby tub; bubble bath; towel on the floor; rubber duck; paper shower cap |
| 55 | Wrapping Paper Mayhem | Project, Funny | Only stuff you have, Stationery | 1 roll of wrapping paper; tape; bows; 3-4 living-room objects (cushion, remote, empty vase, book) |
| 56 | Elf in the Fridge Surprise | Funny | Only stuff you have | clean, dry little plate or container; a little paper or ribbon scarf; card |
| 57 | Fridge Magnet Message | Cute | Need to buy | colored letter magnets; clean fridge door; small card |
| 58 | Closet Fashion Show Elf | Funny | Only stuff you have | 3-4 doll clothes or stuffed-animal outfits; a paper runway or an open book; mini hangers or clothespins |
| 59 | Memory Jar - Last Week Goodbye | Goodbye, Interactive | Only stuff you have, Stationery | empty clear jar; 7 small blank cards; markers; instruction card |
| 60 | Goodbye Breakfast and Hug Coupon | Goodbye | Food, Stationery | set breakfast table; a paper hug coupon (printable coupon from the site); short see-you-soon letter; a heart-shaped cookie |
