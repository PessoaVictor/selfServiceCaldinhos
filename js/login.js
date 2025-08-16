document.getElementById("login").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    let listaCadastro = JSON.parse(localStorage.getItem('usuariosCadastrados')) || [];
    let login = JSON.parse(sessionStorage.getItem('usuarioLogado')) || [];

    cadastrado = listaCadastro.some(elemento => elemento.email == email && elemento.senha == senha);

    if(cadastrado){
            if(login.length>0){
                login = []
            }

                let loginDados = {
                    email: email,
                    senha: senha
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
    }else{
        alert("Email ou senha incorretos!");
    }
});