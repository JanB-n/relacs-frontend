// import React from "react";
import React, {useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import { Button, Form } from 'react-bootstrap';
import { red } from '@mui/material/colors';
import { Link } from 'react-router-dom';

//const USER_REGEX = /^[a-zA-Z][a-zA-Z]{1,29}$/;
const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{1,29}$/;
//const EMAIL_REGEX = /^.+\@.+\..+/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/auth/register/";

const Register = () => {
    const userRef = useRef();
    const errorRef = useRef();

    const [username, setUsername] = useState('');
    const [validUser, setValidUser] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [passwordMatch, setPasswordMatch] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    
    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        const isUserValid = USERNAME_REGEX.test(username);
        setValidUser(isUserValid);
    }, [username])

    useEffect(() => {
        // const isPasswordValid = PASSWORD_REGEX.test(password);
        // setValidPassword(isPasswordValid);
        if(password.length >=8 & password.length <=24){
            const match = password === passwordMatch;
            setValidMatch(match);
        }
    }, [password, passwordMatch])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const u = USERNAME_REGEX.test(username);
        const p = PASSWORD_REGEX.test(password);
        if(!p){
            setErrorMessage("Password must include uppercase and lowercase letter, a number, a special character and be 8-24 characters long!");
            return;
        }
        if(!u){
            setErrorMessage("Username must be 2-30 characters long!");
            return;
        }
        try{
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({username: username, first_name: "placeholder", last_name: "placeholder", email: "placeholder@placeholder.com", password: password}),
                {
                    headers: {'Content-Type': 'application/json'},
                    //withCredentials: true
                }
            );
            console.log(response.data);
            console.log(response.accessToken);
            setSuccess(true);
        } catch(err){
            if(!err?.response){
                setErrorMessage('No Server Response');
            }
            else if (err.response?.status === 409) {
                setErrorMessage('UserName Taken');
            }
            else {
                setErrorMessage('Username taken!');
            }
            errorRef.current.focus();
        }
    } 

    return (
    <>
    {success ? (
        <>
        <section style={{ 'marginTop': '10px', 'alignItems': 'center', 'display': 'flex', 'justifyContent': 'center'}}>
            <h1 style={{'marginTop': '10px'}}> Your account has been created! </h1>
        </section>
        <section style={{ 'marginTop': '10px', 'alignItems': 'center', 'display': 'flex', 'justifyContent': 'center'}}>
            <a style={{'marginTop': '10px'}} href="/login"> Sign In </a>
        </section>
        </>
    ) : (
    
    <section className="authentication">
    <Form onSubmit={handleSubmit}>  
        <Form.Group>
            <Form.Label htmlFor="InputUsername">Username:</Form.Label>
            <Form.Control type="text" className="form-control" id="exampleInputUsername1"  ref={userRef}  autoComplete='off' onChange={(e) => setUsername(e.target.value)} value={username} required/>
        </Form.Group>
        <Form.Group style={{ 'marginTop': '10px'}}>
            <Form.Label htmlFor="InputPassword">Password:</Form.Label>
            <Form.Control type="password" className="form-control" id="exampleInputPassword1" autoComplete='off' onChange={(e) => setPassword(e.target.value)} value={password} required/>
        </Form.Group>
        <Form.Group style={{ 'marginTop': '10px'}}>
            <Form.Label htmlFor="InputPassword">Confirm password:</Form.Label>
            <Form.Control type="password" className="form-control" id="exampleInputPassword2"   autoComplete='off' onChange={(e) => setPasswordMatch(e.target.value)} value={passwordMatch} required/>
        </Form.Group>
        <Form.Group style={{ 'marginTop': '10px', 'alignItems': 'center', 'display': 'flex', 'justifyContent': 'center'}}>
            {/* <Button style={{'marginTop': '10px'}} type="submit" className="btn btn-primary" 
            disabled={!validPassword || !validMatch ? true : false}>Create account</Button> */}
            <Button style={{'marginTop': '10px'}} type="submit" className="btn btn-primary" 
            disabled={!validMatch ? true : false}>Create account</Button>
        </Form.Group>

        <Form.Group className="text-center" style={{ 'marginTop': '10px'}}>
            <p>Already registered? <a href="/login">Log in</a></p>    
        </Form.Group>
        <Form.Group className="text-center" style={{ 'marginTop': '10px'}}>
        <p ref={errorRef} className={errorMessage ? "errmsg" : "offscreen"} style={{'color': 'red'}} aria-live="assertive"> {errorMessage} </p>   
        </Form.Group>
    </Form>

    </section>
  )}
  </>
  )
}
export default Register