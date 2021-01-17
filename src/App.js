import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useParams,
  useRouteMatch,
  Prompt,
} from "react-router-dom";
import React, { useState } from 'react';
import {
  SearchHotel,
  Hotels,
  Profile,
  NoMatch,
  Login,
  LoggedIn,
} from './Components';
import apiFacade from './apiFacade';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [username, setUserName] = useState("");

  const logout = () => {
    apiFacade.logout()
    setLoggedIn(false)
  }

  const login = (user, pass) => {
    setUserName(user);
    apiFacade.login(user, pass)
      .then(res => {
        setLoggedIn(true)
        setError('');
      })
      .catch(err => {
        setError("Couldn't log you in, see error in console for further information");
        console.log(err);
      })
  }


  return (
    <Router>
      <div>
        <Header
          loginMsg={loggedIn ? "Logout" : "Login"}
          isLoggedIn={loggedIn}
        />
        <Switch>
          <Route exact path="/">
            <div>
              {!loggedIn ? (<Login login={login} />) :
              (<div>
                <LoggedIn username={username}/>
                <button onClick={logout}>Logout</button>
              </div>)}
              
              {error}
            </div>

            <SearchHotel />

          </Route>
          <Route path="/hotels">
            <Hotels isLoggedIn={loggedIn} />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route component={NoMatch}></Route>
        </Switch>
      </div>
    </Router>
  );
}

function Header({ isLoggedIn, loginMsg }) {
  return (
    <ul className="header">
      <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
      <li><NavLink exact activeClassName="active" to="/hotels">Hoteller</NavLink></li>
      {
        isLoggedIn &&
        (
          <React.Fragment>
            <li><NavLink activeClassName="active" to="/profile">Profile</NavLink></li>
          </React.Fragment>
        )
      }
    </ul>
  );
}

export default App;
