"""Recorta as fotos dos cartões do Instagram (referencia/) e gera os .webp do site.

Rodar da raiz do repo: python3 -I ferramentas/preparar-fotos.py
Os cartões de sabor têm a foto em cima e o texto embaixo; o recorte pega só a foto.
"""
from pathlib import Path
from PIL import Image

REF = Path("referencia")
OUT = Path("docs/img")
OUT.mkdir(parents=True, exist_ok=True)

# (saída, arquivo de origem, caixa relativa x0, y0, x1, y1)
CARTAO = (0.04, 0.0, 0.96, 0.52)
FOTOS = [
    ("broa-de-leite", "posts/2026-01-27_DT_k0WjjexZ_01.jpg", CARTAO),
    ("rosca-de-leite", "posts/2026-02-10_DUj2pYpDdii_01.jpg", CARTAO),
    ("amanteigado", "posts/2026-01-27_DT_lEBQDU35_01.jpg", CARTAO),
    ("coco", "posts/2026-01-27_DT_lPwzjeUu_01.jpg", CARTAO),
    ("amendoim", "posts/2026-01-28_DUDgwVUjY49_01.jpg", CARTAO),
    ("casado-de-amendoim", "posts/2026-01-28_DUEZJjREpye_01.jpg", CARTAO),
    ("fuba", "posts/2026-01-31_DUML0zJEktX_01.jpg", CARTAO),
    ("palito-de-queijo", "posts/2026-01-31_DUMLxs_Er1Y_01.jpg", CARTAO),
    ("casado-de-doce-de-leite", "posts/2026-02-10_DUj0D4fjS79_01.jpg", CARTAO),
    ("casado-de-goiaba", "posts/2026-02-10_DUj0Gtxjfol_01.jpg", CARTAO),
    ("natal", "posts/2026-02-11_DUn3jeyESSr_01.jpg", CARTAO),
    ("olho", "posts/2026-02-11_DUn4O4hEd0N_01.jpg", CARTAO),
    ("broa-de-leite-condensado", "posts/2026-02-11_DUnnVckkTie_01.jpg", CARTAO),
    ("rosca-de-leite-condensado", "posts/2026-02-11_DUnnWmvEW82_01.jpg", CARTAO),
    ("palito-de-maisena", "posts/2026-02-11_DUnpbDUEah4_01.jpg", CARTAO),
    ("araruta", "posts/2026-02-11_DUoH_grEWfl_01.jpg", CARTAO),
    ("nata", "posts/2026-02-11_DUovvwtDbp9_01.jpg", CARTAO),
    ("cocadinha", "posts/2026-08-27_Dci1B0lxfZ__01.jpg", (0.0, 0.12, 1.0, 0.85)),
    ("tentacao", "posts/2026-06-05_DZOQYIitG4C_01.jpg", (0.0, 0.0, 1.0, 1.0)),
    ("integral-castanha", "posts/2026-04-27_DXoamChDjHS_01.jpg", (0.0, 0.40, 0.5, 0.78)),
    ("integral-passas", "posts/2026-04-27_DXoamChDjHS_01.jpg", (0.5, 0.40, 1.0, 0.78)),
    ("integral-aveia-mel", "posts/2026-04-27_DXouPwsjXK3_01.jpg", (0.05, 0.38, 0.95, 0.92)),
    ("integral-sabores", "posts/2026-06-02_DZFZQdiRHje_01.jpg", (0.0, 0.62, 1.0, 1.0)),
    # Catálogo de Natal: um post com 4 fotos em grade 2×2 (o recorte deixa o rótulo de fora)
    ("natal-fino", "posts/2026-10-17_DemkCkhP2jQ_01.jpg", (0.02, 0.112, 0.49, 0.44)),
    ("natal-bola", "posts/2026-10-17_DemkCkhP2jQ_01.jpg", (0.51, 0.112, 0.98, 0.44)),
    ("natal-melado", "posts/2026-10-17_DemkCkhP2jQ_01.jpg", (0.02, 0.545, 0.49, 0.87)),
    ("natal-pinheiro", "posts/2026-10-17_DemkCkhP2jQ_01.jpg", (0.51, 0.545, 0.98, 0.87)),
]


def corta_43(im, caixa):
    w, h = im.size
    x0, y0, x1, y1 = (int(caixa[0] * w), int(caixa[1] * h), int(caixa[2] * w), int(caixa[3] * h))
    im = im.crop((x0, y0, x1, y1))
    w, h = im.size
    if w / h > 4 / 3:  # largo demais: corta as laterais
        nw = int(h * 4 / 3)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:  # alto demais: corta embaixo (o texto do cartão fica embaixo)
        nh = int(w * 3 / 4)
        top = 0 if caixa == CARTAO else (h - nh) // 2
        im = im.crop((0, top, w, top + nh))
    return im


for nome, origem, caixa in FOTOS:
    im = Image.open(REF / origem).convert("RGB")
    im = corta_43(im, caixa).resize((800, 600), Image.LANCZOS)
    im.save(OUT / f"{nome}.webp", quality=80)

# Destaque "Clientes": fotos de bolacha "na vida real". O recorte tira o @ de
# quem postou. A das lembrancinhas de bodas ficou de fora: o rótulo traz o nome do casal.
CLIENTES = [
    ("cliente-loja", "destaques/clientes/05.jpg", (0.10, 0.17, 0.89, 0.89)),
    ("cliente-recepcao", "destaques/clientes/09.jpg", (0.10, 0.17, 0.89, 0.70)),
    ("cliente-empresa", "destaques/clientes/11.jpg", (0.02, 0.0, 0.98, 0.39)),
]
for nome, origem, (x0, y0, x1, y1) in CLIENTES:
    im = Image.open(REF / origem).convert("RGB")
    w, h = im.size
    im = im.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))
    w, h = im.size
    nw = min(w, int(h * 4 / 5))  # retrato 4:5, centralizado
    nh = int(nw * 5 / 4)
    im = im.crop(((w - nw) // 2, (h - nh) // 2, (w - nw) // 2 + nw, (h - nh) // 2 + nh))
    im.resize((480, 600), Image.LANCZOS).save(OUT / f"{nome}.webp", quality=80)

Image.open(REF / "antigas/img01.jpg").convert("RGB").save(OUT / "logo.webp", quality=90)
print(len(FOTOS) + len(CLIENTES) + 1, "imagens em", OUT)
