import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { SABORES, CATEGORIAS, ROTA, WHATSAPP } from "../../docs/dados.js";

// Relógio fixo: terça, 27/10/2026 10h. Assim a lista de datas é previsível.
const AGORA = new Date("2026-10-27T10:00:00-03:00");

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(AGORA);
  // Captura o window.open do botão de WhatsApp em vez de abrir aba.
  await page.addInitScript(() => {
    window.__aberto = [];
    window.open = (url) => { window.__aberto.push(String(url)); return null; };
  });
});

const erros = page => {
  const lista = [];
  page.on("pageerror", e => lista.push(e.message));
  page.on("console", m => { if (m.type() === "error") lista.push(m.text()); });
  return lista;
};

const card = (page, id) => page.locator(`.card[data-id="${id}"]`);
const mais = (page, id) => card(page, id).getByRole("button", { name: /^Pôr um/ });
const menos = (page, id) => card(page, id).getByRole("button", { name: /^Tirar um/ });

test("carrega sem erro no console e mostra o aviso de demonstração", async ({ page }) => {
  const e = erros(page);
  await page.goto("/");
  await expect(page.locator(".demo")).toContainText("demonstração");
  await expect(page.locator(".demo")).toContainText("simulados");
  await expect(page.locator(".card")).toHaveCount(SABORES.length);
  expect(e).toEqual([]);
});

test("todas as imagens carregam", async ({ page }) => {
  await page.goto("/");
  // as fotos são lazy: rola até o fim pra forçar o carregamento
  for (let y = 0; y < 30; y++) await page.mouse.wheel(0, 1200);
  await page.waitForLoadState("networkidle");
  const quebradas = await page.$$eval("img", imgs =>
    imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute("src")));
  expect(quebradas).toEqual([]);
});

test("filtros mostram só a categoria escolhida", async ({ page }) => {
  await page.goto("/");
  for (const c of CATEGORIAS) {
    await page.getByRole("button", { name: c.nome, exact: true }).click();
    await expect(page.getByRole("button", { name: c.nome, exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".card")).toHaveCount(SABORES.filter(s => s.cat === c.id).length);
  }
  await page.getByRole("button", { name: "Todos", exact: true }).click();
  await expect(page.locator(".card")).toHaveCount(SABORES.length);
});

test("faixa de Natal abre o cardápio filtrado em Natal", async ({ page }) => {
  await page.goto("/");
  await page.locator(".temporada").click();
  await expect(page.getByRole("button", { name: "Natal", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".card")).toHaveCount(SABORES.filter(s => s.cat === "natal").length);
  await expect(page.locator("#cardapio")).toBeInViewport();
});

test("pôr e tirar atualiza card, barra, resumo e total", async ({ page }) => {
  await page.goto("/");
  const [a, b] = SABORES;
  await expect(page.locator("#barra")).not.toHaveClass(/ver/);
  await expect(menos(page, a.id)).toBeDisabled();

  await mais(page, a.id).click();
  await mais(page, a.id).click();
  await mais(page, b.id).click();
  await expect(card(page, a.id).locator("output")).toHaveText("2");
  await expect(card(page, a.id)).toHaveClass(/tem/);
  await expect(page.locator("#barra")).toHaveClass(/ver/);
  await expect(page.locator("#barraItens")).toHaveText("3 pacotes");
  const total = (2 * a.preco + b.preco).toFixed(2).replace(".", ",");
  await expect(page.locator("#barraValor")).toContainText(total);
  await expect(page.locator("#totalValor")).toContainText(total);
  await expect(page.locator("#resumo li")).toHaveCount(2);
  await expect(page.locator("#aviso")).toContainText(b.nome);

  await menos(page, b.id).click();
  await expect(page.locator("#barraItens")).toHaveText("2 pacotes");
  await expect(page.locator("#resumo li")).toHaveCount(1);
});

test("quantidade não passa de 50 nem fica negativa", async ({ page }) => {
  await page.goto("/");
  const id = SABORES[0].id;
  for (let i = 0; i < 52; i++) {
    if (await mais(page, id).isDisabled()) break;
    await mais(page, id).click();
  }
  await expect(card(page, id).locator("output")).toHaveText("50");
  await expect(mais(page, id)).toBeDisabled();
});

test("dá pra mexer na quantidade e limpar direto no resumo", async ({ page }) => {
  await page.goto("/");
  const [a, b] = SABORES;
  await mais(page, a.id).click();
  await mais(page, b.id).click();
  const linha = page.locator(`#resumo li[data-id="${a.id}"]`);
  await linha.getByRole("button", { name: /^Pôr um/ }).click();
  await expect(linha.locator("output")).toHaveText("2");
  await expect(card(page, a.id).locator("output")).toHaveText("2");

  await page.getByRole("button", { name: "Limpar pedido" }).click();
  await expect(page.locator("#resumo .vazio")).toBeVisible();
  await expect(card(page, a.id).locator("output")).toHaveText("0");
  await expect(page.getByRole("button", { name: "Limpar pedido" })).toBeHidden();
});

test("pedido continua lá depois de recarregar a página", async ({ page }) => {
  await page.goto("/");
  const id = SABORES[3].id;
  await mais(page, id).click();
  await page.reload();
  await expect(card(page, id).locator("output")).toHaveText("1");
  await expect(page.locator("#barraItens")).toHaveText("1 pacote");
});

test("carrinho salvo com sabor que saiu do cardápio não quebra o site", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("bolachas-carrinho", JSON.stringify({ "nao-existe": 3, "broa-de-leite": 1 })));
  const e = erros(page);
  await page.goto("/");
  await expect(page.locator("#barraItens")).toHaveText("1 pacote");
  expect(e).toEqual([]);
});

test("datas do pedido: só dias de rota, com 1 dia de antecedência", async ({ page }) => {
  await page.goto("/");
  const opcoes = await page.locator("#quando option").allTextContents();
  expect(opcoes[0]).toBe("Escolha uma data");
  expect(opcoes[1]).toContain("quinta, 29/10"); // terça 27 não entra
  expect(opcoes.at(-1)).toContain("combinar");
  const nomes = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const permitidos = ROTA.map(r => nomes[r.dia]);
  for (const o of opcoes.slice(1, -1)) expect(permitidos).toContain(o.split(",")[0]);
});

test("rota da semana aparece marcada como exemplo", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#rota .exemplo")).toBeVisible();
  await expect(page.locator(".dia")).toHaveCount(ROTA.length);
  await expect(page.locator("#rota")).toContainText("Itacorubi");
});

test("enviar sem pacote ou sem data mostra o erro e não abre o WhatsApp", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Enviar pelo WhatsApp" }).click();
  await expect(page.locator("#erro")).toContainText("pelo menos um pacote");
  await mais(page, SABORES[0].id).click();
  await page.getByRole("button", { name: "Enviar pelo WhatsApp" }).click();
  await expect(page.locator("#erro")).toContainText("dia");
  await expect(page.locator("#quando")).toBeFocused();
  expect(await page.evaluate(() => window.__aberto.length)).toBe(0);
});

test("enviar abre o WhatsApp dela com a mensagem completa e lembra o nome", async ({ page }) => {
  await page.goto("/");
  const s = SABORES.find(x => x.id === "nata");
  await mais(page, s.id).click();
  await mais(page, s.id).click();
  await page.getByLabel("Seu nome").fill("Ana");
  await page.getByLabel("Dia e região").selectOption({ index: 1 });
  await page.getByLabel("Bairro", { exact: true }).fill("Itacorubi");
  await page.getByLabel(/Observação/).fill("Sem pressa");
  await page.getByRole("button", { name: "Enviar pelo WhatsApp" }).click();

  const [url] = await page.evaluate(() => window.__aberto);
  expect(url.startsWith(`https://wa.me/${WHATSAPP}?text=`)).toBe(true);
  const msg = decodeURIComponent(new URL(url).searchParams.get("text"));
  expect(msg).toContain("[TESTE");
  expect(msg).toContain("2× Nata");
  expect(msg).toContain("(2 pacotes)");
  expect(msg).toContain("Quando: quinta, 29/10");
  expect(msg).toContain("Nome: Ana");
  expect(msg).toContain("Bairro: Itacorubi");
  expect(msg).toContain("Obs.: Sem pressa");

  await page.reload();
  await expect(page.getByLabel("Seu nome")).toHaveValue("Ana");
});

test("links de contato apontam pro WhatsApp e Instagram dela", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#zapRodape")).toHaveAttribute("href", `https://wa.me/${WHATSAPP}`);
  await expect(page.locator("#zapRota")).toHaveAttribute("href", new RegExp(`^https://wa.me/${WHATSAPP}\\?text=`));
  await expect(page.locator("#insta")).toHaveAttribute("href", "https://www.instagram.com/bolachascristiane/");
});

test("barra do pedido some quando o formulário está na tela", async ({ page }) => {
  await page.goto("/");
  await mais(page, SABORES[0].id).click();
  await expect(page.locator("#barra")).toBeVisible();
  await page.locator("#pedido").scrollIntoViewIfNeeded();
  await page.locator("#form").scrollIntoViewIfNeeded();
  await expect(page.locator("#barra")).toBeHidden();
});

test("dá pra montar o pedido só com o teclado", async ({ page }, info) => {
  test.skip(info.project.name.startsWith("celular"), "teclado não se aplica ao celular");
  await page.goto("/");
  const alvo = mais(page, SABORES[0].id);
  for (let i = 0; i < 80 && !(await alvo.evaluate(el => el === document.activeElement)); i++) {
    await page.keyboard.press("Tab");
  }
  await expect(alvo).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(card(page, SABORES[0].id).locator("output")).toHaveText("1");
  // foco visível
  const outline = await alvo.evaluate(el => getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe("none");
});

for (const largura of [320, 375, 768, 1440]) {
  test(`sem rolagem horizontal em ${largura}px`, async ({ page }) => {
    await page.setViewportSize({ width: largura, height: 800 });
    await page.goto("/");
    const larg = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(larg).toBeLessThanOrEqual(largura);
  });
}

test("botões de toque têm pelo menos 30px", async ({ page }) => {
  await page.goto("/");
  const pequenos = await page.$$eval(".qtd button, .filtro, .btn", els =>
    els.filter(e => e.offsetParent).map(e => e.getBoundingClientRect())
      .filter(r => r.width < 30 || r.height < 30).length);
  expect(pequenos).toBe(0);
});

test("acessibilidade: nenhum problema sério ou crítico no axe", async ({ page }) => {
  await page.goto("/");
  await mais(page, SABORES[0].id).click(); // com resumo e barra preenchidos
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  const graves = r.violations.filter(v => ["serious", "critical"].includes(v.impact))
    .map(v => `${v.id}: ${v.nodes.slice(0, 3).map(n => n.target.join(" ")).join(" | ")}`);
  expect(graves).toEqual([]);
});

test("SEO básico: título, descrição, idioma e noindex enquanto for demo", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Bolachas Cristiane/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{50,}/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("h1")).toHaveCount(1);
});
