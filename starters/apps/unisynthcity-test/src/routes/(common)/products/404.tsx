import { component$ } from "@khulnasoft.com/unisynth";
import { useLocation, type DocumentHead } from "@khulnasoft.com/unisynth-city";

export default component$(() => {
  const { params } = useLocation();

  return (
    <div>
      <h1>Product {params.id} not found</h1>
    </div>
  );
});

export const head: DocumentHead = ({ params }) => {
  return {
    title: `Product ${params.id} Not Found`,
  };
};
