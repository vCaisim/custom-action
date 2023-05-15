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

    if (core.isDebug()) {
      const resBody = await res.readBody();
      core.debug(JSON.stringify(resBody));
    }

    core.info("The run was cancelled successfully!");
    core.setOutput("response-status-code", res.message.statusCode);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
