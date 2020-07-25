import React,{useState, useEffect, useContext} from 'react';
import './style.css';
import {UserContext} from '../../../App';

export const Profile = () => {

  const [mydata, setMydata] = useState([])

  const {state, dispatch} = useContext(UserContext)

  const [image, setImage] = useState('');

  useEffect(() => {
    fetch('/post/mypost', {
      method: "GET", headers: { "auth-token": localStorage.getItem("jwt") },
    }).then(res => res.json())
      .then(result => {
        setMydata(result.myposts)
      })
      .catch(err => console.log(err))
  }, [])


  useEffect(() => {
    if(image){
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
          fetch('/userprofile/updatepic', {
            method : "PUT", headers : {
              "Content-Type" : "application/json",
              "auth-token" : localStorage.getItem("jwt")
            },
            body : JSON.stringify({
              pic : data.url
            })
          }).then(res => res.json())
          .then(result => {
            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
            dispatch({ type: "UPDATEPIC", payload: result.pic })
          })
        })
        .catch(err => console.log(err))
    }
    
  },[image])

  const uploadFile = (e) => {
    setImage(e.target.files[0])
  }

    return (
      <div className="container-fluid profile-card mt-4">
          <div className="row profile-page m-auto">
            <div className="col-md profile-col">
              <div className="img-container text-center">
                <img src={state.pic ? state.pic : "loading"} alt="img" className="profile-img m-auto" />
              </div>
              <div className="right-profile">
                <h2 className="user-name">{state ? state.name : "Loading"}</h2>
                <div className="profile-details mt-3">
                  <p className="posts">
                    <span className="post-details mr-1">{state ? mydata.length : "0"}</span>posts
                    </p>
                  <p className="followers ml-5">
                    <span className="post-details mr-1">{state ? state.followers.length : "0"}</span>followers
                    </p>
                  <p className="following ml-5">
                    <span className="post-details mr-1">{state ? state.following.length : "0"}</span>following
                    </p>
                </div>
              </div>
              <input type="file" className="form-control-file mt-3 ml-3 mb-3" onChange={(e) => uploadFile(e)} />
            </div>
          </div>
 
          <div className="row mt-3">
            <div className="col-12 grid-gallery">
              {
                mydata.map((item, index) => (
                  <img src={item.image} alt={item.body} className="gallery-img" key={index} />
                ))
              }
            </div>
          </div>
    </div>
    );
}
