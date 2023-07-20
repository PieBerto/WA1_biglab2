'use strict';


//import isBetween from 'dayjs/plugin/isBetween'
const dayjs = require('dayjs');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const isBetween = require('dayjs/plugin/isBetween');

//import { Database } from 'sqlite3';

dayjs.extend(isSameOrAfter);
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)
//dayjs.extend(window.dayjs_plugin_isBetween)



class Film {
    constructor(id, title, favorite, date, rating) {
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
            if (this.rating === undefined)
                rating = "<not assigned>";

            else
                rating = this.rating;
            return "Id: " + this.id + ", Title: " + this.title + ", Favorite: " + this.favorite + ", Watch date: " + date + ", Score: " + rating;
        };
        this.resetWatchDate = () => {
            this.date = undefined;
        };
        return this;
    }
}

function sortFilm(film1,film2){
    if(film1.date === film2.date){
        return 0;
    }
    else if(film1.date === undefined){
        return 1;
    }
    else if(film2.date === undefined){
        return -1;
    }
    else if(film1.date.isSameOrAfter(film2.date))
        return 1;
    else 
        return -1;

}

 function FilmLibrary(){
    this.films = [];

    this.addNewFilm =  (film) =>{
        if (film instanceof Film)
            this.films.push(film);
    }
    this.toString = () =>{
        return this.films.map(f => f.toString()).reduce((previous,current) => previous + current + '\n',"");
    }

    this.sortByDate = () =>{
        let newFilmLibrary = new FilmLibrary();
        newFilmLibrary.films = [...this.films];
        newFilmLibrary.films.sort(sortFilm);
        return newFilmLibrary;
    }

    this.filmInLibrary = (id) =>{
        for (let f in this.films){
            if (f.id === this.id)
                return true;
        }
        return false;
    }

    this.deleteFilm = (id) => {
        let i = 0;
        for (const f of this.films){
            
            if (f.id === id){
                this.films.splice(i,1);
                return;
            }
            i++;
        }        
    }
    this.deleteFilmByTitle = (title) => {
        let i = 0;
        for (const f of this.films){
            
            if (f.title === title){
                this.films.splice(i,1);
                return;
            }
            i++;
        }        
    }

    this.resetWatchedFilms = () =>{
        this.films.forEach((f) => f.resetWatchDate());
    }

    this.getRated = () => {
        return this.films.filter((f) => f.rating )
    }
    
    
    this.getAllFromDatabase = () =>{
        return new Promise((resolve, reject) =>{
            const sqlQuery = 'SELECT * FROM Films';
            db.all(sqlQuery,(err, rows) => {
                if(err)
                    reject(err);
                resolve(rows.map((row) => new Film(row.id, row.title, row.favorite, dayjs(row.date), row.rating)));
            })
        })
    }

    this.getFavoriteFromDatabe = () => {
        return new Promise((resolve, reject) => {
            const sqlQuery = 'SELECT * FROM Films WHERE Favorite = 1';
            db.all(sqlQuery, (err, rows) => {
                if (err)
                    reject(err);
                resolve(rows.map((row) => new Film(row.id, row.title, row.favorite, dayjs(row.watchdate), row.rating)));
            })
        });
    }

    this.getFilmsWatchedTodayFromDatabase = () =>{
        return new Promise((resolve, reject) => {
            const sqlQuery = 'SELECT * FROM films WHERE watchdate = ?';
            const today = new dayjs().format('YYYY-MM-DD');
            db.all(sqlQuery, [today], (err, rows) => {
                if(err)
                    reject(err);
                resolve(rows.map((row) => new Film(row.id, row.title, row.favorite, dayjs(row.watchdate), row.rating)));
            })
        })
    }

    this.getFilmsEarlierFromDatabase = (date) => {
        return new Promise((resolve, reject) => {
            const sqlQuery = 'SELECT * FROM Films WHERE date < ?';
            db.all(sqlQuery, [date], (err, rows) => {
                if(err)
                    reject(err);
                resolve(rows.map((row) => new Film(row.id, row.title, row.favorite, dayjs(row.watchdate), row.rating)));
            })
        })
    }

    this.getRatedFilmFromDatabase = (rating) => {
        return new Promise((resolve, reject) => {
            const sqlQuery = 'SELECT * FROM Films WHERE rating >= ?';
            db.all(sqlQuery, [rating], (err, rows) => {
                if (err)
                    reject(err);
                resolve(rows.map((row) => new Film(row.id, row.title, row.favorite, dayjs(row.watchdate), row.rating)));
            })
        })
    }

    this.getFilmFromDatabase = (title) => {
        return new Promise((resolve, reject) => {
            const sqlQuery = 'SELECT * FROM Films WHERE title = ?';
            db.all(sqlQuery, [title], (err, rows) => {
                if (err)
                    reject(err);
                resolve(rows.map((row) => new Film(row.id, row.title, row.favorite, dayjs(row.watchdate), row.rating)));
            })
        })
    }

    this.addMovieInDatabase = (movie) =>{
        return new Promise((resolve, reject) => {
            const sqlInsert = 'INSERT INTO FILMS (id, title, favorite, watchdate, rating,user) VALUES (?, ?, ?, ?, ?,?)';
            console.log(movie)
            db.run(sqlInsert, [movie.id, movie.title, movie.favorite, movie.watchdate, movie.rating,'j'], (err) => {
                console.log("mannaggia a maronna")
                if (err){
                    console.log('ERROR: ' + err)
                    reject(err);
                }
                console.log('Insertion went well');
                resolve(true);
            })
        })
    }

    this.deleteMovieInDatabase = (id) => {
        return new Promise((resolve, reject) => {
           const sqlDelete = 'DELETE FROM FILMS WHERE ID = ?';
           db.run(sqlDelete, [id], (err, rows) => {
                if (err){
                    console.log('ERROR: ' + err)
                    reject(err);
                }
                console.log('Delete went well');
                resolve(true);
           }) 
        })
    }

    this.addNewFilms= (listOfFilms) => {
        listOfFilms.forEach((film) => this.addNewFilm(film));
    }

    return this;
}


function getIdLastFilm(){
    return new Promise((resolve, reject) => {
        const sqlSelectNextId = 'SELECT MAX(id) as ID FROM FILMS'
        db.all(sqlSelectNextId,[], (err, id) =>{
            if(err){
                console.log('ERROR: ' + err)
                reject(err)
            }
            resolve(id[0].ID)
        })
    })
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

function deleteAll(ul){
    ul.innerHTML = '';
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
    "Last seen" : seenLastMonthFilter,
    "Unseen" : unseenFilter,
}

function applyFilter(filmArray, filter){
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
function loadLib(){
    let lib = new FilmLibrary();
    let film1 = new Film(1, 'Pulp Fiction', true, dayjs("March 10 2022","MMMM DD YYYY",true), 5);
    let film2 = new Film(2, '21 Grams' , true,  dayjs("March 09 2022","MMMM DD YYYY",true),  4);
    let film3 = new Film(3, 'Star Wars' , true,  undefined,  undefined);
    let film4 = new Film(4, 'Matrix', false, undefined, undefined);
    let film5 = new Film(5, 'Shrek', false, dayjs("March 21 2022","MMMM DD YYYY"),3);
    let film6 = new Film(6, 'Morbius', false, dayjs("April 21 2022","MMMM DD YYYY"),4);

    lib.addNewFilms([film1,film2,film3,film4,film5,film6]);
    return lib;
}



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

module.exports = {getIdLastFilm, Film, FilmLibrary}