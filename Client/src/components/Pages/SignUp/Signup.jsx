import React,{useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import './style.css'

export const Signup = () => {

  const history = useHistory()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState('')
  const [url, setUrl] = useState('')


  useEffect(() => {
    if(url){
      uploadFields()
    }

  },[url])

  const uploadPic = () => {
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "instaimg")
    data.append("cloud_name", "deepzcloud")

    fetch('https://api.cloudinary.com/v1_1/deepzcloud/image/upload', {
      method: "post",
      body: data
    })
      .then(res => res.json())
      .then(data => {
        setUrl(data.url)
      })
      .catch(err => console.log(err))
  }

  const uploadFields = () => {
    if (name !== '' && email !== '' && password !== '') {
      fetch("/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, pic : url }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          history.push("/login");
        })
        .catch((err) => console.log(err));
    }
    else {
      alert('Fields cannot be Empty')
    }
  }

  const postData = () => {
    if(image){
      uploadPic()
    }
    else{
      uploadFields()
    }
  }

  return (
      <div className="p-5">
        <div className="card signup-card p-5 m-auto">
          <h2 className="insta-name">Instagram</h2>
          <input type="text" className="inp-field mt-3" placeholder="Name" 
            value={name}
            onChange = {(e) => setName(e.target.value)}
            required
          />
          <input type="text" className="inp-field mt-3" placeholder="Email" 
            value={email}
            onChange = {(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="inp-field mt-3"
            placeholder="Password"
            value={password}
            onChange = {(e) => setPassword(e.target.value)}
            required
          />
          <input type="file" className="form-control-file mt-3 mb-3" id="exampleFormControlFile1" onChange={(e) => setImage(e.target.files[0])} />
          <button className="btn btn-primary mt-4" onClick={postData}>SignUp</button>
          <p className="mt-3">
            <Link to="/login">Already have an Account?</Link>
          </p>
        </div>
      </div>
    );
}
