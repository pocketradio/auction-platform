import express from 'express'
import cors from 'cors';
import { userRouter } from './routes/user.router.js';
import { auctionRouter } from './routes/auction.router.js';
import { streamRouter } from './routes/stream.router.js';
import { loginRouter } from './routes/login.router.js';
import { signupRouter } from './routes/signup.router.js';
import { logoutRouter } from './routes/logout.router.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import "./auth/passport.strategy.js";
import "./queue/consumer.js";
import "./redis/subscriber.js"; 

const app = express();
const PORT = process.env.PORT||5000;
app.use(express.json());
app.use(passport.initialize());

app.use(cors({
    credentials:true,
    origin: "http://localhost:3000"
}));

app.use(cookieParser());
app.use('/me', userRouter);
app.use('/auctions', auctionRouter);
app.use('/streams', streamRouter);
app.use('/login', loginRouter);
app.use('/signup',signupRouter);
app.use('/logout', logoutRouter);

app.listen(PORT,()=>{
    console.log(`Server starting on port ${PORT}...`);
})