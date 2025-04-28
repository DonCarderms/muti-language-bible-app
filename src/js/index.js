// import { API } from "./Api/index.js"
const API = 'https://bible-api.com/data'

const elements = {
    translations_select: document.getElementsByTagName('select').translations_select,
    container: document.querySelector('[data-js="container_book_list"]'),
    book_list: document.querySelector('[data-js="book_list"]'),
    content: document.querySelector('[data-js="main-content"]')
}

let book_state = {
    book_id: 'GEN',
    translation: 'web',
    book: 'Genesis',
    chapter: 1,
}

let currentChapter = 'default'


const fetchData = async (endpoint) => {
    const results = await fetch(endpoint)
    const data = await results.json()
    return data
}

(async () => {
    const { translation, book_id, chapter, book } = book_state

    const { translations } = await fetchData(API)
    translations ? createTranslationsOptions(translations) : ''

    const { books } = await fetchData(`${API}/${translation}`)
    books ? elements.container.appendChild(displayBookList(books, elements.book_list, 'web')) : ''

    const { verses } = await fetchData(`${API}/${translation}/${book_id}/${chapter}`)
    displayVerses(verses, `${book} ${chapter}`)
})()


const displayVerses = (verses, chapter) => {
    elements.content.innerHTML = ''
    const h1 = document.createElement('h1')
    h1.textContent = chapter
    elements.content.appendChild(h1)
    verses.map((verse_object) => {
        const { text, verse } = verse_object
        const wrapper = document.createElement('div')
        const span = document.createElement('span')
        const p = document.createElement('p')

        span.textContent = verse
        p.textContent = text
        wrapper.appendChild(span)
        wrapper.appendChild(p)
        elements.content.appendChild(wrapper)
    })

}

const createTranslationsOptions = (translations) => {
    translations.map((translation) => {
        const { name, url, identifier, language, language_code } = translation

        const translations_options = document.createElement('option')
        const options_link = document.createElement('a')


        translations_options.setAttribute('value', identifier)
        identifier === 'web' ? translations_options.selected = true : ''

        options_link.setAttribute('href', url)

        translations_options.textContent = name

        translations_options.appendChild(options_link)
        elements.translations_select.appendChild(translations_options)
    })
}



const displayBookList = (books, book_list, book_list_id) => {
    book_list.setAttribute('id', book_list_id)
    book_list.innerHTML = ''
    books.map((book) => {
        const { id, name, url } = book
        const li = document.createElement('li')

        li.setAttribute('id', id)
        li.setAttribute('name', name)
        li.textContent = name

        // li.appendChild(a)
        book_list.appendChild(li)
    })

    return book_list
}

const chooseLanguage = async (e) => {
    book_state.translation = e.target.value
    const { books } = await fetchData(`${API}/${e.target.value}`)
    books ? elements.container.appendChild(displayBookList(books, elements.book_list, e.target.value)) : ''

    const { id, name } = books[0]

    book_state.book_id = id
    book_state.book = name

    const { translation, book_id, book, chapter } = book_state
    const { verses } = await fetchData(`${API}/${translation}/${book_id}/${chapter}`)
    displayVerses(verses, `${book} ${chapter}`)
}

const changeBook = async (e) => {
    if (book_state.book_id !== e.target.id) {
        const chapter_name = document.querySelector(`#${e.target.id}`).getAttribute('name')

        book_state.book_id = e.target.id
        book_state.book = chapter_name
        const { translation, book_id, chapter, book } = book_state

        const { verses } = await fetchData(`${API}/${translation}/${book_id}/${chapter}`)

        displayVerses(verses, `${book} ${chapter}`)
    }
    return
}

elements.translations_select.addEventListener('change', chooseLanguage)
elements.book_list.addEventListener('click', changeBook)
