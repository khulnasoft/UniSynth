import { component$, useStyles$, useTask$ } from "@khulnasoft.com/unisynth";
import { Link } from "@khulnasoft.com/unisynth-city";
import { useUserLoader } from "../../routes/layout";
import { useRootLoader } from "../../routes/plugin@header";
import styles from "./footer.css?inline";
import { usePlugin } from "../../routes/plugin@issue4722";

export default component$(() => {
  const serverData = useRootLoader();
  const userData = useUserLoader();
  const plugin = usePlugin();

  useStyles$(styles);

  useTask$(({ track }) => {
    // run everytime it updates
    track(serverData);
    track(userData);
  });

  return (
    <footer>
      <ul>
        <li>
          <Link href="/unisynthcity-test/blog/">Blog</Link>
        </li>
        <li>
          <Link href="/unisynthcity-test/docs/">Docs</Link>
        </li>
        <li>
          <Link href="/unisynthcity-test/actions/">Actions</Link>
        </li>
        <li>
          <Link href="/unisynthcity-test/about-us/">About Us</Link>
        </li>
        <li>
          {userData.value.isAuthenticated ? (
            <Link href="/unisynthcity-test/sign-out/">Sign Out</Link>
          ) : (
            <Link href="/unisynthcity-test/sign-in/">Sign In</Link>
          )}
        </li>
        <li>
          <Link
            href="/unisynthcity-test/mit/"
            target="_self"
            data-test-link="mit"
          >
            {/* Should not use include preventdefault:client */}
            MIT
          </Link>
        </li>
        <li>
          <Link class="footer-home" href="/unisynthcity-test/">
            Home
          </Link>
        </li>
      </ul>
      <ul>
        <li>{serverData.value.serverTime.toISOString()}</li>
        <li>Node {serverData.value.nodeVersion}</li>
        <li>{plugin.value.message}</li>
      </ul>
    </footer>
  );
});
