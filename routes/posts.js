import express from 'express';

import { getPosts, createPost, updatePost, deletePost, likePost } from '../controllers/posts.js';

import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', auth, createPost);
router.patch('/:id',auth, updatePost);
router.delete('/:id',auth,  deletePost);
router.patch('/:id/likePost',auth, likePost)
export default router;

// in here for see the posts user not necessary to login
// for creating any action for that v need to logged in and that is {"auth"}
// before tha likePost call the auth bcoz every user has the permission to like the post & he can't like twice or many times