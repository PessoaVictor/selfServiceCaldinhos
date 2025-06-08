document.addEventListener("DOMContentLoaded", function () {
  const buscaInput = document.querySelector('#busca input[type="search"]');
  const clearBtn = document.querySelector("#busca .clear-btn");
  const form = document.getElementById("form-cardapio");
  const tabela = document.getElementById("tabela-cardapio");
  const imagemInput = document.getElementById("imagem");
  const inputPreco = document.getElementById("preco");
  const idEdicaoInput = document.getElementById("id-edicao");
  const nomeImagemAnexo = document.getElementById("nome-imagem-anexo");

  let cardapio = [];

  MascaraPreco(inputPreco);

  fetch("/api/cardapio")
    .then((res) => res.json())
    .then((data) => {
      cardapio = data;
      atualizarTabela();
    })
    .catch(() => {
      console.warn("Falha ao carregar cardápio");
    });

  buscaInput.addEventListener("input", () => {
    const termo = buscaInput.value.toLowerCase();

    if (termo.length > 0) {
      clearBtn.style.display = "block";
      const filtrado = cardapio.filter((item) =>
        item.nome.toLowerCase().includes(termo)
      );
      atualizarTabela(filtrado);
    } else {
      clearBtn.style.display = "none";
      atualizarTabela(cardapio);
    }
  });

  clearBtn.addEventListener("click", () => {
    buscaInput.value = "";
    clearBtn.style.display = "none";
    buscaInput.focus();
    atualizarTabela(cardapio);
  });

  imagemInput.addEventListener("change", () => {
    const arquivo = imagemInput.files[0];
    if (arquivo && ImagemValida(arquivo)) {
      nomeImagemAnexo.classList.remove("mensagem-erro");
      nomeImagemAnexo.innerHTML = `
      <i class="fi fi-br-clip"></i> ${arquivo.name}
      <button id="remover-imagem" title="Remover imagem" type="button">
        <i class="fi fi-br-cross"></i>
      </button>
    `;

      const btnRemoverImagem = document.getElementById("remover-imagem");
      btnRemoverImagem.addEventListener("click", () => {
        imagemInput.value = "";
        nomeImagemAnexo.innerHTML = "";
        nomeImagemAnexo.classList.remove("mensagem-erro");
        imagemInput.focus();
      });
    } else {
      nomeImagemAnexo.classList.add("mensagem-erro");
      nomeImagemAnexo.innerHTML =
        "Arquivo não suportado. Por favor, escolha uma imagem válida (JPG, PNG ou WEBP).";
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const preco = inputPreco.value.trim();
    const categoria = document.getElementById("categoria").value;
    const descricao = document.getElementById("descricao").value.trim();
    const imagem = imagemInput.files[0];

    if (
      !nome ||
      !preco ||
      !categoria ||
      !descricao ||
      (!imagem && !idEdicaoInput.value)
    ) {
      exibirPopup("Preencha todos os campos e selecione uma imagem.");
      return;
    }

    if (imagem && !ImagemValida(imagem)) {
      exibirPopup("Erro: selecione uma imagem no formato JPG, PNG ou WEBP.");
      return;
    }

    const processarItem = (imagemURL) => {
      const item = {
        id: idEdicaoInput.value
          ? parseInt(idEdicaoInput.value)
          : gerarProximoID(),
        nome,
        preco,
        categoria,
        descricao,
        imagem:
          imagemURL ||
          (cardapio.find((i) => i.id == idEdicaoInput.value) || {}).imagem,
      };

      if (idEdicaoInput.value) {
        const index = cardapio.findIndex((i) => i.id == item.id);
        if (index !== -1) cardapio[index] = item;
      } else {
        cardapio.push(item);
      }

      atualizarTabela();
      salvarCardapioJSON();
      form.reset();
      idEdicaoInput.value = "";
      nomeImagemAnexo.innerHTML = "";
    };

    if (imagem) {
      const leitor = new FileReader();
      leitor.onload = function (event) {
        processarItem(event.target.result);
      };
      leitor.readAsDataURL(imagem);
    } else {
      processarItem();
    }
  });

  tabela.addEventListener("click", (e) => {
    const botaoEditar = e.target.closest(".btn-editar");
    const botaoExcluir = e.target.closest(".btn-excluir");

    if (botaoExcluir) {
      const id = botaoExcluir.dataset.id;
      cardapio = cardapio.filter((item) => item.id != id);
      atualizarTabela();
      salvarCardapioJSON();
    }

    if (botaoEditar) {
      const id = botaoEditar.dataset.id;
      const item = cardapio.find((i) => i.id == id);
      if (item) {
        idEdicaoInput.value = item.id;
        document.getElementById("nome").value = item.nome;
        document.getElementById("preco").value = item.preco;
        document.getElementById("categoria").value = item.categoria;
        document.getElementById("descricao").value = item.descricao;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  });

  function atualizarTabela(dados = cardapio) {
    tabela.innerHTML = "";
    dados.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td class="acoes" data-label="AÇÕES">
        <button class="btn-editar" data-id="${item.id}">
          <i class="fi fi-br-pencil"></i>
        </button>
        <button class="btn-excluir" data-id="${item.id}">
          <i class="fi fi-br-trash"></i>
        </button>
      </td>
      <td data-label="ID">${item.id}</td>
      <td data-label="IMAGEM"><img src="${item.imagem}" alt="${item.nome}" /></td>
      <td data-label="NOME">${item.nome}</td>
      <td data-label="PREÇO">${item.preco}</td>
      <td data-label="CATEGORIA">${item.categoria}</td>
      <td data-label="DESCRIÇÃO">${item.descricao}</td>
    `;
      tabela.appendChild(row);
    });
  }

  function MascaraPreco(input) {
    input.addEventListener("input", () => {
      let valor = input.value.replace(/\D/g, "");

      if (!valor) {
        input.value = "R$0,00";
        return;
      }

      valor = (parseInt(valor) / 100).toFixed(2).replace(".", ",");
      input.value = `R$${valor}`;
    });
  }

  function gerarProximoID() {
    return cardapio.length > 0 ? Math.max(...cardapio.map((i) => i.id)) + 1 : 1;
  }

  function ImagemValida(file) {
    const tiposValidos = ["image/jpeg", "image/png", "image/webp"];
    return file && tiposValidos.includes(file.type);
  }

  function salvarCardapioJSON() {
    fetch("/api/cardapio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cardapio),
    }).catch(() => console.warn("Erro ao salvar o cardápio no .json"));
  }

  window.exibirPopup = function (mensagem) {
    const popup = document.getElementById("popup");
    const mensagemEl = document.getElementById("popup-mensagem");
    mensagemEl.textContent = mensagem;
    popup.style.display = "block";
  };

  window.fecharPopup = function () {
    document.getElementById("popup").style.display = "none";
  };
});
