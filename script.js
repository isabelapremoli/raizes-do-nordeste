
let total = 0;
let produtos = [];

function adicionar(nome, preco) {
    produtos.push(nome + " - R$ " + preco.toFixed(2).replace(".", ","));

    total = total + preco;

    document.getElementById("itens").innerHTML = produtos.join("<br>");

    document.getElementById("total").innerHTML =
        total.toFixed(2).replace(".", ",");

    document.getElementById("mensagem").innerHTML =
        "Produto adicionado ao pedido!";
}

document.getElementById("formulario").onsubmit = function(evento) {
    evento.preventDefault();

    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let privacidade = document.getElementById("privacidade").checked;

    if (nome == "" || email == "") {
        document.getElementById("mensagem").innerHTML =
            "Preencha todos os campos!";
    } else if (privacidade == false) {
        document.getElementById("mensagem").innerHTML =
            "Aceite o aviso de privacidade para continuar.";
    } else if (produtos.length == 0) {
        document.getElementById("mensagem").innerHTML =
            "Adicione pelo menos um produto ao pedido.";
    } else {
        document.getElementById("mensagem").innerHTML =
            "Pedido realizado com sucesso, " + nome + "! Total: R$ " +
            total.toFixed(2).replace(".", ",");
    }
};
