document.getElementById("submit").addEventListener("submit", function (event) {
    event.preventDefault();
    alert("oi");
    let listaCadastro = JSON.parse(localStorage.getItem('usuariosCadastrados')) || [];
    let cadastrado = false;

    const data = document.getElementById("data").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const telefone = document.getElementById("telefone").value;
    const hoje = new Date();
    const [ano, mes, dia] = data.split('-');

    if(senha.length < 8){
        alert("sua senha deve ter pelo menos 8 caracteres");
        return;
    }
    if(telefone.length < 15){
        alert("coloque o número completo");
        return;
    }
    if (ano > hoje.getFullYear() || (hoje.getFullYear()-ano) >= 125) {
        alert("A data não pode ser no futuro ou com a idade maior que 125 anos");
        return;
    }

    const usuario = {
        data: data,
        email: email,
        senha: senha,
        telefone: telefone,
    };

    listaCadastro.forEach(element => {
        if(element.email == usuario.email){
            alert("o email já está cadastrado");
            cadastrado = true;
            return;
        }
    });

    if(cadastrado !== true){
        listaCadastro.push(usuario);
        localStorage.setItem('usuariosCadastrados', JSON.stringify(listaCadastro));
        alert("Cadastro feito com sucesso!");
        window.location.href = "login.html";
    }
});