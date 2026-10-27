/* Configuração do site: é só aqui que se mexe em preço, sabor e rota.
   ATENÇÃO: site de demonstração. Preços, pesos e rota são SIMULADOS. */
export const DEMO = true;
export const WHATSAPP = "554899112975";             // o mesmo do link da bio (wa.me/554899112975)
export const INSTAGRAM = "bolachascristiane";
export const ENDERECO = "Rua Vereador Pedro Medeiros, 456 · Serraria, São José/SC";

// Categorias na ordem em que aparecem no cardápio.
export const CATEGORIAS = [
  { id: "tradicionais", nome: "Tradicionais" },
  { id: "recheadas",    nome: "Recheadas" },
  { id: "integrais",    nome: "Integrais" },
  { id: "especiais",    nome: "Especiais" }
];

// preco em reais, peso em gramas (valores simulados).
const T = { cat: "tradicionais", preco: 8, peso: 250 };
export const SABORES = [
  { ...T, id: "broa-de-leite", nome: "Broa de leite", tipo: "Leve, macia e derrete na boca",
    ing: "Trigo, açúcar, maisena, margarina, leite em pó, ovos, bicarbonato e baunilha." },
  { ...T, id: "rosca-de-leite", nome: "Rosca de leite", tipo: "Amanteigada e crocante",
    ing: "Trigo, açúcar, margarina, leite em pó, ovos, bicarbonato e baunilha." },
  { ...T, id: "rosca-de-leite-condensado", nome: "Rosca de leite condensado", tipo: "Crocante, derrete na boca",
    ing: "Maisena, leite condensado, margarina e bicarbonato de amônia." },
  { ...T, id: "broa-de-leite-condensado", nome: "Broa de leite condensado", tipo: "Crocante, derrete na boca",
    ing: "Maisena, leite condensado, margarina e bicarbonato de amônia." },
  { ...T, id: "nata", nome: "Nata", tipo: "Macia, derrete na boca",
    ing: "Trigo, maisena, margarina, açúcar, ovos, aroma de nata e bicarbonato de amônia." },
  { ...T, id: "araruta", nome: "Araruta", tipo: "Macia, derrete na boca",
    ing: "Trigo, maisena, polvilho, araruta, coco fresco, ovos, açúcar, margarina, açúcar baunilha e bicarbonato de amônia." },
  { ...T, id: "palito-de-maisena", nome: "Palito de maisena", tipo: "Crocante, derrete na boca",
    ing: "Maisena, trigo, açúcar, margarina, ovos, aroma de coco, açúcar baunilha e bicarbonato de amônia." },
  { ...T, id: "amanteigado", nome: "Amanteigado", tipo: "Amanteigada e crocante",
    ing: "Trigo, açúcar, margarina, ovos, bicarbonato e baunilha." },
  { ...T, id: "coco", nome: "Coco", tipo: "Amanteigada e crocante",
    ing: "Trigo, açúcar, margarina, ovos, coco fresco, aroma de coco, bicarbonato e baunilha." },
  { ...T, id: "fuba", nome: "Fubá", tipo: "Amanteigada e crocante",
    ing: "Trigo, fubá, margarina, açúcar, ovos, bicarbonato, açúcar baunilha e corante amarelo." },
  { ...T, id: "amendoim", nome: "Amendoim", tipo: "Amanteigada e crocante",
    ing: "Trigo, margarina, açúcar, amendoim torrado, maisena, ovos, sal amoníaco e baunilha." },
  { ...T, id: "natal", nome: "Natal", tipo: "Amanteigada e crocante",
    ing: "Trigo, margarina, ovos, açúcar, açúcar baunilha e bicarbonato de amônia." },
  { ...T, id: "palito-de-queijo", nome: "Palito de queijo", tipo: "Salgado e crocante", preco: 9,
    ing: "Trigo, margarina, ovos, queijo parmesão, leite, bicarbonato, sal, corante amarelo e aroma de queijo." },

  { cat: "recheadas", preco: 10, peso: 250, id: "casado-de-goiaba", nome: "Casado de goiaba", tipo: "Amanteigado e macio",
    ing: "Trigo, margarina, açúcar e bicarbonato de amônia. Recheio: doce de goiaba." },
  { cat: "recheadas", preco: 10, peso: 250, id: "casado-de-doce-de-leite", nome: "Casado de doce de leite", tipo: "Amanteigado e macio",
    ing: "Trigo, margarina, açúcar e bicarbonato de amônia. Recheio: doce de leite." },
  { cat: "recheadas", preco: 10, peso: 250, id: "casado-de-amendoim", nome: "Casado de amendoim", tipo: "Amanteigada e crocante",
    ing: "Trigo, margarina, açúcar, amendoim torrado, maisena, ovos, sal amoníaco e baunilha. Recheio: doce de leite cremoso e amendoim." },
  { cat: "recheadas", preco: 9, peso: 250, id: "olho", nome: "Olho de goiaba", tipo: "Amanteigado e crocante",
    ing: "Trigo, margarina, açúcar e bicarbonato de amônia. Cobertura: doce de goiaba." },

  { cat: "integrais", preco: 12, peso: 200, id: "integral-aveia-mel", nome: "Aveia e mel", tipo: "Integral, adoçada com mel",
    ing: "Aveia, farinha integral e mel." },
  { cat: "integrais", preco: 13, peso: 200, id: "integral-passas", nome: "Aveia, passas e mel", tipo: "Integral, doçura das passas",
    ing: "Aveia, farinha integral, uva-passa e mel." },
  { cat: "integrais", preco: 14, peso: 200, id: "integral-castanha", nome: "Aveia, castanha-do-pará e mel", tipo: "Integral e crocante",
    ing: "Aveia, farinha integral, castanha-do-pará e mel." },
  { cat: "integrais", preco: 14, peso: 200, id: "integral-nozes", foto: "integral-sabores", nome: "Aveia, nozes e mel", tipo: "Integral e crocante",
    ing: "Aveia, farinha integral, nozes e mel." },
  { cat: "integrais", preco: 14, peso: 200, id: "integral-cranberry", foto: "integral-sabores", nome: "Aveia, cranberry e mel", tipo: "Integral, levemente azedinha",
    ing: "Aveia, farinha integral, cranberry e mel." },

  { cat: "especiais", preco: 10, peso: 250, id: "cocadinha", nome: "Cocadinha", tipo: "5× mais coco",
    ing: "Coco fresco e açúcar: a primeira receita da casa." , selo: "A primeira" },
  { cat: "especiais", preco: 12, peso: 250, id: "tentacao", nome: "Tentação", tipo: "Leite condensado com chocolate",
    ing: "Bolacha de leite condensado mergulhada no chocolate meio amargo.", selo: "Queridinha" }
];

// Rota da semana (EXEMPLO). A Cristiane passa pelos bairros e combina o ponto
// pelo WhatsApp. dia: 0 = domingo ... 6 = sábado.
export const ROTA = [
  { dia: 2, bairros: ["Itacorubi", "Trindade", "Córrego Grande"], janela: "9h às 17h" },
  { dia: 4, bairros: ["Kobrasol", "Campinas", "Barreiros"],       janela: "9h às 17h" },
  { dia: 6, bairros: ["Serraria (retirada na fábrica)"],           janela: "8h às 12h" }
];

export const NOMES_DIA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
export const DIAS_A_FRENTE = 21;      // datas oferecidas no pedido
export const ANTECEDENCIA_H = 24;     // pedido com pelo menos 1 dia de antecedência

/* ---------- funções puras ---------- */

export const brl = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function totalDe(carrinho) {
  let itens = 0, valor = 0;
  for (const s of SABORES) {
    const q = carrinho[s.id] || 0;
    itens += q; valor += q * s.preco;
  }
  return { itens, valor };
}

// Próximas datas em que há rota, a partir de `agora` respeitando a antecedência.
export function proximasDatas(agora = new Date()) {
  const limite = new Date(agora.getTime() + ANTECEDENCIA_H * 3600e3);
  const out = [];
  for (let i = 0; i <= DIAS_A_FRENTE; i++) {
    const d = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + i);
    const fimDoDia = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59);
    const r = ROTA.find(x => x.dia === d.getDay());
    if (r && fimDoDia >= limite) out.push({ data: d, rota: r });
  }
  return out;
}

export function dataCurta(d) {
  return `${NOMES_DIA[d.getDay()]}, ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function mensagemPedido({ carrinho, nome, quando, bairro, obs }) {
  const linhas = [];
  if (DEMO) linhas.push("*[TESTE: site de demonstração, valores simulados]*", "");
  linhas.push(`Oi, Cristiane! Quero fazer uma encomenda 🍪`, "");
  for (const s of SABORES) {
    const q = carrinho[s.id] || 0;
    if (q) linhas.push(`• ${q}× ${s.nome} (${s.peso} g) · ${brl(q * s.preco)}`);
  }
  const t = totalDe(carrinho);
  linhas.push("", `*Total: ${brl(t.valor)}* (${t.itens} pacote${t.itens > 1 ? "s" : ""})`);
  if (quando) linhas.push(`Quando: ${quando}`);
  if (bairro) linhas.push(`Bairro: ${bairro}`);
  if (nome) linhas.push(`Nome: ${nome}`);
  if (obs) linhas.push(`Obs.: ${obs}`);
  return linhas.join("\n");
}
