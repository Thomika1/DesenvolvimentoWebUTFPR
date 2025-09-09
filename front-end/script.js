const loginBtn = document.getElementById('login-btn');
const loginPage = document.getElementById('login-page');
const chatPage = document.getElementById('chat-page');
const enviarBtn = document.getElementById('enviar-btn');
const inputChat = document.getElementById('input-chat');
const messageContainer = document.getElementById('message-container');

loginBtn.addEventListener('click', (event) => {
    // Evita que o formulário seja submetido e recarregue a página
    event.preventDefault();

    // Esconde a tela de login e mostra a do chat
    loginPage.classList.add('d-none');
    chatPage.classList.remove('d-none');
});
 

// ... (código existente para encontrar elementos)

enviarBtn.addEventListener('click', () => {
    const message = inputChat.value;

    if (message.trim() !== '') {
        // Lógica para a mensagem do usuário
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'd-flex my-2';
        
        const messageBubble = document.createElement('div');
        messageBubble.className = 'p-2 rounded';
        messageBubble.style.backgroundColor = '#0d6efd';
        messageBubble.style.color = '#fff';
        messageBubble.textContent = message;
        
        messageBubble.classList.add('ms-auto');
        
        messageWrapper.appendChild(messageBubble);
        messageContainer.appendChild(messageWrapper);
        inputChat.value = '';
        messageContainer.scrollTop = messageContainer.scrollHeight;

        // ---- Lógica para a Resposta da IA ----
        setTimeout(() => {
            const botMessageWrapper = document.createElement('div');
            botMessageWrapper.className = 'd-flex my-2';

            const botMessageBubble = document.createElement('div');
            botMessageBubble.className = 'p-2 rounded';
            
            // Estilo diferente para a mensagem da IA (cinza)
            botMessageBubble.style.backgroundColor = '#6c757d'; 
            botMessageBubble.style.color = '#fff';
            botMessageBubble.textContent = "Olá!";

            // A classe me-auto alinha a bolha para a esquerda
            botMessageBubble.classList.add('me-auto');
            
            botMessageWrapper.appendChild(botMessageBubble);
            messageContainer.appendChild(botMessageWrapper);

            // Rola novamente para o final
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }, 500); // 500 milissegundos = meio segundo de atraso
    }
});