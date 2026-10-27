import {
  SABORES, CATEGORIAS, ROTA, NOMES_DIA, WHATSAPP, INSTAGRAM, ENDERECO,
  brl, totalDe, proximasDatas, dataCurta, mensagemPedido
} from "./dados.js";

const $ = s => document.querySelector(s);
const CHAVE = "bolachas-carrinho";
const CHAVE_NOME = "bolachas-nome";

let carrinho = {};
try { carrinho = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch { carrinho = {}; }
for (const id of Object.keys(carrinho)) {
  if (!SABORES.some(s => s.id === id) || !(carrinho[id] > 0)) delete carrinho[id];
}
const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(carrinho)); } catch {} };

const zap = texto => `https://wa.me/${WHATSAPP}${texto ? "?text=" + encodeURIComponent(texto) : ""}`;

/* ---------- cardápio ---------- */
let filtro = "todos";

function desenhaFiltros() {
  const opcoes = [{ id: "todos", nome: "Todos" }, ...CATEGORIAS];
  $("#filtros").innerHTML = opcoes.map(c =>
    `<button class="filtro" type="button" data-cat="${c.id}" aria-pressed="${c.id === filtro}">${c.nome}</button>`).join("");
}

function card(s) {
  const q = carrinho[s.id] || 0;
  return `<article class="card${q ? " tem" : ""}" data-id="${s.id}">
    <div class="foto"><img src="img/${s.foto || s.id}.webp" alt="${s.nome}" loading="lazy" width="800" height="600">
      ${s.selo ? `<span class="tag">${s.selo}</span>` : ""}</div>
    <div class="corpo">
      <h3>${s.nome}</h3>
      <div class="tipo">${s.tipo}</div>
      <details><summary>Ingredientes</summary><p>${s.ing}</p></details>
      <div class="rodape">
        <div class="preco"><b>${brl(s.preco)}</b><small>pacote ${s.peso} g</small></div>
        <div class="qtd">
          <button type="button" data-d="-1" aria-label="Tirar um ${s.nome}" ${q ? "" : "disabled"}>−</button>
          <output aria-label="Quantidade de ${s.nome}">${q}</output>
          <button type="button" data-d="1" aria-label="Pôr um ${s.nome}">+</button>
        </div>
      </div>
    </div>
  </article>`;
}

function desenhaGrade() {
  const lista = SABORES.filter(s => filtro === "todos" || s.cat === filtro);
  $("#grade").innerHTML = lista.map(card).join("");
}

function atualizaCard(id) {
  const el = document.querySelector(`.card[data-id="${id}"]`);
  if (!el) return;
  const q = carrinho[id] || 0;
  el.classList.toggle("tem", q > 0);
  el.querySelector("output").textContent = q;
  el.querySelector('[data-d="-1"]').disabled = !q;
  el.querySelector('[data-d="1"]').disabled = q >= MAX;
}

function filtrar(cat) {
  filtro = cat;
  desenhaFiltros(); desenhaGrade();
}

$("#filtros").addEventListener("click", e => {
  const b = e.target.closest("[data-cat]");
  if (b) filtrar(b.dataset.cat);
});

// Atalhos (ex.: a faixa de Natal no topo) que abrem o cardápio já filtrado.
document.addEventListener("click", e => {
  const a = e.target.closest("[data-ir-cat]");
  if (a) filtrar(a.dataset.irCat);
});

const MAX = 50;
function muda(id, delta) {
  const q = Math.max(0, Math.min(MAX, (carrinho[id] || 0) + delta));
  if (q) carrinho[id] = q; else delete carrinho[id];
  salvar(); atualizaCard(id); atualizaTotais();
  const s = SABORES.find(x => x.id === id);
  $("#aviso").textContent = q ? `${q}× ${s.nome} no pedido` : `${s.nome} saiu do pedido`;
}

$("#grade").addEventListener("click", e => {
  const b = e.target.closest("[data-d]");
  if (b) muda(b.closest(".card").dataset.id, Number(b.dataset.d));
});

$("#resumo").addEventListener("click", e => {
  const b = e.target.closest("[data-d]");
  if (b) muda(b.closest("[data-id]").dataset.id, Number(b.dataset.d));
});

$("#limpar").addEventListener("click", () => {
  const ids = Object.keys(carrinho);
  carrinho = {};
  salvar(); ids.forEach(atualizaCard); atualizaTotais();
  $("#aviso").textContent = "Pedido limpo";
});

/* ---------- totais, barra e resumo ---------- */
function atualizaTotais() {
  const t = totalDe(carrinho);
  const pac = `${t.itens} pacote${t.itens === 1 ? "" : "s"}`;
  $("#barraValor").textContent = brl(t.valor);
  $("#barraItens").textContent = pac;
  $("#barra").classList.toggle("ver", t.itens > 0);
  $("#totalValor").textContent = brl(t.valor);
  const linhas = SABORES.filter(s => carrinho[s.id]).map(s => `<li data-id="${s.id}">
      <span class="item">${s.nome} <small>(${s.peso} g)</small></span>
      <span class="qtd">
        <button type="button" data-d="-1" aria-label="Tirar um ${s.nome}">−</button>
        <output>${carrinho[s.id]}</output>
        <button type="button" data-d="1" aria-label="Pôr um ${s.nome}" ${carrinho[s.id] >= MAX ? "disabled" : ""}>+</button>
      </span>
      <span class="val">${brl(carrinho[s.id] * s.preco)}</span></li>`);
  $("#limpar").hidden = !linhas.length;
  $("#resumo").innerHTML = linhas.length ? linhas.join("")
    : `<li class="vazio">Nenhum pacote ainda. <a href="#cardapio">&nbsp;Escolha no cardápio</a></li>`;
}

// A barra some quando o próprio formulário de pedido está na tela.
new IntersectionObserver(([e]) => {
  $("#barra").style.visibility = e.isIntersecting ? "hidden" : "";
}, { threshold: 0.15 }).observe($("#pedido"));

/* ---------- rota ---------- */
function desenhaRota() {
  $("#rotaGrid").innerHTML = ROTA.map(r => `<div class="dia">
    <div class="nome">Toda ${NOMES_DIA[r.dia]}${r.dia === 6 ? "" : "-feira"}</div>
    <h3>${r.bairros.length > 1 ? r.bairros[0] + " e região" : r.bairros[0].split(" (")[0]}</h3>
    <ul>${r.bairros.map(b => `<li>${b}</li>`).join("")}</ul>
    <div class="hora">${r.janela} · ponto combinado no WhatsApp</div>
  </div>`).join("").replace(/Toda sábado/g, "Todo sábado");

  const datas = proximasDatas();
  $("#quando").innerHTML = `<option value="">Escolha uma data</option>` +
    datas.map(({ data, rota }) => {
      const txt = `${dataCurta(data)} · ${rota.bairros.join(", ")}`;
      return `<option value="${txt}">${txt}</option>`;
    }).join("") + `<option value="Outro dia (combinar)">Outro dia ou bairro (combinar)</option>`;
}

/* ---------- pedido ---------- */
$("#form").addEventListener("submit", e => {
  e.preventDefault();
  const erro = $("#erro");
  const t = totalDe(carrinho);
  if (!t.itens) { erro.textContent = "Escolha pelo menos um pacote no cardápio."; return; }
  if (!$("#quando").value) { erro.textContent = "Escolha o dia em que quer receber."; $("#quando").focus(); return; }
  erro.textContent = "";
  const msg = mensagemPedido({
    carrinho, nome: $("#nome").value.trim(), quando: $("#quando").value,
    bairro: $("#bairro").value.trim(), obs: $("#obs").value.trim()
  });
  try { localStorage.setItem(CHAVE_NOME, $("#nome").value.trim()); } catch {}
  window.open(zap(msg), "_blank", "noopener");
});

/* ---------- início ---------- */
$("#zapRota").href = zap("Oi, Cristiane! Você passa pelo meu bairro?");
$("#zapRodape").href = zap();
$("#zapRodape").textContent = `WhatsApp (48) ${WHATSAPP.slice(4, 8)}-${WHATSAPP.slice(8)}`;
$("#insta").href = `https://www.instagram.com/${INSTAGRAM}/`;
$("#insta").textContent = `@${INSTAGRAM}`;
$("#endereco").textContent = ENDERECO;
$("[data-preco-min]").textContent = brl(Math.min(...SABORES.map(s => s.preco)));
$("[data-n-sabores]").textContent = SABORES.length;

try { $("#nome").value = localStorage.getItem(CHAVE_NOME) || ""; } catch {}

desenhaFiltros(); desenhaGrade(); desenhaRota(); atualizaTotais();
