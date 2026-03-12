# Auction Platform

Real time auction system supporting concurrent bidding with atomic validation and live event streaming.

## Architecture

Client submits bid → API publishes message to RabbitMQ → Worker processes bid →  
Redis Lua script validates atomically → Database updated → Redis Pub-sub fans out event →  
SSE pushes update to connected clients.

## Features

- Race-condition safe bidding using Redis Lua
- Queue-driven background processing with RabbitMQ
- Real-time UI updates via SSE
- Distributed event fan-out using Redis Pub/Sub
- Stateless authentication with JWT cookies
- Failure-safe flows preventing duplicate bid execution

## Setup

```bash
clone the repo
cd auction-platform
npm install

# create .env
DATABASE_URL=
REDIS_URL=
RABBITMQ_URL=
JWT_SECRET=
```
