import React,{useContext} from 'react'
import {Navbar, Nav} from 'react-bootstrap'
import {Link, useHistory} from 'react-router-dom'
import './style.css'
import {UserContext} from '../../App'

export const NavbarContainer = () => {

    const {state, dispatch} = useContext(UserContext)

    const history = useHistory()

    const renderList = () => {
      if(state){
        return[
        <Nav.Link as={ Link } to = "/profile" key="1">
          Profile
        </Nav.Link >,
          <Nav.Link as={Link} to="/create" key="2">
          CreatePost
        </Nav.Link>,
        <Nav.Link as={Link} to="/followingPost" key="3">
            Following Post
        </Nav.Link>,
        <Nav.Link key="4">
          <button className="btn btn-sm btn-danger" 
            onClick={()=>{
              localStorage.clear()
              dispatch({type:"CLEAR"})
              history.push('/login')
            }} 
          >
            Logout
          </button>
        </Nav.Link>
      ]}
      else {
        return[
          <Nav.Link as={Link} to="/signup" key="3">
            SignUp
          </Nav.Link>,
          <Nav.Link as={Link} to="/login" key="4">
            Login{" "}
          </Nav.Link>
        ]}
    }

    return (
      <Navbar collapseOnSelect expand="lg" className="navbar">
        <Navbar.Brand className="brand-name" as={Link} to={state ? "/" : "login"}>
          Instagram
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="navLinks">
            {renderList()}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
}
