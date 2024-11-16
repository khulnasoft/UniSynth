import type { LocationsProps } from "./location";
import { type Signal } from "@khulnasoft.com/unisynth";
export interface MapProps {
  // default options
  location: Signal<LocationsProps>;
  // add other options to customization map
}
