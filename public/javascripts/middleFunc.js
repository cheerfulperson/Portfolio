let $ = (el = "body") => { // TODO Сокращенная форма получения элемента
    return document.querySelector(el);
}

function getNumFromStyle(el, style) { // TODO Получение у элемента из стиля числа
    return Number().getNumber(getComputedStyle(el)[style]);
}

Number.prototype.getNumber = function (num = 0) { // ? Получение из строки числа
    return typeof num == 'string' ?
        Number(num.split("").map(el => {
            if (el == '.' || !isNaN(Number(el)))
                return el == '.' ? '.' : Number(el)
        }).join("")) :
        num;
}

async function changeCssText(arrayOfElements = [], arrayForWait = [], time = 300) { // * Функция меняет сss через время и сразу
    arrayOfElements.forEach(e => {
        e.el.style.cssText += e.cssText
    })
    await new Promise(resolve => setTimeout(resolve, time));
    await arrayForWait.forEach(e => {
        e.el.style.cssText += e.cssText
    })
}


const formData = form => { // TODO Получение объекта из формы
    if (!form) return;
    let data = new Object(),
        inputs = form.querySelectorAll('input'),
        txtFields = form.querySelectorAll('textarea');

    for (let el of inputs) {
        if (el.type === 'checkbox' && !el.checked)
            el.value = 'off';

        if(el.value)
            data[el.name] = el.value ;
    }
    for (let el of txtFields) 
        data[el.name] = el.value;
    

    return data;
}

// ? Example POST method implementation:
async function postData(url = '', data = {}, meth = 'POST', contentType = 'application/json') {
    // Default options are marked with *
    const response = await fetch(url, {
        method: meth, // * GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', /// *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': contentType
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: meth !== 'GET' ? JSON.stringify(data) : null // body data type must match "Content-Type" header
    });
    
    return response.json(); // parses JSON response into native JavaScript objects
}

// * Добавленение или удаление имя класса
function addOrRemoveClassName(element, className) {
    if (!element) return;
    element.classList.toggle(className);
}