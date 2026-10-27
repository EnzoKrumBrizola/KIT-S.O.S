#!/usr/bin/env python3
"""Uso: python aplicar_alteracoes.py index.html
Cria index_novo.html com: kit completo no topo (celular), selo e seção de REFIL,
aviso de refil nos cards, no quiz e no FAQ. O original não é alterado."""
import sys

src = sys.argv[1] if len(sys.argv) > 1 else "index.html"
h = open(src, encoding="utf-8").read()

def troca(antigo, novo, vezes=1):
    global h
    assert h.count(antigo) == vezes, f"Trecho não encontrado {vezes}x: {antigo[:60]!r} (achei {h.count(antigo)})"
    h = h.replace(antigo, novo)

CSS = """.chip2{position:absolute;right:14px;top:14px;background:#fff;color:var(--azul-esc);font-weight:800;border-radius:999px;padding:7px 14px;font-size:14px;box-shadow:0 6px 16px rgba(0,0,0,.3)}
.chip2 i{color:var(--laranja);margin-right:6px}
.hero-refil{display:flex;gap:10px;align-items:flex-start;background:rgba(232,133,12,.18);border:1px solid var(--laranja);border-radius:12px;padding:12px 14px;margin-bottom:22px;color:#fff;font-size:15.5px;max-width:54ch;line-height:1.4}
.hero-refil i{color:var(--laranja);margin-top:3px}
.refil{background:var(--azul-esc);color:#fff}
.refil h2{color:#fff;text-align:center}
.refil h2 span{color:var(--laranja)}
.refil .sub{color:#cfdcf5;text-align:center}
.rpassos{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:980px;margin:0 auto 30px}
.rpasso{background:#fff;color:var(--texto);border-radius:var(--raio);padding:22px;border-top:6px solid var(--laranja);text-align:center}
.rpasso .n{display:inline-grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--laranja);color:#fff;font:800 24px "Barlow Condensed",sans-serif;margin-bottom:8px}
.rpasso h3{font-size:22px;margin-bottom:6px}
.rpasso p{font-size:15px;color:#334155}
.refilnote{display:flex;gap:8px;align-items:center;justify-content:center;font-size:13.5px;font-weight:700;color:var(--azul-esc);background:#fff4e5;border:1px dashed var(--laranja);border-radius:10px;padding:8px 10px;margin-bottom:8px}
.refilnote i{color:var(--laranja)}
.qrefil{font-size:14px;font-weight:700;color:var(--azul-esc);background:#fff4e5;border:1px dashed var(--laranja);border-radius:10px;padding:8px 12px;max-width:420px;margin:12px auto 0}

/* CONFIANÇA */"""
troca("/* CONFIANÇA */", CSS)

troca(""".hero-img{order:0;padding:12px}
.hero-img img{aspect-ratio:auto;max-height:230px}""",
""".hero-img{order:-1;padding:10px}
.hero-img img{aspect-ratio:auto;max-height:190px}
.rpassos{grid-template-columns:1fr}
.chip,.chip2{font-size:12px;padding:5px 10px}""")

troca('<span class="chip"><i class="fa-solid fa-stopwatch"></i> Peça na mão em 10 s</span>',
'<span class="chip2"><i class="fa-solid fa-rotate"></i> Com refil</span>\n      <span class="chip"><i class="fa-solid fa-stopwatch"></i> Peça na mão em 10 s</span>')

troca('      <div class="cta">',
'      <p class="hero-refil"><i class="fa-solid fa-rotate"></i><span><b>Kit com refil:</b> acabou um tamanho de parafuso? É só chamar no WhatsApp e repomos. Você compra a maleta uma vez e ela não fica vazia.</span></p>\n      <div class="cta">')

SECAO = """<section id="refil" class="refil">
  <div class="wrap">
    <h2>Não é kit de usar e jogar fora. <span>É kit com refil.</span></h2>
    <p class="sub">Kit comum acaba e você volta à estaca zero. Aqui a maleta continua sendo sua: quando um tamanho acabar, a gente repõe e ela volta cheia.</p>
    <div class="rpassos">
      <div class="rpasso rv"><span class="n">1</span><h3>Use à vontade</h3><p>Cada peça tem o seu lugar na divisória. Abriu, pegou, continuou o serviço.</p></div>
      <div class="rpasso rv"><span class="n">2</span><h3>Acabou um tamanho?</h3><p>Mande mensagem no WhatsApp dizendo qual parafuso, porca ou arruela acabou.</p></div>
      <div class="rpasso rv"><span class="n">3</span><h3>A gente repõe</h3><p>Você recebe a reposição e deixa a maleta completa de novo, sem comprar outro kit.</p></div>
    </div>
    <div class="center"><a class="btn btn-v" href="https://wa.me/5541988725687?text=Quero%20saber%20sobre%20o%20refil%20do%20Kit%20S.O.S" target="_blank" rel="noopener" data-track="refil_whatsapp"><i class="fa-brands fa-whatsapp"></i> Falar sobre refil no WhatsApp</a></div>
  </div>
</section>

<!-- 2.1 O QUE É O KIT"""
troca("<!-- 2.1 O QUE É O KIT", SECAO)

troca('<a href="#o-kit">O que é o kit?</a>', '<a href="#o-kit">O que é o kit?</a>\n      <a href="#refil">Refil</a>')

troca('<a class="vermais btn-full"',
'<p class="refilnote"><i class="fa-solid fa-rotate"></i> Com refil: repomos o que acabar</p>\n      <a class="vermais btn-full"', 3)

troca("<small>no Pix, ou parcelado em até 6x no cartão</small>' +",
"<small>no Pix, ou parcelado em até 6x no cartão</small><p class=\"qrefil\"><i class=\"fa-solid fa-rotate\"></i> Acabou peça? Repomos o refil pelo WhatsApp.</p>' +")

troca("""<h4><i class="fa-solid fa-circle-question"></i> Posso comprar reposição quando acabar?</h4>
        <p>Pode. Quando um tamanho de parafuso ou porca acabar, é só mandar mensagem no nosso WhatsApp que vendemos a reposição para deixar a maleta cheia de novo.</p>""",
"""<h4><i class="fa-solid fa-circle-question"></i> O kit tem refil? Como funciona?</h4>
        <p>Tem. A maleta é sua para sempre: quando um tamanho de parafuso, porca ou arruela acabar, é só mandar mensagem no nosso WhatsApp que repomos, e ela volta a ficar cheia. Você não precisa comprar um kit novo.</p>""")

open("index_novo.html", "w", encoding="utf-8").write(h)
print("Pronto: index_novo.html criado.")
