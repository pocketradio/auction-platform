import express from 'express'
import cors from 'cors';
import { userRouter } from './routes/user.router.js';
import { auctionRouter } from './routes/auction.router.js';
import { streamRouter } from './routes/stream.router.js';
const app = express();
const PORT = process.env.PORT||5000;
app.use(express.json());
app.use(cors());
app.use('/users', userRouter);
app.use('/auctions', auctionRouter);
app.use('/streams', streamRouter);

app.listen(PORT,()=>{
    console.log(`Server starting on port ${PORT}...`);
})