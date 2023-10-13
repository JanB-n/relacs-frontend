import React, {useRef, useState, useEffect, useContext} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import { Button, Form } from 'react-bootstrap';
const LOGIN_URL = '/auth/login/';

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const emailRef = useRef();
    const errorRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        //emailRef.current.focus()
    }, [])

    useEffect(() => {
        setErrorMessage('');
    }, [email, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.post(LOGIN_URL, JSON.stringify({username: email, password: password}), 
            {
                headers: { 'Content-Type' : 'application/json'},
                //withCredentials: true
            }
            );
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.access;
            const refresh = response?.data?.refresh;
            //const first_name = response?.data?.first_name;
            //const last_name = response?.data?.last_name;
            localStorage.setItem("refresh", JSON.stringify(refresh));
            //console.log("This is in local storage:" + localStorage.getItem("refresh"));
            setAuth({username: email, token: accessToken, refresh: refresh});
            setEmail('');
            setPassword('');
            // setTimeout(function(){
            //     navigate(from, {replace: true})
            // }, 10000)
            navigate(from, {replace: true});
        } catch(err){
            if (!err?.response) {
                setErrorMessage('No Server Response');
            }
        errorRef.current.focus();
        }
        
    }

  return (
        // <section class="authentication">
        //     <form onSubmit={handleSubmit}>  
        //         <label htmlFor="InputEmail">Username:</label>
        //         <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username" ref={emailRef} autoComplete='off' onChange={(e) => setEmail(e.target.value)} value={email} required/>
      
        //         <label htmlFor="InputPassword">Password:</label>
        //         <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" ref={emailRef} autoComplete='off' onChange={(e) => setPassword(e.target.value)} value={password} required/>

        //         <button type="submit" className="btn btn-primary">Submit</button>
        //     </form>
        //     <div className="text-center">
        //         <p>Not a member? <a href="/register">Register</a></p>
                
        //     </div>

        // </section>

        <section class="authentication">
            <Form onSubmit={handleSubmit}>  
                <Form.Group>
                    <Form.Label htmlFor="InputEmail">Username:</Form.Label>
                    <Form.Control type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username" ref={emailRef} autoComplete='off' onChange={(e) => setEmail(e.target.value)} value={email} required/>
                </Form.Group>
                <Form.Group style={{ 'margin-top': '10px'}}>
                    <Form.Label htmlFor="InputPassword">Password:</Form.Label>
                    <Form.Control type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" ref={emailRef} autoComplete='off' onChange={(e) => setPassword(e.target.value)} value={password} required/>
                </Form.Group>
                <Form.Group style={{ 'margin-top': '10px', 'align-items': 'center', 'display': 'flex', 'justify-content': 'center'}}>
                    <Button style={{'margin-top': '10px'}} type="submit" className="btn btn-primary">Log in</Button>
                </Form.Group>

                <Form.Group className="text-center" style={{ 'margin-top': '10px'}}>
                    <p>Not a member? <a href="/register">Register</a></p>    
                </Form.Group>
            </Form>

        </section>
  );
}

export default Login;