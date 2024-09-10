import React, { useEffect, useState } from 'react';
import './LoginSignupPage.css';
import userImg from '../../assets/user.png';
import emailImg from '../../assets/email.png';
import passwordImg from '../../assets/password.png';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const LoginSignupPage = () => {
  const [page, setPage] = useState('Log in');
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submit, setSubmit] = useState(false);

  const [validUser, setValidUser] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPwd, setValidPwd] = useState(false);

  let msg = '';

  useEffect(() => {
    setValidUser(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(password));
  }, [password]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (page === 'Sign up') {
      if (!validUser || !validEmail || !validPwd) {
        msg = 'Los unos parametara';
      }

      // Sign up logic: add new user to the database
      axios
        .post('http://localhost:3001/register', { user, email, password })
        .then((result) => {
          console.log('User registered:', result);
          // Handle successful registration (e.g., show a success message or redirect)
        })
        .catch((err) => console.log('Registration error:', err));
    } else if (page === 'Log in') {
      // Log in logic: check if the user exists in the database

      if (!validUser || !validPwd) {
        msg = 'Los unos parametara';
      }

      axios
        .post('http://localhost:3001/login', { user, password })
        .then((result) => {
          if (result.data) {
            console.log('User logged in:', result);
            // Handle successful login (e.g., store token, redirect)
            setSubmit(true);
          } else {
            console.log('User is not logged in');
            // Handle invalid login (e.g., show an error message)
          }
        })
        .catch((err) => console.log('Login error:', err));
    }
  };

  return submit ? (
    <Navigate to="/game"></Navigate>
  ) : (
    <div className="page">
      <div className="container">
        <div className="header">
          <p className="title">{page}</p>
          <div className="line"></div>
        </div>
        <p>{msg}</p>
        <form className="fields" onSubmit={handleSubmit}>
          <div className="inputFields">
            <div className="field">
              <img src={userImg} alt="user_name" className="image" />
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUser(e.target.value)}
              />
            </div>
            {page === 'Log in' ? (
              <div></div>
            ) : (
              <div className="field">
                <img src={emailImg} alt="e_mail" className="image" />
                <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
            <div className="field">
              <img src={passwordImg} alt="password" className="image" />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="submit-button">
              <button type="submit" className="button">
                Submit
              </button>
            </div>
          </div>
          <div className="buttons">
            <button
              type="button"
              className={
                page === 'Log in' ? 'gray changeButton' : 'changeButton'
              }
              onClick={() => {
                setPage('Log in');
              }}
            >
              Log in
            </button>
            <button
              type="button"
              className={
                page === 'Sign up' ? 'gray changeButton' : 'changeButton'
              }
              onClick={() => {
                setPage('Sign up');
              }}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginSignupPage;
