# API Read Cache

This service is a read caching service for Netflix Github organization data.

# Overview

The service will cache the following API endpoints periodically and return Github API respoonse data:

- `/`
- `/orgs/Netflix`
- `/orgs/Netflix/members`
- `/orgs/Netflix/repos`

The service provides the following custom views based on the `/orgs/Netflix/repos` endpoint:

- `/view/bottom/N/forks` - bottom-n repos by number of forks
- `/view/bottom/N/last_updated` - bottom-n repos by "Last Updated" Github filter
- `/view/bottom/N/open_issues` - bottom-n repos by number of open issues
- `/view/bottom/N/stars` - bottom-n repos by number of stars

For all other requests, the service will proxy the request to the Github API and return Github API respoonse data.

# Design Considerations

From a higher level, I approached this assignment in roughly the following iterative/piece-wise fashion:

- Implement a data fetcher for non paginated routes
- Implement a data fetcher for paginated routes
- For explicit cached routes, hook up route handler to corresponding paginated/non-paginated data fetchers
- For view routes, hook up route handler to paginated data fetchers
- Run provided test suite (updated values as fitting) - **in theory, this service should work without a cache altogether**
- Set up caching for explicit cached routes and view routes.
- Run provided test suite once more with cache and without cache.

## Caching

At higher level, I chose Redis for caching because Redis data resides in memory, which enables for lower latency and higher throughput data access.

This said, because Redis data resides in memory, I tried to be cognizant of how much cache space my service was consuming, and this manifested in a couple thoughts:

- setting a configurable TTL (so stale/old entries could be flushed more often or less often as needed)
- for view routes, only storing post processed and filtered data (we only need to store the end-return tuple items, not the entire Github API response)
- If I had even more limited space, I would dial the TTL of the cached routes to be lower than that of the views (since the raw responses take up more space). 

## Packages

This service development was made easier through the addition of a couple packages:

- [celebrate](https://www.npmjs.com/package/celebrate) for request validation
- [dotenv](https://www.npmjs.com/package/dotenv) to pull in .env values
- [eslint](https://www.npmjs.com/package/eslint) for linting/formatting code 
- [express](https://www.npmjs.com/package/express) for routing/web server setup
- [octokit](https://www.npmjs.com/package/octokit) for Github API interactions
- [redis](https://www.npmjs.com/package/redis) for caching

# Running The Service

1. Clone this repository
2. In the repo, run `npm install` to fetch all necessary `npm` modules.
3. Create a .env file in the root directory of the repository, supplying the following values

```
# Required Values
GITHUB_TOKEN=<your github token>
REDIS_TTL=<your selected redis ttl>

# Optional Values
GIT_HUB_ITEMS_PER_PAGE=<your value> # Defaults to 100
SERVER_PORT=<your port> # Defaults to 3000
DISABLE_CACHE= true # Forces a write of new data to the cache
```

4. Install redis using instructions [here](https://redis.io/docs/getting-started/), then start redis in a window with `redis-server`.
5. Start the server with `npm start`.


# Testing

Given that I spent only 4ish hours on this implementation, I didn't write unit tests and instead relied on the shell test suite. This all being said, I:
- tested error handling by forcing errors on the Github and Redis layers
- supplied/added typos to my Github token env variable
- sent bad request to be proxied to Github (with expectation that the error bubbles up the service)

# Future Work/To-Dos

Given limited time, I did what I thought was most appropriate with the time given.
This being said, here is a running list of open items I would work on/improve (in roughly descending order of importance):

- Update the pagination conditional logic in the cached routes handler to not have a defined list. Extend/Reuse this logic 
to the proxy route handler. 

Some "dynamic determination" of whether we need paginated data or not would help here - I think this can be dertmined by whether we find paginated headers in the Github API response.
**There is a current pitfall that my implementation will not fetch all paginated data if a paginated route was proxied through my service**

- Better/more granular error handling

Currently, I only added a simple catch-all error handler middleware. The key idea I put forth is that any `console.warning` 
message would be replaced with a logger call (if we were to productionize this), and we would add additional conditional logic 
corresponding to response code and error message to be sent to the user. 

- Unit Testing (starting from `dataUtils`, then through controller classes)
- Integration/Smoke Testing
- Further optimize the Redis key/caching strategy
  - Perhaps we can have dynamically determined TTL for different entries (based on service traffic)
