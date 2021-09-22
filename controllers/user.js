// here the whole complex logic of signin & signup the user
import bcrypt from 'bcryptjs';
// bcrypt is used 2 encrypt the password & users want to have some security
 
import  jwt  from 'jsonwebtoken';
// store the user in a browser some period of time
// if user leaves a site he will still be able to stay logged in that site using jwt

import User from '../models/user.js';

export const signin = async (req, res ) => {
    const { email, password } = req.body;
// all the post data u send is gng 2 b availble for u in the "req.body"
    try {
        const existingUser = await User.findOne({ email });
// if user create new one v need 2 find the old 1 alrdy exist or not in the DB
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist."})

        const isPasswordCorrect = await bcrypt.compare( password, existingUser.password);
// if the new password is enterd check the new password in the DB alrdy exist or not
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials"})
// if the password not correct 
        const token = jwt.sign( { email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h"});
// if the user alrdy exist in DB then just signin with token v need to send to the FE
        res.status(200).json({ result: existingUser, token});
        // 'test' is the replace of jwt having credentials so that v can store in .env variable
     } catch (error) {
        res.status(500).json({ message: 'something went wrong'});
    }
}

export const signup = async (req, res ) => {
    // in the form having details
    const { email , password, confirmPassword, firstName, lastName } = req.body;
// the req.body vr destructuring the things v send over 
// here remember wt v have in the FE side wn vr signingUP
    try {
        const existingUser = await User.findOne({ email });
// find a user with that email bcoz v can't create acnt if it's alrdy an existing user 
        if(existingUser) return res.status(400).json({ message: " User already exists"})
// if v have the user alrdy this msg displays or don't have an existing user go 2 next
        if(password !== confirmPassword) return res.status(400).json({ message: "Both Passwords are not same"})

        const hashedPassword = await bcrypt.hash(password, 12)
// here HASH the password bcoz v don't want 2 store it in a plain text
        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`})
// here creating the user
        const token = jwt.sign( { email: result.email, id: result._id }, 'test', { expiresIn: "1h"});
// here creating the token for the user
        res.status(200).json({ result , token});

    } catch (error) {
        res.status(500).json({ message: 'something went wrong'});

    }
}