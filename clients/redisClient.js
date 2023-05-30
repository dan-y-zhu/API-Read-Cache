import { createClient } from 'redis';

const REDIS_TTL = process.env.REDIS_TTL || 43200; // 12 hours in seconds

const redisClient = createClient();

const constructRedisKey = (path) => {
  if (path.includes('/view/')) {
    return _getFilterConditionFromPathForRedisKey(path);
  }
  return path;
};

const _getFilterConditionFromPathForRedisKey = (path) => {
  const tokens = path.split('/');
  return tokens[tokens.length - 1];
};

const readDataFromRedis = async (redisKey) => {
  let cachedJSONData;
  try {
    cachedJSONData = await redisClient.get(redisKey);
  } catch (error) {
    console.warn(`Error getting Redis value with key ${redisKey}: ${error}`);
  }
  return cachedJSONData;
};

const writeDataToRedis = async (redisKey, data) => {
  try {
    await redisClient.set(redisKey, JSON.stringify(data), REDIS_TTL);
  } catch (error) {
    console.warn(`Error setting Redis value with key ${redisKey}: ${error}`);
  }
};

export {
  constructRedisKey,
  redisClient,
  readDataFromRedis,
  writeDataToRedis
};
