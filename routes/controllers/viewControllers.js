import { celebrate, Joi } from 'celebrate';

import { getPaginatedDataFromAPI } from '../../clients/githubClient.js';
import {
  sortReposByBottomForks,
  sortReposByBottomLastUpdated,
  sortReposByBottomOpenIssues,
  sortReposByBottomStars
} from './utils/dataUtils.js';
import {
  constructRedisKey,
  readDataFromRedis,
  writeDataToRedis
} from '../../clients/redisClient.js';

const { DISABLE_CACHE } = process.env;

const NETFLIX_REPOS_ROUTE = '/orgs/Netflix/repos';

const getBottomValuesValidation = celebrate({
  params: {
    numElements: Joi.number().required()
  }
});

const getBottomReposByForks = async ({ params, path }, response, next) => {
  const redisKey = constructRedisKey(path);
  const cachedJSONData = await readDataFromRedis(redisKey);
  let sortedData;
  if (cachedJSONData != null && DISABLE_CACHE !== 'true') {
    sortedData = JSON.parse(cachedJSONData);
  } else {
    let rawData;
    try {
      rawData = await getPaginatedDataFromAPI(NETFLIX_REPOS_ROUTE);
    } catch (error) {
      return next(error);
    }
    sortedData = sortReposByBottomForks(rawData);
    await writeDataToRedis(redisKey, sortedData);
  }
  const numElements =
    params.numElements > sortedData.length
      ? sortedData.length
      : params.numElements;
  const truncatedData = sortedData.slice(-numElements);
  response.status(200).send(truncatedData);
};

const getBottomReposByLastUpdated = async ({ params, path }, response, next) => {
  const redisKey = constructRedisKey(path);
  const cachedJSONData = await readDataFromRedis(redisKey);
  let sortedData;
  if (cachedJSONData != null && DISABLE_CACHE !== 'true') {
    sortedData = JSON.parse(cachedJSONData);
  } else {
    let rawData;
    try {
      rawData = await getPaginatedDataFromAPI(NETFLIX_REPOS_ROUTE);
    } catch (error) {
      return next(error);
    }
    sortedData = sortReposByBottomLastUpdated(rawData);
    await writeDataToRedis(redisKey, sortedData);
  }
  const numElements =
    params.numElements > sortedData.length
      ? sortedData.length
      : params.numElements;
  const truncatedData = sortedData.slice(-numElements);
  response.status(200).send(truncatedData);
};

const getBottomReposByOpenIssues = async ({ params, path }, response, next) => {
  const redisKey = constructRedisKey(path);
  const cachedJSONData = await readDataFromRedis(redisKey);
  let sortedData;
  if (cachedJSONData != null && DISABLE_CACHE !== 'true') {
    sortedData = JSON.parse(cachedJSONData);
  } else {
    let rawData;
    try {
      rawData = await getPaginatedDataFromAPI(NETFLIX_REPOS_ROUTE);
    } catch (error) {
      return next(error);
    }
    sortedData = sortReposByBottomOpenIssues(rawData);
    await writeDataToRedis(redisKey, sortedData);
  }
  const numElements =
    params.numElements > sortedData.length
      ? sortedData.length
      : params.numElements;
  const truncatedData = sortedData.slice(-numElements);
  response.status(200).send(truncatedData);
};

const getBottomReposByStars = async ({ params, path }, response, next) => {
  const redisKey = constructRedisKey(path);
  const cachedJSONData = await readDataFromRedis(redisKey);
  let sortedData;
  if (cachedJSONData != null && DISABLE_CACHE !== 'true') {
    sortedData = JSON.parse(cachedJSONData);
  } else {
    let rawData;
    try {
      rawData = await getPaginatedDataFromAPI(NETFLIX_REPOS_ROUTE);
    } catch (error) {
      return next(error);
    }
    sortedData = sortReposByBottomStars(rawData);
    await writeDataToRedis(redisKey, sortedData);
  }
  const numElements =
    params.numElements > sortedData.length
      ? sortedData.length
      : params.numElements;
  const truncatedData = sortedData.slice(-numElements);
  response.status(200).send(truncatedData);
};

export {
  getBottomReposByForks,
  getBottomReposByLastUpdated,
  getBottomReposByOpenIssues,
  getBottomReposByStars,
  getBottomValuesValidation
};
