let books = [];

const RENDER_BOOKS = "render-books";
const STORAGE_KEY = "books";

const searchBar = document.getElementById("search-bar");
let searchQuery;
const clearAllBooksButton = document.getElementById("delete-all-button");

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

const findIndexBook = (id) => {
  for (const index in books) {
    if (books[index].id == id) {
      return index;
    }
  }
  return -1;
};

const findBook = (id) => {
  const bookFinded = books.find((item) => item.id == id);
  return bookFinded;
};

function removeBook(id) {
  const deletedBook = findIndexBook(id);

  if (!deletedBook === -1) return;
  books.splice(deletedBook, 1);

  document.dispatchEvent(new Event(RENDER_BOOKS));
  saveData();
}

function switchStatusBook(id) {
  const book = findBook(id);

  book.isComplete = !book.isComplete;
  document.dispatchEvent(new Event(RENDER_BOOKS));
  saveData();
}

const saveData = () => {
  if (isStorageExist()) {
    const dataParsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, dataParsed);
    document.dispatchEvent(new Event(RENDER_BOOKS));
  }
};

function loadDataFromStorage() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_BOOKS));
}

function generateRandomId() {
  return +new Date();
}

function generateBookObject(id, title, author, desc, isComplete) {
  return {
    id,
    title,
    author,
    desc,
    isComplete,
  };
}

function addBook() {
  const title = document.getElementById("book-title").value;
  const desc = document.getElementById("book-desc").value;
  const author = document.getElementById("book-author").value;
  const isComplete = document.getElementById("book-done-type").checked;
  const id = generateRandomId();

  const book = generateBookObject(id, title, author, desc, isComplete);
  books.push(book);
  document.dispatchEvent(new Event(RENDER_BOOKS));
  saveData();
}

function makeBook(book) {
  const title = document.createElement("h3");
  title.innerText = book.title;

  const author = document.createElement("p");
  author.innerText = book.author;

  const bookHead = document.createElement("p");
  bookHead.classList.add("book-head");
  bookHead.append(title, author);

  const sectionDesc = document.createElement("h5");
  sectionDesc.innerText = "Short Description";

  const bookDesc = document.createElement("p");
  bookDesc.innerText = book.desc;

  const bookDescContainer = document.createElement("div");
  bookDescContainer.classList.add("book-desc");
  bookDescContainer.append(sectionDesc, bookDesc);

  const iconTrash = document.createElement("img");
  iconTrash.setAttribute("src", "../assets/icon-trash.png");

  const iconTrashDiv = document.createElement("div");
  iconTrashDiv.classList.add("icon-trash");
  iconTrashDiv.append(iconTrash);
  iconTrashDiv.addEventListener("click", function () {
    // console.log("book id = ", book.id);
    removeBook(book.id);
  });

  const iconDone = document.createElement("img");
  iconDone.setAttribute("src", "../assets/icon-done.png");

  const iconDoneDiv = document.createElement("div");
  iconDoneDiv.classList.add("icon-done");
  iconDoneDiv.append(iconDone);
  iconDoneDiv.addEventListener("click", function () {
    // console.log("book status => ", book.isComplete);
    switchStatusBook(book.id);
  });
  const bookActionDiv = document.createElement("div");
  bookActionDiv.classList.add("book-action");
  bookActionDiv.append(iconTrashDiv, iconDoneDiv);

  const cardBook = document.createElement("div");
  cardBook.classList.add("card-book");
  cardBook.append(bookHead, bookDescContainer, bookActionDiv);
  cardBook.setAttribute("id", `book-${book.id}`);

  return cardBook;
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form-add");

  submitForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_BOOKS, function () {
  const unreadBooks = document.getElementById("unread-book");
  const finishReadBooks = document.getElementById("read-book");
  unreadBooks.innerHTML = "<h2>Unread Book</h2>";
  finishReadBooks.innerHTML = "<h2>Finished Book</h2>";

  if (!searchBar.value) {
    books.map((item) => {
      const book = makeBook(item);

      if (!item.isComplete) {
        unreadBooks.append(book);
      } else {
        finishReadBooks.append(book);
      }
    });
  } else {
    books
      .filter((book) => {
        console.log(book.title);
        return book.title.toLowerCase().includes(searchQuery);
      })
      .map((item) => {
        const book = makeBook(item);

        if (!item.isComplete) {
          unreadBooks.append(book);
        } else {
          finishReadBooks.append(book);
        }
      });
  }
});

clearAllBooksButton.addEventListener("click", function (e) {
  //   e.preventDefault();
  console.log("click");
  localStorage.clear();
  //   document.dispatchEvent(new Event(RENDER_BOOKS));
  //   saveData();
  window.alert("All Books Deleted");
  location.reload();
});

searchBar.addEventListener("change", function () {
  searchQuery = searchBar.value.toLowerCase();
  document.dispatchEvent(new Event(RENDER_BOOKS));
});
