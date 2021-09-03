const header = document.querySelector('header.Header'),
    btnMenu = document.getElementById('btnMenu'),
    navBar = document.getElementById('navBar'),
    blockIn = document.getElementById('regAndAuthBlock'),
    wrapMenu = document.getElementById('wrapMenu'),
    personBlock = document.getElementById('personBlock');

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

if(avatarsBlock[0]){

    function chooseImage() {
        let block = avatarsBlock[1];
        for (let el of block.querySelectorAll('img')) {
            el.addEventListener('click', (e) => {
                postData(new URL('/users/avatar', originUrl).href, {image: e.target.src}).then(res => {
                    if(!res) return
                    if(res.state === 200)
                        location.reload();              
                }).cacth(console.error)
            })
        }
    }
    
    avatarsBlock.forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            avatarsBlock[1].style.opacity = '1';
    
        })
        el.addEventListener('mouseleave', (e) => {
            avatarsBlock[1].style.opacity = '0';
        })
    })
    chooseImage();
}