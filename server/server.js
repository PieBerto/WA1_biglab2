const express = require('express');
const PORT = 3001;
const f = require('./FilmLibrary')
const db = require('./databaseLib').databaseFun()
const dayjs = require('dayjs')
const morgan = require('morgan');
const cors = require('cors');

// Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

app = new express();
app.use(morgan('common'));
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
app.use(cors(corsOptions));

app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}/`));

passport.use(new LocalStrategy(async function verify(username, password, cb) {

    const user = await db.getUser(username, password)
    if(!user)
      return cb(null, false, 'Incorrect username or password.');
      
    return cb(null, user);
  }));

passport.serializeUser(function (user, cb) {
    cb(null, user);
  });
  
passport.deserializeUser(function (user, cb) { // this user is id + email + name
    return cb(null, user);
    // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  });

  
  
app.use(session({
    secret: "shhhhh... it's a secret!",
    resave: false,
    saveUninitialized: false,
  }));

app.use(passport.authenticate('session'));




app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).send(info);
        }
        // success, perform the login
        req.login(user, (err) => {
          if (err)
            return next(err);
          // req.user contains the authenticated user, we send all the user info back
          return res.status(201).json(req.user);
        });
    })(req, res, next);
  });

  app.get('/api/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
      res.json(req.user);}
    else
      res.status(401).json({error: 'Not authenticated'});
  });
  
  // DELETE /api/session/current
  app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => {
      res.end();
    });
  });


const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not authorized'});
  }

app.use(isLoggedIn)

/*CREATE FILM*/
app.post('/films',(req, res) => {
    let film = [req.body.title, req.body.favorite,req.body.date ? dayjs(req.body.date,"YYYY-MM-DD").format("YYYY-MM-DD") : undefined, req.body.rating];
    let uid = req.user.id
    db.getIdLastFilm(uid).then((id) => {
        film = new f.Film(id+1,...film);
        db.addMovie(film,uid)
        .then(() =>{
            res.status(200).send()
        }).catch((err)=>{
            res.status(500).json(err + "aaaa")
        }
        )
        
    })
})


/*RETRIEVE ALL FILMS*/
/*RETRIEVE A FILM GIVEN A FILTER*/
app.get('/films',(req,res) => {
    let uid = req.user.id

    if (!req.query.filter) { 
        db.getAll(uid).then((films) => {
            res.status(200).json(films)
        }).catch((err) => {
            res.status(500).json(err)
        })
    }
    else{
        db.getFiltered(req.query.filter,uid).then((films) => {
            res.status(200).json(films)
        }).catch((err) => {
            res.status(500).json(err)
        })}
})



/*RETRIEVE A FILM BY ID*/
app.get('/films/:id', (req, res) => {
    let uid = req.user.id
    db.getFilm(req.params.id, uid).then((film) =>{
        if (film.length) {
            res.status(200).json(film[0] )
        }
        else {
            res.status(404).json("Film not found")
        }
    }).catch((err) => {
        res.status(500).json(err)
    })
}) 



app.delete('/films/:id',(req, res) => {
    let uid = req.user.id
    if (req.params.id) {
        db.deleteMovie(req.params.id, uid).then((val) => {
            if (val) {
                res.status(200).json("Done");
            } else {
                res.status(404).json("Film not found")
            }
        }).catch((err) => {
            res.status(500).json(err)
        })
    }
    else {
        res.status(500).json("Provide an id")
    }
})

/**/ 
app.patch('/films/:id', (req,res) => {
    let uid = req.user.id

    if(req.params.id && req.body.favorite !== undefined){
        db.markFilm(req.params.id, req.body.favorite, uid).then((val) => {
            if (val) {
                res.status(200).json("Done");
            }
            else {
                res.status(404).json("Film not found")
            }
        }).catch((err) => {
            res.status(500).jsonn(err)
        })
    }
    

    else if(req.params.id && req.body.rating !== undefined) {
        db.updateRating(req.params.id, req.body.rating,uid).then((val) => {
            if (val) {
                res.status(200).json("Done");
            }
            else {
                res.status(404).json("Film not found")
            }
        }).catch((err) => {
            res.status(500).json(err)
        })
    }
})

app.put('/films',(req, res) => {
    let uid = req.user.id
    let film = new f.Film (req.body.id,req.body.title, req.body.favorite,req.body.date ? dayjs(req.body.date,"YYYY-MM-DD").format("YYYY-MM-DD") : null, req.body.rating);
    db.updateFilm(film,uid).then((val) =>{
        if (val){
            res.status(200).json("Done");
        }
        else {
            res.status(404).json("Film not found")
        }
    }).catch((err) => {
        res.status(500).json(err)
    })
})




