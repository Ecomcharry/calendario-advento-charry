
// ========================================
// CHARRY - CALENDÁRIO DO ADVENTO 2026
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  // ELEMENTOS

  const container = document.getElementById(
    "calendario-container"
  );

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

  const painelAjuste = document.getElementById(
    "painel-ajuste"
  );

  const mediaMobile = window.matchMedia(
    "(max-width: 767px)"
  );

  // ========================================
  // CONFIGURAÇÃO DOS BENEFÍCIOS
  // ========================================
  //
  // Não há promoções definidas ainda.
  // Todas as caixas revelam "EM BREVE".
  //
  // Quando os benefícios forem aprovados,
  // poderão ser cadastrados aqui.
  //
  // Exemplo:
  //
  // 1: {
  //   titulo: "10% EXTRA",
  //   descricao: "Benefício exclusivo.",
  //   cupom: "EXEMPLO10",
  //   link: "https://www.exemplo.com.br"
  // }
  //
  // Não publique cupons reais antes de sua
  // liberação, pois o JavaScript é público.

  const beneficios = {};


  // ========================================
  // POSIÇÕES DOS BOTÕES
  // ========================================
  //
  // Coordenadas aproximadas em porcentagem.
  // [horizontal, vertical]
  //
  // As posições podem ser corrigidas
  // pelo modo de edição.
  //
  // Os nichos decorativos não recebem
  // botões.

  const POSICOES_INICIAIS = {

    desktop: {

      1: [11, 13],
      2: [27, 13],
      3: [44, 13],
      4: [61, 13],
      5: [78, 13],
      6: [94, 13],

      7: [11, 30],
      8: [27, 30],
      9: [78, 30],
      10: [94, 30],

      11: [36, 47],
      12: [53, 47],
      13: [70, 47],
      14: [87, 47],

      15: [11, 64],
      16: [27, 64],
      17: [44, 64],

      18: [9, 83],
      19: [23, 83],
      20: [36, 83],
      21: [50, 83],
      22: [64, 83],
      23: [77, 83],
      24: [91, 83]

    },

    mobile: {

      1: [26, 9],
      2: [50, 9],
      3: [74, 9],

      4: [50, 20],
      5: [74, 20],

      6: [26, 30],
      7: [50, 30],
      8: [74, 30],

      9: [26, 40],
      10: [50, 40],

      11: [26, 50],
      12: [50, 50],
      13: [74, 50],

      14: [26, 59],
      15: [74, 59],

      16: [26, 69],
      17: [50, 69],
      18: [74, 69],

      19: [26, 79],
      20: [50, 79],
      21: [74, 79],

      22: [26, 89],
      23: [50, 89],
      24: [74, 89]

    }

  };


  // ========================================
  // EDIÇÃO DAS POSIÇÕES
  // ========================================

  const parametros = new URLSearchParams(
    window.location.search
  );

  const modoAjuste =
    parametros.get("editar") === "1";

  let posicoesAtuais = {};
  let dispositivoAtual = "";

  function obterTipo() {
    return mediaMobile.matches
      ? "mobile"
      : "desktop";
  }

  function copiarObjeto(objeto) {
    return JSON.parse(JSON.stringify(objeto));
  }

  function carregarPosicoes(tipo) {

    const chave = "charry-posicoes-" + tipo;

    try {

      const salvas = localStorage.getItem(chave);

      if (salvas) {
        return {
          ...copiarObjeto(POSICOES_INICIAIS[tipo]),
          ...JSON.parse(salvas)
        };
      }

    } catch (erro) {
      console.warn("Posições padrão utilizadas.");
    }

    return copiarObjeto(POSICOES_INICIAIS[tipo]);
  }

  function salvarPosicoes() {

    localStorage.setItem(
      "charry-posicoes-" + dispositivoAtual,
      JSON.stringify(posicoesAtuais)
    );

  }


  // ========================================
  // CRIAÇÃO DOS BOTÕES
  // ========================================

  function criarBotoes() {

    areaBotoes.innerHTML = "";

    dispositivoAtual = obterTipo();

    posicoesAtuais = carregarPosicoes(
      dispositivoAtual
    );

    for (let dia = 1; dia <= 24; dia++) {

      const coordenadas = posicoesAtuais[dia];

      if (!coordenadas) continue;

      const botao = document.createElement(
        "button"
      );

      botao.type = "button";

      botao.className = "botao-desbloquear";

      botao.textContent = "DESBLOQUEAR";

      botao.dataset.dia = String(dia);

      botao.setAttribute(
        "aria-label",
        "Abrir surpresa do dia " + dia
      );

      botao.style.left = coordenadas[0] + "%";
      botao.style.top = coordenadas[1] + "%";

      if (modoAjuste) {

        ativarArraste(botao, dia);

      } else {

        botao.addEventListener("click", () => {
          abrirSurpresa(dia);
        });

      }

      areaBotoes.appendChild(botao);

    }

  }


  // ========================================
  // ARRASTAR OS BOTÕES
  // ========================================

  function ativarArraste(botao, dia) {

    botao.addEventListener(
      "pointerdown",
      evento => {

        evento.preventDefault();

        const ponteiro = evento.pointerId;

        botao.setPointerCapture(ponteiro);

        function mover(e) {

          const rect = container.getBoundingClientRect();

          const x = (
            (e.clientX - rect.left) /
            rect.width
          ) * 100;

          const y = (
            (e.clientY - rect.top) /
            rect.height
          ) * 100;

          const limitar = valor =>
            Math.max(0, Math.min(100, valor));

          posicoesAtuais[dia] = [
            limitar(x),
            limitar(y)
          ];

          botao.style.left =
            posicoesAtuais[dia][0] + "%";

          botao.style.top =
            posicoesAtuais[dia][1] + "%";

        }

        function finalizar() {

          salvarPosicoes();

          botao.removeEventListener(
            "pointermove",
            mover
          );

          botao.removeEventListener(
            "pointerup",
            finalizar
          );

          botao.removeEventListener(
            "pointercancel",
            finalizar
          );

        }

        botao.addEventListener(
          "pointermove",
          mover
        );

        botao.addEventListener(
          "pointerup",
          finalizar
        );

        botao.addEventListener(
          "pointercancel",
          finalizar
        );

      }
    );

  }


  // ========================================
  // ABRIR MODAL
  // ========================================

  let diaSelecionado = null;
  let temporizador = null;
  let focoAnterior = null;

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

    instrucao.textContent =
      "Toque na caixa para descobrir.";

    copiarCupom.textContent = "COPIAR";

    modal.hidden = false;

    document.body.style.overflow = "hidden";

    caixa.focus();

  }


  // ========================================
  // REVELAR SURPRESA
  // ========================================

  function revelarSurpresa() {

    if (caixa.classList.contains("aberta")) {
      return;
    }

    caixa.classList.add("aberta");
    caixa.disabled = true;

    instrucao.textContent = "";

    const beneficio = beneficios[diaSelecionado];

    temporizador = setTimeout(() => {

      if (modal.hidden) return;

      if (!beneficio) {

        titulo.textContent = "EM BREVE";

        descricao.textContent =
          "Estamos preparando uma surpresa especial para você. Volte no dia da revelação!";

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

          const url = beneficio.link;

          // Aceita caminhos internos e URLs HTTPS.
          if (
            url.startsWith("/") ||
            url.startsWith("https://")
          ) {
            linkBeneficio.href = url;
            linkBeneficio.hidden = false;
          }

        }

      }

      resultado.hidden = false;

    }, 900);

  }


  // ========================================
  // FECHAR MODAL
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
  // EVENTOS DO MODAL
  // ========================================

  caixa.addEventListener(
    "click",
    revelarSurpresa
  );

  document.querySelectorAll("[data-fechar]")
    .forEach(elemento => {

      elemento.addEventListener(
        "click",
        fecharSurpresa
      );

    });

  document.addEventListener(
    "keydown",
    evento => {

      if (modal.hidden) return;

      if (evento.key === "Escape") {
        fecharSurpresa();
        return;
      }

      // Mantém a navegação por teclado
      // dentro da janela aberta.
      if (evento.key === "Tab") {

        const elementos = Array.from(
          modal.querySelectorAll(
            "button:not([disabled]), a:not([hidden])"
          )
        ).filter(el =>
          el.getClientRects().length > 0
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

      }

    }
  );


  // ========================================
  // COPIAR CUPOM
  // ========================================

  copiarCupom.addEventListener(
    "click",
    async () => {

      try {

        await navigator.clipboard.writeText(
          codigoCupom.textContent
        );

        copiarCupom.textContent = "COPIADO!";

      } catch (erro) {

        copiarCupom.textContent =
          "SELECIONE O CÓDIGO";

      }

    }
  );


  // ========================================
  // PAINEL DE EDIÇÃO
  // ========================================

  if (modoAjuste) {

    document.body.classList.add(
      "modo-ajuste"
    );

    painelAjuste.hidden = false;

    document.getElementById(
      "exportar-posicoes"
    ).addEventListener(
      "click",
      async () => {

        const dados = {
          desktop: carregarPosicoes("desktop"),
          mobile: carregarPosicoes("mobile")
        };

        const texto = JSON.stringify(
          dados,
          null,
          2
        );

        try {

          await navigator.clipboard.writeText(
            texto
          );

          alert("Posições copiadas!");

        } catch (erro) {

          window.prompt(
            "Copie as posições:",
            texto
          );

        }

      }
    );

    document.getElementById(
      "restaurar-posicoes"
    ).addEventListener(
      "click",
      () => {

        const confirmar = confirm(
          "Restaurar as posições iniciais deste dispositivo?"
        );

        if (!confirmar) return;

        localStorage.removeItem(
          "charry-posicoes-" + dispositivoAtual
        );

        criarBotoes();

      }
    );

  }


  // ========================================
  // INICIALIZAÇÃO
  // ========================================

  criarBotoes();

  mediaMobile.addEventListener(
    "change",
    criarBotoes
  );

});
