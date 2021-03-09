import * as github from '@actions/github';
import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import matchAll from 'match-all';

async function main() {
  try {
    const payload = github.context.payload;
    const owner = payload.repository?.owner.login;
    const repo = payload.repository?.name;
    const token = process.env['GITHUB_TOKEN'];
    const octokit = new Octokit({
      auth: token,
    });

    if (owner && repo) {
      const { data } = await octokit.pulls.list({
        owner,
        repo,
        state: 'closed',
      });

      const resultArr: string[] = [];

      if (data.length > 0) {
        const result = data.find(
          pr => pr.merge_commit_sha === github.context.sha,
        );
        if (result) {
          const regex = /((([a-zA-Z]+)|([0-9]+))+-\d+)/g;
          const matches = matchAll(result.head.ref, regex).toArray();
          matches.forEach((match: string) => {
            if (resultArr.find((element: string) => element === match)) {
            } else {
              resultArr.push(match);
            }
          });
        }
      }

      const jiraKeys = resultArr.join(',').toUpperCase();
      core.info(`JiraKeys: ${jiraKeys}`);
      core.setOutput('jiraKeys', jiraKeys);
    } else {
      core.error('🚧️ Cannot find owner or repo.');
    }
  } catch (e) {
    core.setFailed(e.message);
  }
}

main();
