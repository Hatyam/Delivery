/* Тема сайта */
let btn = document.querySelector('#theme__mode')

if (localStorage.getItem('theme-toggle') === 'dark') {
    document.body.classList.toggle('dark')
    btn.textContent = '🌙'
    btn.style.backgroundColor = 'grey'
}

btn.addEventListener('click', () => {
    document.body.classList.toggle('dark')

    if (document.body.classList.contains('dark')) {
        btn.textContent = '🌙'
        btn.style.backgroundColor = 'grey'
        localStorage.setItem('theme-toggle', 'dark')
    } else {
        btn.textContent = '☀️'
        btn.style.backgroundColor = 'white'
        localStorage.setItem('theme-toggle', 'light')
    }
})

/* Калькулятор */
let form = document.querySelector('.form_calculate')

const formRegExp = {
    username: /^(?=[А-Я])[a-я]{2,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^(\+7|8)\d{10}$/,
    square: /^\d+$/,
    weight: /^\d+/,
    'buy-country': /^[а-яА-Я][а-я]{1,}$/,
    'buy-town': /^[а-яА-Я][а-я]{1,}$/,
    'send-state': /^[а-яА-Я][а-яА-Я]{1,}.*$/,
    'send-town': /^[а-яА-Я][а-я]{1,}$/,
    theme: /.+/,
    sms: /.+/,
}

let totalSum = document.querySelector('.calculation__button')
let lastSum

function isAllValid(formInp) {
    let formInputs = document.querySelectorAll(`${formInp}`)
    return Array.from(formInputs).every(item => formRegExp[item.name].test(item.value))
}

if (!localStorage.hasOwnProperty('form')) localStorage.setItem('form', JSON.stringify({}))
Array.from(form.querySelectorAll('.form__input__item')).forEach(el => {
    let obj = JSON.parse(localStorage.getItem('form'))
    if (obj[el.name] !== undefined) 
        el.value = obj[el.name]
})
if (isAllValid('.form_calculate .form__input__item')) {
    lastSum = +localStorage.getItem('totalSum')
    totalSum.textContent += `${lastSum}`
}

form.addEventListener('input', (event) => {
    let input = event.target
    let rule = formRegExp[input.name]

    if (rule) {
        if (rule.test(input.value.trim())) {
            input.style.outline = '2px solid green'

            let obj = JSON.parse(localStorage.getItem('form'))
            obj[input.name] = input.value
            localStorage.setItem('form', JSON.stringify(obj))
        }
        else {
            input.style.outline = '2px solid red'
        }
    }

    if (isAllValid('.form_calculate .form__input__item')) {
        if (lastSum === undefined) {
            lastSum = form.querySelector("input[name='square']").value * form.querySelector("input[name='weight']").value
            totalSum.textContent += `${lastSum}`
        }
        else {
            totalSum.textContent = totalSum.textContent.replace(`${lastSum}`, `${form.querySelector("input[name='square']").value * form.querySelector("input[name='weight']").value}`)
            lastSum = form.querySelector("input[name='square']").value * form.querySelector("input[name='weight']").value
        }
        localStorage.setItem('totalSum', `${lastSum}`)
    }
})

/* FAQ */
let faqQuestions = document.querySelectorAll('.faq .faq__wrapper')

Array.from(faqQuestions).forEach(item => {
    item.addEventListener('click', () => {
        if (item.parentElement.classList.contains('faq__item__closed')) {
            item.querySelector('.faq__open').textContent = '▲'
        }
        else {
            item.querySelector('.faq__open').textContent = '▼'
        }
        item.parentElement.classList.toggle('faq__item__closed')
        item.parentElement.classList.toggle('faq__item__opened')
    })
})

/* Остались вопросы? */
let formQuestions = document.querySelector('.questions__form')

formQuestions.addEventListener('input', (event) => {
    let input = event.target
    let rule = formRegExp[input.name]

    if (rule) {
        if (rule.test(input.value.trim())) {
            input.style.outline = '2px solid green'

            let obj = JSON.parse(localStorage.getItem('formQuestions'))
            obj[input.name] = input.value
            localStorage.setItem('formQuestions', JSON.stringify(obj))
        }
        else {
            input.style.outline = '2px solid red'
        }
    }
})

if (!localStorage.hasOwnProperty('formQuestions')) localStorage.setItem('formQuestions', JSON.stringify({}))
Array.from(formQuestions.querySelectorAll('.form__input__item')).forEach(el => {
    let obj = JSON.parse(localStorage.getItem('formQuestions'))
    if (obj[el.name] !== undefined) 
        el.value = obj[el.name]
})

/* Отправка письма на почту */
emailjs.init('KU44lPOwgGQibpZ3j')

formQuestions.addEventListener('submit', (event) => {
    event.preventDefault()

    if (!isAllValid('.questions__form .form__input__item')) {
        alert('Заполните все поля!')
        return;
    }

    let timeInput = document.createElement('input')
    timeInput.type = 'hidden'
    timeInput.name = 'time'
    let now = new Date()
    let timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}\n${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getYear().toString()}`
    timeInput.value = timeStr
    formQuestions.appendChild(timeInput)

    emailjs.sendForm('service_s2990uc', 'template_tp0646c', formQuestions, 'KU44lPOwgGQibpZ3j')
        .then(() => {
            alert('✅ Сообщение отправлено!')
            formQuestions.reset()
        })
        .catch(err => {
            alert('❌ Ошибка при отправке:' + err.text)
        })

})

/* Слайдер */
const slides = document.querySelectorAll('.reviews .overflow .slide')
let sliderTrack = document.querySelector('.reviews .slider .slider__track')
let slideWidth = slides[0].offsetWidth
let slideMargin = parseInt(getComputedStyle(slides[0]).marginRight)

let index = 1
let step = slideWidth + slideMargin
sliderTrack.style.transition = 'none'
sliderTrack.style.transform = `translateX(-${step}px)`
requestAnimationFrame( () => {
    requestAnimationFrame(() => {sliderTrack.style.transition = '.5s'})
})

let isAnimating = false

window.addEventListener('resize', () => {
    slideWidth = slides[0].offsetWidth
    slideMargin = parseInt(getComputedStyle(slides[0]).marginRight)
    step = slideWidth + slideMargin
    sliderTrack.style.transition = 'none'
    sliderTrack.style.transform = `translateX(-${step * index}px)`
    requestAnimationFrame( () => {
        requestAnimationFrame(() => {sliderTrack.style.transition = '.5s'})
})
})

document.querySelector('.reviews .slider .slider__track').addEventListener('transitionend', () => {
    if (index === 0) {
        sliderTrack.style.transition = 'none'
        sliderTrack.style.transform = `translateX(-${(Array.from(slides).length - 2) * step}px)`
        
        index = Array.from(slides).length - 2

        requestAnimationFrame( () => {
            requestAnimationFrame(() => {sliderTrack.style.transition = '.5s'})
        } )
    }
    else if (index === Array.from(slides).length - 2) {
        sliderTrack.style.transition = 'none'
        sliderTrack.style.transform = `translateX(0px)`
        
        index = 0

        requestAnimationFrame( () => {
            requestAnimationFrame(() => {sliderTrack.style.transition = '.5s'})
        } )
    }

    isAnimating = false
})

document.querySelector('.reviews .slider .prev__button').addEventListener('click', () => {
    if (isAnimating) return
    isAnimating = true

    if (index === 0) {
        sliderTrack.style.transition = 'none'
        sliderTrack.style.transform = `translateX(-${(Array.from(slides).length - 2) * step}px)`
        
        index = Array.from(slides).length - 3

        requestAnimationFrame( () => {
            requestAnimationFrame( () => {
                sliderTrack.style.transition = '.5s'
                document.querySelector('.slider__track').style.transform = `translateX(-${index * step}px)`})
        })

    } else {
        index = (index - 1) % (slides.length - 1)
        document.querySelector('.slider__track').style.transform = `translateX(-${index * step}px)`
    }
})

document.querySelector('.reviews .slider .next__button').addEventListener('click', () => {
    if (isAnimating) return
    isAnimating = true

    if (index === Array.from(slides).length - 2) {
        sliderTrack.style.transition = 'none'
        sliderTrack.style.transform = `translateX(0px)`
        
        index = 1

        requestAnimationFrame( () => {
            requestAnimationFrame( () => {
                sliderTrack.style.transition = '.5s'
                document.querySelector('.slider__track').style.transform = `translateX(-${index * step}px)`})
        })

    } else {
        index = (index + 1) % (slides.length - 1)
        document.querySelector('.slider__track').style.transform = `translateX(-${index * step}px)`
    }
})

/* Подсказки ввода */
let optionsFullAddress = {
    method: "POST",
    mode: "cors",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + 'c747b1e14381a01ff22ee5093ad6a4ea23d10759'
    },
    body: JSON.stringify({query: 'тихоре'})
}

async function getCountry(url, options) {
    try {
        let fet = await fetch(url, options)
        if (fet.ok === true) {
            let json = await fet.json()

            return json.suggestions
        } else {
            throw new Error('упс...')
        }
    } catch (err) {
        console.log('Произошла ошибка: ' ,err)
        return []
    }
}

let countryEl = document.querySelector('.form_calculate [name="buy-country"]')
let townElBuy = document.querySelector('.form_calculate [name="buy-town"]')
let townElSend = document.querySelector('.form_calculate [name="send-town"]')
let stateElSend = document.querySelector('.form_calculate [name="send-state"]');

const clueKey = new Map()
clueKey.set('buy-town', 'city')
clueKey.set('send-town', 'city')
clueKey.set('send-state', 'region_with_type');

[countryEl ,townElBuy, townElSend, stateElSend].forEach(async (curVal) => {
    curVal.addEventListener('input', async () => {
        if (curVal.parentElement.querySelector('ul')) {
            curVal.parentElement.querySelector('ul').remove()
        }

        if (isAllValid(`.form_calculate [name="${curVal.name}"]`)) {
            let url
            if (curVal.name === 'buy-country') {
                url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/country"
            } else {
                url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
            }
            opt = optionsFullAddress
            opt.body = JSON.stringify({query: curVal.value})
        
            const countries = await getCountry(url, opt)

            let ul = document.createElement('ul')
            ul.style.position = 'absolute'
            ul.style.zIndex = '1'
            ul.style.width = '100%'
            ul.style.listStyle = 'none'
            ul.style.padding = '0'
            ul.style.margin = '0'
            ul.style.backgroundColor = '#DCDCDC'
            ul.style.borderRadius = '3px'
            
            if (curVal.name === 'buy-country') {
                for (let country of countries) {
                    let li = document.createElement('li')
                    li.textContent = country.value

                    ul.appendChild(li)
                }
            } else {
                const newSet = new Set()
                for (let country of countries) {
                    if (!newSet.has(country.data[clueKey.get(curVal.name)])) {
                        newSet.add(country.data[clueKey.get(curVal.name)])
                        
                        let li = document.createElement('li')
                        li.textContent = country.data[clueKey.get(curVal.name)]
                        ul.appendChild(li)
                    }
                }
            }

            curVal.parentElement.appendChild(ul)

            Array.from(ul.querySelectorAll('li')).forEach((cV) => {
                cV.addEventListener('click', () => {
                    curVal.value = cV.textContent
                    let newCountryLS = cV.textContent
                    let obj = JSON.parse(localStorage.form)
                    obj[`${curVal.name}`] = newCountryLS
                    localStorage.form = JSON.stringify(obj)

                    ul.remove()
                })
            })

            document.addEventListener('click', (event) => {
                if (!curVal.contains(event.target)) {
                    ul.remove()
                }
            })
        }
    })
})

/* Модальное окно */
let modalBtn = document.querySelector('.header .chapters__button')
modalBtn.addEventListener('click', () => {
    let modalWindow = document.createElement('div')
    modalWindow.style.position = 'fixed'
    modalWindow.style.fontSize = '16px'
    modalWindow.style.lineHeight = '20px'
    modalWindow.style.borderRadius = '5px'
    modalWindow.style.width = '20vw'
    modalWindow.style.backgroundColor = '#DCDCDC'
    modalWindow.style.textAlign = 'center'
    modalWindow.style.color = '#000'
    modalWindow.style.zIndex = '9999'
    modalWindow.style.opacity = '1'
    modalWindow.innerHTML = 'Совсем скоро вы сможете оставить заявку!</br>Для закрытия нажмитие вне окошка'
    modalWindow.style.height = 'max-content'

    let overlay = document.createElement('div')
    overlay.style.position = 'fixed'
    overlay.style.width = '100vw'
    overlay.style.height = '100vh'
    overlay.style.top = '0'
    overlay.style.left = '0'
    overlay.style.zIndex = '9998'
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'

    document.body.appendChild(overlay)
    document.body.appendChild(modalWindow)

    document.body.style.overflow = 'hidden'

    modalWindow.style.left = `${window.innerWidth / 2 - +modalWindow.offsetWidth / 2}px`
    modalWindow.style.top = `${window.innerHeight / 2 - +modalWindow.offsetHeight / 2}px`

    overlay.addEventListener('click', (event) => {
        document.body.style.overflow = ''
        if (!modalWindow.contains(event.target)) {
            modalWindow.remove()
            overlay.remove()
        }
    })
})