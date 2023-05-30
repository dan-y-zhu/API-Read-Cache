import express from 'express';
import {
  getHealthCheck,
  getPotentiallyCachedRequestData,
  getCustomRequest
} from './controllers/baseControllers.js';
import {
  getBottomReposByForks,
  getBottomReposByLastUpdated,
  getBottomReposByOpenIssues,
  getBottomReposByStars,
  getBottomValuesValidation
} from './controllers/viewControllers.js';
import {
  errorHandler
} from '../error_handlers/errorHandler.js';

const router = express.Router();

/* Health Check Route */
router.get('/healthcheck', getHealthCheck);

/* Cached Routes */
router.get('/', getPotentiallyCachedRequestData);
router.get('/orgs/Netflix', getPotentiallyCachedRequestData);
router.get('/orgs/Netflix/members', getPotentiallyCachedRequestData);
router.get('/orgs/Netflix/repos', getPotentiallyCachedRequestData);

/* View Routes (Built off cached /orgs/Netflix/repos data) */
router.get(
  '/view/bottom/:numElements/forks',
  getBottomValuesValidation,
  getBottomReposByForks
);
router.get(
  '/view/bottom/:numElements/last_updated',
  getBottomValuesValidation,
  getBottomReposByLastUpdated
);
router.get(
  '/view/bottom/:numElements/open_issues',
  getBottomValuesValidation,
  getBottomReposByOpenIssues
);
router.get(
  '/view/bottom/:numElements/stars',
  getBottomValuesValidation,
  getBottomReposByStars
);

/* Proxied/Catch All Route */
router.get('*', getCustomRequest);

router.use(errorHandler);

export default router;
