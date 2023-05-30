import {
  getDataFromAPI,
  getPaginatedDataFromAPI
} from '../../clients/githubClient.js';
import {
  constructRedisKey,
  redisClient,
  readDataFromRedis,
  writeDataToRedis
} from '../../clients/redisClient.js';

const { DISABLE_CACHE, GITHUB_TOKEN, REDIS_TTL } = process.env;

const CACHED_PAGINATED_ROUTES = [
  '/orgs/Netflix/members',
  '/orgs/Netflix/repos'
];

/* Cached Route Handler */
const getPotentiallyCachedRequestData = async ({ path, params }, response, next) => {
  const redisKey = constructRedisKey(path);
  const cachedJSONData = await readDataFromRedis(redisKey);
  let data;
  if (cachedJSONData != null && DISABLE_CACHE !== 'true') {
    data = JSON.parse(cachedJSONData);
  } else {
    // to-do: Replace this branching logic with logic dynamically distinguishing whether to use pagination or not
    if (CACHED_PAGINATED_ROUTES.includes(path)) {
      try {
        data = await getPaginatedDataFromAPI(path);
      } catch (error) {
        return next(error);
      }
    } else {
      try {
        data = await getDataFromAPI(path)
      } catch (error) {
        return next(error);
      }
    }
    await writeDataToRedis(redisKey, data);
  }
  response.status(200).send(data);
};

/* Proxy Route Handler */
const getCustomRequest = async ({ params }, response, next) => {
  if (params.length === 0) {
    return response.status(400).send('No request path found in params.');
  }
  const customRequestPath = params[0];
  // to-do: Add logic dynamically distinguishing whether to use pagination or not
  let data;
  try {
    data = await getDataFromAPI(customRequestPath);
  } catch (error) {
    return next(error);
  }
  response.status(200).send(data);
};

/* Health Check Handler */
const getHealthCheck = async (_request, response, _next) => {
  if (GITHUB_TOKEN === undefined) {
    return response
      .status(503)
      .send(
        'Github token not supplied. Please supply a Github token in the .env file'
      )
  }
  try {
    await getDataFromAPI('/')
  } catch (error) {
    return response
      .status(503)
      .send(
        `An issue occurred while polling the Github API ${error}`
      )
  }
  if (REDIS_TTL === undefined) {
    console.warn('Warning: No redis TTL was set. Will default to 12 hours.')
  }
  try {
    await redisClient.ping()
  } catch (error) {
    return response
      .status(503)
      .send(
        `An issue occurred while polling the Redis client ${error}`
      )
  }
  response.status(200).send('Service is in good health - query on :)')
};

export { getCustomRequest, getHealthCheck, getPotentiallyCachedRequestData }
