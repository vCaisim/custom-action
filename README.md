# Cutom action

This action prints cancels the current cypress run by calling the Currents API.

## Inputs

### `currents-api-url`

**Required** Currents API URL.

### `run-id`

**Required** Cypress run id.

### `bearer-token`

**Required** Bearer authentication token.

## Outputs

### `response-status-code`

HTTP Response status code.

## Example usage

```yaml
uses: actions/custom-action
with:
  currents-api-url: ${{ vars.CURRENTS_API_URL }}
  run-id: 'some-run-id',
  bearer-token: ${{ secrets.CURRENTS_API_TOKEN }}
```