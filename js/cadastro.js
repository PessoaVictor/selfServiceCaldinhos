document.getElementById("submit").addEventListener("submit", function (event) {
    event.preventDefault();
    let listaCadastro = JSON.parse(localStorage.getItem('usuariosCadastrados')) || [];
    let cadastrado = false;

    const data = document.getElementById("data").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const telefone = document.getElementById("telefone").value.trim();
    const hoje = new Date();
    const [ano, mes, dia] = data.split('-');

    if(!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(senha)){
        alert("sua senha deve ter pelo menos 8 caracteres com 1 letra e 1 número");
        return;
    }
    if(!/^\(\d{2}\) 9\d{4}-\d{4}$/.test(telefone)){
        alert("coloque o número no formato certo. ex: (81) 97372-5212");
        return;
    }
    if(ano > hoje.getFullYear() || (hoje.getFullYear()-ano) >= 125) {
        alert("A data não pode ser no futuro ou com a idade maior que 125 anos");
        return;
    }

    const usuario = {
        data: data,
        email: email,
        senha: senha,
        telefone: telefone,
    };

    cadastrado = listaCadastro.some(elemento => elemento.email == usuario.email);
    
    if(cadastrado !== true){
        listaCadastro.push(usuario);
        localStorage.setItem('usuariosCadastrados', JSON.stringify(listaCadastro));
        alert("Cadastro feito com sucesso!");
        window.location.href = "login.html";
    }else{
        alert("o email já está cadastrado");
    }
});