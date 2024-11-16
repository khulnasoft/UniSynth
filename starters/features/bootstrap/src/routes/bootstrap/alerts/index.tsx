import { component$ } from "@khulnasoft.com/unisynth";
import type { DocumentHead } from "@khulnasoft.com/unisynth-city";
import { Alert } from "~/components/bootstrap";
import { colorVariantsList } from "~/constants/data";
export default component$(() => {
  return (
    <>
      <h2>Alerts</h2>
      <hr />
      {colorVariantsList.map((colorVariant, index) => (
        <Alert
          key={`${index + 1}_${colorVariant}`}
          colorVariant={colorVariant}
        />
      ))}
    </>
  );
});

export const head: DocumentHead = {
  title: "Unisynth - Bootstrap v5 - Alerts",
  meta: [
    {
      name: "description",
      content: "Alerts with Boostrap in Unisynth",
    },
  ],
};
