/* ===== Botões "Chamar no WhatsApp": monta o link com o número de config.js ===== */
document.querySelectorAll("a.zap").forEach(a => {
  a.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(MSG_INICIAL);
});
