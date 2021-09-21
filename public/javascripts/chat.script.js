let chatInfoBlock = document.getElementById('chatInfo'),
    btnCloseChatInfo = document.getElementById('closeChatInfo'),
    btnOpenChatInfo = document.getElementById('openChatInfo');

btnCloseChatInfo.addEventListener('click', (e) => {
    chatInfoBlock.classList.toggle('vs-none');
})
btnOpenChatInfo.addEventListener('click', (e) => {
    chatInfoBlock.classList.toggle('vs-none');
})

let socket = new WebSocket(new URL(`ws:${location.host}`));

socket.onopen = () => {
    console.log("Connected")
}