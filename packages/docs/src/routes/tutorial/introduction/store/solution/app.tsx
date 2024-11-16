import { component$, useStore } from '@khulnasoft.com/unisynth';

export default component$(() => {
  const github = useStore({
    org: 'khulnasoft',
    repos: ['unisynth', 'partytown'] as string[] | null,
  });

  return (
    <main>
      <p>
        <label>
          GitHub username:
          <input value={github.org} />
        </label>
      </p>
      <section>
        {github.repos ? (
          <ul>
            {github.repos.map((repo) => (
              <li>
                <a href={`https://github.com/${github.org}/${repo}`}>
                  {github.org}/{repo}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          'loading...'
        )}
      </section>
    </main>
  );
});
