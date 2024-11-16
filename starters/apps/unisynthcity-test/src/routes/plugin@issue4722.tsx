import { routeLoader$ } from "@khulnasoft.com/unisynth-city";

export const usePlugin = routeLoader$(() => {
  return {
    message: "works",
  };
});
