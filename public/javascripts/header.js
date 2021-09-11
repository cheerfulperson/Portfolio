const header = document.querySelector('header.Header'),
    btnMenu = document.getElementById('btnMenu'),
    navBar = document.getElementById('navBar'),
    blockIn = document.getElementById('regAndAuthBlock'),
    wrapMenu = document.getElementById('wrapMenu'),
    personBlock = document.getElementById('personBlock'),
    btnToShowQR = document.getElementById('qrIn');

function openIn(id) {
    let elem = document.getElementById(id);
    if (!blockIn || !elem) return;

    document.body.style.overflow = 'hidden';
    blockIn.style.height = '100%';
    for (let el of blockIn.children) {
        if (el.id != "closeBlockIn")
            el.style.display = 'none';
        else
            el.style.display = 'block';
    }


    elem.style.cssText = 'display: block';
    setTimeout(() => {
        elem.style.marginTop += 0;
    }, 100)
}

function closeBlockIn() {
    if (!blockIn) return;

    setTimeout(() => {
        for (let el of blockIn.children)
            el.style.display += 'none';
    }, 100)

    blockIn.style.height = '0';
    document.body.style.overflow = 'auto';
}

function changeHeader() {
    header.style.transition = 'background 0.5s linear';
    if (header.getAttribute('check') == 'off') {
        if (window.scrollY > 10) {
            if (!header.classList.contains('show-color')) {
                header.classList.add('show-color');
            }
        } else header.classList.remove('show-color')
    }
}

function addOrRemoveClass(el, className) {
    if (!el) return;
    el.classList.toggle(className);
}

function dropNavBar() {
    // toggle() - если есть подкласс то удалит и наоборот
    addOrRemoveClass(btnMenu, 'vs-none');
    addOrRemoveClass(wrapMenu, 'vs-none');
    if (window.innerWidth <= 400)
        addOrRemoveClass(document.getElementById('logo'), 'vs-none');

    setElementsTextCss();
    personBlock.style.cssText = `margin-right: ${wrapMenu.classList.contains('vs-none')?'0':'180'}px;`

}

function setElementsTextCss() {
    wrapMenu.style.cssText =
        `margin-left: ${parseInt(getComputedStyle(document.getElementById('headerContainer')).width) - 200}px;`;
}
window.onscroll = changeHeader; // При скролинге

// При изменении размера окна   
window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
        navBar.classList.remove('overlay');
        header.classList.remove('show-color')
    }
    setElementsTextCss();
})
// Овечает за открытие блоков с регестрацией и входом
let params = new URL(location.href).searchParams.get('open');

if (params) {
    if (params == 'login')
        openIn('logIn')
    else if (params == 'signUp')
        openIn('blockHidenReg');
}

[btnMenu, document.getElementById('closeMenuBtn')].forEach(el => {
    el.addEventListener('click', dropNavBar);
})
let avatarsBlock = [document.getElementById('userImage'), document.getElementById('avatarsChoice')];

if (avatarsBlock[0]) {
    let interval;

    function closeBlock(e) {
        avatarsBlock[1].style.opacity = '0';

        clearTimeout(interval);
        interval = setTimeout(() => {
            avatarsBlock[1].classList.add('vs-none');
        }, 500)
    }

    function openBlock(e) {
        if (e.target.id === 'userImage' && avatarsBlock[1].classList.contains('vs-none'))
            avatarsBlock[1].classList.remove('vs-none');

        clearTimeout(interval);
        interval = setTimeout(() => {
            avatarsBlock[1].style.opacity = '1';
        }, 100)
    }

    function chooseImage() {
        let block = avatarsBlock[1];
        for (let el of block.querySelectorAll('img')) {
            el.addEventListener('click', (e) => {
                postData(new URL('/users/avatar', originUrl).href, {
                    image: e.target.src
                }).then(res => {
                    if (!res) return
                    if (res.state === 200)
                        location.reload();
                }).cacth(console.error)
            })
        }
    }


    avatarsBlock.forEach(el => {
        ['touchenter', 'mouseenter'].forEach(event => {
            el.addEventListener(event, e => {openBlock(e)})
        })

    })

    avatarsBlock[1].addEventListener('mouseleave', (e) => closeBlock(e))
    document.body.addEventListener('touchstart', (e) => {
        if (e.target.id != 'userImage' && e.target.id != 'avatarsBlock' && e.target.id != 'avatarsChoice') closeBlock(e);
        else openBlock(e);
    })


    chooseImage();
}

if (btnToShowQR) {
    btnToShowQR.addEventListener('click', e => {
        let code = document.getElementById('code'),
            qrblock = document.getElementById('qrblock'),
            timeInfo = document.getElementById('timeInfo'),
            deviceID = document.getElementById('deviceID'),
            userAgentInfo = document.getElementById('userAgentInfo'),
            btnReloadDeviceData = document.getElementById('reloadDeviceData');

        addOrRemoveClassName(qrblock, 'vs-none');


        function getDeviceData() {
            $('div#qr').innerHTML = `<img src="https://acegif.com/wp-content/uploads/loading-25.gif" alt="load">`
            postData(new URL('/users/auth/qrcode', originUrl).href, {}, 'GET')
                .then(data => {
                    if (!data) return;

                    code.innerHTML = data.pin;
                    $('div#qr').innerHTML = data.svg;
                })
                .catch(err => {
                    console.error(err);
                    $('div#qr').innerHTML = err;
                })
            let imgLoad = `<img width="20px" height="20px" src="https://acegif.com/wp-content/uploads/loading-25.gif" alt="load">`
            timeInfo.innerHTML = imgLoad;
            userAgentInfo.innerHTML = imgLoad;
            deviceID.innerHTML = imgLoad;
            postData(new URL('/users/device-data', originUrl).href, {}, 'GET')
                .then(data => {
                    if (!data) return;
                    else if (data.state === 204) {
                        timeInfo.innerHTML = "No information";
                        userAgentInfo.innerHTML = "No information";
                        deviceID.innerHTML = "No information";
                    } else {
                        timeInfo.innerHTML = data.time;
                        userAgentInfo.innerHTML = data.userAgent;
                        deviceID.innerHTML = data.ip;
                    }
                    console.log(data)
                })
                .catch(err => {
                    console.error(err);

                })
        }
        getDeviceData();
        btnReloadDeviceData.addEventListener('click', getDeviceData);
    })
}