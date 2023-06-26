// import React from "react";
import React, {useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';

const USER_REGEX = /^[a-zA-Z][a-zA-Z]{1,29}$/;
const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{1,29}$/;
const EMAIL_REGEX = /^.+\@.+\..+/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/auth/register/";

const Register = () => {
    const userRef = useRef();
    const errorRef = useRef();

    const [user, setUser] = useState('');
    const [validUser, setValidUser] = useState(false);
    const [userFocus, setUserFocus] = useState(false);


    const [fn, setFn] = useState('');
    const [validFn, setValidFn] = useState(false);
    const [fnFocus, setFnFocus] = useState(false);

    const [ln, setLn] = useState('');
    const [validLn, setValidLn] = useState(false);
    const [lnFocus, setLnFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

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
        const isUserValid = USERNAME_REGEX.test(user);
        console.log(isUserValid)
        console.log(user);
        setValidUser(isUserValid);
    }, [user])

    useEffect(() => {
        const isFnValid = USER_REGEX.test(fn);
        console.log(isFnValid)
        console.log(fn);
        setValidFn(isFnValid);
    }, [fn])

    useEffect(() => {
        const isLnValid = USER_REGEX.test(ln);
        console.log(isLnValid)
        console.log(ln);
        setValidLn(isLnValid);
    }, [ln])

    useEffect(() => {
        const isEmailValid = EMAIL_REGEX.test(email);
        console.log(isEmailValid)
        console.log(email);
        setValidEmail(isEmailValid);
    }, [email])

    useEffect(() => {
        const isPasswordValid = PASSWORD_REGEX.test(password);
        console.log(isPasswordValid)
        // console.log(password);
        setValidPassword(isPasswordValid);
        const match = password === passwordMatch;
        setValidMatch(match);
    }, [password, passwordMatch])

    useEffect(() => {
        setErrorMessage('');
    }, [fn, ln, email, password, passwordMatch])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const u = USERNAME_REGEX.test(user);
        const f = USER_REGEX.test(fn);
        const l = USER_REGEX.test(ln);
        const em = EMAIL_REGEX.test(email);
        const p = PASSWORD_REGEX.test(password);
        if(!p || !f || !l || !em || !u){
            setErrorMessage("Invalid Entry");
            return;
        }
        try{
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({username: user, first_name: fn, last_name: ln, email: email, password: password}),
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
                <a href="/login"> Sign In </a>
            </p>
        </section>
    ) : (
    <section>
        <p ref={errorRef} className={errorMessage ? "errmsg" : "offscreen"} aria-live="assertive"> 
        {errorMessage} 
        </p>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
                <label htmlFor="user">
                
                Username:
                <span className={validUser ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validUser || !user ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>
            </label>
            <input
                type="text"
                id="user"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                required
                aria-invalid={validUser ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
            />

            <p id="uidnote" className={userFocus && user && !validUser ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle}/>
                2 to 30 characters. <br/>
            </p>

            {/* next */}
            <label htmlFor="fn">
                First Name:
                <span className={validFn ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validFn || !fn ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>
            </label>
            <input
                type="text"
                id="fn"
                autoComplete="off"
                onChange={(e) => setFn(e.target.value)}
                required
                aria-invalid={validFn ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setFnFocus(true)}
                onBlur={() => setFnFocus(false)}
            />

            <p id="uidnote" className={fnFocus && fn && !validFn ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle}/>
                2 to 30 characters. <br/>
            </p>

            <label htmlFor="ln">
                Last Name:
                <span className={validLn ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validLn || !ln ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>
            </label>
            <input
                type="text"
                id="ln"
                autoComplete="off"
                onChange={(e) => setLn(e.target.value)}
                required
                aria-invalid={validLn ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setLnFocus(true)}
                onBlur={() => setLnFocus(false)}
            />

            <p id="uidnote" className={lnFocus && ln && !validLn ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle}/>
                2 to 30 characters. <br/>
            </p>

            <label htmlFor="email">
                Email:
                <span className={validEmail ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validEmail || !email ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>
            </label>
            <input
                type="email"
                id="email"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={validEmail ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
            />

            {/* <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle}/>
                2 to 30 characters. <br/>
            </p> */}

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

            <button disabled={!validFn || !validLn || !validEmail || !validPassword || !validMatch ? true : false}>
                Sign Up</button>

            <p>
                Already registered? <br/>
                <span className="line">
                    {}
                    <a href="/login"> Sign In</a>
                </span>
            </p>
        </form>
    </section>
  )}
  </>
  )
}
export default Register