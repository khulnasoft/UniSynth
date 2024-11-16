import { component$ } from "@khulnasoft.com/unisynth";
import { Form, globalAction$ } from "@khulnasoft.com/unisynth-city";

export const useOtherAction = globalAction$(() => {
  return {
    secret: "this is the secret",
    date: new Date(),
  };
});

export default component$(() => {
  const other = useOtherAction();
  return (
    <div>
      <Form action={other}>
        <button id="submit">Submit</button>
      </Form>
    </div>
  );
});
