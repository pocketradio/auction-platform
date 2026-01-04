import { Router } from "express";
import { createAuction, createBid, getAllAuctions, getAuction } from "../services/auction.service.js";
const auctionRouter = Router();

auctionRouter.get("/", async(req, res) => { // list of auctions
    const auctions = await getAllAuctions();
    if (auctions.length == 0) {
        return res.status(200).json({
            status : 'No available auctions currently :('
        })
    }
    res.json({
        auctions : auctions
    })
});


auctionRouter.get("/:id", async(req, res) => { // details of one auction
    const auctionId = parseInt(req.params.id);
    const auction = await getAuction(auctionId);
    if (!auction) {
        return res.status(404).json({
            error : 'Auction not found'
        })
    }

    res.json({
        auctionId : auctionId,
        auction : auction
    })
});

auctionRouter.post("/create", async(req,res) => {
    // verification step here with auth later. below is temporary
    try{
        await createAuction(req.body);
        res.redirect("/auctions");
    }
    catch(e){
        res.status(400).send("Invalid auction data.");
    }
})

auctionRouter.post("/bid", async(req,res) => {
    
})

export { auctionRouter };
