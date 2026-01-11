import { prisma } from "../services/prisma.js";
import bcrypt from "bcryptjs";
const saltRounds = 10;

export default async function validateUserSignup(name : string , email : string, password : string){
    
    const user = await prisma.user.findUnique({
        where:{
            email:email
        }
    })

    if (user){
        throw new Error("Email already exists.");
    }

    // hash the pwd and add fresh user to database

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return await prisma.user.create({
        data:{
            name : name,
            email : email, 
            password: hashedPassword,
        }
    })
}