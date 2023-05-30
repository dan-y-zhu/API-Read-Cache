/*
  Utility class containing repository data sorting logic

  Per assignment specification, we have two sorts:
    * first in descending order by specific field
    * second in order of name (alphabetical) to tie break specific field
*/

const sortReposByBottomForks = (repos) => {
  repos.sort((repoOne, repoTwo) => {
    if (repoOne.forks_count === repoTwo.forks_count) {
      return repoOne.name.localeCompare(repoTwo.name);
    }
    return repoTwo.forks_count - repoOne.forks_count;
  })
  return repos.map((entry) => [entry.full_name, entry.forks_count]);
};

const sortReposByBottomLastUpdated = (repos) => {
  repos.sort((repoOne, repoTwo) => {
    const unixTimeOne = _convertToUnixTimestamp(repoOne.pushed_at);
    const unixTimeTwo = _convertToUnixTimestamp(repoTwo.pushed_at);
    if (unixTimeOne === unixTimeTwo) {
      return repoOne.name.localeCompare(repoTwo.name);
    }
    return unixTimeTwo - unixTimeOne;
  })
  return repos.map((entry) => [entry.full_name, entry.pushed_at]);
};

const sortReposByBottomOpenIssues = (repos) => {
  repos.sort((repoOne, repoTwo) => {
    if (repoOne.open_issues_count === repoTwo.open_issues_count) {
      return repoOne.name.localeCompare(repoTwo.name);
    }
    return repoTwo.open_issues_count - repoOne.open_issues_count;
  })
  return repos.map((entry) => [entry.full_name, entry.open_issues_count]);
};

const sortReposByBottomStars = (repos) => {
  repos.sort((repoOne, repoTwo) => {
    if (repoOne.stargazers_count === repoTwo.stargazers_count) {
      return repoOne.name.localeCompare(repoTwo.name);
    }
    return repoTwo.stargazers_count - repoOne.stargazers_count;
  })
  return repos.map((entry) => [entry.full_name, entry.stargazers_count]);
};

const _convertToUnixTimestamp = (rawTimestamp) => {
  return new Date(rawTimestamp).valueOf();
};

export {
  sortReposByBottomForks,
  sortReposByBottomLastUpdated,
  sortReposByBottomOpenIssues,
  sortReposByBottomStars
};
