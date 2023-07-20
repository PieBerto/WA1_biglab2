
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
//const dayjs = require('dayjs');
//const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
//const customParseFormat = require('dayjs/plugin/customParseFormat');
//import { Database } from 'sqlite3';

//dayjs.extend(isSameOrAfter);
//dayjs.extend(customParseFormat)
//dayjs.extend(window.dayjs_plugin_isBetween)



export function Film(id, title, favorite, date, rating){
    this.id = id;
    this.title = title;
    this.favorite = favorite;
    this.date = date;
    this.rating = rating;
    this.toString = () => {
        let date;
        let rating;
        if (this.date === undefined)
            date = "<not defined>";
        else
            date = this.date.format("MMMM DD, YYYY");
        if(this.rating === undefined)
            rating = "<not assigned>";
        else
            rating = this.rating;
        return "Id: "+ this.id+", Title: "+ this.title + ", Favorite: "  + this.favorite +", Watch date: " + date +", Score: " + rating;  
    }
    this.resetWatchDate = () =>{
        this.date = undefined;
    }
}






function allFilter(films){
    return films.map((film) => film);
}

function favoriteFilter(films){
    
    let filmFiltered = films.filter((film) => film.favorite);
    return filmFiltered;
}

function bestRatedFilter(films){
    
    let filmFiltered = films.filter((film) => film.rating === 5);
    return filmFiltered;
}

function seenLastMonthFilter(films){
    
    let filmFiltered = films.filter((film) => {
        if (film.date)
            return film.date.isBetween(dayjs().subtract(30,'day'),dayjs());
        return false; 
    });
    return filmFiltered;
}

function unseenFilter(films){
    
    let filmFiltered = films.filter((film) => film.date? false : true);
    return filmFiltered;
}


/*
function allFilter(ul,lib){
    deleteAll(ul);
    lib.films.forEach((film) => createFilmElement(ul,film));
}

function favoriteFilter(ul,lib){
    deleteAll(ul);
    let filmFiltered = lib.films.filter((film) => film.favorite);
    filmFiltered.forEach((film) => createFilmElement(ul,film));
}

function bestRatedFilter(ul,lib){
    deleteAll(ul);
    let filmFiltered = lib.films.filter((film) => film.rating === 5);
    filmFiltered.forEach((film) => createFilmElement(ul,film));
}

function seenLastMonthFilter(ul,lib){
    deleteAll(ul);
    let filmFiltered = lib.films.filter((film) => {
        if (film.date)
            return film.date.isBetween(film.date.subtract(30,'day'),dayjs());
        return false; 
    });
    console.log(filmFiltered);
    filmFiltered.forEach((film) => createFilmElement(ul,film));
}

function unseenFilter(ul,lib){
    deleteAll(ul);
    let filmFiltered = lib.films.filter((film) => film.date? false : true);
    filmFiltered.forEach((film) => createFilmElement(ul,film));
}

function deleteAll(ul){
    ul.innerHTML = '';
}*/
/*
function createFilmElement(ul,filmObj){
    
    let li = document.createElement('li');
    li.classList.add('list-group-item');
    let div = document.createElement('div');
    div.classList.add('container-fluid');
    li.append(div);
    let row = document.createElement('div');
    row.classList.add('row');
    div.append(row);
    
    
    let name = document.createElement('div');
    name.classList.add('col');
    name.innerText = filmObj.title;
    row.append(name);
    let trash = document.createElement('div');
    trash.classList.add('col');
    row.append(trash);
    trash.innerHTML = ' <button  type="button" class="btn btn-link trash" ><i class="bi bi-trash3"></i></button>'
    trash.addEventListener("click",() => {
        lib.deleteFilmByTitle(filmObj.title);
        filterDictionaryFun[currFilterActive.innerHTML](ul,lib);
    });
    let favorite = document.createElement('div');
    favorite.classList.add('col');
    row.append(favorite)
    let form = document.createElement('div');
    form.classList.add('form-check');
    favorite.append(form);
    if(filmObj.favorite){
        form.innerHTML = '<input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked><label class="form-check-label" for="flexCheckChecked">Favorite</label>';

    }
    else{
        form.innerHTML = '<input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"><label class="form-check-label" for="flexCheckChecked">Favorite</label>';
    }
    let watchdate = document.createElement('div');
    watchdate.classList.add('col');
    watchdate.innerText = filmObj.date? filmObj.date.format("MMMM DD, YYYY"): '' ;
    row.append(watchdate);

    let starRating = document.createElement('div');
    starRating.classList.add('col');
    row.append(starRating);

    for(let i = 0; i<filmObj.rating; i++){
        let icon = document.createElement('i');
        icon.classList.add('bi');
        icon.classList.add('bi-star-fill');
        starRating.append(icon);
    }

    for(let i = 0; i<5-filmObj.rating; i++){
        let icon = document.createElement('i');
        icon.classList.add('bi');
        icon.classList.add('bi-star');
        starRating.append(icon);
    }

    ul.append(li);

}

const filterDictionary = {
    All : 0,
    Favorites : 1,
    "Best Rated" : 2,
    "Last seen" : 3,
    "Unseen" : 4
}
*/

const filterDictionaryFun = {
    All : allFilter,
    Favorites : favoriteFilter,
    "Best Rated" : bestRatedFilter,
    "Last Seen" : seenLastMonthFilter,
    "Unseen" : unseenFilter,
}

export function applyFilter(filmArray, filter){
    return filterDictionaryFun[filter](filmArray);
}
/*
function updateFilter(e){
    title.innerText = e.target.innerText;
    currFilterActive.classList.remove('active');
    currFilterActive = filters.children[filterDictionary[e.target.innerText]];
    currFilterActive.classList.add('active');
    filterDictionaryFun[currFilterActive.innerHTML](ul,lib);
}
*/




/*

lib.deleteFilmByTitle('Matrix');


let title = document.getElementById('title');
const ul = document.getElementById('filmLibrary');
const filters = document.getElementById('filters');
const buttonsTrash = document.getElementsByClassName('trash');
allFilter(ul,lib);


for ( let i = 0; i<filters.children.length ;i++){
    filters.children[i].addEventListener("click",updateFilter)
}
let currFilterActive = filters.children[0];







//fLib.addMovieInDatabase(shrek).then(() => console.log('The operation succeed')).catch((err) => console.log(err + ' GANGG'));
/*
function displayAll() {
    let string = "<td> ";
    let stringForChecked = "";
    let tbody = document.getElementById('tbodyFilms');
    tbody.innerHtml = '';
    library.filmArray.forEach(element => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${element.Title}</td>`;
        stringForChecked = `<td><input class="form-check-input mt-1" type="checkbox" value="" aria-label="Checkbox for following text input"`;
        if(element.Favorite)
            stringForChecked += " checked";
        stringForChecked += `> Favorite</td>`;
        row.innerHTML += stringForChecked;
        row.innerHTML += `<td>${element.data}</td>`;
        for (let index = 0; index < element.rating; index++) {
            string += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
        </svg> `;    
        }

        for (let index = 0; index < 5-element.rating; index++) {
            string += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
        </svg> `;
        }

        string += "</td>";
        row.innerHTML += string;
        
        tbody.appendChild(row);
        string ="<td> ";
    });
};*/
