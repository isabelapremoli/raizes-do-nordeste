
let total = 0;
let produtos = [];
let unidadeEscolhida = "";
let numeroPedido = 1000;
let statusAtual = 0;
let pagamentoRecusado = false;

// Escolher a unidade
document.getElementById("unidade").onchange = function() {
    unidadeEscolhida = this.value;

    if (unidadeEscolhida == "londrina") {
        document.getElementById("unidade-pedido").innerHTML = "Londrina";
    } else if (unidadeEscolhida == "curitiba") {
        document.getElementById("unidade-pedido").innerHTML = "Curitiba";
    } else if (unidadeEscolhida == "maringa") {
        document.getElementById("unidade-pedido").innerHTML = "Maringá";
    } else {
        document.getElementById("unidade-pedido").innerHTML = "Nenhuma";
    }

    mostrarProdutos();
};

// Mostrar somente os pratos disponíveis
function mostrarProdutos() {
    let lista = document.getElementsByClassName("produto");
    let busca = document.getElementById("busca").value.toLowerCase();
    let quantidade = 0;

    for (let i = 0; i < lista.length; i++) {
        let nome = lista[i].getAttribute("data-nome").toLowerCase();
        let unidades = lista[i].getAttribute("data-unidades");

        if (unidadeEscolhida != "" &&
            unidades.includes(unidadeEscolhida) &&
            nome.includes(busca)) {
            lista[i].style.display = "block";
            quantidade++;
        } else {
            lista[i].style.display = "none";
        }
    }

    if (unidadeEscolhida == "") {
        document.getElementById("aviso-cardapio").innerHTML =
            "Escolha uma unidade para consultar os pratos disponíveis.";
    } else if (quantidade == 0) {
        document.getElementById("aviso-cardapio").innerHTML =
            "Nenhum prato encontrado nesta unidade.";
    } else {
        document.getElementById("aviso-cardapio").innerHTML =
            "Estes são os pratos disponíveis na unidade escolhida.";
    }
}

// Buscar pratos
document.getElementById("busca").oninput = function() {
    mostrarProdutos();
};

// Adicionar produto ao pedido
function adicionar(nome, preco) {
    if (unidadeEscolhida == "") {
        alert("Escolha uma unidade antes de adicionar produtos.");
        return;
    }

    let encontrado = false;

    for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].nome == nome) {
            produtos[i].quantidade++;
            encontrado = true;
        }
    }

    if (encontrado == false) {
        produtos.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();

    document.getElementById("mensagem").innerHTML =
        "Produto adicionado ao pedido!";
}

// Atualizar o carrinho
function atualizarCarrinho() {
    let lista = document.getElementById("itens");
    lista.innerHTML = "";
    total = 0;

    if (produtos.length == 0) {
        lista.innerHTML = "Nenhum produto adicionado.";
    }

    for (let i = 0; i < produtos.length; i++) {
        let item = document.createElement("p");

        let subtotal = produtos[i].preco * produtos[i].quantidade;
        total = total + subtotal;

        item.innerHTML =
            produtos[i].nome + " - R$ " +
            subtotal.toFixed(2).replace(".", ",") +
            " (Quantidade: " + produtos[i].quantidade + ") ";

        let botaoMenos = document.createElement("button");
        botaoMenos.innerHTML = "-";
        botaoMenos.onclick = function() {
            diminuirQuantidade(i);
        };

        let botaoMais = document.createElement("button");
        botaoMais.innerHTML = "+";
        botaoMais.onclick = function() {
            aumentarQuantidade(i);
        };

        let botaoRemover = document.createElement("button");
        botaoRemover.innerHTML = "Remover";
        botaoRemover.onclick = function() {
            removerProduto(i);
        };

        item.appendChild(botaoMenos);
        item.appendChild(botaoMais);
        item.appendChild(botaoRemover);
        lista.appendChild(item);
    }

    document.getElementById("total").innerHTML =
        total.toFixed(2).replace(".", ",");
}

// Aumentar quantidade
function aumentarQuantidade(indice) {
    produtos[indice].quantidade++;
    atualizarCarrinho();
}

// Diminuir quantidade
function diminuirQuantidade(indice) {
    if (produtos[indice].quantidade > 1) {
        produtos[indice].quantidade--;
    } else {
        produtos.splice(indice, 1);
    }

    atualizarCarrinho();
}

// Remover produto
function removerProduto(indice) {
    produtos.splice(indice, 1);
    atualizarCarrinho();
}

// Limpar o carrinho
function limparCarrinho() {
    produtos = [];
    atualizarCarrinho();

    document.getElementById("mensagem").innerHTML =
        "O pedido foi limpo.";
}

// Finalizar pedido e simular pagamento
document.getElementById("formulario").onsubmit = function(evento) {
    evento.preventDefault();

    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let pagamento = document.getElementById("pagamento").value;
    let resultado = document.getElementById("resultado-pagamento").value;
    let privacidade = document.getElementById("privacidade").checked;
    let promocoes = document.getElementById("promocoes").checked;

    if (unidadeEscolhida == "") {
        document.getElementById("mensagem").innerHTML =
            "Escolha uma unidade.";
    } else if (produtos.length == 0) {
        document.getElementById("mensagem").innerHTML =
            "Adicione pelo menos um produto ao pedido.";
    } else if (nome == "" || email == "") {
        document.getElementById("mensagem").innerHTML =
            "Preencha seu nome e e-mail.";
    } else if (pagamento == "") {
        document.getElementById("mensagem").innerHTML =
            "Escolha uma forma de pagamento.";
    } else if (privacidade == false) {
        document.getElementById("mensagem").innerHTML =
            "Aceite o aviso de privacidade para continuar.";
    } else {
        if (promocoes == true) {
            document.getElementById("mensagem-fidelidade").innerHTML =
                "Você aceitou receber promoções. Esta é uma demonstração.";
        } else {
            document.getElementById("mensagem-fidelidade").innerHTML =
                "Você não optou por receber promoções.";
        }

        if (resultado == "recusado") {
            pagamentoRecusado = true;
            document.getElementById("mensagem").innerHTML =
                "Pagamento recusado na simulação. Você pode tentar novamente.";
            document.getElementById("tentar-novamente").hidden = false;
        } else if (resultado == "indisponivel") {
            pagamentoRecusado = true;
            document.getElementById("mensagem").innerHTML =
                "Serviço de pagamento indisponível. Tente novamente.";
            document.getElementById("tentar-novamente").hidden = false;
        } else {
            pagamentoRecusado = false;
            numeroPedido++;

            document.getElementById("mensagem").innerHTML =
                "Pagamento aprovado na simulação! Obrigado, " + nome + ".";

            document.getElementById("numero-pedido").innerHTML =
                "Número demonstrativo do pedido: " + numeroPedido;

            statusAtual = 0;
            document.getElementById("status-pedido").innerHTML = "Recebido";

            document.getElementById("tentar-novamente").hidden = true;
        }
    }
};

// Tentar novamente após recusa
function tentarNovamente() {
    if (pagamentoRecusado == true) {
        document.getElementById("mensagem").innerHTML =
            "Selecione a opção de aprovação na simulação e confirme novamente.";
    }
}

// Atualizar o status demonstrativo
function atualizarStatus() {
    if (document.getElementById("numero-pedido").innerHTML ==
        "Nenhum pedido confirmado.") {
        document.getElementById("status-pedido").innerHTML =
            "Confirme um pedido primeiro.";
        return;
    }

    statusAtual++;

    if (statusAtual == 1) {
        document.getElementById("status-pedido").innerHTML = "Em preparo";
    } else if (statusAtual == 2) {
        document.getElementById("status-pedido").innerHTML =
            "Pronto para retirada";
    } else {
        document.getElementById("status-pedido").innerHTML =
            "Pedido concluído";
        statusAtual = 2;
    }
}

// Iniciar com o cardápio oculto até escolher a unidade
mostrarProdutos();
