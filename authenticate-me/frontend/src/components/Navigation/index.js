import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
      <li className="left">
      <NavLink exact to='/groups/new'>Create a Group</NavLink>
      </li>
      <li className="loggedIn right">
        <ProfileButton user={sessionUser} />
      </li>
      </>
    );
  } else {
    sessionLinks = (
      <li className="right">
        <OpenModalButton
          className="notlogged"
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
    );
  }
  return (
    <>
      <div className="navbar">
        <ul>
          <li className='left titlecard'>
            <NavLink exact to="/">
              <h1 className="title"><i class="fa-solid fa-drumstick-bite"></i>MeatUp</h1>
            </NavLink>
          </li>
          {isLoaded && sessionLinks}
        </ul>
      </div>
      <div className="line"></div>
    </>
  );
}

export default Navigation;
