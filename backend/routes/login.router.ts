import { Router} from "express";
import type {Request, Response, NextFunction} from 'express';
import { type AuthUser } from "../middleware/validateLogin.js";
import passport from "passport";
const loginRouter = Router();
import * as jwt from "jsonwebtoken"; 

loginRouter.post("/", //login jwt sign

    passport.authenticate("local", {session : false}),

    async(req : Request, res : Response, next : NextFunction) => {
        const user = req.user as AuthUser;
        const token = jwt.sign(user, process.env.JWT_SECRET!, {expiresIn : "1d"});
        res.json({token, user});
})

export {loginRouter};