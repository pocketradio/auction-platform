import { Router } from "express";
const streamRouter = Router();
import type { Response } from "express";

const auctionRoom = new Map<string, Response[]>();

streamRouter.get('/lobby', (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    auctionRoom.get('lobby')?.push(res) ?? auctionRoom.set('lobby', [res]);

    req.on("close", () => {
        const updatedLobby = auctionRoom.get('lobby')?.filter((element) => element !== res);
        if (updatedLobby !== undefined && updatedLobby.length > 0) {
            auctionRoom.set('lobby', updatedLobby);
        }
        else {
            auctionRoom.delete('lobby');
        }
    })
})

streamRouter.get('/:id', (req, res) => {

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const auctionId = String(req.params.id);
    auctionRoom.get(auctionId)?.push(res) ?? auctionRoom.set(auctionId, [res]);


    req.on("close", () => {
        const updatedRoom = auctionRoom.get(auctionId)?.filter((element) => element !== res);
        if (updatedRoom !== undefined && updatedRoom.length > 0) {
            auctionRoom.set(auctionId, updatedRoom);
        }
        else {
            auctionRoom.delete(auctionId);
        }
    })
})


//heartbeat keep alive
setInterval(() => {

    auctionRoom.forEach((value, key) => {
        value.forEach(element => {
            element.write(': heartbeat\n\n')
        });
    });

    console.log("Heartbeat sent to all active rooms.")
}, 25000);



export { streamRouter, auctionRoom };