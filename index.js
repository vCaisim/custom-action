"use strict";

const core = require("@actions/core");
const httpm = require("@actions/http-client");

const currentsApiUrl = core.getInput("currents-api-url", {
  required: true,
});
const runId = core.getInput("run-id", { required: true });
const bearerToken = core.getInput("bearer-token", { required: true });

core.info("Calling the Currents API...");

const http = new httpm.HttpClient("custom-github-action", [
  new httpm.BearerCredentialHandler(bearerToken),
]);

(async () => {
  try {
    const res = await http.put(`${currentsApiUrl}/runs/${runId}/cancel`);

    if (core.isDebug()) {
      core.debug(JSON.stringify(res));
    }

    core.info("The run was cancelled successfully!");
    core.setOutput("response-status-code", res);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
