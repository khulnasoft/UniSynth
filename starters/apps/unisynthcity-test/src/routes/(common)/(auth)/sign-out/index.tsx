/**
 * Simple Auth For Testing Only!!!
 */

import type { RequestHandler } from "@khulnasoft.com/unisynth-city";
import { signOut } from "../../../../auth/auth";

export const onGet: RequestHandler = async ({ redirect, cookie }) => {
  signOut(cookie);
  throw redirect(302, "/unisynthcity-test/sign-in/");
};
