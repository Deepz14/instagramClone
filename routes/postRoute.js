const express = require('express');
const router = express.Router();
const auth = require('../validationToken');
const Post = require('../models/post');


router.post('/',auth, async(req, res) => {
    const { title, body, pic} = req.body


    if (!title || !body || !pic) return res.status(401).json({mesage : "Fields Cannot be Empty..."})

    req.user.password = undefined

    try{
        const newPost = await Post({
            title,
            body,
            image : pic,
            postedBy : req.user
        })
        const savePost = await newPost.save()
        res.json({mesage : "Post saved Successfully", Post : savePost})
    }
    catch(err){
        res.status(401).json({mesage : err})
    }

})

router.get('/',auth, async(req, res) => {
    const allPost = await Post.find().populate("postedBy", "_id name")
    try{
        res.json({Posts : allPost})
    }
    catch(err){
        res.status(401).json({mesage : err})
    }
})

router.get('/followingPost', auth, async (req, res) => {
    const allPost = await Post.find({postedBy : {$in : req.user.following}}).populate("postedBy", "_id name")
    try {
        res.json({ Posts: allPost })
    }
    catch (err) {
        res.status(401).json({ mesage: err })
    }
})

router.get('/mypost', auth,async(req, res) => {
    const getPost = await Post.find({ postedBy: req.user._id }).populate("postedBy", "_id name")
    try{
        res.json({myposts : getPost})
    }
    catch(err){
        res.status(401).json({mesage : err})
    }
})

router.put('/like', auth, async(req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})

router.put('/unlike', auth, async (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})

router.put('/comment', auth, async (req, res) => {

    const comment = {
        text : req.body.text,
        postedBy : req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments : comment}
    }, {
        new: true
    }).populate("comments.postedBy","_id name")
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})


router.delete('/delete/:id', auth, (req, res) => {
    Post.findOne({_id : req.params.id})
    .populate("postedBy", "_id")
    .exec((err, post) => {
        if(err || !post){
            return res.status(422).json({error : err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result => res.json({mesage : result}))
            .catch(err => res.status(403).json({err : err}))
        }
    })
})

module.exports = router;