import { clients } from "../routes/stream.router.js";
import type { Auction } from "@prisma/client";



type streamEvent = 
    | {type : "auction_created" ; auctions : Auction}
    | {type : "created_bid" ; auction_id : number ; current_bid : string}
    | {type : "auction_closed" ; auction_id : number}



// handles all streams and emits it to the client for live updates
export async function emit(payload : streamEvent){
    clients.forEach(e => {
        e.write(payload)
    });
}



