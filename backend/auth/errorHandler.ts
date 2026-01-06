import type { NextFunction, Response, Request } from "express";

function loginErrorHandler (err : Error, req: Request, res: Response, next: NextFunction) {
    res.status(400).json({message : err.message});
}

function signupErrorHandler(err : Error, req : Request, res : Response, next : NextFunction){
    res.status(400).json({message : err.message});
}