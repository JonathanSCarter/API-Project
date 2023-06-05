import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import "./LoginForm.css";
import {useModal} from '../../context/Modal'

function LoginFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if(credential.length < 4 || password.length < 6) setDisabled(true)
    else setDisabled(false)
  }, [credential, password])

  const { closeModal } = useModal()



  if (sessionUser) return <Redirect to="/" />;


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
    .then(()=>closeModal()).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
      );
    };

    return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>

        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            aria-label='test'
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button type="submit" disabled={disabled}>Log In</button>
        <button className="demo" type="submit" onClick={() => {
          setCredential('Demo-lition')
          setPassword('password')
        }}>Log in as Demo User</button>
      </form>
    </>
  );
}

export default LoginFormModal;
