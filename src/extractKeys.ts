import matchAll from 'match-all';
import { Endpoints } from '@octokit/types';

const getJiraKeys = (
  data: Endpoints['GET /repos/{owner}/{repo}/pulls']['response']['data'],
  sha: string,
) => {
  const resultArr: string[] = [];

  if (data.length > 0) {
    const result = data.find(pr => pr.merge_commit_sha === sha);
    if (result) {
      const regex = /((([a-zA-Z]+)|([0-9]+))+-\d+)/g;
      const matches = matchAll(result.head.ref, regex).toArray();
      matches.forEach((match: string) => {
        if (resultArr.find((element: string) => element !== match)) {
          resultArr.push(match);
        }
      });
    }
  }

  return resultArr.join(',').toUpperCase();
};
export default getJiraKeys;
