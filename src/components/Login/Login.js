import React, {useRef, useState, useEffect, useContext} from 'react';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';

const LOGIN_URL = '/auth';

const Login = () => {
    const { setAuth } = useAuth();
    const userRef = useRef();
    const errorRef = useRef();

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrorMessage('');
    }, [user, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.post(LOGIN_URL, JSON.stringify({user, password}), 
            {
                headers: { 'Content-Type' : 'application/json'},
                withCredentials: true
            }
            );
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            setAuth({user, password, accessToken});
            setUser('');
            setPassword('');
            setSuccess(true);
        } catch(err){
            if (!err?.response) {
                setErrorMessage('No Server Response');
            }
        errorRef.current.focus();
        }
        
    }

  return (
    <>
        {success ? (
            <section>
                <h1> You are logged in! </h1>
                <br />
                <p>
                    <a href="#"> Go to main page </a>
                </p>
            </section>
        ) : (
        <div>
            <form onSubmit={handleSubmit}>  
                <label htmlFor="InputEmail">Email address:</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" ref={userRef} autoComplete='off' onChange={(e) => setUser(e.target.value)} value={user} required/>
      
                <label htmlFor="InputPassword">Password:</label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" ref={userRef} autoComplete='off' onChange={(e) => setPassword(e.target.value)} value={user} required/>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
      <div className="text-center">
        <p>Not a member? <a href="#!">Register</a></p>
      </div>

    </div>
        )}
    </>
  );
}

export default Login;