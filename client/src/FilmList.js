import { ListGroupItem, Col,Container, Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'
import {BsPencilSquare, BsFillTrashFill, BsStarFill, BsStar} from 'react-icons/bs'
import { useState } from "react";
import './App.css';
import { useNavigate} from 'react-router-dom'


function MyFilmList(props){
    let filmList = props.filteredList;
    return (
    <Container fluid>
        <ul className="list-group list-group-flush" id="filmLibrary">
            {filmList.map((film,index) => (<FilmRow film = {film}  key ={film.id.toString()} deleteFilm = {props.deleteFilm} toggleFavorite = {props.toggleFavorite} updateStars = {props.updateStars} updateFilm = {props.updateFilm} first = {index===0}></FilmRow>))}
        </ul>
    </Container>)
}

function FilmRow(props){
    
    let film = props.film;
    /*const [check,setCheck] = useState(film.favorite ? true : false);*/
    let check = film.favorite;
    let color = check ? "text-danger" : "";
    let date;
    if (film.date === undefined || film.date === null)
        date = "";
    else
        date = film.date.format("MMMM DD, YYYY");
    
    const navigate = useNavigate();
    
    let elem = 
    <ListGroupItem className="list-group-item " >
        <Container fluid>
            <Row>
                <Col className={color}>
                    <button type="button" className="btn btn-link trash py-0 px-2" style={{boxSizing: "border-box"}} 
                        onClick={() => navigate('/Edit?id='.concat(film.id),{filter: ''})}>
                        <BsPencilSquare style = {{  transform: "translate(0px, -4px)"}}/>
                    </button>
                    <button type="button" className="btn btn-link trash py-0 px-2" onClick={() => props.deleteFilm(film)}>
                        <BsFillTrashFill className="align-baseline"/>
                    </button>
                    {film.title}
                </Col>
                <Col>
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" onChange={() => {props.toggleFavorite(film, check)}} value="" id={film.title} checked={check}/>
                        <label className="form-check-label" htmlFor={film.title}>Favorite</label>
                    </div>
                </Col>
                <Col>
                    {date}
                </Col>
                <Col>
                    <DynamicRating rating={film.rating? film.rating: 0} updateStars={props.updateStars} currentFilm={film} />
                </Col>
            </Row>
            
        </Container>
    </ListGroupItem> 
    return elem;
}
/*
function Rating(props){
    let component = [];
    component.push(<BsStar style={{color: "white"}} visibility={"visible"}  onMouseOut={() => props.setTemporaryStars(props.rating)} key={-1}></BsStar>)
    for(let i = 0; i < props.rating; i++)
        component.push(<BsStarFill   key={i}></BsStarFill>)
    for(let i = props.rating; i< 5;i++)
        component.push(<BsStar   key={i}></BsStar>)
    return (component);
}*/

export function DynamicRating(props){
    let component = [];
    let rat = props.rating ? props.rating : 0;
    const [temporaryStars, setTemporaryStars] = useState(rat);
    component.push(<BsStar className="pointer" style={{color: "white"}} visibility={"visible"} onClick={() => props.updateStars(props.currentFilm, 0)} onMouseOver={() => setTemporaryStars(0)} onMouseOut={() => setTemporaryStars(rat)} /*onMouseOut={() => props.setTemporaryStars(props.rating)}*/ key={-1}></BsStar>)
    for(let i = 0; i < rat; i++)
        component.push(<BsStarFill  className="pointer" onClick={() => props.updateStars(props.currentFilm, temporaryStars)} onMouseOver={() => setTemporaryStars(i+1)} onMouseOut={() => setTemporaryStars(rat)} key={i}></BsStarFill>)
    for(let i = rat; i< 5;i++)
        component.push(<BsStar  className="pointer" onClick={() => props.updateStars(props.currentFilm, temporaryStars)} onMouseOver={() => setTemporaryStars(i+1)} onMouseOut={() => setTemporaryStars(rat)} key={i}></BsStar>)
    return (component);
}
 

export default MyFilmList;