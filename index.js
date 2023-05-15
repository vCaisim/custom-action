"use strict";

const core = require("@actions/core");
const { HttpClient } = require("@actions/http-client");
const { BearerCredentialHandler } = require("@actions/http-client/lib/auth");

const currentsApiUrl = core.getInput("currents-api-url", {
  required: true,
});
const runId = core.getInput("run-id", { required: true });
const bearerToken = core.getInput("bearer-token", { required: true });

core.info("Calling the Currents API...");

const http = new HttpClient("custom-github-action", [
  new BearerCredentialHandler(bearerToken),
]);

(async () => {
  try {
    const res = await http.put(`${currentsApiUrl}/runs/${runId}/cancel`);
    const resBody = await res.readBody();

    if (core.isDebug()) {
      core.debug(JSON.stringify(resBody));
    }

    if (res.message.statusCode !== 200) {
      core.debug(resBody.errors)
      core.setFailed(resBody.errors[0].message);
    }

    core.info("The run was cancelled successfully!");
    core.setOutput("response-status-code");
  } catch (error) {
    core.setFailed(error.message);
  }
})();
