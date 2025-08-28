Cypress.Commands.add(
  "takeSnap",
  (
    name,
    {
      devices,
      fullPage,
      colorScheme,
      enableJavaScript,
      injectStyles,
      resourceDiscoveryTimeout,
      cloneCookies,
      cssIgnores,
      xpathIgnores,
    } = {},
  ) => {
    Cypress.log({ name: `Take Snapshot: ${name}` });
    let currentDom;
    let cookies;

    return cy
      .getCookies()
      .then((cyCookies) => {
        if (cloneCookies) {
          cookies = cyCookies;
        }
      })
      .document({ log: false })
      .then((dom) => {
        currentDom = dom;
      })
      .url()
      .then(async (url) => {
        if (!global.SNAPSHOT) {
          const response = await fetch("http://localhost:1337/parseDom.js", {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            redirect: "follow",
            referrerPolicy: "no-referrer",
          });
          const parseDomFile = await response.text();

          eval(parseDomFile);
        }

        const { title, html, resources } = global.SNAPSHOT.parseDom(
          currentDom,
          enableJavaScript,
        );
        const snapshot = {
          name,
          url,
          title,
          html,
          resources,
          devices,
          fullPage,
          colorScheme,
          enableJavaScript,
          injectStyles,
          resourceDiscoveryTimeout,
          cookies,
          cssIgnores,
          xpathIgnores,
          version: 1,
        };
        return await fetch("http://localhost:1337/snapshot", {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(snapshot),
        })
          .then(() => {
            Cypress.log({
              name: "takeSnap",
              displayName: "snapshot",
              message: name,
              consoleProps() {
                return {
                  name,
                  devices,
                  fullPage,
                  colorScheme,
                  enableJavaScript,
                  injectStyles,
                  resourceDiscoveryTimeout,
                  cssIgnores,
                  xpathIgnores,
                };
              },
            });
          })
          .catch((error) => {
            console.error(`Taking snapshot ${name} failed`);
            console.error(error);
          });
      });
  },
);
