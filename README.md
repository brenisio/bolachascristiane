# Bolachas Cristiane

Site de encomendas da Bolachas Cristiane (@bolachascristiane), bolacha caseira assada
em forno a lenha em Serraria, São José/SC.

> ⚠️ **Demonstração.** Este site é um protótipo para apresentar à Bolachas Cristiane.
> **Todos os preços e pesos são simulados** (base: R$ 8,00 o pacote de 250 g) e não
> são valores reais. Nenhum pedido feito aqui é atendido.

## Arquivos

| Caminho | O que é |
|---|---|
| `docs/` | O site (HTML/CSS/JS puro, sem build), servido pelo GitHub Pages |
| `docs/dados.js` | Sabores, preços, rota da semana e WhatsApp: é só aqui que se mexe |
| `docs/app.js` | Cardápio, carrinho e mensagem do pedido pro WhatsApp |
| `docs/img/` | Fotos recortadas dos cartões do Instagram |
| `ferramentas/preparar-fotos.py` | Gera `docs/img/` a partir de `referencia/` (fora do git) |

## Rodar localmente

```bash
python3 -m http.server 8790 --directory docs
```

O pedido não tem banco: o site monta a mensagem e abre o WhatsApp da Cristiane.
A rota da semana (bairros por dia) é um exemplo e está em `docs/dados.js`.

## Direitos

© 2026 brenisio. Todos os direitos reservados (ver `LICENSE`). O site tem marca d'água "DEMONSTRAÇÃO · brenisio" enquanto `DEMO` for demo; para tirar, apague o `<div class="marca-dagua">` do `index.html`.
