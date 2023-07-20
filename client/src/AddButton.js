import { useNavigate} from 'react-router-dom'


function AddButton(props){
    const navigate = useNavigate()
    return (<div className="position-absolute bottom-0 end-0 p-4">
    <button  type="button" className="btn btn-link" onClick={() => navigate('/Add')}>
        
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus-circle-fill text-primary" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
        </svg>
    </button>
</div>)
}

export default AddButton;