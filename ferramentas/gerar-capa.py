"""Gera docs/img/capa.jpg (1200×630), a prévia do link no WhatsApp/Instagram/Facebook.

Rodar da raiz do repo: python3 -I ferramentas/gerar-capa.py
Usa só as fotos já prontas em docs/img (não precisa da pasta referencia/).
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

IMG = Path("docs/img")
W, H = 1200, 630
CREME, CAFE, CARAMELO, VERMELHO, PAPEL = "#fbf5ea", "#3a2416", "#8a5223", "#a3262a", "#fffdf8"
SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
SANS_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

capa = Image.new("RGB", (W, H), CREME)

# Lado direito: grade 2×2 de fotos (cada uma 4:3 recortada no quadrado).
FOTOS = ["rosca-de-leite", "cocadinha", "casado-de-goiaba", "natal-fino"]
LADO = H // 2
x0 = W - 2 * LADO
for i, nome in enumerate(FOTOS):
    f = Image.open(IMG / f"{nome}.webp").convert("RGB")
    m = (f.width - f.height) // 2
    f = f.crop((m, 0, m + f.height, f.height)).resize((LADO, LADO), Image.LANCZOS)
    capa.paste(f, (x0 + (i % 2) * LADO, (i // 2) * LADO))

d = ImageDraw.Draw(capa)
d.rectangle((x0 - 6, 0, x0, H), fill=CARAMELO)

# Logo redonda.
logo = Image.open(IMG / "logo.webp").convert("RGB").resize((132, 132), Image.LANCZOS)
masc = Image.new("L", logo.size, 0)
ImageDraw.Draw(masc).ellipse((0, 0, *logo.size), fill=255)
capa.paste(logo, (60, 58), masc)

d.text((60, 225), "Bolachas", font=ImageFont.truetype(SERIF, 64), fill=CAFE)
d.text((60, 297), "Cristiane", font=ImageFont.truetype(SERIF, 64), fill=CAFE)
d.text((62, 392), "Forno a lenha · desde 1979", font=ImageFont.truetype(SANS, 28), fill=CARAMELO)

# Botão "Peça pelo WhatsApp".
fb = ImageFont.truetype(SANS_B, 26)
txt = "Peça pelo WhatsApp"
tw = d.textlength(txt, font=fb)
d.rounded_rectangle((60, 470, 60 + tw + 56, 528), radius=29, fill=VERMELHO)
d.text((88, 483), txt, font=fb, fill=PAPEL)

capa.save(IMG / "capa.jpg", quality=84, optimize=True, progressive=True)
print(IMG / "capa.jpg", (IMG / "capa.jpg").stat().st_size // 1024, "KB")
