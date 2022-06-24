let nomeUsuario = {
    name:undefined
}
let mensagensRecebidas = [];
let chat = [];

function entrarChat(){
    nomeUsuario.name = prompt("Qual o seu nome:") 
    let promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeUsuario)
    promessa.then(entrarChatSucesso);
    promessa.catch(entrarChatErro);
}

function entrarChatErro(erro) {
    alert("O nome de usuario ja esta sendo usado, tente outro nome");
    entrarChat()
}

function entrarChatSucesso(sucesso) {
    alert("Tudo certo pode usar o chat!!!")
    requisitarMensagensDoChat()
}

function requisitarMensagensDoChat() {
    let promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promessa.then(requisitarMensagensSucesso)
    promessa.catch(requisitarMensagensErro)
}

function requisitarMensagensSucesso(sucesso){
    mensagensRecebidas = sucesso.data
    montarMensagens()
    renderizarMensagens()
    ultimaMensagem()
    //atualizarChat()

}

function requisitarMensagensErro(erro){
    console.log(erro)
}


function montarMensagens() {
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
                <h2><strong>${mensagensRecebidas[i].from}</strong> para todos:</h2>
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

function ultimaMensagem() {
    let mensagens = document.querySelectorAll(".mensagens li")
    let ultima = mensagens[mensagens.length - 1];
    ultima.scrollIntoView()
}

function atualizarChat() {
    setInterval(requisitarMensagensDoChat(), 3000)
}

requisitarMensagensDoChat()