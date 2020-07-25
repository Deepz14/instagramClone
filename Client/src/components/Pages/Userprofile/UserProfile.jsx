import React, { useState, useEffect ,useContext } from 'react';
import {useParams} from 'react-router-dom';
import './style.css';
import { UserContext } from '../../../App';
// import profileImg from '../../../Images/deepz.jpg'


export const UserProfile = () => {

    const [userprofile, setUserprofile] = useState(null)

    const { state, dispatch } = useContext(UserContext)

    const {userid} = useParams()

    const [showfollow, setShowfollow] = useState(state ? !state.following.includes(userid) : true)

    useEffect(() => {
        loadData()
    }, [])

     const loadData = async () => {
       const response = await fetch(`/userprofile/${userid}`,{
          method:'GET',
          headers: {
              "auth-token": localStorage.getItem("jwt")
          }
         })
        try{
            const data = await response.json()
            setUserprofile(data)
            console.log(data)
        }
        catch(err){
            console.log(err)
        }
       
   }

   const followUser = () => {
        fetch('/userprofile/follow', {
            method : "PUT", headers : {
                "Content-Type" : "application/json",
                "auth-token" : localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                followId : userid
            })
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            dispatch({type : "UPDATE", payload : {follower : result.followers, following : result.following}})
            localStorage.setItem("user", JSON.stringify(result))
            setUserprofile((prevState) => {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers, result._id]
                    }
                }
            })
            setShowfollow(false)
        })
        .catch(err => console.log(err))
   }

    const unfollowUser = () => {
        fetch('/userprofile/unfollow', {
            method: "PUT", headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                dispatch({ type: "UPDATE", payload: { follower: result.followers, following: result.following } })
                localStorage.setItem("user", JSON.stringify(result))
                setUserprofile((prevState) => {
                   const newFollower = prevState.user.followers.filter(item => item !== result._id)
                   return {
                       ...prevState,
                       user : {
                           ...prevState.user,
                           followers : newFollower
                       }
                   }
                })
                setShowfollow(true)
            })
            .catch(err => console.log(err))
    }

    return (
        <>
        {
            userprofile ? (<div className="container-fluid profile-card mt-4">
                <div className="row profile-page m-auto">
                    <div className="col-md profile-col">
                        <div className="img-container text-center">
                            <img src={userprofile.user.pic} alt="img" className="profile-img m-auto" />
                        </div>
                        <div className="right-profile">
                            <h2 className="user-name">{userprofile.user.name}</h2>
                            {
                                showfollow ? <button className="btn btn-sm btn-primary" onClick={followUser}>Follow</button> :
                                    <button className="btn btn-sm btn-primary" onClick={unfollowUser}>Unfollow</button>
                            }
                            <div className="profile-details mt-3">
                                <p className="posts">
                                    <span className="post-details mr-1">{userprofile.post.length}</span>posts
                                </p>
                                <p className="followers ml-5">
                                    <span className="post-details mr-1">{userprofile.user.followers.length}</span>followers
                                </p>
                                <p className="following ml-5">
                                    <span className="post-details mr-1">{userprofile.user.following.length}</span>following
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12 grid-gallery">
                        {
                            userprofile.post.map((item, index) => (
                                <img src={item.image} alt="img" className="gallery-img" key={index} />
                            ))
                        }
                    </div>
                </div>
            </div>) : <h2 className="text-center">Loading</h2>
        }
        </>
    );
}
