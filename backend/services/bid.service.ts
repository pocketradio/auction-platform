import { prisma } from "./prisma.js";

export default async function updateBid(auctionId: number, currentBid: number, userId: number) {
    await prisma.auction.update({
        where: { id: auctionId },
        data: {
            currentBid,
            winnerId: userId
        }
    })
}