// import React from "react";
import React, {useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../../api/axios';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";

const Register = () => {
    const userRef = useRef();
    const errorRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
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
        const isUserValid = USER_REGEX.test(user);
        console.log(isUserValid)
        console.log(user);
        setValidName(isUserValid);
    }, [user])

    useEffect(() => {
        const isPasswordValid = PASSWORD_REGEX.test(user);
        console.log(isPasswordValid)
        console.log(user);
        setValidPassword(isPasswordValid);
        const match = password === passwordMatch;
        setValidMatch(match);
    }, [password, passwordMatch])

    useEffect(() => {
        setErrorMessage('');
    }, [user, password, passwordMatch])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const u = USER_REGEX.test(user);
        const p = PASSWORD_REGEX.test(password);
        if(!p || !u){
            setErrorMessage("Invalid Entry");
            return;
        }
        try{
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({user, password}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
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
                setErrorMessage('Registration Failed');
            }
            errorRef.current.focus();
        }
    } 

    return (
    <>
    {success ? (
        <section>
            <h1> Success! </h1>
            <p>
                <a href="#"> Sign In </a>
            </p>
        </section>
    ) : (
    <section>
        <p ref={errorRef} className={errorMessage ? "errmsg" : "offscreen"} aria-live="assertive"> 
        {errorMessage} 
        </p>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">
                Username:
                <span className={validName ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validName || !user ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>
            </label>
            <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                required
                aria-invalid={validName ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
            />

            <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle}/>
                4 to 24 characters. <br/>
                Must begin with a letter.
            </p>

            <label htmlFor="password">
                Password:
                <span className={validPassword ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validPassword || !password ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>
            </label>
            <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-invalid={validPassword ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
            />

            <p id="pwdnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle}/>
                8 to 24 characters. <br/>
                Must include uppercase and lowercase letter, a number and a special character.
            </p>

            <label htmlFor="password">
                Confirm Password:
                <span className={validMatch && validPassword? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validMatch || !validPassword? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>
            </label>
            <input
                type="password"
                id="confirmPwd"
                onChange={(e) => setPasswordMatch(e.target.value)}
                required
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
            />
            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle}/>
                Must match the password input field.
            </p>

            <button disabled={!validName || !validPassword || !validMatch ? true : false}>
                Sign Up</button>

            <p>
                Already registered? <br/>
                <span className="line">
                    {}
                    <a href="#"> Sign In</a>
                </span>
            </p>
        </form>
    </section>
  )}
  </>
  )
}
export default Register