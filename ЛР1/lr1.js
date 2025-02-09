const searchButton = document.getElementById('search');
const queryInput = document.getElementById('query');
const resultsDiv = document.getElementById('results');
const errorDiv = document.getElementById('error');

searchButton.addEventListener('click', async () => {
  const query = queryInput.value.trim();
  if (query === '') {
    showError('Please enter a search query.');
    return;
  }

  clearResults();
  showError('');

  try {
    const data = await searchBooks(query);
    if (data.numFound === 0) {
      showError('No results found.');
    } else {
      displayResults(data.docs);
    }
  } catch (error) {
    showError('An error occurred. Please try again later.');
  }
});

async function searchBooks(query) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
}

function displayResults(books) {
  books.forEach((book) => {
    const card = document.createElement('div');
    card.className = 'card';

    const cover = document.createElement('img');
    cover.className = 'cover-image';
    if (book.cover_i) {
      cover.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    } else {
      cover.src = 'https://via.placeholder.com/128x193?text=No+Cover';
    }
    cover.alt = book.title || 'Book cover';

    const title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = book.title || 'No title available';

    const author = document.createElement('div');
    author.className = 'card-author';
    author.textContent = book.author_name
      ? `Author: ${book.author_name.join(', ')}`
      : 'Author: Unknown';

    const date = document.createElement('div');
    date.className = 'card-date';
    date.textContent = book.first_publish_year
      ? `First published: ${book.first_publish_year}`
      : 'No publication date';

    card.appendChild(cover);
    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(date);
    resultsDiv.appendChild(card);
  });
}

function clearResults() {
  resultsDiv.innerHTML = '';
}

function showError(message) {
  errorDiv.textContent = message;
}
