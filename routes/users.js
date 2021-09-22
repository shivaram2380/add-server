import express from 'express';

import { signin, signup } from '../controllers/user.js';
// this r coming from user.js
const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
// u needed it to be 'post'' rqst bcoz u've 2 send all details from the login form to the BE

export default router;