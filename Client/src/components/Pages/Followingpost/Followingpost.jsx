import React, { useState, useEffect, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faShare, faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../../App'
import './style.css';

export const Followingpost = () => {

    const [data, setData] = useState([])

    const { state } = useContext(UserContext)

    const history = useHistory()

    useEffect(() => {
        fetch('/post/followingPost', {
            method: "GET", headers: { "auth-token": localStorage.getItem("jwt") },
        }).then(res => res.json())
            .then(result => {
                setData(result.Posts)
            })
            .catch(err => console.log(err))
    }, [])


    const likePost = (id) => {
        fetch('/post/like', {
            method: "PUT", headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: id })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map((item) => {
                    if (item._id === result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            })
            .catch(err => console.log(err))
    }

    const unlikePost = (id) => {
        fetch('/post/unlike', {
            method: "PUT", headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: id })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map((item) => {
                    if (item._id === result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            })
            .catch(err => console.log(err))
    }

    const makeComments = (text, id) => {
        fetch('/post/comment', {
            method: "PUT", headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                text,
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map((item) => {
                    if (item._id === result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            })
            .catch(err => console.log(err))
    }

    const deletePost = (id) => {
        fetch(`/post/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
                history.push('/')
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="home mt-4">
            {
                data.map((item, index) => (<div className="card display-card" key={index}>
                    <div className="card-header">
                        <img src={item.image} alt="img" className="header-img" />
                        <h6 className="username-header"><Link to={item.postedBy._id !== state._id ? `/profile/${item.postedBy._id}` : `/profile`}>{item.postedBy.name}</Link></h6>
                        <div className="del-icon">
                            <FontAwesomeIcon icon={faTrash} className="delicons ml-5" onClick={() => deletePost(item._id)} />
                        </div>
                    </div>
                    <img className="card-img-top" src={item.image} alt="img" />
                    <div className="card-body text-primary">
                        {
                            item.likes.includes(state._id) ? <FontAwesomeIcon icon={faHeart} className="icons" onClick={() => unlikePost(item._id)} /> :

                                <FontAwesomeIcon icon={faHeart} className="icons" onClick={() => likePost(item._id)} />
                        }

                        <FontAwesomeIcon icon={faComment} className="icons ml-3" />
                        <FontAwesomeIcon icon={faShare} className="icons ml-3" />
                        <h6 className="card-title">{item.likes.length} likes</h6>
                        <h5 className="card-title">{item.title}</h5>
                        <p className="card-text">
                            {item.body}
                        </p>
                        {
                            item.comments.map(record => {
                                return (
                                    <h6 key={record._id}><span style={{ fontWeight: "500", color: "black" }}>{record.postedBy.name}</span> {record.text}</h6>
                                )
                            })
                        }
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            makeComments(e.target[0].value, item._id)
                        }}>
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="comment"
                            />
                        </form>

                    </div>
                </div>))
            }

        </div>
    );
}
