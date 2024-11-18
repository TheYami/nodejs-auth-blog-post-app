import { Router } from "express";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {db} from '../utils/db.js'
import dotenv from 'dotenv';
dotenv.config();

const authRouter = Router();

authRouter.post('/register', async (req,res) => {
    try{
        const user = {
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.password,
            lastname: req.body.lastname
        }
    
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt)
    
        const collection = db.collection('users')
        await collection.insertOne(user);
    
        return res.status(200).json({"message": "User has been created successfully" })

    }catch(e){
        console.log(e);
        return res.status(500).json({"message": "Server fail"})
    }
})

authRouter.post('/login', async (req,res) => {
    try{
        const user = await db.collection('users').findOne({username:req.body.username})

        if(!user){
            return res.status(400).json({"message":"user not found"})
        }

        const password = await bcrypt.compare(req.body.password,user.password)

        if(!password){
            return res.status(400).json({"message":"password not valid"})
        }

        const token = jwt.sign(
            {id:user._id, fistName:user.firstName, lastName:user.lastName},
            process.env.SECRET_KEY,
            {
                expiresIn:"900000"
            }
        )

        return res.status(200).json({"message":"login successfully",token})

    }catch(e){
        console.log(e);
        return res.status(500).json({"message":"server fail"})
    }
})

export default authRouter;
