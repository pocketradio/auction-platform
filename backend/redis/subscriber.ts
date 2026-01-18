import { subClient, channel } from "./client.js";
import { auctionRoom } from "../routes/stream.router.js";

type bidCreated = {
    type: "BID_CREATED";
    auctionId: number;
    amount: number;
    userId: number;
};

type bidRejected = {
    type: "BID_REJECTED";
    auctionId: number;
    userId: number;
};

type auctionCreated = {
    type: "AUCTION_CREATED";
    auctionId: number;
    timestamp: string;
};

type PublishedMessage = bidCreated | bidRejected | auctionCreated;

subClient.subscribe(channel, (message) => {
    const payload = JSON.parse(message) as PublishedMessage;

    // everything goes to lobby ( except bid rej ) and specific ones go to the auction rooms. 

    const lobbyRoom = auctionRoom.get('lobby')

    if (payload.type !== 'BID_REJECTED' && lobbyRoom && lobbyRoom.length > 0) {
        lobbyRoom.forEach(res => {
            res.write(`event: ${payload.type}\n`);
            res.write(`data: ${JSON.stringify(payload)}\n\n`);
        });
    }

    // now handling specifics : 

    if (payload.type !== 'AUCTION_CREATED') {
        const roomKey = String(payload.auctionId);
        const room = auctionRoom.get(roomKey);
        if (room && room.length > 0) {
            room.forEach(res => {
                res.write(`event: ${payload.type}\n`);
                res.write(`data: ${JSON.stringify(payload)}\n\n`);
            });
        }
    }
})