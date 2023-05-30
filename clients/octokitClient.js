import { Octokit } from 'octokit';

const { GITHUB_TOKEN } = process.env;

export default new Octokit({ auth: GITHUB_TOKEN });
