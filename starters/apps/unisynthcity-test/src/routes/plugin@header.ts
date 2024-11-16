import {
  routeLoader$,
  type RequestHandler,
} from "@khulnasoft.com/unisynth-city";

export const useRootLoader = routeLoader$(() => {
  return {
    serverTime: new Date(),
    reg: new RegExp(""),
    nu: Infinity,
    nodeVersion: process.version,
  };
});

export const onRequest: RequestHandler = ({ headers, url, json }) => {
  headers.set("X-Unisynth", "handled");
  if (url.pathname === "/unisynthcity-test/virtual/auth") {
    json(200, {
      message: "handled",
    });
  }
};
