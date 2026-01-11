import { prisma } from "../services/prisma.js";
import bcrypt from "bcryptjs";


export type AuthUser = {
    id : number
    email : string
}

export async function validateUserLogin(email: string, password: string){

    const user = await prisma.user.findUnique({
        where:{
            email : email,
        }
    })

    if ( !user ){
        throw new Error("Invalid user");
    }

    const bcryptResult = await bcrypt.compare(password, user.password)
    if ( !bcryptResult){
        throw new Error("Invalid user");
    }

    const result : AuthUser = {
        id : user.id, 
        email : user.email
    }

    return result;
}