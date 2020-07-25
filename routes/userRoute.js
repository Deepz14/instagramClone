const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Post = require('../models/post');
const auth = require('../validationToken');



router.get('/:id',auth,async(req, res) => {
     const user = await User.findOne({ _id: req.params.id }).select("-password")
     try{
        const posts = await Post.find({ postedBy: req.params.id }).populate("postedBy", "_id name")
        try{
            res.json({post : posts, user : user})
        }
        catch(err){
            res.status(404).json({ message: "User not Found!!" })
        }
     }
     catch(err){
        res.status(403).json({ Message: err })
     }

})


router.put('/follow',auth, async(req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push : {followers : req.user._id}
    },{new : true}, (err, result) => {
        if(err){
            return res.status(422).json({err: err})
        }
        User.findByIdAndUpdate(req.user._id, {
            $push : {following : req.body.followId}
        }, {
            new : true
        }).select("-password").then(result => res.json({result}))
        .catch(err => res.status(422).json({Message : err}))
    }
    )
})

router.put('/unfollow', auth, async (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    }, { new: true }, (err, result) => {
        if (err) {
            return res.status(422).json({ err: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }
        }, {
            new: true
        }).select("-password").then(result => res.json({ result }))
            .catch(err => res.status(422).json({ Message: err }))
    }
    )
})


router.put('/updatepic', auth,(req, res) => {
    User.findByIdAndUpdate(req.user._id, {$set : {pic : req.body.pic}}, {new : true}, (err, result) => {
        if(err){
            return res.status(422).json({Message : err})
        }
        res.json(result)
    })
})


module.exports = router;