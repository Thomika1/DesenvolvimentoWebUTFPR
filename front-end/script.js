const loginBtn = document.getElementById('login-btn');
const loginPage = document.getElementById('login-page');
const chatPage = document.getElementById('chat-page');


loginBtn.addEventListener('click', (event) => {
    // Evita que o formulário seja submetido e recarregue a página
    event.preventDefault();

    // Esconde a tela de login e mostra a do chat
    loginPage.classList.add('d-none');
    chatPage.classList.remove('d-none');
});