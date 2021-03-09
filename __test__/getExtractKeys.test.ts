import { Endpoints } from '@octokit/types';
import getJiraKeys from '../src/extractKeys';

const prList: unknown[] = [
  {
    id: 1,
    merge_commit_sha: 'e5bd3914e2e596debea16f433f57875b5b90bcd6',
    head: {
      ref: 'fix/GOCRE-123-foo-bar',
    },
  },
  {
    id: 2,
    merge_commit_sha: '24b79b5c9f608bb09fce333f3e507784f9ecb8a2',
    head: {
      ref: 'fix/GOCRE-124-foo-bar',
    },
  },
  {
    id: 3,
    merge_commit_sha: '3e1c3db7f3c3cf694af59e210379545b65d485c4',
    head: {
      ref: 'fix/FLANET-125-FLANET-126-foo-bar',
    },
  },
];

describe('Get Extract Jira Issue Keys', () => {
  it('Get single Jira issue key', () => {
    const sha = 'e5bd3914e2e596debea16f433f57875b5b90bcd6';

    const result = getJiraKeys(
      prList as Endpoints['GET /repos/{owner}/{repo}/pulls']['response']['data'],
      sha,
    );
    expect(result).toBe('GOCRE-123');
  });

  it('Get another single Jira issue key', () => {
    const sha = '24b79b5c9f608bb09fce333f3e507784f9ecb8a2';

    const result = getJiraKeys(
      prList as Endpoints['GET /repos/{owner}/{repo}/pulls']['response']['data'],
      sha,
    );
    expect(result).toBe('GOCRE-124');
  });

  it('Get multiple Jira issue keys', () => {
    const sha = '3e1c3db7f3c3cf694af59e210379545b65d485c4';

    const result = getJiraKeys(
      prList as Endpoints['GET /repos/{owner}/{repo}/pulls']['response']['data'],
      sha,
    );
    expect(result).toBe('FLANET-125,FLANET-126');
  });

  it('Cannot find issue key', () => {
    const sha = 'blahblah';

    const result = getJiraKeys(
      prList as Endpoints['GET /repos/{owner}/{repo}/pulls']['response']['data'],
      sha,
    );
    expect(result).toBe('');
  });
});
