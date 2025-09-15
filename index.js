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