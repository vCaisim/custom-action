"use strict";

const core = require("@actions/core");
const { HttpClient } = require("@actions/http-client");
const { BearerCredentialHandler } = require("@actions/http-client/lib/auth");

const currentsApiUrl = core.getInput("currents-api-url", {
  required: true,
});
const bearerToken = core.getInput("bearer-token", { required: true });
const githubRunId = core.getInput("github-run-id", { required: true });
const githubRunAttempt = core.getInput("github-run-attempt", {
  required: true,
});

core.info("Calling the Currents API...");
core.info(`GitHub run id: ${githubRunId}`);
core.info(`GitHub run attempt: ${githubRunAttempt}`);

const http = new HttpClient("custom-github-action", [
  new BearerCredentialHandler(bearerToken),
]);

(async () => {
  try {
    const { result, statusCode } = await http.putJson(
      `${currentsApiUrl}/runs/cancel-by-github-ci`,
      {
        githubRunId,
        githubRunAttempt,
      }
    );

    if (core.isDebug()) {
      core.debug(result);
    }

    if (statusCode !== 200) {
      core.error(`Currents API responed with ${statusCode}`);
      core.setFailed(result);
    } else {
      core.info("The run was cancelled successfully!");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
