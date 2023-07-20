import { Button, Form, ListGroupItem } from 'react-bootstrap';
import {useState} from 'react';
import { Film} from './FilmLibrary'
import dayjs from 'dayjs';
import {Container, Row, Col} from 'react-bootstrap'
import { BsStarFill, BsStar} from 'react-icons/bs'
import { useNavigate} from 'react-router-dom'

function AddFilmForm(props){

    const [title,setTitle] = useState(props.film.title ? props.film.title : '');
    const [favorite, setFavorite] = useState(props.film.favorite ? props.film.favorite : false);
    const [date,setDate] = useState(props.film.date ? props.film.date.format("YYYY-MM-DD") : '');
    const [rating,setRating] = useState(props.film.rating ? props.film.rating : 0); 
    const [err, setError] = useState(false);

    const navigate = useNavigate();
    
    const onSubmit = (event) => {
        event.preventDefault();
        let newDate = date ? dayjs(date) : undefined;
        if (!title || !title.trim()){
            setError(true);
            return;
        }
        let newFilm = new Film(props.idFilm, title, favorite, newDate, rating);
        props.addFilm(newFilm);
        setTitle('');
        setFavorite(false);
        setDate('');
        setRating();
        setError(false);
        navigate(-1);
    }

    const onSubmitUpdate = (event) =>{
        event.preventDefault();
        if (!title || !title.trim()){
            setError(true);
            return;
        }
        let newDate = date ? dayjs(date) : undefined;
        let newFilm = new Film(props.film.id, title, favorite, newDate, rating);
        props.updateFilm(props.film,newFilm)
        navigate(-1)
    }
    let style = {};
    /*if (props.first) 
        style =  {border: "none", borderBottom : "1px solid rgba(0,0,0,.125)"};
    if (!props.mode)
        style =  {border: "none", borderTop : "1px solid rgba(0,0,0,.125)"}
*/
    style =  {border: "none"}
    const updateRating = (rating) => {
        setRating(rating);
    }
    
    return (
        <ListGroupItem style = {style}>
        <Container fluid>
        
            <Form>
                <Row>
                <Col>
                <Form.Group className='mb-3'>

                    <Form.Control className = {err && "border border-danger "}type='text'  value = {title} placeholder={!err ? "Film title" : "Please, insert a title"}  
                    onChange={(event) => setTitle(event.target.value)} />
                </Form.Group>
                </Col>
                {' '}
                <Col>
                {/*<Form.Group className='mb-3'>
                    <Form.Label>Favorite</Form.Label>
                    <Form.Check value = {favorite}  onChange = {() => setFavorite(!favorite)}/>
    </Form.Group>*/}
                <div className="form-check">
                    {''}
                    <input className="form-check-input" type="checkbox"  id="flexCheckChecked" checked= {favorite} 
                    onChange = {() => setFavorite(!favorite)/*() => { 
                        film.favorite = !check; 
                        setCheck(!check); 

                        }*/
                        }/>
                        <label className="form-check-label" htmlFor="flexCheckChecked">Favorite</label>
                </div>
                </Col>
                <Col>
                <Form.Group className='mb-3'>
                    <Form.Control value = {date} onChange = {(event) => {
                        setDate(event.target.value)}}type = 'date' />
                </Form.Group>
                </Col>
                <Col>
                    <DynamicRating rating = {rating} updateRating = {updateRating}/>
                </Col>
                <div align='right'>
                    <Button variant = 'outline-danger' className="mx-1" onClick = {() => navigate(-1)/*props.mode ? () => props.toggleEdit() : () => props.toggleAdd()*/}>Cancel</Button>
                    {' '}
                    <Button  type='submit' variant='outline-success' onClick = {props.mode ? (event) => onSubmitUpdate(event):(event) => onSubmit(event)}>{props.mode? props.mode : 'Add'}</Button>
                </div>
                </Row>
            </Form>
        </Container> 
        </ListGroupItem>
        
    
    )
}

function DynamicRating(props){
    let component = [];
    let rat = props.rating ? props.rating : 0;
    const [temporaryStars, setTemporaryStars] = useState(rat);
    component.push(<BsStar className="pointer" style={{color: "white"}} visibility={"visible"} onClick={() => props.updateRating(temporaryStars)} onMouseOver={() => setTemporaryStars(0)} /*onMouseOut={() => props.setTemporaryStars(props.rating)}*/ key={-1}></BsStar>)
    for(let i = 0; i< rat; i++)
        component.push(<BsStarFill  className="pointer" onClick={() => props.updateRating(temporaryStars)} onMouseOver={() => setTemporaryStars(i+1)} onMouseOut={() => setTemporaryStars(props.rating)} key={i}></BsStarFill>)
    for(let i = rat; i< 5;i++)
        component.push(<BsStar  className="pointer" onClick={() => props.updateRating(temporaryStars)} onMouseOver={() => setTemporaryStars(i+1)} onMouseOut={() => setTemporaryStars(props.rating)} key={i}></BsStar>)
    return (component);
}
export default AddFilmForm;