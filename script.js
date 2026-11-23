
// ====================================
// CHARRY - CALENDÁRIO DO ADVENTO
// ====================================

document.addEventListener("DOMContentLoaded", () => {

  const container = document.querySelector(
    ".calendario-container"
  );

  const areaBotoes = document.getElementById(
    "botoes-calendario"
  );

  const aviso = document.getElementById("aviso");

  const mediaMobile = window.matchMedia(
    "(max-width: 767px)"
  );

  // ====================================
  // POSIÇÕES INICIAIS
  // ====================================
  // Coordenadas em porcentagem da imagem.
  // Ajuste conforme os nichos reais.
  //
  // Desktop: distribuição inicial 6 x 4
  // Mobile: distribuição inicial 3 x 8

  function gerarGrade(colunas, linhas) {
    const posicoes = [];

    for (let linha = 0; linha < linhas; linha++) {
      for (
        let coluna = 0;
        coluna < colunas;
        coluna++
      ) {
        posicoes.push({
          x: ((coluna + 0.5) / colunas) * 100,
          y: ((linha + 0.78) / linhas) * 100
        });
      }
    }

    return posicoes;
  }

  const posicoesPadrao = {
    desktop: gerarGrade(6, 4),
    mobile: gerarGrade(3, 8)
  };

  // ====================================
  // POSIÇÕES PERSONALIZADAS
  // ====================================

  function obterPosicoes(tipo) {
    try {
      const salvas = JSON.parse(
        localStorage.getItem(
          "charry-posicoes-" + tipo
        )
      );

      if (
        Array.isArray(salvas) &&
        salvas.length === 24
      ) {
        return salvas;
      }
    } catch (erro) {
      console.warn("Usando posições padrão.");
    }

    return posicoesPadrao[tipo].map(
      posicao => ({ ...posicao })
    );
  }

  function tipoAtual() {
    return mediaMobile.matches
      ? "mobile"
      : "desktop";
  }

  // ====================================
  // MODO DE AJUSTE
  // ====================================
  // Para ativar, adicione:
  // ?editar=1
  // ao final do endereço do site.

  const modoAjuste = new URLSearchParams(
    window.location.search
  ).get("editar") === "1";

  if (modoAjuste) {
    document.body.classList.add("modo-ajuste");
  }

  // ====================================
  // MENSAGENS
  // ====================================

  let tempoAviso;

  function mostrarAviso(mensagem) {
    aviso.textContent = mensagem;
    aviso.classList.add("visivel");

    clearTimeout(tempoAviso);

    tempoAviso = setTimeout(() => {
      aviso.classList.remove("visivel");
    }, 2600);
  }

  // ====================================
  // CRIAÇÃO DOS 24 BOTÕES
  // ====================================

  function criarBotoes() {

    areaBotoes.innerHTML = "";

    const tipo = tipoAtual();
    const posicoes = obterPosicoes(tipo);

    for (let dia = 1; dia <= 24; dia++) {

      const botao = document.createElement(
        "button"
      );

      botao.type = "button";

      botao.className = "botao-desbloquear";

      botao.textContent = "DESBLOQUEAR";

      botao.dataset.dia = dia;

      botao.setAttribute(
        "aria-label",
        `Dia ${dia} de dezembro, em breve`
      );

      const posicao = posicoes[dia - 1];

      botao.style.left = posicao.x + "%";
      botao.style.top = posicao.y + "%";

      if (modoAjuste) {
        ativarArraste(
          botao,
          dia - 1,
          tipo,
          posicoes
        );
      } else {
        botao.addEventListener("click", () => {
          mostrarAviso(
            `Dia ${String(dia).padStart(2, "0")}/12: em breve!`
          );
        });
      }

      areaBotoes.appendChild(botao);
    }
  }

  // ====================================
  // ARRASTAR PARA POSICIONAR
  // ====================================

  function ativarArraste(
    botao,
    indice,
    tipo,
    posicoes
  ) {

    botao.addEventListener(
      "pointerdown",
      evento => {

        evento.preventDefault();

        botao.setPointerCapture(
          evento.pointerId
        );

        function mover(eventoMovimento) {

          const retangulo =
            container.getBoundingClientRect();

          const x = (
            (eventoMovimento.clientX -
              retangulo.left) /
            retangulo.width
          ) * 100;

          const y = (
            (eventoMovimento.clientY -
              retangulo.top) /
            retangulo.height
          ) * 100;

          const limitar = valor =>
            Math.max(
              0,
              Math.min(100, valor)
            );

          posicoes[indice] = {
            x: limitar(x),
            y: limitar(y)
          };

          botao.style.left =
            posicoes[indice].x + "%";

          botao.style.top =
            posicoes[indice].y + "%";
        }

        function finalizar() {

          localStorage.setItem(
            "charry-posicoes-" + tipo,
            JSON.stringify(posicoes)
          );

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

  // ====================================
  // EXPORTAR POSIÇÕES
  // ====================================
  // No modo ?editar=1, pressione E.
  // O JSON será copiado para a área
  // de transferência, se permitido.

  if (modoAjuste) {

    document.addEventListener(
      "keydown",
      async evento => {

        if (evento.key.toLowerCase() !== "e") {
          return;
        }

        const dados = {
          desktop: obterPosicoes("desktop"),
          mobile: obterPosicoes("mobile")
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

          mostrarAviso(
            "Posições copiadas!"
          );
        } catch (erro) {
          console.log(texto);
          mostrarAviso(
            "Posições disponíveis no console."
          );
        }
      }
    );
  }

  // ====================================
  // INICIALIZAÇÃO
  // ====================================

  criarBotoes();

  mediaMobile.addEventListener(
    "change",
    criarBotoes
  );

});
