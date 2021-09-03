const
    videosPoster = document.querySelectorAll('.videoPoster'),
    multimedia = document.getElementById('multimedia'),
    posterCounter = document.getElementById('countElements'),
    poster = document.querySelector('.pre-header-poster'),
    lernMoreBlock = $('#lernMoreBlockDesign'),
    textBlockDesign = $('#textBlockDesign'),
    enginersPhotos = $('div#blockOfEngineersPhoto'),
    reviesBlock = $('#blockOfReviews');

let setTimeToNextSlide, timeOut, intervalOut,
    step = 0,
    photoNumber = 0,
    imageNum = 1;


function createLinePreloader(step) { // Создет линии на постере какие элементы
    if(!posterCounter)return;

    posterCounter.innerHTML = "";
    for (let i = 0; i < multimedia.children.length; i++) {
        if (posterCounter.children.length != multimedia.children.length)
            posterCounter.innerHTML += `<span class="counter ${i === step?"fill-color":""}" step="${i}">`
    }
}

function getPreOrNextImage(num, isPressed) { // получаем следующий или предыдущий постер
    step += num;

    let posterElements = multimedia.children,
        timer = 5000,
        videoEl;

    // Устанавливаем пределы
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


function getLearnMoreBlock(isOpen = false) { // Получение блока с текстом lern more
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

function getNewMiddleImage(num) {
    if(!enginersPhotos) return;

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

function resize() { // Отвечает за оптимизацию стилей при загрузке и изменении страницы
    videosPoster.forEach(el => resizeVideo(el));
    getNewMiddleImage(0);
    if(reviesBlock){
        changeCssText([{
            el: reviesBlock.children[0],
            cssText: `margin-left:${getNumFromStyle(reviesBlock, 'width') / 2 - getNumFromStyle(reviesBlock.children[0], 'width') / 2}px;`
        }, {
            el: reviesBlock.children[reviesBlock.children.length - 1],
            cssText: `margin-right:${getNumFromStyle(reviesBlock, 'width') / 2 - getNumFromStyle(reviesBlock.children[0], 'width') / 2}px;`
        }])
    }
}

window.onresize = resize;
window.onload = () => {

    for (let el of videosPoster) {
        el.addEventListener('loadeddata', resize)
    }
    resize()
};

function scrollReviews(number = 0){
    if (timeOut)
        clearTimeout(timeOut);

    let children = reviesBlock.children,
        e = reviesBlock;
    for (let element of children) {
        if (element.classList.contains('show'))
            element.classList.remove('show');
    }
    let scrollSize = (e.scrollWidth - getNumFromStyle(reviesBlock, 'width')) / (children.length - 1);

    let num = Math.round(e.scrollLeft / scrollSize) + number;
    if(num > children.length - 1) num = children.length - 1;
    else if(num < 0) num = 0;

    console.log(num)
    let el = children[num];
    el.classList.add('show')

    timeOut = setTimeout(() => {
        intervalOut = setInterval(() => {
            if (Math.round(e.scrollLeft) > Math.round(num * scrollSize) + 10)
                e.scrollLeft -= 10;
            else if (Math.round(e.scrollLeft) < Math.round(num * scrollSize) - 10)
                e.scrollLeft += 10;
            else {
                clearInterval(intervalOut)
                e.scrollLeft = scrollSize * num;
            }
        }, 10);
    }, 300);
}
if(reviesBlock)
    reviesBlock.addEventListener('scroll', ()=>{scrollReviews()})

if ($('video'))
    $('video').addEventListener('loadedmetadata', () => {
        getPreOrNextImage(0)
    })

if($('#preData'))    
    $('#preData').addEventListener('click', () => {
        getPreOrNextImage(-1, true)
    })

if($('#postData'))
    $('#postData').addEventListener('click', () => {
        getPreOrNextImage(1, true)
    })

createLinePreloader(step);
getNewMiddleImage(0);