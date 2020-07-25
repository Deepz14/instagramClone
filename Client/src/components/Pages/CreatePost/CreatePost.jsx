import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import './style.css'

export const CreatePost = () => {

    const history = useHistory()
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        if(url){
            fetch('/post', {
                method: "POST", headers: { "Content-Type": "application/json", "auth-token": localStorage.getItem("jwt") },
                body: JSON.stringify({ title, body, pic: url })
            }).then(res => res.json())
                .then((data) => {
                    if (data.error) {
                        console.log(data.error)
                    }
                    else {
                        console.log(data)
                        history.push("/");
                    }
                })
                .catch((err) => console.log(err));
        }
    },[url])

    const postDetails = () => {
      const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "instaimg")
        data.append("cloud_name", "deepzcloud")

        fetch('https://api.cloudinary.com/v1_1/deepzcloud/image/upload', {
            method : "post",
            body : data
        })
        .then(res => res.json())
        .then(data => setUrl(data.url))
        .catch(err => console.log(err))  

    }

    return (
        <div className="post-card mt-4 p-4">
            <div className="card createpost-card m-auto p-3">
                <input type="text" className="file-inp mb-3" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input type="text" className="file-inp mb-3" placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />
                <input type="file" className="form-control-file mb-3" placeholder="uploadImage" onChange={(e) => setImage(e.target.files[0])} />
                <button className="btn btn-primary mt-4" onClick={postDetails}>Submit</button>
            </div>
        </div>
    )
}