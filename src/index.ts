import * as github from '@actions/github';
import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import extractKeys from './extractKeys';

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

      const jiraKeys = extractKeys(data, github.context.sha);

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
