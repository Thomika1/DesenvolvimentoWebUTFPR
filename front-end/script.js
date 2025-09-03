const loginBtn = document.getElementById('login-btn');
const loginPage = document.getElementById('login-page');
const chatPage = document.getElementById('chat-page');
const enviarBtn = document.getElementById('enviar-btn');
const inputChat = document.getElementById('input-chat');

loginBtn.addEventListener('click', (event) => {
    // Evita que o formulário seja submetido e recarregue a página
    event.preventDefault();

    // Esconde a tela de login e mostra a do chat
    loginPage.classList.add('d-none');
    chatPage.classList.remove('d-none');
});

enviarBtn.addEventListener('click', (event)=>{
    event.preventDefault();

    const text = inputChat.value;
    inputChat.value = "";

})  