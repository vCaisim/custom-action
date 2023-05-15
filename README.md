# Cutom action

This action prints cancels the current cypress run by calling the Currents API.

## Inputs

### `currents-api-url`

**Required** Currents API URL.

### `bearer-token`

**Required** Bearer authentication token.

### `github-run-id`

**Required** GitHub run id.

### `github-run-attempt`

**Required** GitHub run attempt.

## Example usage

```yaml
uses: actions/custom-action
with:
  currents-api-url: ${{ vars.CURRENTS_API_URL }}
  bearer-token: ${{ secrets.CURRENTS_API_TOKEN }}
  github-run-id: ${{ github.run_id }}
  github-run-attempt: ${{ github.run_attempt }}

```