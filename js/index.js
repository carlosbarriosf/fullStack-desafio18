
const main = document.querySelector('main');

const movies = JSON.parse(localStorage.getItem('movies')) || movieObjects;

document.addEventListener('DOMContentLoaded', homePage)

function homePage () {

    const home = document.createElement('div');
    const xhr = new XMLHttpRequest;
    changeToPage('home')
    xhr.open('get', '../pages/home.html');
    xhr.addEventListener('load', () => {
        home.innerHTML = xhr.response;


        const cardContainer = home.querySelector('[data-card-container]');
        movies.forEach(movie => {
                const cardTemplate = home.querySelector('[data-card-template]');
                const card = cardTemplate.content.cloneNode(true).children[0];
        
                const title = card.querySelector('[data-card-title]');
                title.innerText = movie.title;
        
                const premiere = card.querySelector('[data-card-date]');
                premiere.innerText = movie.year;
        
                const genre = card.querySelector('[data-card-genre]');
                genre.innerText = movie.genre;
        
                const description = card.querySelector('[data-card-description]');
                description.innerText = movie.description;
        
                cardContainer.appendChild(card)
        })

        const selectYearElement = home.querySelector('#selectYear');
        // console.log(selectYearElement)
        const yearArray = movies.map( movie => movie.year);
        // console.log(yearArray)
        const options = [...new Set(yearArray)].sort((a, b) => b - a);
        // console.log(options)

        options.forEach( option => {
            const optionElement = document.createElement('option');
            optionElement.innerHTML = option;
            // console.log(optionElement)
            optionElement.value = option
            selectYearElement.appendChild(optionElement)
        })

        main.innerHTML = home.innerHTML
    
        const select = document.querySelector('#selectYear');

        const cards = Array.from(document.querySelectorAll('[data-card]'));
        // console.log(cards)
        const cardObjects = cards.map(card => {
            const title = card.querySelector('[data-card-title]');
            const year = card.querySelector('[data-card-date]');
            return { title: title.innerText, year: year.innerText, element: card, visible: true };
        })
        // console.log(cardObjects)

        // console.log(select)
        select.addEventListener('change', (e) => {
            const value = e.target.value;
            cardObjects.forEach(card => {
                const isVisible = card.year === value || value === 'noValue';
                card.element.classList.toggle('hide', !isVisible );
                card.visible = isVisible;
                // console.log(card)
            })
        })

        const searchBar = document.getElementById('searchBar');
        // console.log(searchBar)
        searchBar.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            cardObjects.forEach(card => {
                if(card.visible) {
                    let isVisible = card.title.toLowerCase().includes(value);
                    card.element.classList.toggle('hide', !isVisible)
                }
            })
            const hiddenCards = cardObjects.map(card => {
                const isHidden = card.element.classList.contains('hide');
                return isHidden
            })
            const errorMessage = document.querySelector('[data-nothing-found]');
            if(hiddenCards.indexOf(false) === -1) {
                errorMessage.style.display = 'block';
            } else {
                errorMessage.style.display = 'none';
            }
        })
    })
    xhr.send();
}


function addMoviePage () {
    const newXhr = new XMLHttpRequest;
    const addMovie = document.createElement('div');
    newXhr.open('get', '../pages/addMovie.html');
    newXhr.addEventListener('load', () => {
        addMovie.innerHTML = newXhr.response;
        main.innerHTML = addMovie.innerHTML;

        const form = document.querySelector('[data-form]');
        console.log(form)

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const titleInput = form.querySelector('[data-title-input]');
            const genreInput = form.querySelector('[data-genre-input]');
            const yearInput = form.querySelector('[data-year-input]');
            const descriptionInput = form.querySelector('[data-description-input]');
        
            const isValid = titleInput.value && genreInput.value && yearInput.value && descriptionInput.value;
            if(isValid) {
                const newMovie = {
                    title: titleInput.value,
                    genre: genreInput.value,
                    year: Number(yearInput.value),
                    description: descriptionInput.value
                };

                const savedMovies = JSON.parse(localStorage.getItem('movies'));
                savedMovies.push(newMovie)
                console.log(savedMovies)
                localStorage.setItem('movies', JSON.stringify(savedMovies))
            }
        })
    })
    newXhr.send()
}


// window.addEventListener('unload', function() {
//     console.log(location.hash);
//     location.hash = '';
//     console.log(location.hash);
// });

// window.addEventListener('beforeunload', function(e) {
//     e.preventDefault();
//     e.returnValue = '';
// });


function changeToPage(page) {
    location.hash = page;
}

window.addEventListener('popstate', () => {
    const { hash } = location;
    const parsedHash = hash.slice(1);
    console.log(parsedHash)
    if(parsedHash === 'addMovie') {
        addMoviePage();
    } else {
        homePage();
    }
})