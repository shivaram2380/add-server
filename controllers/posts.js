import express from 'express';
import mongoose  from 'mongoose';
import PostMessage from "../models/postMessage.js";

const router = express.Router();

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();

        res.status(200).json(postMessages)
    } catch (error) {
        res.status(404).json({message: error.message })
    }
}

export const createPost = async (req, res) =>{
   const post = req.body;

   const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString()});
// here creator is new user and BE specifies the creator of a specific post & know (Date) wn it's created
    try {
        await newPost.save(); 

        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }

}

export const updatePost = async (req, res)=>{
    const { id: _id } = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });

    res.json(updatedPost);
};

export const deletePost = async (req, res ) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id )) return res.status(404).send('No post with that id');

     await PostMessage.findByIdAndRemove(id);

      res.json({ message: 'post deleted successfully' })

}

export const likePost = async ( req, res ) => {
    const { id } = req.params;
    if(!req.userId) return res.json({ message: "Unauthenticated" });

    if(!mongoose.Types.ObjectId.isValid(id )) return res.status(404).send('No post with that id');

    const post = await PostMessage.findById(id);
    // if the user alrdy in the like section or not
    const index = post.likes.findIndex((id) => id === String(req.userId))
    // each like is gng 2 be the id from this id v r gng 2 know who liked the specific post
    if(index === -1){
        post.likes.push(req.userId);
        // wn user like the post then this id pushing to it
    }else{
        post.likes = post.likes.filter((id) => id !== String(req.userId));
        // remove the id from wn user dislike the post
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true})

    res.json(updatedPost);
}
export default router;