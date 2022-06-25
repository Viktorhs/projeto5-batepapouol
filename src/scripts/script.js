let nomeUsuario = {
    name:undefined
};
let mensagensRecebidas = [];
let chat = [];

let pessoas = [];
let listaPessoas = [];

let paraQuem = "Todos";
let tipoDeMensagem = "message";

function entrarChat(){
    let promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeUsuario);
    promessa.then(entrarChatSucesso);
    promessa.catch(entrarChatErro);
}

function entrarChatErro(erro) {
    alert("O nome de usuario ja esta sendo usado, tente outro nome");
    nomeJaUtilizado();
}

function entrarChatSucesso(sucesso) {
    requisitarMensagensDoChat();
    habilitarChat();
    atulizarPessoas();
    atulizarAsCoisas();
}

function verificarConexao () {
    let promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeUsuario);
    promessa.then(verificarConexaoSucesso);
    promessa.catch(verificarConexaoErro);
}

function verificarConexaoSucesso(sucesso){
}

function verificarConexaoErro(erro){
    alert("voce foi desconectado")
    window.location.reload()
}

function requisitarMensagensDoChat() {
    let promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(requisitarMensagensSucesso);
    promessa.catch(requisitarMensagensErro);
}

function requisitarMensagensSucesso(sucesso){
    mensagensRecebidas = sucesso.data
    montarMensagens();
    renderizarMensagens();
    ultimaMensagem();
}

function requisitarMensagensErro(erro){
    console.log(erro);
}


function montarMensagens() {
    chat = []
    let mensagem;

    for(let i = 0; i < mensagensRecebidas.length; i++){
        
        if(mensagensRecebidas[i].type === "status"){
            mensagem = `
            <li class="status">
                <p>(${mensagensRecebidas[i].time})</p>
                <h2><strong>${mensagensRecebidas[i].from}</strong> ${mensagensRecebidas[i].text}</h2>
            </li>`
            chat.push(mensagem);
        }else if(mensagensRecebidas[i].type === "private_message" && mensagensRecebidas[i].to === nomeUsuario.name){    
            mensagem = `
            <li class="privado">
                <p>(${mensagensRecebidas[i].time})</p>
                <h2><strong>${mensagensRecebidas[i].from}</strong> reservadamente para <strong>${mensagensRecebidas[i].to}</strong>:</h2>
                <h3>${mensagensRecebidas[i].text}</h3>
            </li>`
            chat.push(mensagem)
        }else {
            mensagem = `
            <li>
                <p>(${mensagensRecebidas[i].time})</p>
                <h2><strong>${mensagensRecebidas[i].from}</strong> para ${mensagensRecebidas[i].to}:</h2>
                <h3>${mensagensRecebidas[i].text}</h3>
            </li>`
            chat.push(mensagem)
        }
    }
}

function renderizarMensagens() {
    document.querySelector(".mensagens").innerHTML = '';
    for(let i = 0; i < chat.length; i++){
        document.querySelector(".mensagens").innerHTML += chat[i];
    }
}

function enviarMensagen() {
    const mensagemDigitada = document.querySelector(".barra-mensagem input").value;
    const mensagemParaServidor = {
        from: nomeUsuario.name,
	    to: paraQuem,
	    text: mensagemDigitada,
	    type: tipoDeMensagem,
    }
    console.log(mensagemParaServidor)
    let promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagemParaServidor)
    promessa.then(enviarMensagenSucesso);
    promessa.catch(enviarMensagenErro);
}

function enviarMensagenSucesso(sucesso) {
    console.log("tudo certo")
    document.querySelector(".barra-mensagem input").value = ""
    paraQuem = "Todos"
    tipoDeMensagem = "message"
    requisitarMensagensDoChat()
    descricaoModoMensagem()
    atulizarPessoas()
}

function enviarMensagenErro(erro) {
    alert("nenhuma mensagem")

}

function ultimaMensagem() {
    let mensagens = document.querySelectorAll(".mensagens li")
    let ultima = mensagens[mensagens.length - 1];
    ultima.scrollIntoView();
}

//Bonus//

const menuLateral = () => {document.querySelector(".menu-lateral").classList.remove("esconder")
document.querySelector("body").classList.add("parar")
};
const esconderMenuLateral = (elemento) => {elemento.parentNode.classList.add("esconder")
document.querySelector("body").classList.remove("parar")
};

function atulizarPessoas() {
    let promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    promessa.then(atulizarPessoasSucesso)
    //promessa.catch(atulizarPessoasErro)
}

function atulizarPessoasSucesso(sucesso){
    pessoas = sucesso.data;
    listaPessoas = []
    montarLista()
    renderizarListaPessoas()
}

function montarLista(){
    let template =`
    <li class="ativo">
        <span onclick="escolherPessoa(this)">
            <ion-icon name="people-sharp"></ion-icon>
            <h5>Todos</h5> 
        </span>
    </li>`
    listaPessoas.push(template);

    for(let i = 0; i < pessoas.length; i++) {
        template = `
        <li>
            <span onclick="escolherPessoa(this)">
                <ion-icon name="person-circle-sharp"></ion-icon>
                <h5>${pessoas[i].name}</h5> 
            </span>
        </li>`
        listaPessoas.push(template);
    }
}

function renderizarListaPessoas() {
    document.querySelector(".chat-lista").innerHTML = '';
    for(let i = 0; i < listaPessoas.length; i++){
        document.querySelector(".chat-lista").innerHTML += listaPessoas[i];
    }
}

function escolherPessoa(elemento) {
    paraQuem = elemento.querySelector("h5").innerHTML;
    let lista = document.querySelector(".chat-lista .ativo");
    if(lista !== null){
        lista.classList.remove("ativo")
    }
    elemento.parentNode.classList.add("ativo")

    descricaoModoMensagem()
}

function escolherModo(elemento) {
    modoMensagem = elemento.querySelector("h5").innerHTML;
    let lista = document.querySelector(".visibilidade .ativo");
    if(lista !== null){
        lista.classList.remove("ativo")
    }
    elemento.classList.add("ativo")
    document.querySelector(".barra-mensagem p").innerHTML = "Enviado para (reservadamente)"

    if(modoMensagem === "Reservadamente"){
        tipoDeMensagem = "private_message"
    }else{
        tipoDeMensagem = "message"
    }

    descricaoModoMensagem()
}

function atulizarAsCoisas(){
    setInterval(requisitarMensagensDoChat, 3000)
    setInterval(atulizarPessoas, 10000)
    setInterval(verificarConexao, 5000)
}

function descricaoModoMensagem() {
    let modo
    if(tipoDeMensagem === "private_message"){
        modo = "Reservadamente"
    }else{
        modo = "público"
    }

    let descricao = `Enviado para ${paraQuem}(${modo})`

    document.querySelector(".barra-mensagem p").innerHTML = descricao;

}

function botaoEntrar(){
    nomeUsuario.name = document.querySelector(".tela-login input").value;
    document.querySelector(".login").classList.add("esconder")
    document.querySelector(".tela-login .carregar").classList.remove("esconder")
    entrarChat()

}

function habilitarChat(){
    document.querySelector(".tela-login").classList.add("esconder")
    document.querySelector("header").classList.remove("esconder")
    document.querySelector("main").classList.remove("esconder")
    document.querySelector(".barra-mensagem").classList.remove("esconder")

}

function nomeJaUtilizado() {
    document.querySelector(".login").classList.remove("esconder")
    document.querySelector(".tela-login .carregar").classList.add("esconder")
}

