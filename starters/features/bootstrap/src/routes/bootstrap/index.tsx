import { component$ } from "@khulnasoft.com/unisynth";
import { Link, type DocumentHead } from "@khulnasoft.com/unisynth-city";

export default component$(() => {
  return (
    <>
      <h2>Bootstrap components</h2>
      <hr />
      <ul>
        <li>
          <Link href="/bootstrap/alerts/">Alerts</Link>
        </li>
        <li>
          <Link href="/bootstrap/buttons/">Buttons</Link>
        </li>
        <li>
          <Link href="/bootstrap/spinners/">Spinners</Link>
        </li>
      </ul>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Unisynth",
  meta: [
    {
      name: "description",
      content: "Unisynth site description",
    },
  ],
};
