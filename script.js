
document.addEventListener("DOMContentLoaded", () => {

  const area = document.getElementById("botoes-calendario");
  const aviso = document.getElementById("aviso");
  const mediaMobile = window.matchMedia("(max-width: 767px)");

  // Coordenadas em porcentagem da imagem.
  // Cada número corresponde ao dia de dezembro.
  // Nichos com looks e laço NÃO recebem botões.

  const desktop = {
    1: [11, 15],
    2: [27, 15],
    3: [44, 15],
    4: [61, 15],
    5: [78, 15],
    6: [94, 15],

    7: [11, 32],
    8: [27, 32],
    9: [78, 32],
    10: [94, 32],

    11: [36, 49],
    12: [53, 49],
    13: [70, 49],
    14: [87, 49],

    15: [11, 66],
    16: [27, 66],
    17: [44, 66],

    18: [9, 82],
    19: [23, 82],
    20: [36, 82],
    21: [50, 82],
    22: [64, 82],
    23: [77, 82],
    24: [91, 82]
  };

  const mobile = {
    1: [26, 8],
    2: [50, 8],
    3: [74, 8],

    4: [50, 19],
    5: [74, 19],

    6: [26, 29],
    7: [50, 29],
    8: [74, 29],

    9: [26, 39],
    10: [50, 39],

    11: [26, 49],
    12: [50, 49],
    13: [74, 49],

    14: [26, 58],
    15: [74, 58],

    16: [26, 68],
    17: [50, 68],
    18: [74, 68],

    19: [26, 78],
    20: [50, 78],
    21: [74, 78],

    22: [26, 88],
    23: [50, 88],
    24: [74, 88]
  };

  let temporizador;

  function mostrarAviso(dia) {
    if (!aviso) return;

    aviso.textContent =
      `A surpresa de ${String(dia).padStart(2, "0")}/12 ainda não está disponível.`;

    aviso.classList.add("visivel");

    clearTimeout(temporizador);

    temporizador = setTimeout(() => {
      aviso.classList.remove("visivel");
    }, 3000);
  }

  function criarBotoes() {
    if (!area) return;

    area.innerHTML = "";

    const posicoes = mediaMobile.matches
      ? mobile
      : desktop;

    for (let dia = 1; dia <= 24; dia++) {

      const coordenadas = posicoes[dia];

      if (!coordenadas) continue;

      const botao = document.createElement("button");

      botao.type = "button";
      botao.className = "botao-desbloquear";
      botao.textContent = "DESBLOQUEAR";

      botao.setAttribute(
        "aria-label",
        `Desbloquear surpresa de ${dia} de dezembro`
      );

      botao.style.left = coordenadas[0] + "%";
      botao.style.top = coordenadas[1] + "%";

      botao.addEventListener("click", () => {
        mostrarAviso(dia);
      });

      area.appendChild(botao);
    }
  }

  criarBotoes();

  mediaMobile.addEventListener("change", criarBotoes);

});
