import {Film} from './FilmLibrary'
import dayjs from 'dayjs'
const APIURL = 'http://localhost:3001';
const SERVER_URL = APIURL

async function loadFilmList(filter) {
    const url = APIURL + '/films' + (filter ?  '?filter=' + filter : '')
    try {
        const response = await fetch(url, {
            credentials: 'include',
          })
        if (response.ok) {
            const arr =  await response.json()
            const filmList = arr.map((e) => new Film(e.id, e.title, e.favorite, e.date ? dayjs(e.date): undefined, e.rating))
            return filmList
        }
        else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch(err){
        throw err
    }
}

async function addFilm(film) {
    const url = APIURL + '/films'
    try {
        const response = await fetch(url, {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            credentials : 'include',
            body: JSON.stringify(film)
        });
        if (response.ok) {
            return;
        }
        else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch(err) {
        throw err
    }
}

async function markFilm(id, favorite) {
    const url = APIURL + '/films/' + id
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                "Content-Type" : "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                favorite: favorite? 1 : 0
            })
        })
        if (response.ok) {
            return;
        } else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch(err) {
        throw err
    }
}

async function updateRating(id, rating) {
    const url = APIURL + '/films/' + id
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                "Content-Type" : "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                rating: rating
            })
        })
        if (response.ok) {
            return;
        } else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch(err) {
        throw err
    }
}

async function updateFilm(film) {
    const url = APIURL + '/films' 
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                "Content-Type" : "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(film)
        })
        if (response.ok) {
            return
        }  else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (err) {
        throw err
    }
}

async function deleteFilm(id) {
    const url = APIURL + '/films/' + id 
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include'
        })
        if (response.ok) {
            return
        }  else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (err) {
        throw err
    }
}



const logIn = async (credentials) => {
    try {
        const response = await fetch(SERVER_URL + '/api/sessions', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
            });
        if(response.ok) {
            const user = await response.json();
            return user;
        }
        else {
            const errDetails = await response.text();
            throw errDetails;
        }
  } catch (e) {
      throw e
  }}

  ;
  
const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      credentials: 'include',
    });
    
    const user = await response.json();
    if (response.ok) {
      return user;
    } else {
      throw user;  // an object with the error coming from the server
    }
  };
  
const logOut = async() => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.ok)
      return null;
}

const API = {loadFilmList, addFilm, markFilm, updateRating, updateFilm, deleteFilm, logIn, getUserInfo, logOut}

export default API