let chatInfoBlock = document.getElementById('chatInfo'),
    btnCloseChatInfo = document.getElementById('closeChatInfo'),
    btnOpenChatInfo = document.getElementById('openChatInfo'),
    blockChats = document.getElementById('chats');

btnCloseChatInfo.addEventListener('click', (e) => {
    chatInfoBlock.classList.toggle('vs-none');
})
btnOpenChatInfo.addEventListener('click', (e) => {
    chatInfoBlock.classList.toggle('vs-none');
})

let socket = new WebSocket(new URL(`ws:${location.host}`));

socket.onopen = (ws, ev) => {
    console.log("Connected")
}


function loadEventListener(parent) {
    let elements = parent.childNodes;
    if(!elements)return;

    elements.forEach(el => {
        el.addEventListener('click', e => {
            let chatUid = el.getAttribute('chatname');  
            socket.send(JSON.stringify({event: 'openchat', data: chatUid}));
            chatInfoBlock.classList.toggle('vs-none');
            document.getElementById('msgAboutChat').remove();
            document.getElementById('chatContainer').classList.remove('vs-none');
        })
    })
}

function fillInfoAboutChats(data = Array) {
    for (obj of data) {
        console.log(obj);
        str = `
            <div class="chat-stream" chatname="${obj.chats[0]}">
                <div class="user-image">
                    <img src="${obj.image}" alt="avatar">
                </div>
                <div class="data-info">
                    <h3 class="name">${obj.name}</h3>
                    <p class="message">${obj.email}</p>
                </div>
            </div>`
        blockChats.innerHTML += str;
    }
    loadEventListener(blockChats);
}

socket.onmessage = (ws, ev) => {
    console.log("Message");
    const message = JSON.parse(ws.data);

    switch (message.event) {
        case 'uploadChats':
            fillInfoAboutChats(message.data)
            break;

        default:
            break;
    }
}

socket.onerror = function(error) {
    alert("Ошибка " + error.message);
  };