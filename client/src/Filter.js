import { Col, Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate} from 'react-router-dom'

const filter = ['All', 'Favorites', 'Best Rated', 'Last Seen', 'Unseen']


function MyFilters(props){
    const navigate = useNavigate();
    return (
    <Col className="col-4 p-2 bg-secondary bg-opacity-25">
        <div className="list-group" id = "filters">
        {
            filter.map((value, idx) => {
                let classes = "list-group-item list-group-item-action";
                if (value === props.currFilter)
                    classes += " active";
                return (<Button  key= {idx} type="button" className={classes}  onClick={() => navigate("/".concat(value))/*() => {props.setFilter(value)}*/}> {value}</Button>)})
        }   
        </div>
    </Col>);
}


export default MyFilters;

    