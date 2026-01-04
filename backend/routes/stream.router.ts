// import type { Auction } from "@prisma/client";
import { Router } from "express";
const streamRouter = Router();
import type { Response } from "express";

const clients : Response[] = [];

streamRouter.get('/', (req,res) => {   
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    clients.push(res);
    console.log(clients,"is the list of clients");
    req.on("close", ()=>{
        const index = clients.indexOf(res);
        if ( index > -1){
            clients.splice(index, 1);
        }
    })
})



export {streamRouter, clients};