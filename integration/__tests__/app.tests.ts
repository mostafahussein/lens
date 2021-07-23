/**
 * Copyright (c) 2021 OpenLens Authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*
  Cluster tests are run if there is a pre-existing minikube cluster. Before running cluster tests the TEST_NAMESPACE
  namespace is removed, if it exists, from the minikube cluster. Resources are created as part of the cluster tests in the
  TEST_NAMESPACE namespace. This is done to minimize destructive impact of the cluster tests on an existing minikube
  cluster and vice versa.
*/
import * as utils from "../helpers/utils";

jest.setTimeout(20_000);

describe("preferences page tests", () => {
  it('shows "preferences" and can navigate through the tabs', async () => {
    const { window, cleanup } = await utils.start();

    try {
      await utils.clickWelcomeButton(window);
      await window.keyboard.press("Meta+,");

      await window.waitForSelector("[data-testid=application-header] >> text=Application");
      await window.click("[data-testid=proxy-tab]");
      await window.waitForSelector("[data-testid=proxy-header] >> text=Proxy");
      await window.click("[data-testid=kube-tab]");
      await window.waitForSelector("[data-testid=kubernetes-header] >> text=Kubernetes");
      await window.click("[data-testid=telemetry-tab]");
      await window.waitForSelector("[data-testid=telemetry-header] >> text=Telemetry");
    } finally {
      await cleanup();
    }
  });

  it("ensures helm repos", async () => {
    const repos = await utils.listHelmRepositories();

    if (repos.length === 0) {
      fail("Lens failed to add any repositories");
    }

    const { window, cleanup } = await utils.start();

    try {
      await utils.clickWelcomeButton(window);
      await window.keyboard.press("Meta+,");

      await window.click("[data-testid=kube-tab]");
      await window.waitForSelector(`div.repos .repoName >> text=${repos[0].name}`, {
        timeout: 100_000,
      });
      await window.click("#HelmRepoSelect");
      await window.waitForSelector("div.Select__option");
    } finally {
      await cleanup();
    }
  }, 120_000);
});
