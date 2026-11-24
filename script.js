
// ========================================
// CHARRY - CALENDÁRIO DO ADVENTO 2026
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  const areaBotoes = document.getElementById(
    "botoes-calendario"
  );

  const modal = document.getElementById(
    "surpresa-modal"
  );

  const caixa = document.getElementById(
    "abrir-caixa"
  );

  const resultado = document.getElementById(
    "surpresa-resultado"
  );

  const titulo = document.getElementById(
    "beneficio-titulo"
  );

  const descricao = document.getElementById(
    "beneficio-descricao"
  );

  const data = document.getElementById(
    "surpresa-data"
  );

  const instrucao = document.getElementById(
    "surpresa-instrucao"
  );

  const areaCupom = document.getElementById(
    "beneficio-cupom"
  );

  const codigoCupom = document.getElementById(
    "codigo-cupom"
  );

  const copiarCupom = document.getElementById(
    "copiar-cupom"
  );

  const linkBeneficio = document.getElementById(
    "beneficio-link"
  );

  const mediaMobile = window.matchMedia(
    "(max-width: 767px)"
  );

  // ========================================
  // CONFIGURAÇÃO DOS BENEFÍCIOS
  // ========================================
  //
  // Nenhum benefício foi cadastrado ainda.
  //
  // Exemplo futuro:
  //
  // 1: {
  //   titulo: "10% EXTRA",
  //   descricao: "Benefício exclusivo Charry.",
  //   cupom: "EXEMPLO10",
  //   link: "https://www.exemplo.com.br"
  // }
  //
  // Não publique cupons reais antecipadamente
  // em um repositório público.

  const beneficios = {};


  // ========================================
  // COORDENADAS DAS IMAGENS
  // ========================================
  //
  // Medidas nas imagens originais:
  //
  // desk_sem_casinhas.png: 1064 x 1479
  // mobile_sem_casinhas.png: 941 x 1672
  //
  // Cada par representa o centro do botão:
  // [posição horizontal, posição vertical]
  //
  // As coordenadas são convertidas para
  // porcentagens, para acompanhar a imagem
  // em diferentes larguras de tela.
  //
  // Não utilizamos mais posições salvas
  // no localStorage.

  const LAYOUTS = {

    desktop: {
      largura: 1064,
      altura: 1479,

      botoes: {

        1: [110, 232],
        2: [279, 232],
        3: [446, 232],
        4: [614, 232],
        5: [781, 232],
        6: [948, 232],

        7: [110, 495],
        8: [279, 495],
        9: [781, 495],
        10: [948, 495],

        11: [390, 766],
        12: [572, 766],
        13: [759, 766],
        14: [942, 766],

        15: [118, 1025],
        16: [302, 1025],
        17: [496, 1025],

        18: [97, 1281],
        19: [240, 1281],
        20: [389, 1281],
        21: [537, 1281],
        22: [683, 1281],
        23: [829, 1281],
        24: [976, 1281]
      }
    },

    mobile: {
      largura: 941,
      altura: 1672,

      botoes: {

        1: [237, 151],
        2: [464, 151],
        3: [692, 151],

        4: [464, 345],
        5: [692, 345],

        6: [237, 519],
        7: [464, 519],
        8: [692, 519],

        9: [237, 704],
        10: [464, 704],

        11: [237, 871],
        12: [464, 871],
        13: [692, 871],

        14: [237, 1039],
        15: [692, 1039],

        16: [237, 1200],
        17: [464, 1200],
        18: [692, 1200],

        19: [237, 1369],
        20: [464, 1369],
        21: [692, 1369],

        22: [237, 1537],
        23: [464, 1537],
        24: [692, 1537]
      }
    }
  };


  // ========================================
  // CRIAÇÃO DOS BOTÕES
  // ========================================

  function criarBotoes() {

    areaBotoes.innerHTML = "";

    const tipo = mediaMobile.matches
      ? "mobile"
      : "desktop";

    const layout = LAYOUTS[tipo];

    for (let dia = 1; dia <= 24; dia++) {

      const coordenada = layout.botoes[dia];

      if (!coordenada) continue;

      const x = coordenada[0];
      const y = coordenada[1];

      const botao = document.createElement(
        "button"
      );

      botao.type = "button";

      botao.className = "botao-desbloquear";

      botao.textContent = "DESBLOQUEAR";

      botao.dataset.dia = dia;

      botao.setAttribute(
        "aria-label",
        `Desbloquear surpresa do dia ${dia} de dezembro`
      );

      botao.style.left =
        (x / layout.largura) * 100 + "%";

      botao.style.top =
        (y / layout.altura) * 100 + "%";

      botao.addEventListener("click", () => {
        abrirSurpresa(dia);
      });

      areaBotoes.appendChild(botao);
    }
  }


  // ========================================
  // CONTROLE DA JANELA
  // ========================================

  let diaSelecionado = null;
  let temporizador = null;
  let focoAnterior = null;


  // ========================================
  // ABRIR JANELA DA SURPRESA
  // ========================================

  function abrirSurpresa(dia) {

    diaSelecionado = dia;
    focoAnterior = document.activeElement;

    clearTimeout(temporizador);

    data.textContent =
      String(dia).padStart(2, "0") +
      " DE DEZEMBRO";

    caixa.classList.remove("aberta");

    caixa.disabled = false;

    resultado.hidden = true;
    areaCupom.hidden = true;
    linkBeneficio.hidden = true;

    codigoCupom.textContent = "";
    copiarCupom.textContent = "COPIAR";

    instrucao.textContent =
      "Toque na caixa para descobrir.";

    modal.hidden = false;

    document.body.style.overflow = "hidden";

    caixa.focus();
  }


  // ========================================
  // REVELAR A SURPRESA
  // ========================================

  function revelarSurpresa() {

    if (caixa.classList.contains("aberta")) {
      return;
    }

    caixa.classList.add("aberta");

    caixa.disabled = true;

    instrucao.textContent = "";

    const beneficio = beneficios[diaSelecionado];

    clearTimeout(temporizador);

    temporizador = setTimeout(() => {

      if (modal.hidden) return;

      if (!beneficio) {

        titulo.textContent = "EM BREVE";

        descricao.textContent =
          "Estamos preparando uma surpresa especial para você. Volte em breve para descobrir!";

      } else {

        titulo.textContent =
          beneficio.titulo || "SURPRESA CHARRY";

        descricao.textContent =
          beneficio.descricao || "";

        if (beneficio.cupom) {

          codigoCupom.textContent =
            beneficio.cupom;

          areaCupom.hidden = false;
        }

        if (beneficio.link) {

          try {

            const destino = new URL(
              beneficio.link,
              window.location.href
            );

            if (destino.protocol === "https:") {

              linkBeneficio.href = destino.href;

              linkBeneficio.hidden = false;
            }

          } catch (erro) {

            console.warn(
              "Link de benefício inválido."
            );
          }
        }
      }

      resultado.hidden = false;

    }, 850);
  }


  // ========================================
  // FECHAR JANELA
  // ========================================

  function fecharSurpresa() {

    clearTimeout(temporizador);

    modal.hidden = true;

    caixa.classList.remove("aberta");

    document.body.style.overflow = "";

    if (
      focoAnterior &&
      focoAnterior.isConnected
    ) {
      focoAnterior.focus();
    }
  }


  // ========================================
  // CLIQUES DA CAIXA
  // ========================================

  caixa.addEventListener(
    "click",
    revelarSurpresa
  );


  // ========================================
  // FECHAR AO CLICAR NO X OU FORA
  // ========================================

  document.querySelectorAll("[data-fechar]")
    .forEach(elemento => {

      elemento.addEventListener(
        "click",
        fecharSurpresa
      );
    });


  // ========================================
  // FECHAR COM ESC
  // E CONTROLAR FOCO DO MODAL
  // ========================================

  document.addEventListener("keydown", evento => {

    if (modal.hidden) return;

    if (evento.key === "Escape") {

      fecharSurpresa();

      return;
    }

    if (evento.key !== "Tab") return;

    const elementos = Array.from(
      modal.querySelectorAll(
        'button:not([disabled]), a:not([hidden])'
      )
    ).filter(elemento =>
      elemento.getClientRects().length > 0
    );

    if (!elementos.length) return;

    const primeiro = elementos[0];
    const ultimo = elementos[elementos.length - 1];

    if (
      evento.shiftKey &&
      document.activeElement === primeiro
    ) {

      evento.preventDefault();
      ultimo.focus();

    } else if (
      !evento.shiftKey &&
      document.activeElement === ultimo
    ) {

      evento.preventDefault();
      primeiro.focus();
    }
  });


  // ========================================
  // COPIAR CUPOM
  // ========================================

  copiarCupom.addEventListener(
    "click",
    async () => {

      const codigo = codigoCupom.textContent;

      try {

        await navigator.clipboard.writeText(
          codigo
        );

        copiarCupom.textContent = "COPIADO!";

      } catch (erro) {

        copiarCupom.textContent =
          "COPIE O CÓDIGO";
      }
    }
  );


  // ========================================
  // INICIALIZAÇÃO
  // ========================================

  criarBotoes();

  // Recria as posições caso a tela
  // passe de desktop para mobile ou vice-versa.

  mediaMobile.addEventListener(
    "change",
    criarBotoes
  );

});
