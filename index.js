"use strict";

const core = require("@actions/core");
const httpm = require("@actions/http-client");

const currentsApiUrl = core.getInput("currentsApiUrl", { required: true });
const runId = core.getInput("runId", { required: true });
const bearerToken = core.getInput("bearerToken", { required: true });

core.info("Calling the Currents API...");

const http = new httpm.HttpClient("custom-github-action", [
  new httpm.BearerCredentialHandler(bearerToken),
]);

http
  .put(`${currentsApiUrl}/runs/${runId}/cancel`)
  .then((res) => {
    if (core.isDebug()) {
      core.debug(JSON.stringify(res));
    }

    core.setOutput("responseStatusCode", res);

    core.info("The run was cancelled successfully!");
  })
  .catch(core.error);
