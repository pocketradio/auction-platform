---@diagnostic disable: undefined-global

local amount = tonumber(ARGV[3])
local currentBid = tonumber(redis.call('GET', KEYS[1]))

if not currentBid then
    currentBid = 0
end

if amount > currentBid then
    redis.call('SET', KEYS[1], amount)
    return 1
else
    return -1
end
