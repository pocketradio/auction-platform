import { Router } from "express";
import type { Request, Response } from "express";
import { createAuction, getAllAuctions, getAuction } from "../services/auction.service.js";
import passport from "passport";
import type { AuthUser } from "../middleware/validateLogin.js";
import { pub } from "../queue/client.js";
import { client } from "../redis/client.js";
import type { Auction } from "@prisma/client";

const auctionRouter = Router();

auctionRouter.get("/", async (req, res) => { // list of auctions
    const auctions = await getAllAuctions();
    if (auctions.length == 0) {
        return res.status(200).json({
            status: 'No available auctions currently :('
        })
    }
    res.json({
        auctions: auctions
    })
});

auctionRouter.get("/:id", async (req, res) => { // details of one auction
    const auctionId = parseInt(req.params.id);
    const auction = await getAuction(auctionId);
    if (!auction) {
        return res.status(404).json({
            error: 'Auction not found'
        })
    }

    res.json({
        auctionId: auctionId,
        auction: auction
    })
});

auctionRouter.post(
    "/create",
    passport.authenticate("jwt", { session: false }),
    async (req: Request, res: Response) => {
        console.log(req.user, "is the user");
        try {
            const newAuction = await createAuction(req) as Auction;
            client.publish("AUCTION_UPDATES", JSON.stringify({
                type: "AUCTION_CREATED",
                ...newAuction
            }))
            res.sendStatus(200);
        } catch (e) {
            res.status(400).send("Invalid auction data.");
        }
    }
);


auctionRouter.post(
    "/:id/bid",
    passport.authenticate("jwt", { session: false }),
    async (req: Request, res: Response) => {
        console.log("Bid endpoint hit and user validated.");

        const { id, email } = req.user as AuthUser;
        const auctionId = Number(req.params.id);
        const { amount } = req.body as { amount: number };

        try {
            await pub.send(
                { exchange: "bid", routingKey: "bid.created" },
                {
                    auctionId,
                    userId: id,
                    email,
                    amount,
                    timestamp: Date.now()
                }
            );

            console.log("RabbitMQ publish ok → bid.created", {
                auctionId,
                userId: id,
                amount
            });

            res.sendStatus(202);
        } catch (err) {
            console.error("RabbitMQ publish FAILED", err);
            res.status(500).json({ error: "Failed to enqueue bid" });
        }
    }
);

export { auctionRouter };
