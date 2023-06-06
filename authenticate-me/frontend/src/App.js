import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from './components/HomePage'
import Groups from './components/Groups'
import SingleGroups from "./components/SingleGroup";
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch></Switch>}
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path='/groups'>
          <Groups />
        </Route>
        <Route path='/groups/:groupId'>
          <SingleGroups />
        </Route>
      </Switch>
    </>
  );
}

export default App;
