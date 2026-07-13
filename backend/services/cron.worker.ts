import cron from 'node-cron';
import { prisma } from './prisma.js';
import { client } from '../redis/client.js';

export const initializeCron = () => {
    cron.schedule('* * * * *', async () => {
        const expiredAuctions = await prisma.auction.findMany({
            where: {
                isActive: true,
                endsAt: {
                    lte: new Date()
                }
            },
            include: {
                winner: true
            }
        });

        for (const auction of expiredAuctions) {
            const closedAuction = await prisma.auction.update({
                where: { id: auction.id },
                data: { isActive: false },
                include: { winner: true }
            });

            await client.publish("AUCTION_UPDATES", JSON.stringify({
                type: "AUCTION_CLOSED",
                auctionId: closedAuction.id,
                winner: closedAuction.winner?.email ?? null,
                winnerId: closedAuction.winnerId,
                finalPrice: closedAuction.currentBid.toString()
            }));
        }
    });
}
