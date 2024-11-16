import { component$ } from '@khulnasoft.com/unisynth';

export default component$(() => {
  return (
    <main>
      <p>
        <label>
          GitHub organization:
          <input value="khulnasoft" />
        </label>
      </p>
      <section>
        <ul>
          <li>
            <a href="https://github.com/khulnasoft/unisynth">Unisynth</a>
          </li>
          <li>
            <a href="https://github.com/BuilderIO/partytown">Partytown</a>
          </li>
        </ul>
      </section>
    </main>
  );
});
