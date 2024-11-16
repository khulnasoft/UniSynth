import { UnisynthAuth$ } from "@auth/qwik";
import GitHub from "@auth/qwik/providers/github";

export const { onRequest, useSession, useSignIn, useSignOut } = UnisynthAuth$(
  () => ({
    providers: [GitHub],
  }),
);
