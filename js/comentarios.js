/* ===== Comentários: desenha a lista e envia novos comentários pelo WhatsApp ===== */
const lista = document.getElementById("lista-comentarios");
COMENTARIOS.forEach(c => {
  const box = document.createElement("article"); box.className = "coment";
  const est = document.createElement("div"); est.className = "estrelas";
  est.textContent = "★".repeat(c.nota) + "☆".repeat(5 - c.nota);
  est.setAttribute("aria-label", "Nota " + c.nota + " de 5");
  const txt = document.createElement("p"); txt.textContent = c.texto;
  const aut = document.createElement("small"); aut.textContent = c.nome + ", " + c.data;
  box.append(est, txt, aut); lista.appendChild(box);
});
document.getElementById("form-comentario").addEventListener("submit", e => {
  e.preventDefault();
  const nome = document.getElementById("c-nome").value.trim();
  const nota = +document.getElementById("c-nota").value;
  const texto = document.getElementById("c-texto").value.trim();
  const msg = "Olá! Gostaria de deixar um comentário no site.\nNome: " + nome + "\nNota: " + "★".repeat(nota) + "\nComentário: " + texto;
  window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
});
