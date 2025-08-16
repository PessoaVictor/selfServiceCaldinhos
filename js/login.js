document.getElementById("login").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;
    let mensagemErro = '';

    let listaCadastro = JSON.parse(localStorage.getItem('usuariosCadastrados')) || [];
    let login = JSON.parse(sessionStorage.getItem('usuarioLogado')) || [];

    listaCadastro.forEach(element => {
        if (element.email === email && element.senha === senha) {
            if(login.length>0){
                login = []
            }

            mensagemErro = 'ok'
            let emailDigitado = element.email;
            let passwordDigitado = element.senha;

                let loginDados = {
                    email: emailDigitado,
                    senha: passwordDigitado
                };
                
                login.push(loginDados);
                sessionStorage.setItem("usuarioLogado", JSON.stringify(login));
                alert("login feito com sucesso")

                const url = new URL(document.referrer);
                const pathname = url.pathname;
                alert(pathname)
                if(document.referrer){
                    if (pathname == '/cadastro.html' || pathname == '/login.html') {
                        window.location.href = 'index.html'; 
                    } else {
                        window.location.href = document.referrer;
                    }
                }
        }
       
    });
    if(mensagemErro !== 'ok'){
        alert("Email ou senha incorretos!");
    }
    
});