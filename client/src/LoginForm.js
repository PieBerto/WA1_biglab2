import {Container,Form, Card, Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import API from './API'



function LoginForm(props) {
    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const [err, setErr] = useState(0)
    let emailError = ""
    let pwdError = ""

    const navigate = useNavigate();

    if (err === 3 || err === 1){
        emailError = "Please, insert a valid email"
    } 

    if (err === 3 || err === 2){
        pwdError = "Please, insert the password"
    }

    if (err === 4){
        emailError = " "
        pwdError = "Password or email not valid"
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        const re = /\S+@\S+\.\S+/
        if (!re.test(email) && pwd === ""){
            setErr(3) /*Email not valid and password has not been inserted*/
        }
        else if (!re.test(email)){
            setErr(1) /*Email not valid*/
        }
        else if (pwd === "") {
            setErr(2) /*pwd has not been inserted*/
        }
        else {
            const credentials = {username : email, password : pwd}
            try {
                const user = await API.logIn(credentials)
                navigate('/')
                props.setupUser(user)
                setErr(0)
            }
            catch (e) {
                console.log(e)
                setErr(4)
            }
        }
        
    }
    return (
    <>
    <div className =' d-flex flex-column h-100 '>
        <MyNavBar/>
        <Container fluid className="flex-grow-1 justify-content-center d-flex align-items-center" >
        <Card border="primary" style={{ padding : '4rem'}}>
            <Form>
                <Form.Group className="mb-2" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="email@address.dom" value = {email} onChange = {(e) => setEmail(e.target.value)} className = {emailError && "border border-danger "}/>
                    {emailError && < ErrorMessage className='mt-1' text = {emailError}/>}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value = {pwd} onChange = {(e) => setPwd(e.target.value)} className = {pwdError && "border border-danger "}/>
                    {pwdError &&<ErrorMessage className='mt-1' text = {pwdError} />}

                </Form.Group>
                <Button variant="primary" type="submit" onClick={(event) => onSubmit(event)}>
                    Login
                </Button>
            </Form>
            </Card>

        </Container>
    </div>
    </>
    )
}

function MyNavBar(props){
    return (
        <nav className="navbar navbar-dark bg-primary">
            <Container fluid  className = "justify-content-center">
                <a className="navbar-brand" href='dummy'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-collection-play" viewBox="0 0 16 16">
                        <path d="M2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3zm2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1zm2.765 5.576A.5.5 0 0 0 6 7v5a.5.5 0 0 0 .765.424l4-2.5a.5.5 0 0 0 0-.848l-4-2.5z"/>
                        <path d="M1.5 14.5A1.5 1.5 0 0 1 0 13V6a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 16 6v7a1.5 1.5 0 0 1-1.5 1.5h-13zm13-1a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5h-13A.5.5 0 0 0 1 6v7a.5.5 0 0 0 .5.5h13z"/>
                    </svg>
                    {' '}Film Library
                </a>
            </Container>
        </nav>);
    }

function ErrorMessage(props) {
    return (
    <div className="text-danger">
        {props.text}
    </div>
    )
}
export default LoginForm