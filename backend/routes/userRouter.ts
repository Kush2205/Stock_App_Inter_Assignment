import {Router} from 'express';
import prisma from "../db/index"
//@ts-ignore
import jwt from 'jsonwebtoken';
//@ts-ignore
import bcrypt from 'bcrypt';

export const userRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
userRouter.post('/signup', async (req, res) => {
    const {email, password, name} = req.body;
    try {
        const existingUser = await prisma.user.findUnique({where: {email}});
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {email, password: hashedPassword, name, stocks: []}
        });

        const token = jwt.sign({userId: newUser.id}, JWT_SECRET);
        res.status(201).json({message: 'User created successfully', userId: newUser.id, token});
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
        console.log(error);
    }
})

userRouter.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await prisma.user.findUnique({where: {email}});
        if (!user) {
            return res.status(400).json({message: 'Invalid email or password'});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({message: 'Invalid email or password'});
        }
        const token = jwt.sign({userId: user.id}, JWT_SECRET);
        res.status(200).json({message: 'Login successful', userId: user.id, token});
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
})



