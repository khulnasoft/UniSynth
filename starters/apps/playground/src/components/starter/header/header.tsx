import { component$ } from "@khulnasoft.com/unisynth";
import { UnisynthLogo } from "../icons/unisynth";
import styles from "./header.module.css";

export default component$(() => {
  return (
    <header class={styles.header}>
      <div class={["container", styles.wrapper]}>
        <div class={styles.logo}>
          <a href="/" title="unisynth">
            <UnisynthLogo height={50} width={143} />
          </a>
        </div>
        <ul>
          <li>
            <a
              href="https://unisynth.dev/docs/components/overview/"
              target="_blank"
            >
              Docs
            </a>
          </li>
          <li>
            <a
              href="https://unisynth.dev/examples/introduction/hello-world/"
              target="_blank"
            >
              Examples
            </a>
          </li>
          <li>
            <a
              href="https://unisynth.dev/tutorial/welcome/overview/"
              target="_blank"
            >
              Tutorials
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
});
