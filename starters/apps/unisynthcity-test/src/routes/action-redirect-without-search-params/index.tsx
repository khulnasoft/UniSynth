import { routeAction$, Form } from "@khulnasoft.com/unisynth-city";
import { component$ } from "@khulnasoft.com/unisynth";

export const useAction = routeAction$((_, context) => {
  throw context.redirect(
    302,
    "/unisynthcity-test/action-redirect-without-search-params-target/",
  );
});

export default component$(() => {
  const action = useAction();

  return (
    <Form action={action}>
      <h1>Should have searchParams</h1>
      <button type="submit">Submit</button>
    </Form>
  );
});
