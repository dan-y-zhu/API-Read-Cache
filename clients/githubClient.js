import octokitClient from './octokitClient.js';

const { GITHUB_ITEMS_PER_PAGE } = process.env;

const DEFAULT_GITHUB_ITEMS_PER_PAGE = 100;

const getDataFromAPI = async (apiPath) => {
  const response = await octokitClient.request(`GET ${apiPath}`);
  if (response.status !== 200) {
    throw new Error(
      `Bad response status ${response.status} ${JSON.stringify(response)}`
    );
  }
  return response.data;
};

const getPaginatedDataFromAPI = async (apiPath) => {
  const data = await octokitClient.paginate(`GET ${apiPath}`, {
    per_page: GITHUB_ITEMS_PER_PAGE ?? DEFAULT_GITHUB_ITEMS_PER_PAGE
  });
  return data;
};

export { getDataFromAPI, getPaginatedDataFromAPI };
