# Get Jira Keys from PR
This Github Action parses all the possible issue keys from the merged PR branch name.

## Requirements
The branch name must include the Jira Issue keys. 

Issue keys must use letters and must have a dash ('-') between the letters and digits. There should be no spaces between the characters of an issue key.

ex>: `fix/GOCRE-123-some-bugs`, `fix/gocre-123-some-issues`, `feat/GOCRE-123-GOCRE-124-foo-bar`

## Action Specifications

### Input values

#### Required

Inside your .yml file there should be something that looks like this required variable:

###### Environment variables

```
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

For more information on Github Environment Variables, see https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables#default-environment-variables

### Output value

- `jiraKeys` - All of the keys found in the PR branch name.

## Usage

```yaml
  steps:
    - name: Get Jira keys
      id: getJiraKeys
      uses: ejnkr/get-jira-keys-from-pr@main
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    - name: Upload deployment info
      uses: HighwayThree/jira-upload-deployment-info@master
      with:
        client-id: '${{ secrets.CLIENT_ID }}'
        client-secret: '${{ secrets.CLIENT_SECRET }}'
        cloud-instance-base-url: '${{ secrets.CLOUD_INSTANCE_BASE_URL }}'
        issue-keys: "${{ steps.getJiraKeys.outputs.jiraKeys }}"
        display-name: "Deployment Number 1"
        description: "Test Deployment"
        last-updated: '${{ github.event.head_commit.timestamp }}'
        label: 'Test Deployment Label'
        state: '${{env.DEPLOY_STATE}}'
        environment-id: 'Test'
        environment-display-name: 'Test'
        environment-type: 'testing'
```
