// import { API } from "./Api/index.js"
const API = "https://bible-api.com/data";

const elements = {
  translations_select:
    document.getElementsByTagName("select").translations_select,
  container: document.querySelector('[data-js="container_book_list"]'),
  books_select: document.querySelector('[data-js="book-select"]'),
  content: document.querySelector('[data-js="main-content"]'),
};

const Book = {
  id: "GEN",
  translation: "web",
  name: "Genesis",
  chapter: 1,
  books: [],
  async fetchData(endpoint) {
    const cache = {};
    try {
      const results = await fetch(endpoint);
      const data = await results.json();
      return data;
    } catch (error) {
      console.log(error.message);
    }
  },
  async fetchBooks() {
    elements.books_select.innerHTML = "";
    const books_result = await Book.fetchData(`${API}/${this.translation}`);
    const { books, translation } = await books_result;
    if (!books[0].id || !books[0]?.name || !translation?.identifier) {
      return;
    }
    this.update({ books: books, translation: translation.identifier });
    this.displayBookList();
  },
  update(
    { id, name, translation, chapter, books } = {
      id: this.id,
      name: this.name,
      translation: this.translation,
      chapter: this.chapter,
      books: this.books,
    }
  ) {
    this.id = id || this.id;
    this.name = name || this.name;
    this.translation = translation || this.translation;
    this.chapter = chapter || this.chapter;
    this.books = books || this.books;
    return {
      id: this.id,
      translation: this.translation,
      name: this.name,
      chapter: this.chapter,
      books: this.books,
    };
  },
  displayBookList() {
    this.books.forEach((book) => {
      const { id, name } = book;

      const books_options = document.createElement("option");

      books_options.setAttribute("value", id);
      id === this.id ? (books_options.selected = true) : "";

      books_options.textContent = name;
      elements.books_select.appendChild(books_options);
    });
  },
  render() {},
};

(async () => {
  const { translation, id, chapter, name } = Book;

  const { translations } = await Book.fetchData(API);
  translations ? createTranslationsOptions(translations) : "";

  Book.fetchBooks();
  const { verses } = await Book.fetchData(
    `${API}/${translation}/${id}/${chapter}`
  );
  displayVerses(verses, `${name} ${chapter}`);
})();

const displayVerses = (verses, chapter) => {
  elements.content.innerHTML = "";
  const h1 = document.createElement("h1");
  h1.textContent = chapter;
  elements.content.appendChild(h1);
  verses.forEach((verse_object) => {
    const { text, verse } = verse_object;
    const wrapper = document.createElement("div");
    const span = document.createElement("span");
    const p = document.createElement("p");

    span.textContent = `${Book.chapter}:${verse}`;
    p.textContent = text;
    wrapper.appendChild(span);
    wrapper.appendChild(p);
    elements.content.appendChild(wrapper);
  });
};

const createTranslationsOptions = (translations) => {
  translations.forEach((translation) => {
    const { name, identifier } = translation;

    const translations_options = document.createElement("option");

    translations_options.setAttribute("value", identifier);
    identifier === "web" ? (translations_options.selected = true) : "";

    translations_options.textContent = name;
    elements.translations_select.appendChild(translations_options);
  });
};

const chooseLanguage = async (e) => {
  const { books } = await Book.fetchData(`${API}/${e.target.value}`);
  const { id, name } = books[0];

  const updated_book = Book.update({
    translation: e.target.value,
    id: id,
    name: name,
  });

  const { verses } = await Book.fetchData(
    `${API}/${updated_book.translation}/${updated_book.id}/${updated_book.chapter}`
  );

  Book.fetchBooks();
  displayVerses(verses, `${updated_book.name} ${updated_book.chapter}`);
};

const changeBook = async (e) => {
  if (Book.id !== e.target.id) {
    const chapter_name = e.target.options[e.target.selectedIndex].text;

    Book.update({
      id: e.target.value,
      name: chapter_name,
    });

    const { translation, id, chapter, name } = Book;
    const { verses } = await Book.fetchData(
      `${API}/${translation}/${id}/${chapter}`
    );

    displayVerses(verses, `${name} ${chapter}`);
  }
  return;
};

elements.translations_select.addEventListener("change", chooseLanguage);
elements.books_select.addEventListener("change", changeBook);
