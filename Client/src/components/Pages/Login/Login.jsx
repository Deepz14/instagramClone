import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import './style.css';

export const Login = () => {
    
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const postData = () => {
    if(email !== '' && password !== ''){
      fetch('/login', {method : "POST", headers : {"Content-Type" : "application/json"}, 
      body : JSON.stringify({email, password})
      }).then(res => res.json())
        .then((data) => {
        if(data.error){
          console.log(data.error)
        }
        else{
          localStorage.setItem("jwt",data.token)
          localStorage.setItem("user",JSON.stringify(data.user))
          console.log(data)
          history.push("/");
        }
         
        })
        .catch((err) => console.log(err));
    }
    else{
      alert('Fields Cannot be Empty');
    }
  }

  return (
    <div className="p-5">
      <div className="card login-card p-5 m-auto">
        <h2 className="insta-name">Instagram</h2>
        <input
          type="text"
          className="inp-field mt-3"
          placeholder="Email"
          value= {email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="inp-field mt-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary mt-4" onClick={postData}>Login</button>
      </div>
    </div>
  );
}
