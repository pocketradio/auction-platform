import http from "k6/http";
import { check, sleep } from "k6";
import crypto from "k6/crypto";
import encoding from "k6/encoding";
import { Rate } from "k6/metrics";

const baseUrl = __ENV.BASE_URL || "http://localhost:5000";
const auctionId = __ENV.AUCTION_ID || "1";
const startBid = Number(__ENV.START_BID || 100);
const users = JSON.parse(__ENV.K6_USERS || "[]");
const jwtSecret = __ENV.JWT_SECRET;
const testUserId = Number(__ENV.K6_USER_ID || 999999);
const testUserEmail = __ENV.K6_USER_EMAIL || "k6@example.com";

export const options = {
    scenarios: {
        concurrent_bids: {
            executor: "ramping-vus",
            stages: [
                { duration: "10s", target: 20 },
                { duration: "30s", target: 20 },
                { duration: "10s", target: 0 }
            ]
        }
    },
    thresholds: {
        checks: ["rate>0.95"],
        http_req_duration: ["p(95)<500"]
    }
};

const queuedBids = new Rate("bid_queued");
const closedAuctionRejections = new Rate("bid_rejected_closed");

function makeJwt() {
    const now = Math.floor(Date.now() / 1000);
    const header = encoding.b64encode(JSON.stringify({ alg: "HS256", typ: "JWT" }), "rawurl");
    const payload = encoding.b64encode(JSON.stringify({
        id: testUserId,
        email: testUserEmail,
        iat: now,
        exp: now + 3600
    }), "rawurl");
    const signature = crypto.hmac("sha256", jwtSecret, `${header}.${payload}`, "base64rawurl");

    return `${header}.${payload}.${signature}`;
}

export function setup() {
    if (__ENV.AUTH_TOKEN) {
        return { tokens: [__ENV.AUTH_TOKEN] };
    }

    if (jwtSecret) {
        return { tokens: [makeJwt()] };
    }

    if (users.length === 0) {
        throw new Error("set AUTH_TOKEN, JWT_SECRET, or K6_USERS before running this test");
    }

    const tokens = users.map((user) => {
        const response = http.post(`${baseUrl}/login`, JSON.stringify(user), {
            headers: { "Content-Type": "application/json" }
        });

        check(response, {
            "login succeeded": (res) => res.status === 200,
            "login returned token cookie": (res) => Boolean(res.cookies.token?.[0]?.value)
        });

        return response.cookies.token?.[0]?.value;
    }).filter(Boolean);

    if (tokens.length === 0) {
        throw new Error("login did not return any token cookies");
    }

    return { tokens };
}

export default function (data) {
    const token = data.tokens[(__VU - 1) % data.tokens.length];
    const amount = startBid + (__VU * 1000) + __ITER;

    const response = http.post(
        `${baseUrl}/auctions/${auctionId}/bid`,
        JSON.stringify({ amount }),
        {
            headers: {
                "Content-Type": "application/json",
                Cookie: `token=${token}`
            }
        }
    );

    const accepted = response.status === 202;
    const closed = response.status === 409;

    queuedBids.add(accepted);
    closedAuctionRejections.add(closed);

    check(response, {
        "bid queued or auction closed": () => accepted || closed
    });

    sleep(1);
}
