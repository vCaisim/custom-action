# Cutom action

This action prints cancels the current cypress run by calling the Currents API.

## Inputs

### `currents-api-url`

Currents API URL. Default value is `https://api.currents.dev/api/v1`

### `bearer-token`

**Required** Bearer authorization token.

### `github-run-id`

**Required** GitHub run id.

### `github-run-attempt`

**Required** GitHub run attempt.

## Example usage

```yaml
- name: Cancel the run if workflow is cancelled
  if: ${{ cancelled() }}
  uses: currents-dev/cancel-run-action@v1
  with:
    bearer-token: ${{ secrets.CURRENTS_API_TOKEN }}
    github-run-id: ${{ github.run_id }}
    github-run-attempt: ${{ github.run_attempt }}

```