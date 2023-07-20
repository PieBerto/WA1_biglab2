const sqlite = require('sqlite3')
const fL = require('./FilmLibrary')
const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween');
const crypto = require('crypto');

dayjs.extend(isBetween)


const db = new sqlite.Database(('films.db'), (err) => {
    if (err)
        throw err;
})

function databaseFun() {

    this.getBestRated = (uid) => {
        return new Promise((resolve, reject) => {
            const sqlQuery = 'SELECT * FROM Films WHERE Rating = 5 AND USER = ?';
            db.all(sqlQuery,[uid] ,(err, rows) => {
                if (err)
                    reject(err);
                resolve(rows.map((row) => new fL.Film(row.id, row.title, row.favorite, dayjs(row.watcdate), row.rating)));
            })
        });
    }

    this.getUnseen = (uid) =>{
        return new Promise((resolve, reject) => {
            const sqlQuery = 'SELECT * FROM Films WHERE watchdate IS NULL AND USER = ?';
            db.all(sqlQuery, [uid],(err, rows) => {
                if (err)
                    reject(err);
                resolve(rows.map((row) => new fL.Film(row.id, row.title, row.favorite,dayjs(row.watchdate), row.rating)));
            })
        });
    }

    this.getAll = (uid) =>{
        return new Promise((resolve, reject) =>{
            const sqlQuery = 'SELECT * FROM Films WHERE USER = ?';
            db.all(sqlQuery, [uid],(err, rows) => {
                if(err)
                    reject(err);
                resolve(rows.map((row) => new fL.Film(row.id, row.title, row.favorite, dayjs(row.watchdate), row.rating)));
            })
        })
    }

    this.getFavorite = (uid) => {
        return new Promise((resolve, reject) => {
            const sqlQuery = 'SELECT * FROM Films WHERE Favorite = 1 AND USER = ?';
            db.all(sqlQuery, [uid],(err, rows) => {
                if (err)
                    reject(err);
                resolve(rows.map((row) => new fL.Film(row.id, row.title, row.favorite, dayjs(row.watchdate), row.rating)));
            })
        });
    }

    this.getFilmsedToday = (uid) =>{
        return new Promise((resolve, reject) => {
            const sqlQuery = 'SELECT * FROM films WHERE watchdate = ? AND USER = ?';
            const today = new dayjs().format('YYYY-MM-DD');
            db.all(sqlQuery, [today,uid], (err, rows) => {
                if(err)
                    reject(err);
                resolve(rows.map((row) => new fL.Film(row.id, row.title, row.favorite, dayjs(row.watchdate), row.rating)));
            })
        })
    }

    this.getFilmsEarlier = (uid) => {
        return new Promise((resolve, reject) => {
            const sqlQuery = 'SELECT * FROM Films WHERE USER = ?';
            db.all(sqlQuery, [uid], (err, rows) => {
                if(err)
                    reject(err);
                resolve(rows.map((row) => {
                    let date = dayjs(row.watchdate,"YYYY-MM-DD")
                    if (date.isBetween(dayjs().subtract(30,'day'),dayjs())){
                        return new fL.Film(row.id, row.title, row.favorite, dayjs(row.watchdate) , row.rating)
                }}
                ).filter((f) =>  f)
            
                )
            })
        })
    }

    this.getRatedFilm = (rating,uid) => {
        return new Promise((resolve, reject) => {
            const sqlQuery = 'SELECT * FROM Films WHERE rating >= ? AND USER = ?';
            db.all(sqlQuery, [rating,uid], (err, rows) => {
                if (err)
                    reject(err);
                resolve(rows.map((row) => new fL.Film(row.id, row.title, row.favorite, dayjs(row.watchdate), row.rating)));
            })
        })
    }

    this.getFilm = (id,uid) => {
        return new Promise((resolve, reject) => {
            const sqlQuery = 'SELECT * FROM Films WHERE id = ? AND USER = ?';
            db.all(sqlQuery, [id,uid], (err, rows) => {
                if (err)
                    reject(err);
                resolve(rows.map((row) => new fL.Film(row.id, row.title, row.favorite, row.date ? dayjs(row.date): '', row.rating)));
            })
        })
    }

    this.addMovie = (movie,uid) =>{
        return new Promise((resolve, reject) => {
            const sqlInsert = 'INSERT INTO FILMS (id, title, favorite, watchdate, rating, user) VALUES (?, ?, ?, ?, ?,?)';
            db.run(sqlInsert, [movie.id, movie.title, movie.favorite, movie.date, movie.rating,uid], (err) => {
                if (err){
                    console.log('ERROR: ' + err)
                    reject(err);
                }
                resolve(true);
            })
        })
    }

    this.deleteMovie = (id,uid) => {
        return new Promise((resolve, reject) => {
        const sqlDelete = 'DELETE FROM FILMS WHERE ID = ? AND USER = ?';
        db.run(sqlDelete, [id,uid], function (err)  {
                if (err){
                    console.log('ERROR: ' + err)
                    reject(err);
                }
                resolve(this.changes);
        }) 
        })
    }

    this.markFilm = (id, value,uid) => {
        return new Promise((resolve,reject) => {
            const sqlQuery = 'UPDATE FILMS SET FAVORITE = ? WHERE ID = ? AND USER = ?';
            db.run(sqlQuery, [value,id,uid], function (err)  {
                if (err){
                    console.log('ERROR: ' + err)
                    reject(err)
                }
                resolve(this.changes);
            })
        })
    }

    this.updateRating = (id, rating,uid) => {
        return new Promise((resolve, reject) => {
            const sqlQuery = 'UPDATE FILMS SET RATING = ? WHERE ID = ? AND USER = ?';
            db.run(sqlQuery,[rating, id,uid], function (err) {
                if (err){
                    console.log('ERROR: ' + err)
                    reject(err)
                }
                resolve(this.changes)
            })
        })
    }

    this.updateFilm = (film,uid) => {
        return new Promise((resolve, reject) => {
            const sqlQuery = 'UPDATE FILMS SET TITLE = ?, FAVORITE = ?, WATCHDATE = ?, RATING = ? WHERE ID = ? AND USER = ?'
            db.run(sqlQuery, [film.title, film.favorite, film.date, film.rating, film.id,uid], function (err) {
                if (err){
                    console.log('ERROR: ' + err)
                    reject(err)
                }
                resolve(this.changes)
            })
        })
    }

    this.getIdLastFilm = (uid) => {
        return new Promise((resolve, reject) => {
            const sqlSelectNextId = 'SELECT MAX(id) as ID FROM FILMS'
            db.all(sqlSelectNextId,[], (err, id) =>{
                if(err){
                    console.log('ERROR: xxx' + err)
                    reject(err)
                }
                resolve(id[0].ID)
            })
        })
    }

    const map = {
        "All": this.getAll,
        'Favorites': this.getFavorite,
        'Last Seen': this.getFilmsEarlier,
        'Best Rated': this.getBestRated,
        'Unseen': this.getUnseen
    }

    this.getFiltered = (filter,uid) => {
        return map[filter](uid)
    }

    this.getUser = (email, password) => {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM users WHERE email = ?';
          db.get(sql, [email], (err, row) => {
            if (err) { 
              reject(err); 
            }
            else if (row === undefined) { 
              resolve(false); 
            }
            else {
              const user = {id: row.id, username: row.email, name: row.name};
              crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) {
                if (err) reject(err);
                
                if(!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
                  resolve(false);
                else
                  resolve(user);
              });
            }
          });
        });
      };
    
    this.getUserById = (id) => {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM users WHERE id = ?';
          db.get(sql, [id], (err, row) => {
            if (err) { 
              reject(err); 
            }
            else if (row === undefined) { 
              resolve({error: 'User not found!'}); 
            }
            else {
              const user = {id: row.id, username: row.email, name: row.name};
              resolve(user);
            }
          });
        });
    };

    return this
}

function returnValue() {
    return this.changes;
}

/*
function addUser() {
    const email = "testuser@testuser.it"
    const id = 3
    const name = "testuser"
    const salt = crypto.randomBytes(32)
    const password = "password"
    crypto.scrypt(password, salt, 32, function(err,
        hashedPassword) {
            const sql = "INSERT INTO USERS (id, email, name, hash, salt) VALUES (?,?,?,?,?)";
            hashedPassword = hashedPassword.toString('hex')
            db.run(sql, [id, email, name, hashedPassword, salt], (err) => {
                console.log(err)
            });
    });
}
*/

module.exports = {databaseFun}