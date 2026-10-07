/* ===== Fundo: grade de janelas de alumínio com um reflexo de luz deslizando no vidro ===== */
(function () {
  const cv = document.getElementById("fundo"), ctx = cv.getContext("2d");
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W, H, pw, ph, rgbT, rgbP, aT;

  function cores() {
    const cs = getComputedStyle(document.documentElement);
    rgbT = cs.getPropertyValue("--rgb-traco").trim(); rgbP = cs.getPropertyValue("--rgb-pulso").trim();
    aT = parseFloat(cs.getPropertyValue("--a-traco"));
  }
  function medir() {
    const dpr = Math.min(devicePixelRatio, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pw = Math.max(150, Math.min(W / 4, 240)); ph = pw * 1.4; // tamanho de cada janela
  }
  // Tipo de janela: 0 lisa, 1 com venezianas, 2 de duas folhas (repete a cada 2 linhas)
  const tipo = (i, j) => (i * 7 + (((j % 2) + 2) % 2) * 3) % 3;
  const cor = a => "rgba(" + rgbT + "," + a + ")";

  function desenhar(t) {
    ctx.clearRect(0, 0, W, H);
    const offY = reduz ? 0 : -((scrollY * 0.12) % (2 * ph)); // a grade sobe de leve com a rolagem
    const cols = Math.ceil(W / pw) + 1, rows = Math.ceil(H / ph) + 3, x0 = -(cols * pw - W) / 2;
    const vidros = [];
    for (let j = -1; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = x0 + i * pw, y = offY + j * ph, tp = tipo(i, j);
      ctx.fillStyle = cor(0.04); ctx.fillRect(x + 6, y + 6, pw - 12, ph - 12);
      ctx.lineWidth = 3; ctx.strokeStyle = cor(aT * 1.4); ctx.strokeRect(x, y, pw, ph); // perfil de alumínio
      ctx.lineWidth = 1.5; ctx.strokeStyle = cor(aT * 0.9);
      if (tp === 1) { // venezianas
        for (let yy = y + 24; yy < y + ph - 16; yy += 16) { ctx.beginPath(); ctx.moveTo(x + 14, yy); ctx.lineTo(x + pw - 14, yy); ctx.stroke(); }
      } else if (tp === 2) { // duas folhas com puxador
        ctx.beginPath(); ctx.moveTo(x + pw / 2, y + 6); ctx.lineTo(x + pw / 2, y + ph - 6); ctx.stroke();
        ctx.fillStyle = cor(aT * 1.6); ctx.fillRect(x + pw / 2 + 8, y + ph / 2 - 18, 5, 36);
      } else { ctx.strokeRect(x + 14, y + 14, pw - 28, ph - 28); }
      vidros.push([x + 6, y + 6, pw - 12, ph - 12]);
    }
    // reflexo de luz passando só sobre o vidro
    ctx.save(); ctx.beginPath(); vidros.forEach(r => ctx.rect(r[0], r[1], r[2], r[3])); ctx.clip();
    const total = W + H * 0.5 + 180, gx = reduz ? W * 0.55 : ((t * 110) % total) - 90;
    ctx.translate(gx, 0); ctx.transform(1, 0, -0.5, 1, 0, 0);
    const g = ctx.createLinearGradient(-110, 0, 110, 0);
    g.addColorStop(0, "rgba(" + rgbP + ",0)"); g.addColorStop(0.5, "rgba(" + rgbP + ",.2)"); g.addColorStop(1, "rgba(" + rgbP + ",0)");
    ctx.fillStyle = g; ctx.fillRect(-110, -20, 220, H + 40);
    const g2 = ctx.createLinearGradient(130, 0, 170, 0);
    g2.addColorStop(0, "rgba(" + rgbP + ",0)"); g2.addColorStop(0.5, "rgba(" + rgbP + ",.12)"); g2.addColorStop(1, "rgba(" + rgbP + ",0)");
    ctx.fillStyle = g2; ctx.fillRect(130, -20, 40, H + 40);
    ctx.restore();
  }

  cores(); medir();
  matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => { cores(); if (reduz) desenhar(0); });
  addEventListener("resize", () => { medir(); if (reduz) desenhar(0); });
  if (reduz) { desenhar(0); return; } // sem movimento para quem prefere assim
  (function animar(ms) { desenhar(ms / 1000); requestAnimationFrame(animar); })(0);
})();
