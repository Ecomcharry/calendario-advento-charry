
// ====================================
// CHARRY - CALENDÁRIO DO ADVENTO
// ====================================

document.addEventListener("DOMContentLoaded", function () {

  const imagem = document.getElementById("imagem-calendario");

  if (!imagem) return;

  // Identifica falhas no carregamento
  imagem.addEventListener("error", function () {
    console.error(
      "Não foi possível carregar a imagem do calendário. Verifique a pasta imagens e os nomes dos arquivos."
    );
  });

  // Confirma o carregamento da imagem
  imagem.addEventListener("load", function () {
    console.log("Calendário Charry carregado.");
  });

});
