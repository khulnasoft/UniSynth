import { component$ } from "@khulnasoft.com/unisynth";
import {
  Form,
  routeLoader$,
  routeAction$,
} from "@khulnasoft.com/unisynth-city";
import { data } from "../data";

export const useGetData = routeLoader$(() => {
  return data;
});

export const useOtherAction = routeAction$((form) => {
  const name = form.name as string;
  data.push(name);
  return { success: true };
});

export default component$(() => {
  const items = useGetData();
  const action = useOtherAction();
  return (
    <div>
      <ul id="issue2644-list">
        {items.value.map((x) => (
          <li>{x}</li>
        ))}
      </ul>
      <Form action={action}>
        <input name="name" id="issue2644-input" />
        <button id="issue2644-submit">Submit</button>
      </Form>
    </div>
  );
});
