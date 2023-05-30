import express from 'express';
import { errors } from 'celebrate';
import { redisClient } from './clients/redisClient.js';

import routes from './routes/routes.js';

const app = express();

const { SERVER_PORT } = process.env;

const DEFAULT_PORT = 3000;

app.use(routes);
app.use(errors());

const server = app.listen(SERVER_PORT || DEFAULT_PORT, async () => {
  try {
    await redisClient.connect()
  } catch (e) {
    console.log(`Issue connecting to Redis Client: ${e}`)
  }
  console.log(
    `API Read Cache Service started on port: ${server.address().port}`
  )
});

export default app;
