import { Connection } from "rabbitmq-client";

export const rabbit = new Connection(process.env.RABBITMQ_URL);

rabbit.on('error', (err) => {
    console.log('RabbitMQ connection error', err)
})
rabbit.on('connection', () => {
    console.log('Connection successfully (re)established')
})

export const pub = rabbit.createPublisher({
    confirm: true,
    maxAttempts: 2, // for retries
    exchanges: [{ exchange: 'bid', type: 'direct' }] // direct -> based on exact key match
})