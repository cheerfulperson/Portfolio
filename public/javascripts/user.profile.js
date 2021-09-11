const registerForm = $('#blockHidenReg form'),
    bodyRegisterForm = $('#joinUS form'),
    loginForm = $('#logInBlock form'),
    feedbackForm = $('form#formFeedback');

let originUrl = new URL(location.origin);

function closeParentNode(parent) {
    if (!parent) return;
    if (!parent.classList.contains('vs-none'))
        parent.classList.add('vs-none');
}

function sendToServer(parent, alertBlock, e) {
    conosole.log(originUrl)
    postData(new URL('/users/signup', originUrl).href, formData(e.target))
        .then(data => {

            if (!data.event) return; // Если пусто, то выходим из функции

            let textMessage, wrongInput; // Текст сообщения
            alertBlock.style.cssText = null;
            if (data.event === 'onverify') {
                textMessage =
                    `
            <strong>HI!</strong> The information has been successfully sent to the server. Please check your inbox
            to confirm your <b>Email</b>.
            `
            } else if (data.event === 'onexpect') {
                alertBlock.style.cssText = `background:red;`;
                textMessage =
                    `
                <strong>Please</strong>, expect <b>${data.time}</b> to send another latter.
                `
            } else if (data.event === 'password not converge') {
                alertBlock.style.cssText = `background:red;`;
                textMessage =
                    `
             <strong>Please</strong>, check your password carefully.
             `
            } else if (data.event === 'wrong email' || data.event === 'wrong psw') { // Ошибка пароля
                wrongInput = parent.querySelector(`input.${data.event === 'wrong email' ? 'email' : 'psw'}`);
                alertBlock.style.cssText = `background:red;`;

                textMessage = `<strong>Hmmm!</strong> Something happened. 
                    ${data.event === 'wrong email' 
                    ? 'This <b>Email</b> address is already in use... or wrong.' 
                    : 'This <b>password</b> is wrong.'}`

                addOrRemoveClassName(wrongInput, 'wrong-input');
            }
            alertBlock.querySelector('span.text').innerHTML = textMessage;
            alertBlock.classList.remove('vs-none');

            setTimeout(() => {
                closeParentNode(alertBlock);
                addOrRemoveClassName(wrongInput, 'wrong-input');
            }, 15000);
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

[registerForm, bodyRegisterForm].forEach(el => {
    if (el) {
        el.addEventListener('submit', e => {
            let parent = e.target.parentNode;
            let alertBlock = parent.querySelector('.alert');

            e.preventDefault();
            sendToServer(parent, alertBlock, e);
        })
    }
})

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {

        e.preventDefault();
        postData(new URL('/users/login', originUrl).href, formData(e.target))
            .then(data => {
                console.log(data    )
                let alertBlock = e.target.parentNode.querySelector('div.alert');
                alertBlock.style.cssText = null;

                if (data.state === 404) {

                    alertBlock.style.cssText = `background:red;`;

                    alertBlock.querySelector('.text').innerHTML =
                        `
                <strong>Hmmm!</strong> Something happened. Incorrect <b>email address</b> or <b>password</b>...
                `
                    alertBlock.classList.remove('vs-none');

                    for (let el of e.target.querySelectorAll('input'))
                        addOrRemoveClassName(el, 'wrong-input');

                    setTimeout(() => {
                        closeParentNode(alertBlock);
                        for (let el of e.target.querySelectorAll('input'))
                            addOrRemoveClassName(el, 'wrong-input');
                    }, 15000);
                } else if (data.state === 200) {
                    window.location.replace(location.origin);
                }

                console.log(data)
            })
            .catch(console.error);
    })
}

// * Feedback block

if (feedbackForm) {
    ['keyup', 'keydown', 'keypress'].forEach(event => {
        if (document.getElementById('textReview')) {
            document.getElementById('textReview').addEventListener(event, (e) => {
                document.getElementById('textLength').innerHTML = e.target.value.length;
            })
        }

    })

    function toggleVsNone(id) {
        document.getElementById(id).classList.toggle('vs-none');
    }

    $('form#formFeedback').addEventListener('submit', e => {
        e.preventDefault();
        console.log(formData(e.target))
    })
    let interval;
    feedbackForm.addEventListener('submit', e => {
        e.preventDefault();
        postData(new URL('/users/feedback', originUrl).href, formData(e.target))
            .then(data => {
                let alertBlock = e.target.parentNode.querySelector('div.alert');
                alertBlock.style.cssText = null;
                if (interval) clearTimeout(interval);

                if (data.state === 204) {

                    alertBlock.style.cssText = `background:red;`;

                    alertBlock.querySelector('.text').innerHTML =
                        `
                        <strong>Hmmm!</strong> Something happened. Your <b>review</b> must contain at least 30 characters...
                        `
                    alertBlock.classList.remove('vs-none');

                    for (let el of e.target.querySelectorAll('input'))
                        addOrRemoveClassName(el, 'wrong-input');

                    addOrRemoveClassName(e.target.querySelector('textarea'), 'wrong-textarea');

                    interval = setTimeout(() => {
                        closeParentNode(alertBlock);
                        if (e.target.querySelector('textarea').classList.contains('wrong-textarea')) {
                            for (let el of e.target.querySelectorAll('input'))
                                addOrRemoveClassName(el, 'wrong-input');
                            addOrRemoveClassName(e.target.querySelector('textarea'), 'wrong-textarea');
                        }
    
                    }, 15000);
                } else if (data.state === 200) {
                    alertBlock.querySelector('.text').innerHTML =
                        `
                    <strong>Thank you, </strong>your opinion is very important for us! Your review has been sent successfully.
                    `
                    interval = setTimeout(() => {
                        closeParentNode(alertBlock);
                    }, 15000);
                }
                alertBlock.classList.remove('vs-none');
                
                console.log(data)
            })
            .catch(console.error);
    })
}
