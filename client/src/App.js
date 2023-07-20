import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, Row, Col} from 'react-bootstrap'
import MyNavBar from './NavBar'
import MyFilters from './Filter';
import {useState, useEffect} from 'react';
import AddButton from './AddButton'
import AddFilmForm from './AddFilmForm'
import dayjs from 'dayjs'
import {BrowserRouter, Routes, Route, useParams, useSearchParams, Navigate} from 'react-router-dom'
import API from './API'
import { applyFilter } from './FilmLibrary';
import MyFilmList from './FilmList'
import LoginForm from './LoginForm';

//const filter = ['All', 'Favorites', 'Best Rated', 'Last Seen', 'Unseen']


function App() {
  const [loggedUser, setUser] = useState(null)

  const setupUser = (user) => {
    setUser(user)
  }

  const handleLogout = async () => {
    await API.logOut();
    setUser(null);
    // clean up everything
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo(); // we have the user info here
        setUser(user);
      } catch(e) {
        
      }
    }
    checkAuth();
  }, []);

  return (
  <BrowserRouter>
    {loggedUser ? 
    <Routes>
      <Route path="/" element = {<Layout mode="view"  handleLogout = {handleLogout} user = {loggedUser}/>}/>
      <Route path="/:filter" element = {<Layout mode="view" handleLogout = {handleLogout} user = {loggedUser}/>}/>
      <Route path="/Add" element = {<Layout mode={'add'}  handleLogout = {handleLogout} user = {loggedUser} />}/>
      <Route path="/Edit" element = {<Layout mode = {'edit'}  handleLogout = {handleLogout} user = {loggedUser}/>}/>
      <Route path="/login" element = {<Navigate replace to='/'  handleLogout = {handleLogout} user = {loggedUser}/>}/>
    </Routes>
    :
    <Routes>
      <Route path="/login" element = {<LoginForm setupUser = {setupUser}/>}/>
      <Route path="*" element = {<Navigate replace to ="/login"/>} />
    </Routes>
    }
  </BrowserRouter>

  );

  
}

function Layout(props){
  const params = useParams();
  //const [currFilter, changeFilter] = useState(params.filter);
  const [add,setAdd] = useState(true);
  const [loading,setLoading] = useState(true);
  let currFilter = params.filter? params.filter: '';
  let [searchParams] = useSearchParams();
  const toggleAdd = () =>{
    setAdd(!add);
  }
  const [filmList,setList] = useState([]);
  useEffect(() => {
    async function load() {
      setLoading(true)
      const list = await API.loadFilmList(currFilter);
      setList(list);
      setLoading(false)
    } 
    load();
  },[currFilter]);
  /*
  const setFilter = (filter) =>{
    setAdd(false);
    changeFilter(filter);
  }*/
  const  deleteFilm = async (deletedFilm) =>{
    try {
      setAdd(false);
      await API.deleteFilm(deletedFilm.id )
      setList((oldFilmList) => oldFilmList.filter((film) => film.id !== deletedFilm.id))
    } catch(e) {
      console.log("Something went wrong while deleting this film...")
    }
  }


  const toggleFavorite = async (targetFilm,check) => {
    setAdd(false);
    try {
      await API.markFilm(targetFilm.id, !check )
      setList((oldFilmList) => oldFilmList.map((film) => { 
        if (targetFilm.id === film.id){
              targetFilm.favorite = !check
              return targetFilm
        }
        return film;
      }))
    } catch (e) {
      console.log("Something went wrong while updating this film...")
    }
  }

  

  const updateDate = (targetFilm, event) => {
    setList((oldFilmList) => oldFilmList.map((film) => {
        if(targetFilm.id === film.id){
            if(event)
                targetFilm.date = dayjs(event);
            else targetFilm.date = undefined;
            return targetFilm;
        }
        return film;
    }));
  };

  const updateStars = async (targetFilm, rating) => {
    if (targetFilm.rating === rating) return
    try {
      await API.updateRating(targetFilm.id, rating)
      setList((oldFilmList) => oldFilmList.map((film) => {
          if(targetFilm.id === film.id){
              targetFilm.rating = rating;
              return targetFilm;
          }
          return film;
      }));
    } catch (e) {
    console.log("Something went wrong while updating this film...")
  }
  };

  const updateFilm = async (targetFilm, updatedFilm) => {
    try {
      await API.updateFilm(updatedFilm);
      setList((oldFilmList) => oldFilmList.map((film) => {
        if(targetFilm.id === film.id){
          return updatedFilm;
        }
        return film;
      }))
    } catch(err) {
      console.log("Something went wrong while updating this film... ")
    }
  }
  const addFilm = async (film) =>{
    try {
      await API.addFilm(film);
      setList([...filmList,film]);
    } catch(e) {
      console.log('Something went wrong while inserting a new film...');
    }
  }

  let outlet;
  if (props.mode === 'view'){
    if (loading === false) {
      currFilter = params.filter? params.filter: 'All';
      let filteredList = applyFilter(filmList, currFilter);
      outlet = <><h1 id="title">{currFilter}</h1>
      <MyFilmList currFilter = {currFilter} deleteFilm = {deleteFilm} toggleFavorite = {toggleFavorite} filteredList = {filteredList} updateStars = {updateStars} updateDate = {updateDate} updateFilm = {updateFilm}/>
      <AddButton toggleAdd = {toggleAdd}/></>;
    } else {
      outlet =  <div className="d-flex align-items-center justify-content-center h-100 ">
        <div className="spinner-border" role="status" style={{width: "4rem", height: "4rem"}}></div>
      </div>
    }
  }
  else if (props.mode === 'add') {

    outlet = <>
    <h1 id="title">Add a film</h1>
    <AddFilmForm film='' addFilm={addFilm} idFilm = {0}/></>
  }
  else if (props.mode === 'edit') {
    let filmToBeEdited =  filmList.find((f) => f.id === Number(searchParams.get('id')));
    outlet = <>
      <h1 id = "title">Edit</h1>
      {filmToBeEdited?<AddFilmForm film={filmToBeEdited} addFilm={addFilm} idFilm = {0} mode={'Edit'} updateFilm = {updateFilm}/>: <h2>This film cannot be found.</h2>}
    </>
  }
  return (
    <div className ="d-flex flex-column h-100">
      <MyNavBar handleLogout = {props.handleLogout} name = {props.user.name}/>
      <Container fluid className="flex-grow-1">
          <Row className = "h-100"> 
              <MyFilters currFilter={currFilter} setFilter ={''/*setFilter*/}/>
              <Col  xs = {8} className="p-2">
                {outlet}
              </Col>
          </Row>      
      </Container>
    </div>
    
  );
}



/*: <AddFilmForm film='' addFilm={addFilm} idFilm = {filmList[filmList.length-1].id + 1}/>}*/





export default App;
