import { component$ } from '@khulnasoft.com/unisynth';
import { useContent } from '@khulnasoft.com/unisynth-city';

export const IntegrationsList = component$(() => {
  const { menu } = useContent();

  const integrations = menu?.items?.find((item) => item.text === 'Integrations')?.items;

  return (
    <ul>
      {integrations?.map((integration) => {
        return (
          <li key={integration.text}>
            <a href={integration.href}>{integration.text}</a>
          </li>
        );
      })}
    </ul>
  );
});
