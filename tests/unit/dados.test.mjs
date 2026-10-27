import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import {
  SABORES, CATEGORIAS, ROTA, WHATSAPP, DEMO, ANTECEDENCIA_H, DIAS_A_FRENTE,
  brl, totalDe, proximasDatas, dataCurta, mensagemPedido
} from "../../docs/dados.js";

const img = nome => new URL(`../../docs/img/${nome}.webp`, import.meta.url);

test("cada sabor tem id único, categoria válida, preço e foto", () => {
  const ids = new Set();
  const cats = new Set(CATEGORIAS.map(c => c.id));
  for (const s of SABORES) {
    assert.ok(!ids.has(s.id), `id repetido: ${s.id}`);
    ids.add(s.id);
    assert.ok(cats.has(s.cat), `${s.id}: categoria ${s.cat} não existe`);
    assert.ok(s.preco > 0 && s.peso > 0, `${s.id}: preço/peso inválido`);
    assert.ok(s.nome && s.tipo && s.ing, `${s.id}: falta nome, tipo ou ingredientes`);
    assert.ok(existsSync(img(s.foto || s.id)), `${s.id}: falta docs/img/${s.foto || s.id}.webp`);
  }
});

test("toda categoria tem pelo menos um sabor", () => {
  for (const c of CATEGORIAS) assert.ok(SABORES.some(s => s.cat === c.id), c.id);
});

test("rota usa dias da semana válidos e sem repetir", () => {
  const dias = ROTA.map(r => r.dia);
  assert.equal(new Set(dias).size, dias.length);
  for (const r of ROTA) {
    assert.ok(r.dia >= 0 && r.dia <= 6);
    assert.ok(r.bairros.length > 0 && r.janela);
  }
});

test("WhatsApp é só dígitos, com DDI 55 e DDD 48", () => {
  assert.match(WHATSAPP, /^5548\d{8,9}$/);
});

test("brl formata em reais", () => {
  assert.equal(brl(8).replace(/\s/g, " "), "R$ 8,00");
  assert.equal(brl(1234.5).replace(/\s/g, " "), "R$ 1.234,50");
});

test("totalDe soma pacotes e valor e ignora id desconhecido", () => {
  const [a, b] = SABORES;
  assert.deepEqual(totalDe({}), { itens: 0, valor: 0 });
  assert.deepEqual(totalDe({ [a.id]: 2, [b.id]: 1, inexistente: 9 }),
    { itens: 3, valor: 2 * a.preco + b.preco });
});

test("proximasDatas só traz dias de rota, dentro do prazo e com antecedência", () => {
  const agora = new Date(2026, 9, 27, 10, 0); // terça, 27/10/2026 10h
  const datas = proximasDatas(agora);
  assert.ok(datas.length > 0);
  const diasRota = new Set(ROTA.map(r => r.dia));
  const limite = agora.getTime() + ANTECEDENCIA_H * 3600e3;
  const fim = new Date(2026, 9, 27 + DIAS_A_FRENTE, 23, 59).getTime();
  for (const { data, rota } of datas) {
    assert.ok(diasRota.has(data.getDay()));
    assert.equal(rota.dia, data.getDay());
    assert.ok(new Date(data.getFullYear(), data.getMonth(), data.getDate(), 23, 59).getTime() >= limite);
    assert.ok(data.getTime() <= fim);
  }
  // terça de hoje não entra (precisa de 24 h); a primeira é a quinta 29/10
  assert.equal(dataCurta(datas[0].data), "quinta, 29/10");
});

test("proximasDatas atravessa virada de mês e de ano", () => {
  const datas = proximasDatas(new Date(2026, 11, 28, 9, 0));
  assert.ok(datas.some(d => d.data.getFullYear() === 2027));
});

test("mensagemPedido lista itens, total, plural e campos preenchidos", () => {
  const [a, b] = SABORES;
  const msg = mensagemPedido({ carrinho: { [a.id]: 2, [b.id]: 1 }, nome: "Ana", quando: "quinta, 29/10", bairro: "Itacorubi", obs: "" });
  if (DEMO) assert.ok(msg.startsWith("*[TESTE"), "demo precisa avisar na mensagem");
  assert.ok(msg.includes(`2× ${a.nome}`));
  assert.ok(msg.includes(`1× ${b.nome}`));
  assert.ok(msg.includes("(3 pacotes)"));
  assert.ok(msg.includes("Nome: Ana"));
  assert.ok(msg.includes("Bairro: Itacorubi"));
  assert.ok(!msg.includes("Obs.:"), "observação vazia não aparece");
});

test("mensagemPedido usa singular com 1 pacote", () => {
  const msg = mensagemPedido({ carrinho: { [SABORES[0].id]: 1 } });
  assert.ok(msg.includes("(1 pacote)"));
});
