const
    videosPoster = document.querySelectorAll('.videoPoster'),
    multimedia = document.getElementById('multimedia'),
    posterCounter = document.getElementById('countElements'),
    poster = document.querySelector('.pre-header-poster'),
    lernMoreBlock = $('#lernMoreBlockDesign'),
    textBlockDesign = $('#textBlockDesign'),
    enginersPhotos = $('div#blockOfEngineersPhoto');

let setTimeToNextSlide,
    step = 0,
    photoNumber = 0,
    imageNum = 1;

function createLinePreloader(step) {
    posterCounter.innerHTML = "";
    for (let i = 0; i < multimedia.children.length; i++) {
        if (posterCounter.children.length != multimedia.children.length)
            posterCounter.innerHTML += `<span class="counter ${i === step?"fill-color":""}" step="${i}">`
    }
}

function getPreOrNextImage(num, isPressed) {
    step += num;

    let posterElements = multimedia.children,
        timer = 5000,
        videoEl;

    if (step < 0) step = posterElements.length - 1;
    else if (step >= posterElements.length) step = 0;

    if (setTimeToNextSlide && isPressed) clearTimeout(setTimeToNextSlide);

    for (let el of posterElements) {
        videoEl = el.querySelector('video');
        if (el.getAttribute('step') == step) {

            if (el.classList.contains('vs-none')) el.classList.remove('vs-none');
            if (videoEl) {
                timer = videoEl.duration.toFixed(1) * 1000;
            }
            setTimeToNextSlide = setTimeout(() => {

                getPreOrNextImage(1);
            }, timer)
        } else {

            if (!el.classList.contains('vs-none')) el.classList.add('vs-none');

            if (videoEl) {
                videoEl.currentTime = 0;
                // videoEl.pause()
            }


        }
    }
    createLinePreloader(step)
    resize();
}




function resizeVideo(el) { // Масштабирование видео

    // Получение стилей элемента
    let posterStyles = getComputedStyle(poster);
    let videoStyles = getComputedStyle(el);
    if (videosPoster.length == 1) el.style.width = 0;
    if (Number().getNumber(posterStyles.width) >= Number().getNumber(videoStyles.width) && Number().getNumber(posterStyles.height) <= Number().getNumber(videoStyles.height)) {
        // Меняем стили
        el.style.cssText = `width: ${posterStyles.width} !important;`;
    } else {
        // Меняем стилий
        el.style.cssText = `height: ${posterStyles.height} !important;`;
    }
    el.style.cssText += `
        left: ${"-" + (Number().getNumber(videoStyles.width) - Number().getNumber(posterStyles.width)) / 2 + "px;"}
        top: ${"-" + (Number().getNumber(videoStyles.height) - Number().getNumber(posterStyles.height)) / 2 + "px;"}
    `;
}


async function changeCssText(arrayOfElements = [], arrayForWait = [], time = 300) {
    arrayOfElements.forEach(e => {
        e.el.style.cssText += e.cssText
    })
    await new Promise(resolve => setTimeout(resolve, time));
    await arrayForWait.forEach(e => {
        e.el.style.cssText += e.cssText
    })
}

function getLearnMoreBlock(isOpen = false) {
    if (isOpen) {
        changeCssText([{
            el: $('#lernMoreBlockDesign'),
            cssText: `width:0; margin-left:-100%;`
        }, {
            el: $('#aboutDesign'),
            cssText: `opacity:0;transition: opacity 0.2s`
        }], [{
            el: $('#lernMoreBlockDesign'),
            cssText: `display:none`
        }], 500)

    } else {
        changeCssText([{
            el: $('#lernMoreBlockDesign'),
            cssText: `display:block;transition:0.5s`
        }], [{
            el: $('#lernMoreBlockDesign'),
            cssText: `width:100%;margin-left:0;`
        }, {
            el: $('#aboutDesign'),
            cssText: `opacity:1;transition: opacity 2s;`
        }], 100)

    }
}

function getMarginLeft(el, isMinus = true) {
    // * Надо для оптимизации центрирования фотографии в блоке engineer
    let photoWidth = Number().getNumber(getComputedStyle($('div#blockOfEngineersPhoto .media')).width);
    let marginLeft = Number().getNumber(getComputedStyle($('div#blockOfEngineersPhoto')).width) - 108 - photoWidth;
    el.style.cssText = `margin-left: ${isMinus ? '-':'+'}${photoWidth - marginLeft / 2}px;`
}

function setAnimation() {

}

function getNewMiddleImage(num) {
    let
        counter = $('p#engineersImagesCounter'),
        imagesAmount = enginersPhotos.children.length,
        children = enginersPhotos.children,
        elem;

    photoNumber += num;
    if (photoNumber < 0) photoNumber = imagesAmount - 1;
    else if (photoNumber == imagesAmount) photoNumber = 0;

    imageNum += num;
    if (imageNum < 1) imageNum = imagesAmount;
    else if (imageNum > imagesAmount) imageNum = 1;

    counter.innerHTML = `${imageNum} / ${imagesAmount}`;

    let previous = children[photoNumber - 1 < 0 ? imagesAmount - 1 : photoNumber - 1],
        el = children[photoNumber],
        next = children[photoNumber + 1 == imagesAmount ? 0 : photoNumber + 1];

    if (el) {

        for (let e of children) {
            e.style = '';
            e.classList.remove('middle');
            e.classList.add('opacity')
            if (e == el) {
                e.classList.add('middle');
                if (e.classList.contains('opacity'))
                    e.classList.remove('opacity');
            } else if (previous != e && next != e) {
                e.style.display = 'none'
            }

        }



        if (photoNumber - 1 < 0) {
            photoNumber++;
            elem = previous;
            previous.remove();
            enginersPhotos.prepend(elem);
            // getMarginLeft(elem)
        } else if (photoNumber + 1 == imagesAmount) {
            // if(num == 1)
            photoNumber--;
            elem = next;
            next.remove();
            enginersPhotos.append(elem);
            // elem = previous;
            // getMarginLeft(previous)
        } else {


        }
        getMarginLeft(previous)

        if (num == -1) {

            previous.animate([
                // keyframes
                {
                    marginLeft: -(Number().getNumber(getComputedStyle(previous).marginLeft)) * 2 + 'px'
                },
                {
                    marginLeft: getComputedStyle(previous).marginLeft
                }
            ], {
                // timing options
                duration: 500,
                iterations: 1
            });
        } else if (num == 1) {
            console.log(getComputedStyle(next).marginLeft)
            previous.animate([
                // keyframes
                {
                    marginLeft: getComputedStyle(next).marginLeft
                },
                {
                    marginLeft: getComputedStyle(previous).marginLeft
                }
            ], {
                // timing options
                duration: 500,
                iterations: 1
            });

        }
    }

}

function $(el = "body") {
    return document.querySelector(el)
}

Number.prototype.getNumber = function (num = 0) { // * Получение из строки числа
    return typeof num == 'string' ?
        Number(num.split("").map(el => {
            if (el == '.' || !isNaN(Number(el)))
                return el == '.' ? '.' : Number(el)
        }).join("")) :
        num;
}

function resize() { // Отвечает за оптимизацию стилей при загрузке и изменении страницы
    videosPoster.forEach(el => resizeVideo(el));
    getNewMiddleImage(0);

}

window.onresize = resize;
window.onload = () => {
    for (let el of videosPoster) {
        el.addEventListener('loadeddata', resize)
    }
};

if ($('video'))
    $('video').addEventListener('loadedmetadata', () => {
        getPreOrNextImage(0)
    })
$('#preData').addEventListener('click', () => {
    getPreOrNextImage(-1, true)
})
$('#postData').addEventListener('click', () => {
    getPreOrNextImage(1, true)
})

createLinePreloader(step);
getNewMiddleImage(0);