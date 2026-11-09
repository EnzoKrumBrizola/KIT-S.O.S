/* Preços só para atendentes — Casa do Parafuso
   Precisa de precos.enc.js carregado ANTES deste arquivo.
   Os preços ficam criptografados (AES-GCM) e só abrem com a senha. */
(function () {
  "use strict";
  var ENC = window.PRECOS_ENC;
  if (!ENC) return;
  var SKEY = "cdpAtendente";

  function brl(n) { return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
  function unit(n) { return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 4 }); }
  function soma(itens) { return Math.round(itens.reduce(function (a, i) { return a + i.t; }, 0) * 100) / 100; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function b64(s) {
    var b = atob(s), a = new Uint8Array(b.length);
    for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i);
    return a;
  }
  async function decifrar(senha) {
    var raw = b64(ENC.d), salt = raw.slice(0, 16), iv = raw.slice(16, 28), ct = raw.slice(28);
    var km = await crypto.subtle.importKey("raw", new TextEncoder().encode(senha), "PBKDF2", false, ["deriveKey"]);
    var key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: salt, iterations: ENC.i, hash: "SHA-256" }, km, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    var pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, ct);
    return JSON.parse(new TextDecoder().decode(pt));
  }

  /* ---------- estilo ---------- */
  var css = document.createElement("style");
  css.textContent =
    ".klinha.at-tem{flex-wrap:wrap}" +
    ".at-det{flex:0 0 100%;margin-top:6px;padding:8px 10px;border-radius:8px;background:#fff4e5;border-left:4px solid var(--laranja,#E8850C);font-size:13.5px;color:var(--texto,#1E2B45)}" +
    ".at-det div{display:flex;justify-content:space-between;gap:12px;padding:2px 0}" +
    ".at-det div span:last-child{white-space:nowrap;font-weight:700}" +
    ".at-det .at-sub{border-top:1px dashed var(--laranja,#E8850C);margin-top:4px;padding-top:5px;color:var(--azul-esc,#08224F)}" +
    ".klinha.at-total{background:var(--azul-esc,#08224F)!important;color:#fff;border-radius:8px;border-bottom:0;margin-top:6px}" +
    ".klinha.at-total span{color:#fff!important}" +
    ".at-banner{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center;max-width:760px;margin:0 auto 22px;padding:12px 16px;border-radius:12px;background:var(--azul-esc,#08224F);color:#fff;font-weight:600;font-size:15px}" +
    ".at-banner button{font:inherit;font-size:14px;font-weight:700;cursor:pointer;border:2px solid #fff;background:transparent;color:#fff;border-radius:999px;padding:6px 16px;min-height:36px}" +
    ".at-banner button:hover{background:#fff;color:var(--azul-esc,#08224F)}" +
    ".at-link{background:none;border:0;color:#9fb3d9;font:inherit;font-size:13px;cursor:pointer;text-decoration:underline;padding:10px;margin-top:6px}" +
    ".at-link:hover{color:#fff}" +
    ".at-modal{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(5,14,31,.8)}" +
    ".at-modal.on{display:flex}" +
    ".at-box{position:relative;width:min(380px,100%);background:#fff;border-top:6px solid var(--laranja,#E8850C);border-radius:14px;padding:24px 22px 20px;box-shadow:0 24px 60px rgba(0,0,0,.45)}" +
    ".at-box h4{font-size:26px;margin-bottom:4px;color:var(--azul,#0E3A82)}" +
    ".at-box p{font-size:14.5px;color:#334155;margin-bottom:12px}" +
    ".at-box input{width:100%;padding:12px 14px;border:2px solid #cfd9ec;border-radius:8px;font:inherit;font-size:16px}" +
    ".at-box input:focus{border-color:var(--laranja,#E8850C);outline:0}" +
    ".at-err{min-height:20px;margin:8px 0 4px;color:#D64545;font-size:14px;font-weight:600}" +
    ".at-acts{display:flex;gap:10px}.at-acts .btn{flex:1}" +
    ".at-x{position:absolute;top:4px;right:4px;width:44px;height:44px;border:0;background:none;font-size:20px;color:#64748b;cursor:pointer;border-radius:50%}";
  document.head.appendChild(css);

  /* ---------- aplicar / remover preços ---------- */
  function limpar() {
    document.querySelectorAll(".at-det,.at-total,.at-banner").forEach(function (e) { e.remove(); });
    document.querySelectorAll(".klinha.at-tem").forEach(function (e) { e.classList.remove("at-tem"); });
  }

  function aplicar(dados) {
    limpar();
    ["k6", "k8", "kc"].forEach(function (id) {
      var box = document.getElementById("det-" + id);
      var linhas = dados[id];
      if (!box || !linhas) return;
      var lista = box.querySelector(".klista");
      var rows = lista ? lista.querySelectorAll(".klinha") : [];
      if (rows.length !== linhas.length) {
        console.warn("Preços do kit " + id + " não aplicados: a lista do site tem " + rows.length + " linhas e os preços têm " + linhas.length + ".");
        return;
      }
      rows.forEach(function (row, i) {
        var itens = linhas[i];
        var det = document.createElement("div");
        det.className = "at-det";
        det.innerHTML = itens.map(function (it) {
          return "<div><span>" + esc(it.d) + " — " + it.q + (it.un === "pacote" ? " pacote" : " un.") + " × " + unit(it.u) + "</span><span>" + brl(it.t) + "</span></div>";
        }).join("") + (itens.length > 1 ? "<div class='at-sub'><span>Subtotal desta linha</span><span>" + brl(soma(itens)) + "</span></div>" : "");
        row.classList.add("at-tem");
        row.appendChild(det);
      });
      var tot = document.createElement("div");
      tot.className = "klinha at-total";
      tot.innerHTML = "<span>Total das peças do kit</span><span>" + brl(soma(linhas.flat())) + "</span>";
      lista.appendChild(tot);
    });
    var wrap = document.querySelector("#conteudo .wrap");
    if (wrap) {
      var b = document.createElement("div");
      b.className = "at-banner";
      b.innerHTML = "<span><i class='fa-solid fa-lock-open'></i> Modo atendente: preços visíveis só neste navegador</span><button type='button'>Sair</button>";
      b.querySelector("button").onclick = sair;
      var ref = wrap.querySelector(".sub");
      wrap.insertBefore(b, ref ? ref.nextSibling : wrap.firstChild);
    }
  }

  function sair() {
    try { sessionStorage.removeItem(SKEY); } catch (e) {}
    limpar();
  }

  /* ---------- janela da senha ---------- */
  var modal = document.createElement("div");
  modal.className = "at-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "at-t");
  modal.innerHTML =
    "<div class='at-box'><button type='button' class='at-x' aria-label='Fechar'>&times;</button>" +
    "<h4 id='at-t'>Área do atendente</h4><p>Digite a senha para ver o preço de cada peça dos kits.</p>" +
    "<input type='password' id='at-senha' autocomplete='current-password' aria-label='Senha'>" +
    "<div class='at-err' id='at-err' role='alert'></div>" +
    "<div class='at-acts'><button type='button' class='btn btn-o' id='at-ok'>Entrar</button></div></div>";
  document.body.appendChild(modal);
  var inp = modal.querySelector("#at-senha"), err = modal.querySelector("#at-err"), ok = modal.querySelector("#at-ok");

  function abrir() { err.textContent = ""; inp.value = ""; modal.classList.add("on"); setTimeout(function () { inp.focus(); }, 30); }
  function fechar() { modal.classList.remove("on"); }
  modal.querySelector(".at-x").onclick = fechar;
  modal.addEventListener("click", function (e) { if (e.target === modal) fechar(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") fechar(); });
  inp.addEventListener("keydown", function (e) { if (e.key === "Enter") entrar(); });
  ok.onclick = entrar;

  async function entrar() {
    if (!window.crypto || !crypto.subtle) { err.textContent = "Abra o site pelo endereço com https para usar esta área."; return; }
    if (!inp.value) { err.textContent = "Digite a senha."; return; }
    ok.disabled = true; err.textContent = "Verificando...";
    try {
      var dados = await decifrar(inp.value);
      try { sessionStorage.setItem(SKEY, JSON.stringify(dados)); } catch (e) {}
      fechar();
      aplicar(dados);
      var alvo = document.getElementById("conteudo");
      if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      err.textContent = "Senha incorreta.";
      inp.select();
    }
    ok.disabled = false;
  }

  /* ---------- como o atendente chega até aqui ---------- */
  var rodape = document.querySelector("footer .wrap");
  if (rodape) {
    var l = document.createElement("button");
    l.type = "button"; l.className = "at-link"; l.textContent = "Área do atendente";
    l.onclick = abrir;
    rodape.appendChild(l);
  }
  function checaHash() { if (location.hash === "#atendente") { history.replaceState(null, "", location.pathname + location.search); abrir(); } }
  window.addEventListener("hashchange", checaHash);

  /* continua liberado ao recarregar, até fechar a aba */
  try {
    var salvo = sessionStorage.getItem(SKEY);
    if (salvo) aplicar(JSON.parse(salvo));
  } catch (e) {}
  checaHash();
})();
