import React, {useReducer, useContext, useEffect} from 'react';
import './App.css';
import { NavbarContainer } from './components/Navbar/Nav';
import {BrowserRouter, Route, useHistory} from 'react-router-dom';
import { Home } from './components/Pages/Home/Home';
import { Login } from './components/Pages/Login/Login';
import { Profile } from './components/Pages/Profile/Profile';
import { Signup } from './components/Pages/SignUp/Signup';
import { CreatePost } from './components/Pages/CreatePost/CreatePost';
import { UserProfile } from './components/Pages/Userprofile/UserProfile';
import { Followingpost } from './components/Pages/Followingpost/Followingpost'
import {Reducer} from './reducers/Reducer';

export const UserContext = React.createContext();

const Routing = () => {

  const history = useHistory()

  const {dispatch}  = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if(user){
      dispatch({type: "USER", payload : user})
    }
    else{
      history.push('/login')
    }
  },[])

  return (
    <>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/followingPost">
        <Followingpost />
      </Route>
    </> 
  )
}

function App() {

  const initialState = null

  const [state, dispatch] = useReducer(Reducer, initialState)

  return (
    <div className="App">
      <UserContext.Provider value={{state, dispatch}}>
        <BrowserRouter>
          <NavbarContainer />
          <Routing />
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
