'use strict';

import { getInput, info, isDebug, debug, setFailed } from '@actions/core';
import { HttpClient } from '@actions/http-client';
import { BearerCredentialHandler } from '@actions/http-client/lib/auth';
import pRetry, { AbortError } from 'p-retry';

export type ResponseStatus = 'OK' | 'FAILED';
export type RunCancellation = {
  actor: string;
  canceledAt: string;
  reason: string;
};
export type CancelRunGithubCIRouteParams = {
  githubRunId: string;
  githubRunAttempt: number;
};

const currentsApiUrl = getInput('currents-api-url', {
  required: true,
});
const bearerToken = getInput('bearer-token', { required: true });
const githubRunId = getInput('github-run-id', { required: true });
const githubRunAttempt = getInput('github-run-attempt', {
  required: true,
});

info('Calling the Currents API...');
info(`GitHub run id: ${githubRunId}`);
info(`GitHub run attempt: ${githubRunAttempt}`);

const http = new HttpClient('custom-github-action', [
  new BearerCredentialHandler(bearerToken),
]);

const request = async () => {
  const { result, statusCode } = await http.putJson<{
    status: ResponseStatus;
    data: RunCancellation & CancelRunGithubCIRouteParams;
  }>(`${currentsApiUrl}/runs/cancel-by-github-ci`, {
    githubRunId,
    githubRunAttempt,
  });

  if (result === null) {
    throw new Error('Resource not found!');
  }

  if (statusCode >= 400 && statusCode < 500) {
    throw new AbortError(JSON.stringify(result));
  }

  return result;
};

(async () => {
  try {
    const result = await pRetry(request, {
      retries: 3,
      minTimeout: 1000,
      maxTimeout: 10000,
      onFailedAttempt: (error) => {
        info(
          `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
        );
      },
    });

    if (isDebug()) {
      debug(JSON.stringify(result));
    }

    info('The run was cancelled successfully!');
  } catch (error) {
    setFailed(JSON.stringify(error));
  }
})();
